import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const schema = z.object({
  conversation_id: z.string().uuid(),
  transcript: z.array(z.object({
    role: z.string(),
    content: z.string(),
    timestamp: z.string(),
  })),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 })

    const supabase = createAdminClient()

    // Get conversation details
    const { data: conversation } = await supabase
      .from('conversations')
      .select('workspace_id, chatbot_id, contact_id, contacts(name, email), chatbots(name), workspaces(name, settings)')
      .eq('id', parsed.data.conversation_id)
      .single()

    if (!conversation) {
      return NextResponse.json({ success: false, error: 'Conversation not found' }, { status: 404 })
    }

    // Mark conversation as resolved if active
    await supabase
      .from('conversations')
      .update({ status: 'resolved', resolved_at: new Date().toISOString() })
      .eq('id', parsed.data.conversation_id)
      .eq('status', 'active')

    // TODO: Send transcript email via n8n webhook or SMTP
    // The transcript data is available in parsed.data.transcript

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Widget transcript error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
