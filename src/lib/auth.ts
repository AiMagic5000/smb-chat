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

export async function ensureDbUser(userId: string, supabase: SupabaseClient, metadata?: { email?: string; full_name?: string }) {
  const { data: existing } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single()

  if (existing) return existing

  const { data: user } = await supabase
    .from('users')
    .insert({
      id: userId,
      email: metadata?.email ?? '',
      full_name: metadata?.full_name ?? '',
    })
    .select()
    .single()

  if (user) {
    await supabase.from('workspaces').insert({ name: 'My Workspace', owner_id: userId }).select().single().then(({ data: ws }) => {
      if (ws) {
        return supabase.from('workspace_members').insert({
          workspace_id: ws.id,
          user_id: userId,
          role: 'owner',
          accepted_at: new Date().toISOString(),
        })
      }
    })
  }

  return user
}
