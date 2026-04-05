import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const schema = z.object({
  conversation_id: z.string().uuid(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })

    const supabase = createAdminClient()

    const { data, error } = await supabase
      .from('conversations')
      .update({ is_live_chat: true })
      .eq('id', parsed.data.conversation_id)
      .select()
      .single()

    if (error) throw error

    // Insert system message about handoff
    await supabase.from('messages').insert({
      conversation_id: parsed.data.conversation_id,
      role: 'system',
      content: 'Visitor requested to speak with a live agent.',
    })

    return NextResponse.json({
      success: true,
      data: { conversation_id: data.id, is_live_chat: true },
    })
  } catch (error) {
    console.error('Widget handoff error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
