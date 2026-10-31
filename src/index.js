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
  if (env.ENVIRONMENT === "test" && env.__testMember) {
    const member = env.__testMember;
    const userLevel = ROLES[member.role] || 0;
    const requiredLevel = ROLES[minimumRole] || 99;
    if (userLevel < requiredLevel) {
      return { error: `Forbidden: role '${member.role}' does not meet required role '${minimumRole}'`, status: 403 };
    }
    return { member };
  }

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
  const subAction = parts[5] || "";
  const userLevel = ROLES[member.role] || 0;

  // 1. Current user identity / session info
  if (request.method === "GET" && resource === "me") {
    return json({
      member: {
        email: member.email,
        role: member.role
      }
    });
  }

  // 2. Metrics & Overview
  if (request.method === "GET" && resource === "overview") {
    const entriesCounts = await env.DB.prepare(
      "SELECT COUNT(*) AS total, SUM(status = 'published') AS published, SUM(status = 'draft') AS drafts, SUM(status = 'archived') AS archived FROM cms_entries"
    ).first();

    const membersCount = await env.DB.prepare("SELECT COUNT(*) AS count FROM cms_members WHERE active = 1").first();
    const redirectsCount = await env.DB.prepare("SELECT COUNT(*) AS count FROM cms_redirects WHERE active = 1").first();
    const mediaCount = await env.DB.prepare("SELECT COUNT(*) AS count FROM cms_media_assets").first();

    return json({
      metrics: {
        total: entriesCounts?.total || 0,
        published: entriesCounts?.published || 0,
        drafts: entriesCounts?.drafts || 0,
        archived: entriesCounts?.archived || 0,
        members: membersCount?.count || 0,
        redirects: redirectsCount?.count || 0,
        media: mediaCount?.count || 0
      }
    });
  }

  // 3. Content Entries (CRUD + Workflow)
  if (resource === "entries") {
    // Single entry fetch with revisions
    if (request.method === "GET" && id) {
      const row = await env.DB.prepare("SELECT * FROM cms_entries WHERE id = ?").bind(id).first();
      if (!row) return json({ error: "Not found" }, 404);

      const revisions = await env.DB.prepare(
        "SELECT id, title, status, actor_email, created_at FROM cms_entry_revisions WHERE entry_id = ? ORDER BY created_at DESC LIMIT 10"
      ).bind(id).all();

      return json({
        item: {
          ...row,
          data: JSON.parse(row.data_json),
          seo: row.seo_json ? JSON.parse(row.seo_json) : {}
        },
        revisions: revisions?.results || []
      });
    }

    // List entries (with optional type, status, q filters, pagination)
    if (request.method === "GET" && !id) {
      const status = url.searchParams.get("status");
      const type = url.searchParams.get("type");
      const q = url.searchParams.get("q");
      const limit = Math.min(Math.max(parseInt(url.searchParams.get("limit") || "50", 10), 1), 100);
      const offset = Math.max(parseInt(url.searchParams.get("offset") || "0", 10), 0);

      let sql = "SELECT id, content_type, slug, title, status, created_by, updated_by, created_at, updated_at, published_at FROM cms_entries WHERE 1=1";
      const bindings = [];

      if (status) {
        if (!["draft", "published", "archived"].includes(status)) {
          return json({ error: "Invalid status parameter" }, 400);
        }
        sql += " AND status = ?";
        bindings.push(status);
      }

      if (type) {
        if (!VALID_CONTENT_TYPES.has(type)) {
          return json({ error: "Invalid type parameter" }, 400);
        }
        sql += " AND content_type = ?";
        bindings.push(type);
      }

      if (q) {
        sql += " AND (title LIKE ? OR slug LIKE ?)";
        bindings.push(`%${q}%`, `%${q}%`);
      }

      sql += " ORDER BY updated_at DESC LIMIT ? OFFSET ?";
      bindings.push(limit, offset);

      const { results = [] } = await env.DB.prepare(sql).bind(...bindings).all();

      let countSql = "SELECT COUNT(*) AS total FROM cms_entries WHERE 1=1";
      const countBindings = [];
      if (status) {
        countSql += " AND status = ?";
        countBindings.push(status);
      }
      if (type) {
        countSql += " AND content_type = ?";
        countBindings.push(type);
      }
      if (q) {
        countSql += " AND (title LIKE ? OR slug LIKE ?)";
        countBindings.push(`%${q}%`, `%${q}%`);
      }
      const countRow = await env.DB.prepare(countSql).bind(...countBindings).first();

      return json({ items: results, total: countRow?.total || results.length });
    }

    // Create entry
    if (request.method === "POST" && !id) {
      if (userLevel < ROLES.editor) return json({ error: "Forbidden: editor role required" }, 403);

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

      const existingSlug = await env.DB.prepare("SELECT id FROM cms_entries WHERE slug = ?").bind(entrySlug).first();
      if (existingSlug) {
        return json({ error: `Slug '${entrySlug}' is already in use` }, 409);
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

    // Update entry (PATCH)
    if (request.method === "PATCH" && id) {
      if (userLevel < ROLES.editor) return json({ error: "Forbidden: editor role required" }, 403);

      const parsed = await parseJsonBody(request);
      if (parsed.error) return parsed.error;
      const body = parsed.data;

      const current = await env.DB.prepare("SELECT * FROM cms_entries WHERE id = ?").bind(id).first();
      if (!current) return json({ error: "Not found" }, 404);

      const title = body.title !== undefined ? String(body.title).trim().slice(0, 240) : current.title;
      const entrySlug = body.slug !== undefined ? slug(body.slug) : current.slug;
      const contentType = body.content_type !== undefined ? String(body.content_type).trim().toLowerCase() : current.content_type;

      if (!title) return json({ error: "title cannot be empty" }, 400);
      if (!entrySlug) return json({ error: "slug cannot be empty" }, 400);
      if (!VALID_CONTENT_TYPES.has(contentType)) {
        return json({ error: `Invalid content_type` }, 400);
      }

      if (entrySlug !== current.slug) {
        const slugConflict = await env.DB.prepare("SELECT id FROM cms_entries WHERE slug = ? AND id != ?").bind(entrySlug, id).first();
        if (slugConflict) {
          return json({ error: `Slug '${entrySlug}' is already in use by another entry` }, 409);
        }
      }

      const dataJson = body.data !== undefined ? JSON.stringify(body.data) : current.data_json;
      const seoJson = body.seo !== undefined ? JSON.stringify(body.seo) : (current.seo_json || "{}");

      await env.DB.batch([
        env.DB.prepare(
          "UPDATE cms_entries SET title = ?, slug = ?, content_type = ?, data_json = ?, seo_json = ?, updated_by = ?, updated_at = datetime('now') WHERE id = ?"
        ).bind(title, entrySlug, contentType, dataJson, seoJson, member.email, id),
        env.DB.prepare(
          "INSERT INTO cms_entry_revisions (id, entry_id, title, data_json, seo_json, status, actor_email, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))"
        ).bind(crypto.randomUUID(), id, title, dataJson, seoJson, current.status, member.email)
      ]);

      await audit(env, member, "entry.update", contentType, id, { title, slug: entrySlug });
      return json({ id, status: current.status });
    }

    // Publish entry
    if (request.method === "POST" && id && subAction === "publish") {
      if (userLevel < ROLES.admin) return json({ error: "Forbidden: admin role required" }, 403);
      const result = await env.DB.prepare(
        "UPDATE cms_entries SET status = 'published', published_at = COALESCE(published_at, datetime('now')), updated_by = ?, updated_at = datetime('now') WHERE id = ?"
      ).bind(member.email, id).run();
      if (!result.meta.changes) return json({ error: "Not found" }, 404);
      await audit(env, member, "entry.publish", "content", id);
      return json({ id, status: "published" });
    }

    // Unpublish entry
    if (request.method === "POST" && id && subAction === "unpublish") {
      if (userLevel < ROLES.admin) return json({ error: "Forbidden: admin role required" }, 403);
      const result = await env.DB.prepare(
        "UPDATE cms_entries SET status = 'draft', updated_by = ?, updated_at = datetime('now') WHERE id = ?"
      ).bind(member.email, id).run();
      if (!result.meta.changes) return json({ error: "Not found" }, 404);
      await audit(env, member, "entry.unpublish", "content", id);
      return json({ id, status: "draft" });
    }

    // Archive entry (POST /entries/:id/archive or DELETE /entries/:id)
    if ((request.method === "POST" && id && subAction === "archive") || (request.method === "DELETE" && id)) {
      if (userLevel < ROLES.admin) return json({ error: "Forbidden: admin role required" }, 403);
      const result = await env.DB.prepare(
        "UPDATE cms_entries SET status = 'archived', updated_by = ?, updated_at = datetime('now') WHERE id = ?"
      ).bind(member.email, id).run();
      if (!result.meta.changes) return json({ error: "Not found" }, 404);
      await audit(env, member, "entry.archive", "content", id);
      return json({ id, status: "archived" });
    }
  }

  // 4. Media Library
  if (resource === "media") {
    if (request.method === "GET") {
      const { results = [] } = await env.DB.prepare(
        "SELECT id, object_key, public_url, mime_type, size_bytes, alt_text, uploaded_by, created_at FROM cms_media_assets ORDER BY created_at DESC LIMIT 100"
      ).all();
      return json({ items: results });
    }

    if (request.method === "POST") {
      if (userLevel < ROLES.editor) return json({ error: "Forbidden: editor role required" }, 403);
      const parsed = await parseJsonBody(request);
      if (parsed.error) return parsed.error;
      const body = parsed.data;

      const objectKey = String(body.object_key || "").trim();
      const publicUrl = String(body.public_url || "").trim() || null;
      const mimeType = String(body.mime_type || "application/octet-stream").trim();
      const sizeBytes = parseInt(body.size_bytes || 0, 10);
      const altText = String(body.alt_text || "").trim();

      if (!objectKey) return json({ error: "object_key is required" }, 400);

      const assetId = crypto.randomUUID();
      await env.DB.prepare(
        "INSERT INTO cms_media_assets (id, object_key, public_url, mime_type, size_bytes, alt_text, uploaded_by, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))"
      ).bind(assetId, objectKey, publicUrl, mimeType, sizeBytes, altText, member.email).run();

      await audit(env, member, "media.create", "media", assetId, { object_key: objectKey, public_url: publicUrl });
      return json({ id: assetId, object_key: objectKey, public_url: publicUrl }, 201);
    }

    if (request.method === "DELETE" && id) {
      if (userLevel < ROLES.admin) return json({ error: "Forbidden: admin role required" }, 403);
      const result = await env.DB.prepare("DELETE FROM cms_media_assets WHERE id = ?").bind(id).run();
      if (!result.meta.changes) return json({ error: "Not found" }, 404);
      await audit(env, member, "media.delete", "media", id);
      return json({ id, deleted: true });
    }
  }

  // 5. Redirects Management
  if (resource === "redirects") {
    if (request.method === "GET") {
      const { results = [] } = await env.DB.prepare(
        "SELECT id, source_path, destination_url, status_code, active, created_by, created_at FROM cms_redirects ORDER BY created_at DESC"
      ).all();
      return json({ items: results });
    }

    if (request.method === "POST") {
      if (userLevel < ROLES.seo_manager) return json({ error: "Forbidden: seo_manager role required" }, 403);
      const parsed = await parseJsonBody(request);
      if (parsed.error) return parsed.error;
      const body = parsed.data;

      const sourcePath = String(body.source_path || "").trim();
      const destinationUrl = String(body.destination_url || "").trim();
      const statusCode = [301, 302, 307, 308].includes(body.status_code) ? body.status_code : 301;
      const active = body.active === 0 || body.active === false ? 0 : 1;

      if (!sourcePath || !sourcePath.startsWith("/")) {
        return json({ error: "source_path must start with a leading slash (/)" }, 400);
      }
      if (!destinationUrl) {
        return json({ error: "destination_url is required" }, 400);
      }

      const redirectId = crypto.randomUUID();
      try {
        await env.DB.prepare(
          "INSERT INTO cms_redirects (id, source_path, destination_url, status_code, active, created_by, created_at) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))"
        ).bind(redirectId, sourcePath, destinationUrl, statusCode, active, member.email).run();
      } catch (err) {
        if (String(err).includes("UNIQUE")) {
          return json({ error: `Redirect for '${sourcePath}' already exists` }, 409);
        }
        throw err;
      }

      await audit(env, member, "redirect.create", "redirect", redirectId, { source_path: sourcePath, destination_url: destinationUrl });
      return json({ id: redirectId, source_path: sourcePath, destination_url: destinationUrl, status_code: statusCode, active }, 201);
    }

    if (request.method === "PATCH" && id) {
      if (userLevel < ROLES.seo_manager) return json({ error: "Forbidden: seo_manager role required" }, 403);
      const parsed = await parseJsonBody(request);
      if (parsed.error) return parsed.error;
      const body = parsed.data;

      const current = await env.DB.prepare("SELECT * FROM cms_redirects WHERE id = ?").bind(id).first();
      if (!current) return json({ error: "Not found" }, 404);

      const destinationUrl = body.destination_url !== undefined ? String(body.destination_url).trim() : current.destination_url;
      const statusCode = body.status_code !== undefined && [301, 302, 307, 308].includes(body.status_code) ? body.status_code : current.status_code;
      const active = body.active !== undefined ? (body.active ? 1 : 0) : current.active;

      await env.DB.prepare(
        "UPDATE cms_redirects SET destination_url = ?, status_code = ?, active = ? WHERE id = ?"
      ).bind(destinationUrl, statusCode, active, id).run();

      await audit(env, member, "redirect.update", "redirect", id, { destination_url: destinationUrl, status_code: statusCode, active });
      return json({ id, destination_url: destinationUrl, status_code: statusCode, active });
    }

    if (request.method === "DELETE" && id) {
      if (userLevel < ROLES.seo_manager) return json({ error: "Forbidden: seo_manager role required" }, 403);
      const result = await env.DB.prepare("DELETE FROM cms_redirects WHERE id = ?").bind(id).run();
      if (!result.meta.changes) return json({ error: "Not found" }, 404);
      await audit(env, member, "redirect.delete", "redirect", id);
      return json({ id, deleted: true });
    }
  }

  // 6. Team & Access Control
  if (resource === "members") {
    if (request.method === "GET") {
      if (userLevel < ROLES.admin) return json({ error: "Forbidden: admin role required" }, 403);
      const { results = [] } = await env.DB.prepare(
        "SELECT email, role, active, created_at, updated_at FROM cms_members ORDER BY role = 'owner' DESC, role, email"
      ).all();
      return json({ items: results });
    }

    if (request.method === "POST") {
      if (userLevel < ROLES.owner) return json({ error: "Forbidden: owner role required to manage team members" }, 403);
      const parsed = await parseJsonBody(request);
      if (parsed.error) return parsed.error;
      const body = parsed.data;

      const email = String(body.email || "").toLowerCase().trim();
      const role = String(body.role || "").toLowerCase().trim();
      const active = body.active === 0 || body.active === false ? 0 : 1;

      if (!email || !email.includes("@")) return json({ error: "Valid email is required" }, 400);
      if (!ROLES[role]) return json({ error: `Invalid role. Must be one of: ${Object.keys(ROLES).join(", ")}` }, 400);

      if (role === "owner") {
        return json({ error: "Cannot create an additional owner. There can be only one owner." }, 400);
      }

      // Check whether the requested email already belongs to an existing owner
      const existing = await env.DB.prepare("SELECT email, role FROM cms_members WHERE email = ?").bind(email).first();
      if (existing && existing.role === "owner") {
        return json({ error: "Cannot modify or reassign an existing owner record through member-upsert endpoint" }, 409);
      }

      await env.DB.prepare(
        "INSERT INTO cms_members (email, role, active, created_at, updated_at) VALUES (?, ?, ?, datetime('now'), datetime('now')) ON CONFLICT(email) DO UPDATE SET role = excluded.role, active = excluded.active, updated_at = datetime('now')"
      ).bind(email, role, active).run();

      await audit(env, member, "member.upsert", "member", email, { role, active });
      return json({ email, role, active }, 201);
    }

    if (request.method === "PATCH" && id) {
      if (userLevel < ROLES.owner) return json({ error: "Forbidden: owner role required to modify team members" }, 403);
      const targetEmail = decodeURIComponent(id).toLowerCase().trim();
      const parsed = await parseJsonBody(request);
      if (parsed.error) return parsed.error;
      const body = parsed.data;

      const target = await env.DB.prepare("SELECT * FROM cms_members WHERE email = ?").bind(targetEmail).first();
      if (!target) return json({ error: "Member not found" }, 404);

      // Determine requested active state, protecting against both numeric 0 and boolean false
      const isDeactivating = body.active === 0 || body.active === false;
      const requestedActive = body.active !== undefined
        ? (isDeactivating ? 0 : 1)
        : target.active;

      // Never allow the sole owner to be deactivated
      if (target.role === "owner" && isDeactivating) {
        return json({ error: "Cannot deactivate the owner account" }, 400);
      }

      const requestedRole = body.role !== undefined ? String(body.role).toLowerCase().trim() : target.role;

      if (!ROLES[requestedRole]) return json({ error: `Invalid role` }, 400);

      // Never allow the sole owner to be demoted or have role changed
      if (target.role === "owner" && requestedRole !== "owner") {
        return json({ error: "Cannot demote or change the role of the sole owner" }, 400);
      }

      // Prevent promoting any other member to owner (preserving single-owner invariant)
      if (target.role !== "owner" && requestedRole === "owner") {
        return json({ error: "Cannot promote to owner. There can be only one owner." }, 400);
      }

      await env.DB.prepare(
        "UPDATE cms_members SET role = ?, active = ?, updated_at = datetime('now') WHERE email = ?"
      ).bind(requestedRole, requestedActive, targetEmail).run();

      await audit(env, member, "member.update", "member", targetEmail, { role: requestedRole, active: requestedActive });
      return json({ email: targetEmail, role: requestedRole, active: requestedActive });
    }
  }

  // 7. Site Settings
  if (resource === "settings") {
    if (request.method === "GET") {
      const { results = [] } = await env.DB.prepare("SELECT setting_key, value_json, updated_by, updated_at FROM cms_settings").all();
      const settings = {};
      for (const row of results) {
        try {
          settings[row.setting_key] = JSON.parse(row.value_json);
        } catch {
          settings[row.setting_key] = row.value_json;
        }
      }
      return json({ settings });
    }

    if (request.method === "PATCH") {
      if (userLevel < ROLES.admin) return json({ error: "Forbidden: admin role required" }, 403);
      const parsed = await parseJsonBody(request);
      if (parsed.error) return parsed.error;
      const body = parsed.data;

      if (!body.settings || typeof body.settings !== "object" || Array.isArray(body.settings)) {
        return json({ error: "settings must be an object of key-value pairs" }, 400);
      }

      const statements = [];
      for (const [key, val] of Object.entries(body.settings)) {
        const valJson = JSON.stringify(val);
        statements.push(
          env.DB.prepare(
            "INSERT INTO cms_settings (setting_key, value_json, updated_by, updated_at) VALUES (?, ?, ?, datetime('now')) ON CONFLICT(setting_key) DO UPDATE SET value_json = excluded.value_json, updated_by = excluded.updated_by, updated_at = datetime('now')"
          ).bind(key, valJson, member.email)
        );
      }

      if (statements.length > 0) {
        await env.DB.batch(statements);
        await audit(env, member, "settings.update", "settings", null, { keys: Object.keys(body.settings) });
      }

      return json({ updated: Object.keys(body.settings) });
    }
  }

  // 8. Audit Log
  if (resource === "audit" && request.method === "GET") {
    if (userLevel < ROLES.admin) return json({ error: "Forbidden: admin role required" }, 403);
    const { results = [] } = await env.DB.prepare(
      "SELECT id, actor_email, action, entity_type, entity_id, detail_json, created_at FROM cms_audit_logs ORDER BY created_at DESC LIMIT 50"
    ).all();
    return json({
      items: results.map(r => ({
        ...r,
        detail: r.detail_json ? JSON.parse(r.detail_json) : {}
      }))
    });
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
          "access-control-allow-methods": "GET, POST, PATCH, DELETE, OPTIONS",
          "access-control-allow-headers": "content-type"
        }
      });
    }

    let response;
    try {
      if (url.pathname.startsWith("/api/admin/v1/")) {
        if (!["GET", "POST", "PATCH", "DELETE"].includes(request.method)) {
          response = json({ error: "Method not allowed" }, 405);
        } else if (["POST", "PATCH", "DELETE"].includes(request.method) && (!origin || !env.ADMIN_ORIGIN || origin !== env.ADMIN_ORIGIN)) {
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
