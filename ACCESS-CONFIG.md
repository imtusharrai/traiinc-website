# TRAI Inc CMS — Zero Trust Access & Authentication Configuration

This document specifies the authentication, authorization, and network isolation architecture for the TRAI Inc Content Management System (CMS).

---

## 1. Architecture Overview

The CMS consists of two separate, isolated Cloudflare components:
1. **CMS Admin Interface:** Hosted on Cloudflare Pages (`traiinc-cms-admin`), mapped to `admin.traiinc.com`.
2. **CMS Worker API:** Hosted on Cloudflare Workers (`traiinc-cms-api`), mapped to `api.traiinc.com`.

The public website (`traiinc.com`, `traiinc-website.pages.dev`) is completely decoupled and remains read-only with respect to CMS endpoints.

```
[ Operator Browser ]
        │
        ▼ (HTTPS)
┌────────────────────────────────────────┐
│  Cloudflare Zero Trust Access Gateway  │
│  • Enforces IdP / MFA Login           │
│  • Issues Cf-Access-Jwt-Assertion      │
└───────────────────┬────────────────────┘
                    │
         ┌──────────┴──────────┐
         ▼                     ▼
┌──────────────────┐  ┌──────────────────────────────────┐
│ admin.traiinc.com│  │ api.traiinc.com                  │
│ Cloudflare Pages │  │ Cloudflare Worker (traiinc-cms)  │
│ (Static Admin UI)│  │ • Verifies JWT against JWKS      │
│                  │  │ • Validates CF_ACCESS_AUD        │
│                  │  │ • Enforces RBAC & Single-Owner   │
│                  │  │ • Queries Cloudflare D1          │
└──────────────────┘  └──────────────────────────────────┘
```

---

## 2. Cloudflare Zero Trust Configuration

### Step A: Access Applications
Create two self-hosted applications (or one wildcard application) in the Cloudflare Zero Trust Dashboard:

1. **Admin Application:**
   - **Application Name:** `TRAI Inc CMS Admin`
   - **Application Domain:** `admin.traiinc.com`
   - **Session Duration:** 24 Hours (or company standard)
   - **Policies:**
     - Rule Name: `Allow TRAI Inc Admins`
     - Action: `Allow`
     - Criteria: Include Emails or Emails ending in `@traiinc.com`

2. **API Application (or path rule):**
   - **Application Name:** `TRAI Inc CMS API`
   - **Application Domain:** `api.traiinc.com`
   - **Policies:** Same policy as Admin.

### Step B: Obtain the Audience Tag (AUD)
1. Go to **Zero Trust Dashboard** → **Access** → **Applications**.
2. Select `TRAI Inc CMS API` and click **Edit**.
3. In the **Overview** tab, copy the **Application Audience (AUD) Tag** (a 64-character hexadecimal string).
4. *Security Notice:* Never commit the AUD string directly to Git repositories.

---

## 3. Worker Configuration & Secrets

### Configuration Files
- **Worker Configuration:** `wrangler.worker.jsonc`
- **Admin Configuration:** `wrangler.admin.jsonc`

### Setting the Team Domain
In `wrangler.worker.jsonc`, update the team domain variable:
```jsonc
"vars": {
  "ADMIN_ORIGIN": "https://admin.traiinc.com",
  "CF_ACCESS_TEAM_DOMAIN": "<your-team-name>.cloudflareaccess.com"
}
```

### Setting the Access Secret
Set the secret in Cloudflare Workers using Wrangler:
```bash
printf '%s' "<CF_ACCESS_AUD_VALUE>" | npx wrangler secret put CF_ACCESS_AUD --config wrangler.worker.jsonc
```

For GitHub Actions CI/CD, add the following repository secrets:
- `CLOUDFLARE_API_TOKEN` (Worker deploy and D1 edit permissions)
- `CLOUDFLARE_ACCOUNT_ID`
- `CF_ACCESS_AUD`

---

## 4. Token Verification & Role-Based Access Control (RBAC)

1. **Header Inspection:**
   When an authenticated request reaches `api.traiinc.com`, Cloudflare Access injects the header:
   `Cf-Access-Jwt-Assertion: <JWT_TOKEN>`

2. **Signature & Audience Verification:**
   The Worker uses the `jose` library to fetch public keys from:
   `https://<team-domain>.cloudflareaccess.com/cdn-cgi/access/certs`
   and verifies:
   - Token signature matches Cloudflare Zero Trust public keys.
   - `aud` claim matches `env.CF_ACCESS_AUD`.
   - `iss` claim matches `https://<team-domain>.cloudflareaccess.com`.
   - Token is not expired.

3. **Database Authorization:**
   Once the email address is cryptographically verified from the token payload, the Worker queries Cloudflare D1:
   ```sql
   SELECT email, role, active FROM cms_members WHERE email = ?;
   ```
   - If the member does not exist or `active != 1`, the request returns `401 Unauthorized`.
   - If the member's role does not satisfy the endpoint's minimum required permission, the request returns `403 Forbidden`.

### Role Hierarchy
| Role | Numeric Level | Permissions |
| :--- | :---: | :--- |
| `owner` | 5 | All permissions, transfer ownership, manage admins, audit log inspection. |
| `admin` | 4 | Publish/unpublish entries, manage content, media assets, redirects. |
| `editor` | 3 | Create drafts, update entries, request publication. |
| `seo_manager` | 2 | Edit SEO metadata, structured data, canonical tags, redirects. |
| `viewer` | 1 | Read-only access to admin overview, draft previews, and activity logs. |

### Single-Owner Invariant
Enforced via database partial unique index:
```sql
CREATE UNIQUE INDEX IF NOT EXISTS idx_cms_members_single_owner
ON cms_members(role)
WHERE role = 'owner';
```
At most **one** active owner may exist in the system at any time.

---

## 5. Initial Owner Provisioning

To safely provision the initial owner without manual SQL mistakes or race conditions:

```bash
# Provision locally (testing):
./scripts/provision-owner.sh --config wrangler.worker.jsonc "owner@traiinc.com"

# Provision remotely (production after D1 creation and migrations):
./scripts/provision-owner.sh --remote --config wrangler.worker.jsonc "owner@traiinc.com"
```

The script:
1. Validates email syntax.
2. Uses safe `printf -v` assignments (no `eval`).
3. Verifies that no owner currently exists before attempting insertion.
4. Executes the insertion and runs an immediate verification query to confirm active status.
