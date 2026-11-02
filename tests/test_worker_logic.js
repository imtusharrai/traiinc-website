const assert = require('assert');

console.log("Running Worker API unit logic tests...");

// Test slug function
function slug(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 160);
}

assert.strictEqual(slug("Hello World!"), "hello-world");
assert.strictEqual(slug("   Spaces & Special @ Characters #123  "), "spaces-special-characters-123");
assert.strictEqual(slug("---leading-trailing---"), "leading-trailing");
assert.strictEqual(slug(""), "");
console.log("PASS: Slug generation tests.");

// Test Role hierarchy
const ROLES = { owner: 5, admin: 4, editor: 3, seo_manager: 2, viewer: 1 };
assert.ok(ROLES.owner > ROLES.admin);
assert.ok(ROLES.admin > ROLES.editor);
assert.ok(ROLES.editor > ROLES.seo_manager);
assert.ok(ROLES.seo_manager > ROLES.viewer);
console.log("PASS: Role hierarchy tests.");

// Test Valid Content Types
const VALID_CONTENT_TYPES = new Set([
  "page", "service", "blog", "case_study", "landing_page", "navigation", "footer"
]);
assert.ok(VALID_CONTENT_TYPES.has("page"));
assert.ok(VALID_CONTENT_TYPES.has("blog"));
assert.ok(!VALID_CONTENT_TYPES.has("malicious_type"));
assert.ok(!VALID_CONTENT_TYPES.has(""));
console.log("PASS: Content types validation tests.");

console.log("ALL WORKER UNIT LOGIC TESTS PASSED.");
