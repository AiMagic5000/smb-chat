import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const supabase = createAdminClient()

    const url = new URL(req.url)
    const limit = parseInt(url.searchParams.get('limit') ?? '50')

    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', id)
      .order('created_at', { ascending: true })
      .limit(limit)

    return NextResponse.json({ success: true, data: messages ?? [] })
  } catch (error) {
    console.error('List messages error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

const sendSchema = z.object({
  content: z.string().min(1).max(4000),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const supabase = createAdminClient()

    const body = await req.json()
    const parsed = sendSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ success: false, error: 'Invalid message' }, { status: 400 })

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: id,
        role: 'agent',
        content: parsed.data.content,
        is_live_agent: true,
      })
      .select()
      .single()

    if (error) throw error

    await supabase.from('conversations').update({ last_message_at: new Date().toISOString() }).eq('id', id)

    return NextResponse.json({ success: true, data: message }, { status: 201 })
  } catch (error) {
    console.error('Send message error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
