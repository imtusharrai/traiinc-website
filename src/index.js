import { createRemoteJWKSet, jwtVerify } from "jose";

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const ROLES = { owner: 5, admin: 4, editor: 3, seo_manager: 2, viewer: 1 };
const VALID_CONTENT_TYPES = new Set([
  "page", "service", "blog", "case_study", "landing_page", "navigation", "footer"
]);
const MAX_PAYLOAD_BYTES = 1048576; // 1 MB limit

let _cachedJWKS = null;
let _cachedDomain = null;

function getJWKS(domain) {
  if (!_cachedJWKS || _cachedDomain !== domain) {
    _cachedDomain = domain;
    _cachedJWKS = createRemoteJWKSet(new URL(`https://${domain}/cdn-cgi/access/certs`));
  }
  return _cachedJWKS;
}

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { ...JSON_HEADERS, ...headers } });
}

function slug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 160);
}

async function parseJsonBody(request) {
  const len = request.headers.get("content-length");
  if (len && parseInt(len, 10) > MAX_PAYLOAD_BYTES) {
    return { error: json({ error: "Payload too large. Maximum size is 1MB." }, 413) };
  }
  try {
    const text = await request.text();
    if (text.length > MAX_PAYLOAD_BYTES) {
      return { error: json({ error: "Payload too large. Maximum size is 1MB." }, 413) };
    }
    const data = JSON.parse(text);
    return { data };
  } catch (err) {
    return { error: json({ error: "Malformed JSON body" }, 400) };
  }
}

async function requireMember(request, env, minimumRole = "viewer") {
  if (!env.CF_ACCESS_TEAM_DOMAIN || !env.CF_ACCESS_AUD) {
    console.error("CMS configuration error: CF_ACCESS_TEAM_DOMAIN or CF_ACCESS_AUD is not set");
    return { error: "CMS authentication is not configured", status: 503 };
  }
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) return { error: "Missing Cloudflare Access assertion header", status: 401 };

  const domain = env.CF_ACCESS_TEAM_DOMAIN.replace(/^https?:\/\//, "").replace(/\/$/, "");
  let email;
  try {
    const jwks = getJWKS(domain);
    const { payload } = await jwtVerify(token, jwks, {
      audience: env.CF_ACCESS_AUD,
      issuer: `https://${domain}`
    });
    email = String(payload.email || "").toLowerCase().trim();
  } catch (jwtErr) {
    console.warn("Cloudflare Access JWT verification failed:", jwtErr.message);
    return { error: "Invalid or expired Access token", status: 401 };
  }

  if (!email) return { error: "No email claim present in token", status: 401 };

  const member = await env.DB.prepare(
    "SELECT email, role, active FROM cms_members WHERE email = ?"
  ).bind(email).first();

  if (!member || member.active !== 1) {
    return { error: "User is not an active CMS member", status: 401 };
  }

  const userLevel = ROLES[member.role] || 0;
  const requiredLevel = ROLES[minimumRole] || 99;
  if (userLevel < requiredLevel) {
    return { error: `Forbidden: role '${member.role}' does not meet required role '${minimumRole}'`, status: 403 };
  }

  return { member: { email, role: member.role } };
}

async function audit(env, actor, action, entityType, entityId, detail = {}) {
  await env.DB.prepare(
    "INSERT INTO cms_audit_logs (actor_email, action, entity_type, entity_id, detail_json, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))"
  ).bind(actor.email, action, entityType, entityId || null, JSON.stringify(detail)).run();
}

async function publicContent(request, env) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const slugValue = url.searchParams.get("slug");

  const publicCacheHeaders = {
    "cache-control": "public, max-age=60, s-maxage=300",
    "access-control-allow-origin": "*"
  };

  if (slugValue) {
    const row = await env.DB.prepare(
      "SELECT id, content_type, slug, title, data_json, seo_json, published_at, updated_at FROM cms_entries WHERE slug = ? AND status = 'published' LIMIT 1"
    ).bind(slug(slugValue)).first();

    return row
      ? json({ item: { ...row, data: JSON.parse(row.data_json), seo: row.seo_json ? JSON.parse(row.seo_json) : {} } }, 200, publicCacheHeaders)
      : json({ error: "Not found" }, 404, publicCacheHeaders);
  }

  if (type && !VALID_CONTENT_TYPES.has(type)) {
    return json({ error: "Invalid content_type filter" }, 400, publicCacheHeaders);
  }

  const stmt = type
    ? env.DB.prepare("SELECT id, content_type, slug, title, data_json, seo_json, published_at, updated_at FROM cms_entries WHERE status = 'published' AND content_type = ? ORDER BY published_at DESC").bind(type)
    : env.DB.prepare("SELECT id, content_type, slug, title, data_json, seo_json, published_at, updated_at FROM cms_entries WHERE status = 'published' ORDER BY content_type, published_at DESC");

  const { results = [] } = await stmt.all();
  return json(
    { items: results.map(row => ({ ...row, data: JSON.parse(row.data_json), seo: row.seo_json ? JSON.parse(row.seo_json) : {} })) },
    200,
    publicCacheHeaders
  );
}

