export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: string
  meta?: {
    total: number
    page: number
    limit: number
  }
}

export interface ChatRequest {
  bot_id: string
  conversation_id: string
  message: string
  session_id: string
}

export interface ChatResponse {
  reply: string
  sources: Array<{ title: string; url: string; score: number }>
  conversation_id: string
}

export interface LeadCaptureRequest {
  conversation_id: string
  name: string
  email: string
  phone?: string
}

export interface WidgetConfig {
  accent_color: string
  position: string
  avatar_url: string | null
  logo_url: string | null
  header_title: string | null
  header_subtitle: string
  show_voice_button: boolean
  show_branding: boolean
  greeting_message: string
  require_lead_capture: boolean
  lead_capture_after_messages: number
  theme: string
  bubble_style: string
}

export interface DashboardStats {
  total_sessions: number
  total_messages: number
  satisfaction_avg: number
  messages_today: number
  active_conversations: number
  resolution_rate: number
}
