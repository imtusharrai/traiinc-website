# TRAI Inc CMS API

Dedicated Cloudflare Worker for the website CMS. This is deployed separately from the existing Cloudflare Pages website.

## Current status
- Worker API scaffold and D1 schema are prepared.
- Admin endpoints fail closed until Cloudflare Access and an active CMS member are configured.
- No Cloudflare resources or production routes are created by this repository change.

## Provisioning
1. Create a D1 database named `traiinc-cms` in the TRAI Inc Cloudflare account.
2. Replace the placeholder `database_id` in `wrangler.toml`.
3. Configure Cloudflare Access for the admin/API hostname and obtain its audience tag.
4. Set Worker secret `CF_ACCESS_AUD`.
5. Apply migrations with `npx wrangler d1 migrations apply traiinc-cms --remote`.
6. Add the first owner to `cms_members` using a controlled, authenticated provisioning procedure.
7. Deploy the Worker and bind `api.traiinc.com` only after staging verification.

Never place Access tokens, API keys, or account credentials in Git.
