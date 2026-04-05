-- SMB Chat Core Schema
-- Multi-tenant chatbot SaaS platform

CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================
-- WORKSPACES (tenants)
-- ============================================================
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id),
  plan TEXT NOT NULL DEFAULT 'starter',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_workspaces_owner ON workspaces(owner_id);
CREATE INDEX idx_workspaces_slug ON workspaces(slug);

-- ============================================================
-- WORKSPACE MEMBERS
-- ============================================================
CREATE TABLE workspace_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member',
  invited_at TIMESTAMPTZ DEFAULT now(),
  accepted_at TIMESTAMPTZ,
  UNIQUE(workspace_id, user_id)
);

CREATE INDEX idx_wm_workspace ON workspace_members(workspace_id);
CREATE INDEX idx_wm_user ON workspace_members(user_id);

-- ============================================================
-- CHATBOTS
-- ============================================================
CREATE TABLE chatbots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft',
  model TEXT NOT NULL DEFAULT 'gpt-4o',
  system_prompt TEXT NOT NULL DEFAULT 'You are a helpful assistant.',
  temperature NUMERIC(3,2) DEFAULT 0.7 CHECK (temperature >= 0 AND temperature <= 2),
  max_tokens INTEGER DEFAULT 1024,
  greeting_message TEXT DEFAULT 'Hi! How can I help you today?',
  fallback_message TEXT DEFAULT 'I am not sure about that. Let me connect you with a team member.',
  require_lead_capture BOOLEAN DEFAULT false,
  lead_capture_after_messages INTEGER DEFAULT 3,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(workspace_id, slug)
);

CREATE INDEX idx_chatbots_workspace ON chatbots(workspace_id);

-- ============================================================
-- WIDGET CONFIGS
-- ============================================================
CREATE TABLE widget_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id UUID UNIQUE NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  accent_color TEXT DEFAULT '#4493f2',
  position TEXT DEFAULT 'bottom-right',
  avatar_url TEXT,
  logo_url TEXT,
  header_title TEXT,
  header_subtitle TEXT DEFAULT 'Online -- We reply instantly',
  show_voice_button BOOLEAN DEFAULT false,
  show_branding BOOLEAN DEFAULT true,
  custom_css TEXT,
  bubble_style TEXT DEFAULT 'circle',
  theme TEXT DEFAULT 'light',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- KNOWLEDGE SOURCES
-- ============================================================
CREATE TABLE knowledge_sources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  source_url TEXT,
  storage_path TEXT,
  file_size_bytes BIGINT,
  mime_type TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  chunk_count INTEGER DEFAULT 0,
  error_message TEXT,
  last_crawled_at TIMESTAMPTZ,
  crawl_frequency TEXT DEFAULT 'manual',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_ks_chatbot ON knowledge_sources(chatbot_id);

-- ============================================================
-- KNOWLEDGE CHUNKS (pgvector embeddings)
-- ============================================================
CREATE TABLE knowledge_chunks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id UUID NOT NULL REFERENCES knowledge_sources(id) ON DELETE CASCADE,
  chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  token_count INTEGER NOT NULL,
  embedding vector(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_kc_chatbot ON knowledge_chunks(chatbot_id);
CREATE INDEX idx_kc_source ON knowledge_chunks(source_id);
CREATE INDEX idx_kc_embedding ON knowledge_chunks
  USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- ============================================================
-- CHATBOT CHANNELS
-- ============================================================
CREATE TABLE chatbot_channels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  channel TEXT NOT NULL,
  enabled BOOLEAN DEFAULT false,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(chatbot_id, channel)
);

-- ============================================================
-- CONTACTS
-- ============================================================
CREATE TABLE contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  email TEXT,
  name TEXT,
  phone TEXT,
  company TEXT,
  metadata JSONB DEFAULT '{}',
  first_seen_at TIMESTAMPTZ DEFAULT now(),
  last_seen_at TIMESTAMPTZ DEFAULT now(),
  total_conversations INTEGER DEFAULT 0,
  total_messages INTEGER DEFAULT 0,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_contacts_workspace ON contacts(workspace_id);
