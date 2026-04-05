-- RLS Policies and Helper Functions

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

CREATE OR REPLACE FUNCTION is_workspace_member(ws_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = ws_id
      AND user_id = auth.uid()
      AND accepted_at IS NOT NULL
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

CREATE OR REPLACE FUNCTION is_workspace_admin(ws_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM workspace_members
    WHERE workspace_id = ws_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
      AND accepted_at IS NOT NULL
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Vector similarity search function
CREATE OR REPLACE FUNCTION match_knowledge_chunks(
  query_embedding vector(1536),
  match_chatbot_id UUID,
  match_count INTEGER DEFAULT 5,
  match_threshold FLOAT DEFAULT 0.7
)
RETURNS TABLE (
  id UUID,
  content TEXT,
  metadata JSONB,
  similarity FLOAT
) AS $$
  SELECT
    kc.id,
    kc.content,
    kc.metadata,
    1 - (kc.embedding <=> query_embedding) AS similarity
  FROM knowledge_chunks kc
  WHERE kc.chatbot_id = match_chatbot_id
    AND 1 - (kc.embedding <=> query_embedding) > match_threshold
  ORDER BY kc.embedding <=> query_embedding
  LIMIT match_count;
$$ LANGUAGE sql STABLE;

-- Auto-create workspace + membership on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  ws_id UUID;
  company_name TEXT;
  ws_slug TEXT;
BEGIN
  company_name := COALESCE(NEW.raw_user_meta_data->>'company', NEW.raw_user_meta_data->>'full_name', 'My Workspace');
  ws_slug := LOWER(REGEXP_REPLACE(company_name, '[^a-z0-9]+', '-', 'gi'));
  ws_slug := ws_slug || '-' || SUBSTRING(NEW.id::TEXT, 1, 8);

  INSERT INTO public.workspaces (name, slug, owner_id)
  VALUES (company_name, ws_slug, NEW.id)
  RETURNING id INTO ws_id;

  INSERT INTO public.workspace_members (workspace_id, user_id, role, accepted_at)
  VALUES (ws_id, NEW.id, 'owner', now());

  INSERT INTO public.subscriptions (workspace_id, plan, message_limit, chatbot_limit)
  VALUES (ws_id, 'starter', 1000, 1);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- ENABLE RLS ON ALL TABLES
-- ============================================================

ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbots ENABLE ROW LEVEL SECURITY;
ALTER TABLE widget_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE usage_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE evaluation_tests ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS POLICIES
-- ============================================================

-- Workspaces
CREATE POLICY workspace_select ON workspaces FOR SELECT
  USING (is_workspace_member(id));
CREATE POLICY workspace_insert ON workspaces FOR INSERT
  WITH CHECK (owner_id = auth.uid());
CREATE POLICY workspace_update ON workspaces FOR UPDATE
  USING (is_workspace_admin(id));

-- Workspace Members
CREATE POLICY wm_select ON workspace_members FOR SELECT
  USING (is_workspace_member(workspace_id));
CREATE POLICY wm_insert ON workspace_members FOR INSERT
  WITH CHECK (is_workspace_admin(workspace_id));
CREATE POLICY wm_update ON workspace_members FOR UPDATE
  USING (is_workspace_admin(workspace_id));
CREATE POLICY wm_delete ON workspace_members FOR DELETE
  USING (is_workspace_admin(workspace_id));

-- Chatbots
CREATE POLICY chatbot_select ON chatbots FOR SELECT
  USING (is_workspace_member(workspace_id));
CREATE POLICY chatbot_insert ON chatbots FOR INSERT
  WITH CHECK (is_workspace_member(workspace_id));
CREATE POLICY chatbot_update ON chatbots FOR UPDATE
  USING (is_workspace_member(workspace_id));
CREATE POLICY chatbot_delete ON chatbots FOR DELETE
  USING (is_workspace_admin(workspace_id));

-- Widget Configs (via chatbot)
CREATE POLICY wc_select ON widget_configs FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM chatbots c WHERE c.id = widget_configs.chatbot_id AND is_workspace_member(c.workspace_id)
  ));
CREATE POLICY wc_insert ON widget_configs FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM chatbots c WHERE c.id = widget_configs.chatbot_id AND is_workspace_member(c.workspace_id)
  ));
