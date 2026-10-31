# TRAI Inc CMS API

Dedicated Cloudflare Worker and Admin infrastructure for the TRAI Inc website CMS. This is deployed separately from the existing Cloudflare Pages website (`traiinc-website`).

## Architecture Separation
- **Public Website (`traiinc.com`):** Cloudflare Pages (`traiinc-website`). Read-only, statically built from `data/*.json`.
- **CMS Worker API (`api.traiinc.com`):** Cloudflare Worker (`traiinc-cms-api`). Configured in `wrangler.worker.jsonc`.
- **CMS Admin Pages (`admin.traiinc.com`):** Cloudflare Pages (`traiinc-cms-admin`). Configured in `wrangler.admin.jsonc`.
- **CMS D1 Database:** Cloudflare D1 database (`traiinc-cms`).

## Security & Access
- All administrative endpoints fail closed until Cloudflare Access authentication and an active CMS member are verified.
- Initial owner provisioning is handled exclusively via `./scripts/provision-owner.sh`.
- Single-owner invariant is strictly enforced at the database level via a partial unique index in `migrations/0002_single_owner_invariant.sql`.
- See `ACCESS-CONFIG.md` for full Zero Trust configuration details.

## Deployment Workflows
- `.github/workflows/cms-worker-ci.yml`: Strict CI validation using `npm ci`, Worker syntax checks, lexical D1 migration validation, and public build isolation verification.
- `.github/workflows/cms-worker-deploy.yml`: Deploys the Worker API to Cloudflare Workers with production environment approval gates.
- `.github/workflows/cms-admin-deploy.yml`: Deploys the Admin UI to Cloudflare Pages with production environment approval gates.
- `.github/workflows/cms-d1-migrate.yml`: Manual, dedicated workflow for applying remote D1 migrations with confirmation gates.

Never place Access tokens, API keys, or account credentials in Git.
