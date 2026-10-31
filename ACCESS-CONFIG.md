# TRAI Inc CMS — Zero Trust Access & Authentication Configuration

This document specifies the authentication, authorization, CORS, and network isolation architecture for the TRAI Inc Content Management System (CMS).

---

## 1. Architecture Overview

The CMS consists of two separate, isolated Cloudflare components:
1. **CMS Admin Interface:** Hosted on Cloudflare Pages (`traiinc-cms-admin`), served from `admin.traiinc.com`.
2. **CMS Worker API:** Hosted on Cloudflare Workers (`traiinc-cms-api`), served from `api.traiinc.com`.

The public website (`traiinc.com`, `traiinc-website.pages.dev`) is completely decoupled and remains read-only with respect to CMS endpoints.

```
[ Operator Browser ]
        │
        ▼ (HTTPS)
┌────────────────────────────────────────────────────────────────────────┐
│ Cloudflare Access Application: "TRAI Inc CMS" (Single AUD Tag)          │
│ • Eager redirect cookie: ON                                            │
│ • Policy: Explicit Allow (e.g. imtusharrai@gmail.com, designated staff)│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
         ┌──────────────────────────┴──────────────────────────┐
         ▼                                                     ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────────────┐
│ Domain 1: admin.traiinc.com          │  │ Domain 2: api.traiinc.com            │
│ Path: /* (Full UI Protection)        │  │ Path: api/admin/v1/* (API Protection)│
│ Host: Cloudflare Pages               │  │ Host: Cloudflare Worker              │
└──────────────────────────────────────┘  └──────────────────────────────────────┘
                                                               │
                                          ┌────────────────────┴─────────────────┐
                                          ▼                                      ▼
                             ┌────────────────────────┐      ┌────────────────────────┐
                             │ /api/admin/v1/*        │      │ /api/public/v1/content │
                             │ [PROTECTED BY ACCESS]  │      │ [UNPROTECTED / PUBLIC] │
                             │ • Validates Access JWT │      │ • Outside Access Path  │
                             │ • Enforces D1 RBAC     │      │ • Open CORS (Origin: *)│
                             │ • Enforces Origin check│      │ • Read-only cached     │
                             └────────────────────────┘      └────────────────────────┘
```

---

## 2. Cloudflare Zero Trust Configuration

### Step A: Single Multi-Domain Access Application
Create a **single self-hosted application** in the Cloudflare Zero Trust Dashboard:

1. **Application Settings:**
   - **Application Name:** `TRAI Inc CMS`
   - **Application Type:** Self-hosted
   - **Session Duration:** 24 Hours (or company standard)

2. **Application Domains:**
   - **Entry 1:** Domain: `admin.traiinc.com` | Path: (leave empty for `/*`)
   - **Entry 2:** Click **+ Add domain** → Domain: `api.traiinc.com` | Path: `api/admin/v1/*`

3. **Public API Path Exemption:**
   Because Entry 2 explicitly scopes protection to `api/admin/v1/*`, the public read-only route `https://api.traiinc.com/api/public/v1/content` remains completely outside Access enforcement.

4. **Advanced Settings — Cookie Configuration:**
   - Navigate to **Advanced settings** → **Cookie settings**.
   - Set **Eager redirect cookie:** `ON` (Enabled).
   - *Technical Note:* Cloudflare issues an application authorization cookie for each configured domain. With Eager redirect cookie enabled, Cloudflare automatically acquires the required cookies through redirects after initial login, eliminating cross-domain cookie failures without needing manual apex cookie configuration.

5. **Access Policy Configuration:**
   - **Rule Name:** `Authorized CMS Operators`
   - **Action:** `Allow`
   - **Include Criteria:** Add exact operator emails (e.g., `imtusharrai@gmail.com` and designated team members).
   - *Security Rule:* Never select "Everyone" or broad unrestricted wildcards.

6. **CORS Settings Tab:**
   - Toggle **Enable CORS:** `ON`
   - **Allowed Origins:** `https://admin.traiinc.com`
   - **Allowed Methods:** `GET, POST, PATCH, OPTIONS`
   - **Allowed Headers:** `content-type`
   - **Allow Credentials:** `ON` (Enabled)