CREATE POLICY wc_update ON widget_configs FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM chatbots c WHERE c.id = widget_configs.chatbot_id AND is_workspace_member(c.workspace_id)
  ));

-- Knowledge Sources
CREATE POLICY ks_select ON knowledge_sources FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM chatbots c WHERE c.id = knowledge_sources.chatbot_id AND is_workspace_member(c.workspace_id)
  ));
CREATE POLICY ks_insert ON knowledge_sources FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM chatbots c WHERE c.id = knowledge_sources.chatbot_id AND is_workspace_member(c.workspace_id)
  ));
CREATE POLICY ks_delete ON knowledge_sources FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM chatbots c WHERE c.id = knowledge_sources.chatbot_id AND is_workspace_admin(c.workspace_id)
  ));

-- Knowledge Chunks
CREATE POLICY kc_select ON knowledge_chunks FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM chatbots c WHERE c.id = knowledge_chunks.chatbot_id AND is_workspace_member(c.workspace_id)
  ));

-- Conversations
CREATE POLICY conv_select ON conversations FOR SELECT
  USING (is_workspace_member(workspace_id));
CREATE POLICY conv_update ON conversations FOR UPDATE
  USING (is_workspace_member(workspace_id));

-- Messages (via conversation)
CREATE POLICY msg_select ON messages FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM conversations c WHERE c.id = messages.conversation_id AND is_workspace_member(c.workspace_id)
  ));
CREATE POLICY msg_insert ON messages FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM conversations c WHERE c.id = messages.conversation_id AND is_workspace_member(c.workspace_id)
  ));

-- Contacts
CREATE POLICY contacts_select ON contacts FOR SELECT
  USING (is_workspace_member(workspace_id));
CREATE POLICY contacts_insert ON contacts FOR INSERT
  WITH CHECK (is_workspace_member(workspace_id));
CREATE POLICY contacts_update ON contacts FOR UPDATE
  USING (is_workspace_member(workspace_id));
CREATE POLICY contacts_delete ON contacts FOR DELETE
  USING (is_workspace_admin(workspace_id));

-- Tickets
CREATE POLICY tickets_select ON tickets FOR SELECT
  USING (is_workspace_member(workspace_id));
CREATE POLICY tickets_insert ON tickets FOR INSERT
  WITH CHECK (is_workspace_member(workspace_id));
CREATE POLICY tickets_update ON tickets FOR UPDATE
  USING (is_workspace_member(workspace_id));

-- Subscriptions
CREATE POLICY sub_select ON subscriptions FOR SELECT
  USING (is_workspace_member(workspace_id));
CREATE POLICY sub_update ON subscriptions FOR UPDATE
  USING (is_workspace_admin(workspace_id));

-- Usage Records
CREATE POLICY usage_select ON usage_records FOR SELECT
  USING (is_workspace_member(workspace_id));

-- API Keys
CREATE POLICY apikey_select ON api_keys FOR SELECT
  USING (is_workspace_member(workspace_id));
CREATE POLICY apikey_insert ON api_keys FOR INSERT
  WITH CHECK (is_workspace_admin(workspace_id));
CREATE POLICY apikey_delete ON api_keys FOR DELETE
  USING (is_workspace_admin(workspace_id));

-- AI Corrections
CREATE POLICY aic_select ON ai_corrections FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM chatbots c WHERE c.id = ai_corrections.chatbot_id AND is_workspace_member(c.workspace_id)
  ));
CREATE POLICY aic_update ON ai_corrections FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM chatbots c WHERE c.id = ai_corrections.chatbot_id AND is_workspace_member(c.workspace_id)
  ));

-- Evaluation Tests
CREATE POLICY eval_select ON evaluation_tests FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM chatbots c WHERE c.id = evaluation_tests.chatbot_id AND is_workspace_member(c.workspace_id)
  ));
CREATE POLICY eval_insert ON evaluation_tests FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM chatbots c WHERE c.id = evaluation_tests.chatbot_id AND is_workspace_member(c.workspace_id)
  ));
CREATE POLICY eval_delete ON evaluation_tests FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM chatbots c WHERE c.id = evaluation_tests.chatbot_id AND is_workspace_member(c.workspace_id)
  ));
