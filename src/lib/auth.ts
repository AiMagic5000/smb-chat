import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'
import type { SupabaseClient } from '@supabase/supabase-js'

interface AuthResult {
  userId: string
  supabase: SupabaseClient
}

export async function requireAuth(): Promise<AuthResult | null> {
  const { userId } = await auth()
  if (!userId) return null
  return { userId, supabase: createAdminClient() }
}

export async function ensureDbUser(
  userId: string,
  supabase: SupabaseClient,
  metadata?: { email?: string; full_name?: string }
) {
  const { data: existing } = await supabase
    .from('chat_users')
    .select('id')
    .eq('id', userId)
    .single()

  if (existing) return existing

  // Create user record
  const { data: user } = await supabase
    .from('chat_users')
    .insert({
      id: userId,
      email: metadata?.email ?? '',
      full_name: metadata?.full_name ?? '',
    })
    .select()
    .single()

  if (user) {
    // Generate a unique slug from email or userId
    const slugBase = metadata?.email
      ? metadata.email.split('@')[0].toLowerCase().replace(/[^a-z0-9]+/g, '-')
      : userId.slice(0, 12)
    const slug = `${slugBase}-${Date.now().toString(36)}`

    const { data: ws } = await supabase
      .from('workspaces')
      .insert({
        name: metadata?.full_name ? `${metadata.full_name}'s Workspace` : 'My Workspace',
        slug,
        owner_id: userId,
      })
      .select()
      .single()

    if (ws) {
      await supabase.from('workspace_members').insert({
        workspace_id: ws.id,
        user_id: userId,
        role: 'owner',
        accepted_at: new Date().toISOString(),
      })

      // Create default subscription
      await supabase.from('chat_subscriptions').insert({
        workspace_id: ws.id,
        plan: 'starter',
        message_limit: 1000,
        chatbot_limit: 1,
      })
    }
  }

  return user
}
