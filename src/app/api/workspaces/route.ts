import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const supabase = createAdminClient()

    const { data: memberships } = await supabase
      .from('workspace_members')
      .select('workspace_id, role, workspaces(*)')
      .eq('user_id', userId)
      .not('accepted_at', 'is', null)

    return NextResponse.json({ success: true, data: memberships ?? [] })
  } catch (error) {
    console.error('List workspaces error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

const createSchema = z.object({
  name: z.string().min(1).max(100),
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const supabase = createAdminClient()

    const body = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })

    const slug = parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + userId.slice(0, 8)

    const { data: workspace, error } = await supabase
      .from('workspaces')
      .insert({ name: parsed.data.name, slug, owner_id: userId })
      .select()
      .single()

    if (error) throw error

    await supabase.from('workspace_members').insert({
      workspace_id: workspace.id,
      user_id: userId,
      role: 'owner',
      accepted_at: new Date().toISOString(),
    })

    await supabase.from('subscriptions').insert({
      workspace_id: workspace.id,
      plan: 'starter',
      message_limit: 1000,
      chatbot_limit: 1,
    })

    return NextResponse.json({ success: true, data: workspace }, { status: 201 })
  } catch (error) {
    console.error('Create workspace error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
