#!/usr/bin/env bash
# scripts/provision-owner.sh
# Safely provisions the initial owner account in the traiinc-cms Cloudflare D1 database.
# Invariant: At most one member can have the role 'owner'.

set -euo pipefail

DB_NAME="traiinc-cms"
CONFIG_FILE="wrangler.worker.jsonc"
REMOTE_FLAG="--local"

usage() {
  cat <<'EOF'
Usage: ./scripts/provision-owner.sh [OPTIONS] <owner-email>

Arguments:
  <owner-email>          Email address of the initial owner to provision.

Options:
  --remote               Execute against remote Cloudflare D1 (default is --local).
  --config <path>        Path to worker config file (default: wrangler.worker.jsonc).
  --help, -h             Show this help message.

Security Notes:
  - This script checks for any existing Owner before inserting.
  - Variable assignment uses printf -v (no eval).
  - Verifies insertion result immediately with post-check query.
EOF
  exit "${1:-1}"
}

OWNER_EMAIL=""
while [[ $# -gt 0 ]]; do
  case "$1" in
    --remote)
      REMOTE_FLAG="--remote"
      shift
      ;;
    --config)
      if [[ -z "${2:-}" ]]; then
        echo "Error: --config requires a file path argument." >&2
        exit 1
      fi
      CONFIG_FILE="$2"
      shift 2
      ;;
    -h|--help)
      usage 0
      ;;
    -*)
      echo "Error: Unknown option: $1" >&2
      usage
      ;;
    *)
      if [[ -z "$OWNER_EMAIL" ]]; then
        OWNER_EMAIL="$1"
        shift
      else
        echo "Error: Unexpected argument: $1" >&2
        usage
      fi
      ;;
  esac
done

if [[ -z "$OWNER_EMAIL" ]]; then
  echo "Error: Missing required <owner-email> argument." >&2
  usage
fi

# Basic email sanitization / validation
# Normalize to lowercase using printf -v
printf -v NORMALIZED_EMAIL '%s' "$OWNER_EMAIL"
NORMALIZED_EMAIL="$(echo "$NORMALIZED_EMAIL" | tr '[:upper:]' '[:lower:]' | xargs)"

if [[ ! "$NORMALIZED_EMAIL" =~ ^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$ ]]; then
  echo "Error: Invalid email format: '$NORMALIZED_EMAIL'" >&2
  exit 1
fi

if [[ ! -f "$CONFIG_FILE" ]]; then
  if [[ -f "wrangler.toml" && "$CONFIG_FILE" == "wrangler.worker.jsonc" ]]; then
    CONFIG_FILE="wrangler.toml"
  else
    echo "Error: Config file '$CONFIG_FILE' not found." >&2
    exit 1
  fi
fi

echo "==> Target Database : $DB_NAME"
echo "==> Mode            : $REMOTE_FLAG"
echo "==> Config          : $CONFIG_FILE"
echo "==> Owner Candidate : $NORMALIZED_EMAIL"

# Step 1: Pre-check if an owner already exists
echo "==> Checking for existing owner in $DB_NAME..."
CHECK_SQL="SELECT email, role, active, created_at FROM cms_members WHERE role = 'owner';"

CHECK_OUTPUT=$(npx wrangler d1 execute "$DB_NAME" $REMOTE_FLAG --config "$CONFIG_FILE" --command "$CHECK_SQL" --json 2>&1) || {
  echo "Error: Failed to query cms_members. Ensure migrations are applied first." >&2
  echo "$CHECK_OUTPUT" >&2
  exit 1
}

# Check if an existing owner was returned in the json output
if echo "$CHECK_OUTPUT" | grep -Eq '"role"[[:space:]]*:[[:space:]]*"owner"'; then
  echo "Error: An Owner already exists in the database. Single-owner invariant prevents adding another." >&2
  echo "$CHECK_OUTPUT"
  exit 1
fi

# Step 2: Insert the owner record
echo "==> Provisioning owner '$NORMALIZED_EMAIL'..."
printf -v ESCAPED_EMAIL '%s' "${NORMALIZED_EMAIL//\'/\'\'}"

INSERT_SQL="INSERT INTO cms_members (email, role, active, created_at, updated_at) VALUES ('${ESCAPED_EMAIL}', 'owner', 1, datetime('now'), datetime('now'));"

INSERT_OUTPUT=$(npx wrangler d1 execute "$DB_NAME" $REMOTE_FLAG --config "$CONFIG_FILE" --command "$INSERT_SQL" 2>&1) || {
  echo "Error: Insertion failed." >&2
  echo "$INSERT_OUTPUT" >&2
  exit 1
}

# Step 3: Post-insertion verification
echo "==> Verifying owner record..."
VERIFY_OUTPUT=$(npx wrangler d1 execute "$DB_NAME" $REMOTE_FLAG --config "$CONFIG_FILE" --command "$CHECK_SQL" --json 2>&1) || {
  echo "Error: Post-insertion verification failed to query database." >&2
  echo "$VERIFY_OUTPUT" >&2
  exit 1
}

if echo "$VERIFY_OUTPUT" | grep -Eq "\"email\"[[:space:]]*:[[:space:]]*\"${NORMALIZED_EMAIL}\""; then
  echo "==> SUCCESS: Owner '$NORMALIZED_EMAIL' successfully provisioned and verified in $DB_NAME."
else
  echo "Error: Owner '$NORMALIZED_EMAIL' was not found during post-insertion verification." >&2
  echo "$VERIFY_OUTPUT" >&2
  exit 1
fi