CREATE UNIQUE INDEX idx_contacts_unique_email ON contacts(workspace_id, email) WHERE email IS NOT NULL;

-- ============================================================
-- CONVERSATIONS
-- ============================================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  contact_id UUID REFERENCES contacts(id),
  channel TEXT NOT NULL DEFAULT 'web',
  session_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  assigned_agent_id UUID REFERENCES auth.users(id),
  is_live_chat BOOLEAN DEFAULT false,
  satisfaction_score INTEGER CHECK (satisfaction_score BETWEEN 1 AND 5),
  metadata JSONB DEFAULT '{}',
  started_at TIMESTAMPTZ DEFAULT now(),
  resolved_at TIMESTAMPTZ,
  last_message_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_conv_chatbot ON conversations(chatbot_id);
CREATE INDEX idx_conv_workspace ON conversations(workspace_id);
CREATE INDEX idx_conv_session ON conversations(session_id);
CREATE INDEX idx_conv_status ON conversations(status);
CREATE INDEX idx_conv_last_msg ON conversations(last_message_at DESC);

-- ============================================================
-- MESSAGES
-- ============================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL,
  content TEXT NOT NULL,
  token_count INTEGER,
  sources JSONB DEFAULT '[]',
  is_live_agent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_msg_conv ON messages(conversation_id);
CREATE INDEX idx_msg_created ON messages(created_at);

-- ============================================================
-- MESSAGE FEEDBACK
-- ============================================================
CREATE TABLE message_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
  rating TEXT NOT NULL,
  comment TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- AI CORRECTIONS
-- ============================================================
CREATE TABLE ai_corrections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  original_response TEXT NOT NULL,
  corrected_response TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_aic_chatbot ON ai_corrections(chatbot_id);
CREATE INDEX idx_aic_status ON ai_corrections(status);

-- ============================================================
-- TICKETS
-- ============================================================
CREATE TABLE tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id),
  contact_id UUID REFERENCES contacts(id),
  chatbot_id UUID REFERENCES chatbots(id),
  subject TEXT NOT NULL,
  description TEXT,
  priority TEXT NOT NULL DEFAULT 'medium',
  status TEXT NOT NULL DEFAULT 'open',
  assigned_to UUID REFERENCES auth.users(id),
  resolved_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_tickets_workspace ON tickets(workspace_id);
CREATE INDEX idx_tickets_status ON tickets(status);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID UNIQUE NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  stripe_subscription_id TEXT,
  stripe_price_id TEXT,
  plan TEXT NOT NULL DEFAULT 'starter',
  status TEXT NOT NULL DEFAULT 'active',
  message_limit INTEGER NOT NULL DEFAULT 1000,
  messages_used INTEGER NOT NULL DEFAULT 0,
  chatbot_limit INTEGER NOT NULL DEFAULT 1,
  extra_message_credits INTEGER DEFAULT 0,
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- USAGE RECORDS
-- ============================================================
CREATE TABLE usage_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  period_start DATE NOT NULL,
  messages_count INTEGER DEFAULT 0,
  tokens_input INTEGER DEFAULT 0,
  tokens_output INTEGER DEFAULT 0,
  embedding_tokens INTEGER DEFAULT 0,
  storage_bytes BIGINT DEFAULT 0,
  UNIQUE(workspace_id, chatbot_id, period_start)
);

CREATE INDEX idx_usage_workspace ON usage_records(workspace_id, period_start);

-- ============================================================
-- API KEYS
-- ============================================================
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  key_prefix TEXT NOT NULL,
  scopes TEXT[] DEFAULT '{read,write}',
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_apikeys_hash ON api_keys(key_hash);
CREATE INDEX idx_apikeys_workspace ON api_keys(workspace_id);

-- ============================================================
-- EVALUATION TESTS
-- ============================================================
CREATE TABLE evaluation_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chatbot_id UUID NOT NULL REFERENCES chatbots(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  input_message TEXT NOT NULL,
  expected_output TEXT,
  match_type TEXT DEFAULT 'contains',
  actual_output TEXT,
  passed BOOLEAN,
  score NUMERIC(5,4),
  last_run_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_eval_chatbot ON evaluation_tests(chatbot_id);
