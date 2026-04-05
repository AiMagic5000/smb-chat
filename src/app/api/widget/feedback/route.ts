import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const schema = z.object({
  message_id: z.string().uuid(),
  conversation_id: z.string().uuid(),
  rating: z.enum(['positive', 'negative']),
  comment: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })

    const supabase = createAdminClient()

    const { error } = await supabase.from('message_feedback').insert(parsed.data)
    if (error) throw error

    // If negative, create a correction entry for review
    if (parsed.data.rating === 'negative') {
      const { data: message } = await supabase
        .from('messages')
        .select('content, conversation_id')
        .eq('id', parsed.data.message_id)
        .single()

      if (message) {
        const { data: conversation } = await supabase
          .from('conversations')
          .select('chatbot_id')
          .eq('id', message.conversation_id)
          .single()

        if (conversation) {
          await supabase.from('ai_corrections').insert({
            chatbot_id: conversation.chatbot_id,
            message_id: parsed.data.message_id,
            original_response: message.content,
            status: 'pending',
          })
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Widget feedback error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
