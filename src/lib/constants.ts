export const PLANS = {
  starter: {
    name: 'Starter',
    price: 29,
    messages_per_month: 1000,
    chatbots: 1,
    knowledge_sources: 5,
    storage_mb: 100,
    channels: ['web'] as const,
    live_chat: false,
    api_access: false,
    remove_branding: false,
    log_retention_days: 30,
  },
  basic: {
    name: 'Basic',
    price: 99,
    messages_per_month: 5000,
    chatbots: 3,
    knowledge_sources: 25,
    storage_mb: 500,
    channels: ['web', 'whatsapp'] as const,
    live_chat: true,
    api_access: false,
    remove_branding: false,
    log_retention_days: 90,
  },
  turbo: {
    name: 'Turbo',
    price: 299,
    messages_per_month: 25000,
    chatbots: 10,
    knowledge_sources: 100,
    storage_mb: 2000,
    channels: ['web', 'whatsapp', 'messenger', 'instagram', 'discord'] as const,
    live_chat: true,
    api_access: true,
    remove_branding: true,
    log_retention_days: 365,
  },
  enterprise: {
    name: 'Enterprise',
    price: null,
    messages_per_month: null,
    chatbots: null,
    knowledge_sources: null,
    storage_mb: null,
    channels: ['web', 'whatsapp', 'messenger', 'instagram', 'discord', 'phone'] as const,
    live_chat: true,
    api_access: true,
    remove_branding: true,
    log_retention_days: null,
  },
} as const

export type PlanKey = keyof typeof PLANS

export const ADDON_MESSAGE_CREDITS = { price: 10, messages: 1000 }

export const MODELS = [
  { id: 'gpt-4o', name: 'GPT-4o', provider: 'openai' },
  { id: 'gpt-4o-mini', name: 'GPT-4o Mini', provider: 'openai' },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'openai' },
] as const

export const EMBEDDING_MODEL = 'text-embedding-3-small'
export const EMBEDDING_DIMENSIONS = 1536
export const CHUNK_SIZE = 1000
export const CHUNK_OVERLAP = 200
export const RAG_TOP_K = 5
export const MAX_CONTEXT_MESSAGES = 10

export const RATE_LIMIT = {
  widget_chat: { max: 60, window_seconds: 60 },
  widget_session: { max: 10, window_seconds: 3600 },
} as const
