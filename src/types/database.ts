export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      workspaces: {
        Row: {
          id: string
          name: string
          slug: string
          owner_id: string
          plan: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          owner_id: string
          plan?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          owner_id?: string
          plan?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          settings?: Json
          updated_at?: string
        }
      }
      workspace_members: {
        Row: {
          id: string
          workspace_id: string
          user_id: string
          role: string
          invited_at: string
          accepted_at: string | null
        }
        Insert: {
          id?: string
          workspace_id: string
          user_id: string
          role?: string
          invited_at?: string
          accepted_at?: string | null
        }
        Update: {
          role?: string
          accepted_at?: string | null
        }
      }
      chatbots: {
        Row: {
          id: string
          workspace_id: string
          name: string
          slug: string
          status: string
          model: string
          system_prompt: string
          temperature: number
          max_tokens: number
          greeting_message: string
          fallback_message: string
          require_lead_capture: boolean
          lead_capture_after_messages: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          slug: string
          status?: string
          model?: string
          system_prompt?: string
          temperature?: number
          max_tokens?: number
          greeting_message?: string
          fallback_message?: string
          require_lead_capture?: boolean
          lead_capture_after_messages?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          name?: string
          slug?: string
          status?: string
          model?: string
          system_prompt?: string
          temperature?: number
          max_tokens?: number
          greeting_message?: string
          fallback_message?: string
          require_lead_capture?: boolean
          lead_capture_after_messages?: number
          updated_at?: string
        }
      }
      widget_configs: {
        Row: {
          id: string
          chatbot_id: string
          accent_color: string
          position: string
          avatar_url: string | null
          logo_url: string | null
          header_title: string | null
          header_subtitle: string
          show_voice_button: boolean
          show_branding: boolean
          custom_css: string | null
          bubble_style: string
          theme: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          chatbot_id: string
          accent_color?: string
          position?: string
          avatar_url?: string | null
          logo_url?: string | null
          header_title?: string | null
          header_subtitle?: string
          show_voice_button?: boolean
          show_branding?: boolean
          custom_css?: string | null
          bubble_style?: string
          theme?: string
        }
        Update: {
          accent_color?: string
          position?: string
          avatar_url?: string | null
          logo_url?: string | null
          header_title?: string | null
          header_subtitle?: string
          show_voice_button?: boolean
          show_branding?: boolean
          custom_css?: string | null
          bubble_style?: string
          theme?: string
          updated_at?: string
        }
      }
      knowledge_sources: {
        Row: {
          id: string
          chatbot_id: string
          type: string
          name: string
          source_url: string | null
          storage_path: string | null
          file_size_bytes: number | null
          mime_type: string | null
          status: string
          chunk_count: number
          error_message: string | null
          last_crawled_at: string | null
          crawl_frequency: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          chatbot_id: string
          type: string
          name: string
          source_url?: string | null
          storage_path?: string | null
          file_size_bytes?: number | null
          mime_type?: string | null
          status?: string
          chunk_count?: number
          error_message?: string | null
          crawl_frequency?: string
        }
        Update: {
          status?: string
          chunk_count?: number
          error_message?: string | null
          last_crawled_at?: string | null
          crawl_frequency?: string
          updated_at?: string
        }
      }
      conversations: {
        Row: {
          id: string
          chatbot_id: string
          workspace_id: string
          contact_id: string | null
          channel: string
          session_id: string
          status: string
          assigned_agent_id: string | null
          is_live_chat: boolean
          satisfaction_score: number | null
          metadata: Json
          started_at: string
          resolved_at: string | null
          last_message_at: string
        }
        Insert: {
          id?: string
          chatbot_id: string
          workspace_id: string
          contact_id?: string | null
          channel?: string
          session_id: string
          status?: string
          assigned_agent_id?: string | null
          is_live_chat?: boolean
          metadata?: Json
        }
        Update: {
          status?: string
          contact_id?: string | null
          assigned_agent_id?: string | null
          is_live_chat?: boolean
          satisfaction_score?: number | null
          resolved_at?: string | null
          last_message_at?: string
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          role: string
          content: string
          token_count: number | null
          sources: Json
          is_live_agent: boolean
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          role: string
          content: string
          token_count?: number | null
          sources?: Json
          is_live_agent?: boolean
        }
        Update: {
          content?: string
        }
      }
      contacts: {
        Row: {
          id: string
          workspace_id: string
          email: string | null
          name: string | null
          phone: string | null
          company: string | null
          metadata: Json
          first_seen_at: string
          last_seen_at: string
          total_conversations: number
          total_messages: number
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          email?: string | null
          name?: string | null
          phone?: string | null
          company?: string | null
          metadata?: Json
          tags?: string[]
        }
        Update: {
          email?: string | null
          name?: string | null
          phone?: string | null
          company?: string | null
          metadata?: Json
          tags?: string[]
          last_seen_at?: string
          total_conversations?: number
          total_messages?: number
          updated_at?: string
        }
      }
      tickets: {
        Row: {
          id: string
          workspace_id: string
          conversation_id: string | null
          contact_id: string | null
          chatbot_id: string | null
          subject: string
          description: string | null
          priority: string
          status: string
          assigned_to: string | null
          resolved_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          conversation_id?: string | null
          contact_id?: string | null
          chatbot_id?: string | null
          subject: string
          description?: string | null
          priority?: string
          status?: string
          assigned_to?: string | null
        }
        Update: {
          subject?: string
          description?: string | null
          priority?: string
          status?: string
          assigned_to?: string | null
          resolved_at?: string | null
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          workspace_id: string
          stripe_subscription_id: string | null
          stripe_price_id: string | null
          plan: string
          status: string
          message_limit: number
          messages_used: number
          chatbot_limit: number
          extra_message_credits: number
          current_period_start: string | null
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          plan?: string
          status?: string
          message_limit?: number
          messages_used?: number
          chatbot_limit?: number
          extra_message_credits?: number
        }
        Update: {
          stripe_subscription_id?: string | null
          stripe_price_id?: string | null
          plan?: string
          status?: string
          message_limit?: number
          messages_used?: number
          chatbot_limit?: number
          extra_message_credits?: number
          current_period_start?: string | null
          current_period_end?: string | null
          updated_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          workspace_id: string
          name: string
          key_hash: string
          key_prefix: string
          scopes: string[]
          last_used_at: string | null
          expires_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          name: string
          key_hash: string
          key_prefix: string
          scopes?: string[]
          expires_at?: string | null
        }
        Update: {
          name?: string
          last_used_at?: string | null
        }
      }
    }
    Functions: {
      is_workspace_member: {
        Args: { ws_id: string }
        Returns: boolean
      }
      is_workspace_admin: {
        Args: { ws_id: string }
        Returns: boolean
      }
    }
  }
}
