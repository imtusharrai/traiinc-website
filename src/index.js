import { createRemoteJWKSet, jwtVerify } from "jose";

const JSON_HEADERS = { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" };
const ROLES = { owner: 5, admin: 4, editor: 3, seo_manager: 2, viewer: 1 };

function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), { status, headers: { ...JSON_HEADERS, ...headers } });
}
function slug(value) {
  return String(value || "").toLowerCase().trim().replace(/[^a-z0-9-]+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 160);
}
async function requireMember(request, env, minimumRole = "viewer") {
  if (!env.CF_ACCESS_TEAM_DOMAIN || !env.CF_ACCESS_AUD) throw new Error("CMS authentication is not configured");
  const token = request.headers.get("Cf-Access-Jwt-Assertion");
  if (!token) return null;
  const domain = env.CF_ACCESS_TEAM_DOMAIN.replace(/^https?:\/\//, "").replace(/\/$/, "");
  const jwks = createRemoteJWKSet(new URL(`https://${domain}/cdn-cgi/access/certs`));
  const { payload } = await jwtVerify(token, jwks, { audience: env.CF_ACCESS_AUD, issuer: `https://${domain}` });
  const email = String(payload.email || "").toLowerCase();
  if (!email) return null;
  const member = await env.DB.prepare("SELECT email, role, active FROM cms_members WHERE email = ?").bind(email).first();
  if (!member || member.active !== 1 || (ROLES[member.role] || 0) < (ROLES[minimumRole] || 99)) return null;
  return { email, role: member.role };
}
async function audit(env, actor, action, entityType, entityId, detail = {}) {
  await env.DB.prepare("INSERT INTO cms_audit_logs (actor_email, action, entity_type, entity_id, detail_json, created_at) VALUES (?, ?, ?, ?, ?, datetime('now'))")
    .bind(actor.email, action, entityType, entityId || null, JSON.stringify(detail)).run();
}
async function publicContent(request, env) {
  const url = new URL(request.url);
  const type = url.searchParams.get("type");
  const slugValue = url.searchParams.get("slug");
  if (slugValue) {
    const row = await env.DB.prepare("SELECT id, content_type, slug, title, data_json, seo_json, published_at, updated_at FROM cms_entries WHERE slug = ? AND status = 'published' LIMIT 1").bind(slug(slugValue)).first();
    return row ? json({ item: { ...row, data: JSON.parse(row.data_json), seo: row.seo_json ? JSON.parse(row.seo_json) : {} } }, 200, { "cache-control": "public, max-age=60, s-maxage=300" }) : json({ error: "Not found" }, 404);
  }
  const stmt = type
    ? env.DB.prepare("SELECT id, content_type, slug, title, data_json, seo_json, published_at, updated_at FROM cms_entries WHERE status = 'published' AND content_type = ? ORDER BY published_at DESC").bind(type)
    : env.DB.prepare("SELECT id, content_type, slug, title, data_json, seo_json, published_at, updated_at FROM cms_entries WHERE status = 'published' ORDER BY content_type, published_at DESC");
  const { results = [] } = await stmt.all();
  return json({ items: results.map(row => ({ ...row, data: JSON.parse(row.data_json), seo: row.seo_json ? JSON.parse(row.seo_json) : {} })) }, 200, { "cache-control": "public, max-age=60, s-maxage=300" });
}
async function adminApi(request, env, member) {
  const url = new URL(request.url);
  const parts = url.pathname.split("/").filter(Boolean);
  const resource = parts[3] || "";
  const id = parts[4] || "";
  if (request.method === "GET" && resource === "entries" && id) {
    const row = await env.DB.prepare("SELECT * FROM cms_entries WHERE id = ?").bind(id).first();
    return row ? json({ item: { ...row, data: JSON.parse(row.data_json), seo: row.seo_json ? JSON.parse(row.seo_json) : {} } }) : json({ error: "Not found" }, 404);
  }
  if (request.method === "GET" && resource === "entries") {
    const status = url.searchParams.get("status");
    const query = status
      ? env.DB.prepare("SELECT id, content_type, slug, title, status, updated_at, published_at FROM cms_entries WHERE status = ? ORDER BY updated_at DESC").bind(status)
      : env.DB.prepare("SELECT id, content_type, slug, title, status, updated_at, published_at FROM cms_entries ORDER BY updated_at DESC");
    const { results = [] } = await query.all();
    return json({ items: results });
  }
  if (request.method === "POST" && resource === "entries") {
    if ((ROLES[member.role] || 0) < ROLES.editor) return json({ error: "Forbidden" }, 403);
    const body = await request.json();
    const title = String(body.title || "").trim().slice(0, 240);
    const contentType = String(body.content_type || "").trim().slice(0, 40);
    const entrySlug = slug(body.slug || title);
    if (!title || !contentType || !entrySlug || !body.data || typeof body.data !== "object") return json({ error: "title, content_type and data are required" }, 400);
    const entryId = crypto.randomUUID();
    const dataJson = JSON.stringify(body.data);
    const seoJson = JSON.stringify(body.seo || {});
    await env.DB.batch([
      env.DB.prepare("INSERT INTO cms_entries (id, content_type, slug, title, data_json, seo_json, status, created_by, updated_by, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, 'draft', ?, ?, datetime('now'), datetime('now'))").bind(entryId, contentType, entrySlug, title, dataJson, seoJson, member.email, member.email),
      env.DB.prepare("INSERT INTO cms_entry_revisions (id, entry_id, title, data_json, seo_json, status, actor_email, created_at) VALUES (?, ?, ?, ?, ?, 'draft', ?, datetime('now'))").bind(crypto.randomUUID(), entryId, title, dataJson, seoJson, member.email)
    ]);
    await audit(env, member, "entry.create", contentType, entryId);
    return json({ id: entryId, status: "draft" }, 201);
  }
  if (request.method === "PATCH" && resource === "entries" && id) {
    if ((ROLES[member.role] || 0) < ROLES.editor) return json({ error: "Forbidden" }, 403);
    const body = await request.json();
    const current = await env.DB.prepare("SELECT * FROM cms_entries WHERE id = ?").bind(id).first();
    if (!current) return json({ error: "Not found" }, 404);
    const title = String(body.title ?? current.title).trim().slice(0, 240);
    const entrySlug = slug(body.slug ?? current.slug);
    const dataJson = JSON.stringify(body.data ?? JSON.parse(current.data_json));
    const seoJson = JSON.stringify(body.seo ?? (current.seo_json ? JSON.parse(current.seo_json) : {}));
    await env.DB.batch([
      env.DB.prepare("UPDATE cms_entries SET title = ?, slug = ?, data_json = ?, seo_json = ?, updated_by = ?, updated_at = datetime('now') WHERE id = ?").bind(title, entrySlug, dataJson, seoJson, member.email, id),
      env.DB.prepare("INSERT INTO cms_entry_revisions (id, entry_id, title, data_json, seo_json, status, actor_email, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))").bind(crypto.randomUUID(), id, title, dataJson, seoJson, current.status, member.email)
    ]);
    await audit(env, member, "entry.update", current.content_type, id);
    return json({ id, status: current.status });
  }
  if (request.method === "POST" && resource === "entries" && id && parts[5] === "publish") {
    if ((ROLES[member.role] || 0) < ROLES.admin) return json({ error: "Forbidden" }, 403);
    const result = await env.DB.prepare("UPDATE cms_entries SET status = 'published', published_at = COALESCE(published_at, datetime('now')), updated_by = ?, updated_at = datetime('now') WHERE id = ?").bind(member.email, id).run();
    if (!result.meta.changes) return json({ error: "Not found" }, 404);
    await audit(env, member, "entry.publish", "content", id);
    return json({ id, status: "published" });
  }
  if (request.method === "POST" && resource === "entries" && id && parts[5] === "unpublish") {
    if ((ROLES[member.role] || 0) < ROLES.admin) return json({ error: "Forbidden" }, 403);
    const result = await env.DB.prepare("UPDATE cms_entries SET status = 'draft', updated_by = ?, updated_at = datetime('now') WHERE id = ?").bind(member.email, id).run();
    if (!result.meta.changes) return json({ error: "Not found" }, 404);
    await audit(env, member, "entry.unpublish", "content", id);
    return json({ id, status: "draft" });
  }
  if (request.method === "GET" && resource === "overview") {
    const row = await env.DB.prepare("SELECT COUNT(*) AS total, SUM(status = 'published') AS published, SUM(status = 'draft') AS drafts FROM cms_entries").first();
    return json({ metrics: row });
  }
  return json({ error: "Route not found" }, 404);
}
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const origin = request.headers.get("Origin");
    const cors = origin && env.ADMIN_ORIGIN && origin === env.ADMIN_ORIGIN
      ? { "access-control-allow-origin": env.ADMIN_ORIGIN, "access-control-allow-credentials": "true", "vary": "Origin" }
      : {};
    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: { ...cors, "access-control-allow-methods": "GET,POST,PATCH,OPTIONS", "access-control-allow-headers": "content-type,Cf-Access-Jwt-Assertion" } });
    let response;
    try {
      if (url.pathname === "/api/public/v1/content" && request.method === "GET") response = await publicContent(request, env);
      else if (url.pathname.startsWith("/api/admin/v1/")) {
        if (!["GET", "POST", "PATCH"].includes(request.method)) response = json({ error: "Method not allowed" }, 405);
        else {
          const member = await requireMember(request, env, "viewer");
          response = member ? await adminApi(request, env, member) : json({ error: "Unauthorized" }, 401);
        }
      } else response = json({ error: "Not found" }, 404);
    } catch (error) {
      console.error("CMS API error", error);
      response = json({ error: "Internal server error" }, 500);
    }
    const headers = new Headers(response.headers);
    for (const [key, value] of Object.entries(cors)) headers.set(key, value);
    return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
  }
};