### Step B: Obtain the Audience Tag (AUD)
1. Go to **Zero Trust Dashboard** → **Access** → **Applications**.
2. Select `TRAI Inc CMS` and click **Edit**.
3. In the **Overview** tab, copy the **Application Audience (AUD) Tag** (a single 64-character hexadecimal string shared across both configured domains).
4. *Security Notice:* Never commit the AUD string directly to Git repositories.

---

## 3. Worker Configuration & Secrets

### Configuration Files
- **Worker Configuration:** `wrangler.worker.jsonc`
- **Admin Configuration:** `wrangler.admin.jsonc`

### Setting the Team Domain
In `wrangler.worker.jsonc`, update the team domain variable to your actual Cloudflare Zero Trust team domain:
```jsonc
"vars": {
  "ADMIN_ORIGIN": "https://admin.traiinc.com",
  "CF_ACCESS_TEAM_DOMAIN": "your-team-slug.cloudflareaccess.com"
}
```

### Setting the Access Secret
Set the secret in Cloudflare Workers using Wrangler:
```bash
printf '%s' "<CF_ACCESS_AUD_VALUE>" | npx wrangler secret put CF_ACCESS_AUD --config wrangler.worker.jsonc
```

For GitHub Actions CI/CD, add the following repository secrets under the `production` environment:
- `CLOUDFLARE_API_TOKEN` (Worker deploy and D1 edit permissions)
- `CLOUDFLARE_ACCOUNT_ID` (`3b8585072875daa47d5c3d6ec273c45a`)
- `CF_ACCESS_AUD` (The single AUD tag from the `TRAI Inc CMS` Access application)

---

## 4. Security & Authorization Boundaries

### A. CORS vs. Authentication
> [!WARNING]
> CORS is a browser origin boundary, **not** an authentication control. Restricting CORS prevents compliant browsers on untrusted domains from reading API responses, but does not identify callers or prevent non-browser requests.

The actual security architecture enforces four complementary boundaries:
1. **Perimeter Boundary:** Cloudflare Zero Trust blocks unauthenticated requests to `admin.traiinc.com` and `api.traiinc.com/api/admin/v1/*`.
2. **Cryptographic JWT Verification:** The Worker verifies the signature of `Cf-Access-Jwt-Assertion` against the public JWKS keys from `https://<team-domain>.cloudflareaccess.com/cdn-cgi/access/certs`, checking expiration, `iss`, and `aud`.
3. **Database Authorization (RBAC):** The Worker maps the verified token email to `cms_members`, requiring `active == 1` and checking numeric role levels (`owner: 5, admin: 4, editor: 3, seo_manager: 2, viewer: 1`).
4. **Origin Validation (CSRF Protection):** For browser-originated mutating requests (`POST`, `PATCH`), the Worker strictly validates that `Origin === env.ADMIN_ORIGIN`. Requests with missing or untrusted origins are rejected with `403 Forbidden` before executing any database mutations.

### B. Machine-to-Machine Clients (Future Service Design)
If non-browser clients (such as automated CI/CD synchronization scripts) require write access in the future:
- They must authenticate via dedicated Cloudflare Access Service Tokens (`CF-Access-Client-Id` and `CF-Access-Client-Secret`).
- They should target dedicated service routes with explicit machine authorization, rather than weakening browser Origin validation.

---

## 5. Initial Owner Provisioning

To safely provision the initial owner without manual SQL mistakes or race conditions:

```bash
# Provision locally (testing):
./scripts/provision-owner.sh --config wrangler.worker.jsonc "owner@traiinc.com"

# Provision remotely (production after D1 migrations):
./scripts/provision-owner.sh --remote --config wrangler.worker.jsonc "imtusharrai@gmail.com"
```

The script:
1. Validates email syntax.
2. Uses safe `printf -v` assignments (no `eval`).
3. Verifies that no owner currently exists before attempting insertion.
4. Executes the insertion and runs an immediate verification query to confirm active status.