async function adminApi(request, env, member) {
  const url = new URL(request.url);
  const parts = url.pathname.split("/").filter(Boolean);
  const resource = parts[3] || "";
  const id = parts[4] || "";

  if (request.method === "GET" && resource === "entries" && id) {
    const row = await env.DB.prepare("SELECT * FROM cms_entries WHERE id = ?").bind(id).first();
    return row
      ? json({ item: { ...row, data: JSON.parse(row.data_json), seo: row.seo_json ? JSON.parse(row.seo_json) : {} } })
      : json({ error: "Not found" }, 404);
  }

  if (request.method === "GET" && resource === "entries") {
    const status = url.searchParams.get("status");
    if (status && !["draft", "published", "archived"].includes(status)) {
      return json({ error: "Invalid status parameter" }, 400);
    }
    const query = status
      ? env.DB.prepare("SELECT id, content_type, slug, title, status, updated_at, published_at FROM cms_entries WHERE status = ? ORDER BY updated_at DESC").bind(status)
      : env.DB.prepare("SELECT id, content_type, slug, title, status, updated_at, published_at FROM cms_entries ORDER BY updated_at DESC");
    const { results = [] } = await query.all();
    return json({ items: results });
  }

  if (request.method === "POST" && resource === "entries") {
    if ((ROLES[member.role] || 0) < ROLES.editor) return json({ error: "Forbidden: editor role required" }, 403);

    const parsed = await parseJsonBody(request);
    if (parsed.error) return parsed.error;
    const body = parsed.data;

    const title = String(body.title || "").trim().slice(0, 240);
    const contentType = String(body.content_type || "").trim().toLowerCase();
    const entrySlug = slug(body.slug || title);

    if (!title) return json({ error: "title is required" }, 400);
    if (!VALID_CONTENT_TYPES.has(contentType)) {
      return json({ error: `Invalid content_type. Must be one of: ${Array.from(VALID_CONTENT_TYPES).join(", ")}` }, 400);
    }
    if (!entrySlug) return json({ error: "Valid slug or title is required" }, 400);
    if (!body.data || typeof body.data !== "object" || Array.isArray(body.data)) {
      return json({ error: "data must be a JSON object" }, 400);
    }
    if (body.seo && (typeof body.seo !== "object" || Array.isArray(body.seo))) {
      return json({ error: "seo must be a JSON object if provided" }, 400);
    }

    const entryId = crypto.randomUUID();
    const dataJson = JSON.stringify(body.data);
    const seoJson = JSON.stringify(body.seo || {});

    await env.DB.batch([
      env.DB.prepare(
        "INSERT INTO cms_entries (id, content_type, slug, title, data_json, seo_json, status, created_by, updated_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'draft', ?, ?, datetime('now'), datetime('now'))"
      ).bind(entryId, contentType, entrySlug, title, dataJson, seoJson, member.email, member.email),
      env.DB.prepare(
        "INSERT INTO cms_entry_revisions (id, entry_id, title, data_json, seo_json, status, actor_email, created_at) VALUES (?, ?, ?, ?, ?, 'draft', ?, datetime('now'))"
      ).bind(crypto.randomUUID(), entryId, title, dataJson, seoJson, member.email)
    ]);

    await audit(env, member, "entry.create", contentType, entryId, { title, slug: entrySlug });
    return json({ id: entryId, status: "draft" }, 201);
  }

  if (request.method === "PATCH" && resource === "entries" && id) {
    if ((ROLES[member.role] || 0) < ROLES.editor) return json({ error: "Forbidden: editor role required" }, 403);

    const parsed = await parseJsonBody(request);
    if (parsed.error) return parsed.error;
    const body = parsed.data;

    const current = await env.DB.prepare("SELECT * FROM cms_entries WHERE id = ?").bind(id).first();
    if (!current) return json({ error: "Not found" }, 404);

    const title = body.title !== undefined ? String(body.title).trim().slice(0, 240) : current.title;
    const entrySlug = body.slug !== undefined ? slug(body.slug) : current.slug;

    if (!title) return json({ error: "title cannot be empty" }, 400);
    if (!entrySlug) return json({ error: "slug cannot be empty" }, 400);

    const dataJson = body.data !== undefined ? JSON.stringify(body.data) : current.data_json;
    const seoJson = body.seo !== undefined ? JSON.stringify(body.seo) : (current.seo_json || "{}");

    await env.DB.batch([
      env.DB.prepare(
        "UPDATE cms_entries SET title = ?, slug = ?, data_json = ?, seo_json = ?, updated_by = ?, updated_at = datetime('now') WHERE id = ?"
      ).bind(title, entrySlug, dataJson, seoJson, member.email, id),
      env.DB.prepare(
        "INSERT INTO cms_entry_revisions (id, entry_id, title, data_json, seo_json, status, actor_email, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))"
      ).bind(crypto.randomUUID(), id, title, dataJson, seoJson, current.status, member.email)
    ]);

    await audit(env, member, "entry.update", current.content_type, id, { title, slug: entrySlug });
    return json({ id, status: current.status });
  }

  if (request.method === "POST" && resource === "entries" && id && parts[5] === "publish") {
    if ((ROLES[member.role] || 0) < ROLES.admin) return json({ error: "Forbidden: admin role required" }, 403);
    const result = await env.DB.prepare(
      "UPDATE cms_entries SET status = 'published', published_at = COALESCE(published_at, datetime('now')), updated_by = ?, updated_at = datetime('now') WHERE id = ?"
    ).bind(member.email, id).run();
    if (!result.meta.changes) return json({ error: "Not found" }, 404);
    await audit(env, member, "entry.publish", "content", id);
    return json({ id, status: "published" });
  }

  if (request.method === "POST" && resource === "entries" && id && parts[5] === "unpublish") {
    if ((ROLES[member.role] || 0) < ROLES.admin) return json({ error: "Forbidden: admin role required" }, 403);
    const result = await env.DB.prepare(
      "UPDATE cms_entries SET status = 'draft', updated_by = ?, updated_at = datetime('now') WHERE id = ?"
    ).bind(member.email, id).run();
    if (!result.meta.changes) return json({ error: "Not found" }, 404);
    await audit(env, member, "entry.unpublish", "content", id);
    return json({ id, status: "draft" });
  }

  if (request.method === "GET" && resource === "overview") {
    const row = await env.DB.prepare(
      "SELECT COUNT(*) AS total, SUM(status = 'published') AS published, SUM(status = 'draft') AS drafts FROM cms_entries"
    ).first();
    return json({ metrics: row });
  }

  return json({ error: "Route not found" }, 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");

    // Public content route CORS (read-only for all origins, e.g. traiinc.com)
    if (url.pathname === "/api/public/v1/content") {
      if (request.method === "OPTIONS") {
        return new Response(null, {
          status: 204,
          headers: {
            "access-control-allow-origin": "*",
            "access-control-allow-methods": "GET, OPTIONS",
            "access-control-allow-headers": "content-type"
          }
        });
      }
      if (request.method !== "GET") {
        return json({ error: "Method not allowed" }, 405, { "access-control-allow-origin": "*" });
      }
      return await publicContent(request, env);
    }

    // Admin API routes (strictly whitelisted CORS for admin origin with credentials)
    const adminCors = origin && env.ADMIN_ORIGIN && origin === env.ADMIN_ORIGIN
      ? { "access-control-allow-origin": env.ADMIN_ORIGIN, "access-control-allow-credentials": "true", "vary": "Origin" }
      : {};

    // Handle preflight OPTIONS before authentication
    if (request.method === "OPTIONS" && url.pathname.startsWith("/api/admin/v1/")) {
      return new Response(null, {
        status: 204,
        headers: {
          ...adminCors,
          "access-control-allow-methods": "GET, POST, PATCH, OPTIONS",
          "access-control-allow-headers": "content-type"
        }
      });
    }

    let response;
    try {
      if (url.pathname.startsWith("/api/admin/v1/")) {
        if (!["GET", "POST", "PATCH"].includes(request.method)) {
          response = json({ error: "Method not allowed" }, 405);
        } else if (["POST", "PATCH"].includes(request.method) && (!origin || !env.ADMIN_ORIGIN || origin !== env.ADMIN_ORIGIN)) {
          // Enforce Origin check for state-mutating requests from browser clients
          response = json({ error: "Forbidden: invalid or missing request origin" }, 403);
        } else {
          const authResult = await requireMember(request, env, "viewer");
          if (authResult.error) {
            response = json({ error: authResult.error }, authResult.status || 401);
          } else {
            response = await adminApi(request, env, authResult.member);
          }
        }
      } else {
        response = json({ error: "Not found" }, 404);
      }
    } catch (error) {
      console.error("CMS API unexpected error:", error);
      response = json({ error: "Internal server error" }, 500);
    }

    const headers = new Headers(response.headers);
    for (const [key, value] of Object.entries(adminCors)) {
      headers.set(key, value);
    }
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
};
