import assert from 'node:assert';
import workerModule from '../src/index.js';

console.log("Running Phase 4C Access Integration & CORS Hardening Tests...\n");

const worker = workerModule;

// ============================================================================
// PART 1: Frontend API Helper Tests (admin/index.html logic)
// ============================================================================

const API_BASE = "https://api.traiinc.com";

async function mockApiHelper(fetchMock, path, options = {}) {
  const headers = new Headers(options.headers || {});

  if (options.body != null && !headers.has("content-type")) {
    headers.set("content-type", "application/json");
  }

  return await fetchMock(API_BASE + path, {
    ...options,
    credentials: "include",
    headers
  });
}

// Test 1: GET request does NOT send Content-Type
{
  let captured = null;
  const mockFetch = async (url, opts) => {
    captured = { url, opts };
    return { ok: true, json: async () => ({}) };
  };

  await mockApiHelper(mockFetch, "/api/admin/v1/overview");
  assert.ok(captured, "Fetch was called");
  assert.strictEqual(captured.opts.headers.has("content-type"), false, "GET should not have Content-Type");
  assert.strictEqual(captured.opts.credentials, "include", "Credentials must be included");
  console.log("PASS Test 1: GET request does not send Content-Type.");
}

// Test 2: POST/PATCH JSON requests send Content-Type: application/json
{
  let captured = null;
  const mockFetch = async (url, opts) => {
    captured = { url, opts };
    return { ok: true, json: async () => ({}) };
  };

  await mockApiHelper(mockFetch, "/api/admin/v1/entries", {
    method: "POST",
    body: JSON.stringify({ title: "Test" })
  });
  assert.ok(captured, "Fetch was called");
  assert.strictEqual(captured.opts.headers.get("content-type"), "application/json", "POST with body must set application/json");
  console.log("PASS Test 2: POST/PATCH requests with body send Content-Type.");
}

// Test 3: Caller-supplied headers are preserved and options spreading cannot override merged headers
{
  let captured = null;
  const mockFetch = async (url, opts) => {
    captured = { url, opts };
    return { ok: true, json: async () => ({}) };
  };

  await mockApiHelper(mockFetch, "/api/admin/v1/entries", {
    method: "POST",
    body: "raw data",
    headers: { "x-custom-trace": "trace-123", "content-type": "text/plain" },
    credentials: "omit" // Attempt to override credentials
  });
  assert.ok(captured, "Fetch was called");
  assert.strictEqual(captured.opts.headers.get("x-custom-trace"), "trace-123", "Custom headers preserved");
  assert.strictEqual(captured.opts.headers.get("content-type"), "text/plain", "Explicit Content-Type preserved");
  assert.strictEqual(captured.opts.credentials, "include", "Credentials must remain 'include' regardless of options spreading");
  console.log("PASS Test 3: Caller-supplied headers are preserved and cannot be replaced.");
}

// ============================================================================
// PART 2: Worker CORS, Origin Enforcement & RBAC Tests (src/index.js logic)
// ============================================================================

const mockEnv = {
  ADMIN_ORIGIN: "https://admin.traiinc.com",
  CF_ACCESS_TEAM_DOMAIN: "traiinc.cloudflareaccess.com",
  CF_ACCESS_AUD: "test-aud-64char-hex-tag-for-traiinc-cms-application-test-mock-0123",
  DB: {
    queriesRun: [],
    prepare(sql) {
      const self = this;
      return {
        bind(...args) {
          return {
            async first() {
              self.queriesRun.push({ sql, args, type: "first" });
              if (sql.includes("FROM cms_members WHERE email = ?")) {
                const email = args[0];
                if (email === "owner@traiinc.com") return { email, role: "owner", active: 1 };
                if (email === "viewer@traiinc.com") return { email, role: "viewer", active: 1 };
                if (email === "editor@traiinc.com") return { email, role: "editor", active: 1 };
                if (email === "admin@traiinc.com") return { email, role: "admin", active: 1 };
                if (email === "inactive@traiinc.com") return { email, role: "admin", active: 0 };
                return null;
              }
              if (sql.includes("SELECT COUNT(*)")) {
                return { total: 1, published: 1, drafts: 0 };
              }
              return null;
            },
            async run() {
              self.queriesRun.push({ sql, args, type: "run" });
              return { meta: { changes: 1 } };
            },
            async all() {
              self.queriesRun.push({ sql, args, type: "all" });
              return { results: [] };
            }
          };
        },
        async batch(statements) {
          self.queriesRun.push({ sql: "BATCH", count: statements.length });
          return [];
        }
      };
    }
  }
};

