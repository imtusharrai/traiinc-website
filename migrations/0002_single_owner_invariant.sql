-- Migration: 0002_single_owner_invariant.sql
-- Enforce invariant: at most one member can hold the 'owner' role at any time.
-- Other roles (admin, editor, seo_manager, viewer) can have multiple members.

CREATE UNIQUE INDEX IF NOT EXISTS idx_cms_members_single_owner
ON cms_members(role)
WHERE role = 'owner';
