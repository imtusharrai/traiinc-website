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

## GitHub Actions deployment

Two workflows are included:
- `.github/workflows/cms-worker-ci.yml` validates Worker syntax, parses the D1 SQL migration and builds the existing website on the CMS feature branch and relevant pull requests.
- `.github/workflows/cms-worker-deploy.yml` deploys the Worker only after a push to `main` (or manual dispatch on `main`).

Before the first production deployment:
1. Create the `traiinc-cms` D1 database in Cloudflare and copy its database ID into `wrangler.toml`.
2. Configure Cloudflare Access for the admin/API hostnames; set `CF_ACCESS_TEAM_DOMAIN` in `wrangler.toml`.
3. Add GitHub Actions secrets `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, and `CF_ACCESS_AUD`.
4. Ensure the Cloudflare token has Workers Scripts edit, D1 edit and permission to deploy Worker secrets.
5. Merge the reviewed PR into `main`. The workflow applies remote D1 migrations, uploads the Access audience secret, then deploys the Worker.

The workflow deliberately fails before any deployment if credentials or Cloudflare resource identifiers are missing. It does not create DNS records or change the existing Pages deployment.