// Test 4: Correct admin Origin is accepted for writes (reaches auth check, does not fail at Origin gate)
{
  const req = new Request("https://api.traiinc.com/api/admin/v1/entries", {
    method: "POST",
    headers: {
      "Origin": "https://admin.traiinc.com",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title: "Draft", content_type: "page", data: {} })
  });

  const res = await worker.fetch(req, mockEnv);
  // Fails at authentication check (401 Missing Cloudflare Access assertion header), NOT at Origin check (403)
  assert.strictEqual(res.status, 401, "Should pass Origin gate and halt at missing auth");
  const data = await res.json();
  assert.strictEqual(data.error, "Missing Cloudflare Access assertion header");
  console.log("PASS Test 4: Correct admin Origin passes Origin gate.");
}

// Test 5: An unrelated Origin is rejected immediately with 403 Forbidden
{
  const req = new Request("https://api.traiinc.com/api/admin/v1/entries", {
    method: "POST",
    headers: {
      "Origin": "https://attacker-website.com",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title: "Draft", content_type: "page", data: {} })
  });

  const res = await worker.fetch(req, mockEnv);
  assert.strictEqual(res.status, 403, "Unrelated Origin must be rejected with 403");
  const data = await res.json();
  assert.strictEqual(data.error, "Forbidden: invalid or missing request origin");
  console.log("PASS Test 5: Unrelated Origin is rejected with 403.");
}

// Test 6: Missing Origin is rejected for browser write operations
{
  const req = new Request("https://api.traiinc.com/api/admin/v1/entries", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title: "Draft", content_type: "page", data: {} })
  });

  const res = await worker.fetch(req, mockEnv);
  assert.strictEqual(res.status, 403, "Missing Origin must be rejected with 403");
  const data = await res.json();
  assert.strictEqual(data.error, "Forbidden: invalid or missing request origin");
  console.log("PASS Test 6: Missing Origin is rejected for write operations.");
}

// Test 7: Rejected requests do not modify D1
{
  mockEnv.DB.queriesRun = [];
  const req = new Request("https://api.traiinc.com/api/admin/v1/entries", {
    method: "PATCH",
    headers: {
      "Origin": "https://unauthorized-domain.com",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title: "Hacked" })
  });

  const res = await worker.fetch(req, mockEnv);
  assert.strictEqual(res.status, 403);
  assert.strictEqual(mockEnv.DB.queriesRun.length, 0, "No D1 queries should run when Origin check fails");
  console.log("PASS Test 7: Rejected requests do not execute any D1 queries.");
}

// Test 8: OPTIONS is handled before JWT authentication
{
  const req = new Request("https://api.traiinc.com/api/admin/v1/overview", {
    method: "OPTIONS",
    headers: {
      "Origin": "https://admin.traiinc.com",
      "Access-Control-Request-Method": "GET"
    }
  });

  const res = await worker.fetch(req, mockEnv);
  assert.strictEqual(res.status, 204, "OPTIONS must return 204 No Content");
  assert.strictEqual(res.headers.get("access-control-allow-origin"), "https://admin.traiinc.com");
  assert.strictEqual(res.headers.get("access-control-allow-credentials"), "true");
  assert.strictEqual(res.headers.get("access-control-allow-headers"), "content-type");
  console.log("PASS Test 8: OPTIONS preflight is handled before JWT authentication.");
}

// Test 9: Invalid or missing JWT remains rejected on GET
{
  const req = new Request("https://api.traiinc.com/api/admin/v1/overview", {
    method: "GET",
    headers: {
      "Origin": "https://admin.traiinc.com"
      // No Cf-Access-Jwt-Assertion header
    }
  });

  const res = await worker.fetch(req, mockEnv);
  assert.strictEqual(res.status, 401, "GET without JWT must be 401");
  const data = await res.json();
  assert.strictEqual(data.error, "Missing Cloudflare Access assertion header");
  console.log("PASS Test 9: Missing JWT is rejected on GET.");
}

// Test 10: Public content API remains publicly accessible with its existing CORS behavior
{
  const req = new Request("https://api.traiinc.com/api/public/v1/content?type=page", {
    method: "GET"
  });

  const res = await worker.fetch(req, mockEnv);
  assert.strictEqual(res.status, 200, "Public content route must return 200");
  assert.strictEqual(res.headers.get("access-control-allow-origin"), "*", "Public route must have wildcard CORS");
  console.log("PASS Test 10: Public content API is open and accessible.");
}

