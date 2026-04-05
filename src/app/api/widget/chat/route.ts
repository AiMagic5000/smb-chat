import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { retrieveContext, generateResponse } from '@/lib/ai/rag'
import { rateLimit } from '@/lib/rate-limit'
import { z } from 'zod'

const schema = z.object({
  bot_id: z.string().uuid(),
  conversation_id: z.string().uuid(),
  message: z.string().min(1).max(4000),
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

    const { bot_id, conversation_id, message } = parsed.data

    const { allowed } = rateLimit(`widget:${ip}:${bot_id}`, 60, 60)
    if (!allowed) {
      return NextResponse.json(
        { success: false, error: 'Rate limit exceeded' },
        { status: 429 }
      )
    }

    const supabase = createAdminClient()

    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('*, widget_configs(*)')
      .eq('id', bot_id)
      .eq('status', 'active')
      .single()

    if (!chatbot) {
      return NextResponse.json(
        { success: false, error: 'Chatbot not found or inactive' },
        { status: 404 }
      )
    }

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('workspace_id', chatbot.workspace_id)
      .single()

    if (subscription) {
      const totalAllowed = subscription.message_limit + subscription.extra_message_credits
      if (subscription.messages_used >= totalAllowed) {
        return NextResponse.json(
          { success: false, error: 'Message limit reached' },
          { status: 402 }
        )
      }
    }

    await supabase.from('messages').insert({
      conversation_id,
      role: 'user',
      content: message,
    })

    const context = await retrieveContext(bot_id, conversation_id, message)

    const { reply, sources } = await generateResponse(
      {
        model: chatbot.model,
        system_prompt: chatbot.system_prompt,
        temperature: chatbot.temperature,
        max_tokens: chatbot.max_tokens,
      },
      context,
      message
    )

    const { data: assistantMsg } = await supabase.from('messages').insert({
      conversation_id,
      role: 'assistant',
      content: reply,
      sources: sources as unknown as Record<string, unknown>[],
    }).select('id').single()

    await supabase
      .from('conversations')
      .update({ last_message_at: new Date().toISOString() })
      .eq('id', conversation_id)

    if (subscription) {
      await supabase
        .from('subscriptions')
        .update({ messages_used: subscription.messages_used + 1 })
        .eq('id', subscription.id)
    }

    return NextResponse.json({
      success: true,
      data: { response: reply, sources, conversation_id, message_id: assistantMsg?.id },
    })
  } catch (error) {
    console.error('Widget chat error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
