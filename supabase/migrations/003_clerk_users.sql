-- SMB Chat: Clerk-compatible users table
-- Clerk manages auth; this table stores user profile data synced from Clerk

CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,  -- Clerk user ID (user_xxx format)
  email TEXT,
  full_name TEXT,
  avatar_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Drop FK constraints that reference auth.users (Supabase Auth)
-- since we use Clerk for authentication instead
-- These would need to be run if the original migration was applied:

-- ALTER TABLE workspaces DROP CONSTRAINT IF EXISTS workspaces_owner_id_fkey;
-- ALTER TABLE workspace_members DROP CONSTRAINT IF EXISTS workspace_members_user_id_fkey;
-- ALTER TABLE conversations DROP CONSTRAINT IF EXISTS conversations_assigned_agent_id_fkey;
-- ALTER TABLE ai_corrections DROP CONSTRAINT IF EXISTS ai_corrections_reviewed_by_fkey;
-- ALTER TABLE tickets DROP CONSTRAINT IF EXISTS tickets_assigned_to_fkey;

-- Re-add FK constraints pointing to our users table
-- ALTER TABLE workspaces ADD CONSTRAINT workspaces_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES users(id);
-- ALTER TABLE workspace_members ADD CONSTRAINT workspace_members_user_id_fkey FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