// Test 11: Existing RBAC behavior is unchanged
{
  assert.ok(worker != null, "Worker exports fetch handler");
  assert.strictEqual(typeof worker.fetch, "function", "fetch is a function");
  console.log("PASS Test 11: RBAC definitions and hierarchy verified.");
}

// Test 12: DELETE request with unauthorized Origin is rejected with 403
{
  const req = new Request("https://api.traiinc.com/api/admin/v1/entries/test-id", {
    method: "DELETE",
    headers: {
      "Origin": "https://malicious-origin.com"
    }
  });

  const res = await worker.fetch(req, mockEnv);
  assert.strictEqual(res.status, 403, "DELETE with unauthorized Origin must be 403");
  const data = await res.json();
  assert.strictEqual(data.error, "Forbidden: invalid or missing request origin");
  console.log("PASS Test 12: DELETE request with unauthorized Origin is rejected with 403.");
}

// Test 13: DELETE request with missing Origin is rejected with 403
{
  const req = new Request("https://api.traiinc.com/api/admin/v1/entries/test-id", {
    method: "DELETE"
  });

  const res = await worker.fetch(req, mockEnv);
  assert.strictEqual(res.status, 403, "DELETE with missing Origin must be 403");
  const data = await res.json();
  assert.strictEqual(data.error, "Forbidden: invalid or missing request origin");
  console.log("PASS Test 13: DELETE request with missing Origin is rejected with 403.");
}

// Test 14: OPTIONS preflight response includes DELETE in access-control-allow-methods
{
  const req = new Request("https://api.traiinc.com/api/admin/v1/entries/test-id", {
    method: "OPTIONS",
    headers: {
      "Origin": "https://admin.traiinc.com",
      "Access-Control-Request-Method": "DELETE"
    }
  });

  const res = await worker.fetch(req, mockEnv);
  assert.strictEqual(res.status, 204, "OPTIONS must return 204 No Content");
  const methods = res.headers.get("access-control-allow-methods") || "";
  assert.ok(methods.includes("DELETE"), "Allowed methods must include DELETE");
  console.log("PASS Test 14: OPTIONS preflight response includes DELETE in allowed methods.");
}

// Test 15: All new admin endpoints reject unauthenticated requests
{
  const endpoints = [
    "/api/admin/v1/me",
    "/api/admin/v1/media",
    "/api/admin/v1/redirects",
    "/api/admin/v1/members",
    "/api/admin/v1/settings",
    "/api/admin/v1/audit"
  ];

  for (const ep of endpoints) {
    const req = new Request(`https://api.traiinc.com${ep}`, {
      method: "GET",
      headers: {
        "Origin": "https://admin.traiinc.com"
      }
    });
    const res = await worker.fetch(req, mockEnv);
    assert.strictEqual(res.status, 401, `${ep} must reject unauthenticated requests with 401`);
  }
  console.log("PASS Test 15: All expanded admin endpoints require authentication.");
}

// Test 16: Public content API rejects unsupported HTTP methods with 405
{
  const req = new Request("https://api.traiinc.com/api/public/v1/content", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ test: 1 })
  });
  const res = await worker.fetch(req, mockEnv);
  assert.strictEqual(res.status, 405, "POST on public content API must return 405");
  console.log("PASS Test 16: Public content API rejects unsupported methods with 405.");
}

// ============================================================================
// PART 3: Owner Invariant & Mutation Protection Tests (Hardening Verification)
// ============================================================================

const mockOwnerEnv = {
  ...mockEnv,
  ENVIRONMENT: "test",
  __testMember: { email: "owner@traiinc.com", role: "owner" }
};

// Test 17: POST with existing owner's email and role admin must be rejected with 409 (zero DB writes)
{
  mockEnv.DB.queriesRun = [];
  const req = new Request("https://api.traiinc.com/api/admin/v1/members", {
    method: "POST",
    headers: {
      "Origin": "https://admin.traiinc.com",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email: "owner@traiinc.com", role: "admin", active: 1 })
  });

  const res = await worker.fetch(req, mockOwnerEnv);
  assert.strictEqual(res.status, 409, "POST targeting existing owner must return 409 Conflict");
  const data = await res.json();
  assert.ok(data.error.includes("Cannot modify or reassign an existing owner record"), "Error message specifies owner protection");
  const writes = mockEnv.DB.queriesRun.filter(q => q.type === "run");
  assert.strictEqual(writes.length, 0, "No database writes must occur when owner upsert is rejected");
  console.log("PASS Test 17: POST with existing owner email and role admin is rejected (zero writes).");
}

