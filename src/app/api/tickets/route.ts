import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const supabase = createAdminClient()

    const url = new URL(req.url)
    const status = url.searchParams.get('status')

    let query = supabase
      .from('tickets')
      .select('*, contacts(name, email), chatbots(name)')
      .order('created_at', { ascending: false })

    if (status) query = query.eq('status', status)

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ success: true, data: data ?? [] })
  } catch (error) {
    console.error('List tickets error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

const createSchema = z.object({
  subject: z.string().min(1),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'urgent']).default('medium'),
  conversation_id: z.string().uuid().optional(),
  contact_id: z.string().uuid().optional(),
  chatbot_id: z.string().uuid().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const supabase = createAdminClient()

    const body = await req.json()
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 })

    const { data: member } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', userId)
      .not('accepted_at', 'is', null)
      .limit(1)
      .single()

    if (!member) return NextResponse.json({ success: false, error: 'No workspace' }, { status: 400 })

    const { data: ticket, error } = await supabase
      .from('tickets')
      .insert({ ...parsed.data, workspace_id: member.workspace_id })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, data: ticket }, { status: 201 })
  } catch (error) {
    console.error('Create ticket error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
