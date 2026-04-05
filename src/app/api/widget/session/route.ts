import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { rateLimit } from '@/lib/rate-limit'
import { z } from 'zod'

const schema = z.object({
  bot_id: z.string().uuid(),
  session_id: z.string().min(1).optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
})

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for') ?? 'unknown'
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      )
    }

    const { bot_id, metadata } = parsed.data
    const session_id = parsed.data.session_id || crypto.randomUUID()

    const { allowed } = rateLimit(`session:${ip}`, 10, 3600)
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Too many sessions' },
        { status: 429 }
      )
    }

    const supabase = createAdminClient()

    const { data: existing } = await supabase
      .from('conversations')
      .select('id')
      .eq('chatbot_id', bot_id)
      .eq('session_id', session_id)
      .eq('status', 'active')
      .single()

    if (existing) {
      return NextResponse.json({
        success: true,
        data: { conversation_id: existing.id, resumed: true },
      })
    }

    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('workspace_id')
      .eq('id', bot_id)
      .single()

    if (!chatbot) {
      return NextResponse.json(
        { success: false, error: 'Chatbot not found' },
        { status: 404 }
      )
    }

    const { data: conversation, error } = await supabase
      .from('conversations')
      .insert({
        chatbot_id: bot_id,
        workspace_id: chatbot.workspace_id,
        session_id,
        channel: 'web',
        metadata: {
          ip,
          user_agent: req.headers.get('user-agent'),
          ...metadata,
        },
      })
      .select('id')
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: { conversation_id: conversation.id, resumed: false },
    })
  } catch (error) {
    console.error('Session creation error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