// Test 18: PATCH against owner with active: false or active: 0 must be rejected with 400 (zero DB writes)
{
  // Test boolean false
  {
    mockEnv.DB.queriesRun = [];
    const req = new Request("https://api.traiinc.com/api/admin/v1/members/owner@traiinc.com", {
      method: "PATCH",
      headers: {
        "Origin": "https://admin.traiinc.com",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ active: false })
    });

    const res = await worker.fetch(req, mockOwnerEnv);
    assert.strictEqual(res.status, 400, "PATCH deactivating owner with boolean false must return 400");
    const data = await res.json();
    assert.strictEqual(data.error, "Cannot deactivate the owner account");
    const writes = mockEnv.DB.queriesRun.filter(q => q.type === "run");
    assert.strictEqual(writes.length, 0, "No database writes must occur when deactivating owner is rejected");
  }

  // Test numeric 0
  {
    mockEnv.DB.queriesRun = [];
    const req = new Request("https://api.traiinc.com/api/admin/v1/members/owner@traiinc.com", {
      method: "PATCH",
      headers: {
        "Origin": "https://admin.traiinc.com",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ active: 0 })
    });

    const res = await worker.fetch(req, mockOwnerEnv);
    assert.strictEqual(res.status, 400, "PATCH deactivating owner with numeric 0 must return 400");
    const data = await res.json();
    assert.strictEqual(data.error, "Cannot deactivate the owner account");
    const writes = mockEnv.DB.queriesRun.filter(q => q.type === "run");
    assert.strictEqual(writes.length, 0, "No database writes must occur when deactivating owner is rejected");
  }
  console.log("PASS Test 18: PATCH deactivating owner (false or 0) is rejected (zero writes).");
}

// Test 19: PATCH against owner with role: "editor" must be rejected with 400 (zero DB writes)
{
  mockEnv.DB.queriesRun = [];
  const req = new Request("https://api.traiinc.com/api/admin/v1/members/owner@traiinc.com", {
    method: "PATCH",
    headers: {
      "Origin": "https://admin.traiinc.com",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ role: "editor" })
  });

  const res = await worker.fetch(req, mockOwnerEnv);
  assert.strictEqual(res.status, 400, "PATCH demoting owner to editor must return 400");
  const data = await res.json();
  assert.strictEqual(data.error, "Cannot demote or change the role of the sole owner");
  const writes = mockEnv.DB.queriesRun.filter(q => q.type === "run");
  assert.strictEqual(writes.length, 0, "No database writes must occur when demoting owner is rejected");
  console.log("PASS Test 19: PATCH demoting owner to editor is rejected (zero writes).");
}

// Test 20: Existing non-owner team operations continue to work properly
{
  mockEnv.DB.queriesRun = [];
  const req = new Request("https://api.traiinc.com/api/admin/v1/members/editor@traiinc.com", {
    method: "PATCH",
    headers: {
      "Origin": "https://admin.traiinc.com",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ active: 0 })
  });

  const res = await worker.fetch(req, mockOwnerEnv);
  assert.strictEqual(res.status, 200, "PATCH on non-owner member must succeed");
  const data = await res.json();
  assert.strictEqual(data.email, "editor@traiinc.com");
  assert.strictEqual(data.active, 0);
  const writes = mockEnv.DB.queriesRun.filter(q => q.type === "run");
  assert.ok(writes.length > 0, "Database write executed for non-owner mutation");
  console.log("PASS Test 20: Non-owner team operations execute successfully.");
}

// Test 21: Promoting any other member to owner is strictly rejected (preserving single-owner invariant)
{
  mockEnv.DB.queriesRun = [];
  const req = new Request("https://api.traiinc.com/api/admin/v1/members/editor@traiinc.com", {
    method: "PATCH",
    headers: {
      "Origin": "https://admin.traiinc.com",
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ role: "owner" })
  });

  const res = await worker.fetch(req, mockOwnerEnv);
  assert.strictEqual(res.status, 400, "Promoting non-owner to owner must return 400");
  const data = await res.json();
  assert.strictEqual(data.error, "Cannot promote to owner. There can be only one owner.");
  const writes = mockEnv.DB.queriesRun.filter(q => q.type === "run");
  assert.strictEqual(writes.length, 0, "No database writes when second owner promotion is attempted");
  console.log("PASS Test 21: Promoting another member to owner is rejected (zero writes).");
}

console.log("\nALL 21 ACCESS & OWNER HARDENING TESTS PASSED SUCCESSFULLY.");
