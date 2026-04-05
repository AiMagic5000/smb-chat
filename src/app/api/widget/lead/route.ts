import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const schema = z.object({
  conversation_id: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const parsed = schema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: 'Invalid request' },
        { status: 400 }
      )
    }

    const { conversation_id, name, email, phone } = parsed.data
    const supabase = createAdminClient()

    const { data: conversation } = await supabase
      .from('conversations')
      .select('workspace_id, chatbot_id')
      .eq('id', conversation_id)
      .single()

    if (!conversation) {
      return NextResponse.json(
        { success: false, error: 'Conversation not found' },
        { status: 404 }
      )
    }

    const { data: existingContact } = await supabase
      .from('contacts')
      .select('id, total_conversations')
      .eq('workspace_id', conversation.workspace_id)
      .eq('email', email)
      .single()

    let contactId: string

    if (existingContact) {
      contactId = existingContact.id
      await supabase
        .from('contacts')
        .update({
          name: name || undefined,
          phone: phone || undefined,
          last_seen_at: new Date().toISOString(),
          total_conversations: (existingContact.total_conversations ?? 0) + 1,
        })
        .eq('id', contactId)
    } else {
      const { data: newContact } = await supabase
        .from('contacts')
        .insert({
          workspace_id: conversation.workspace_id,
          name,
          email,
          phone: phone || null,
          total_conversations: 1,
        })
        .select('id')
        .single()

      contactId = newContact!.id
    }

    await supabase
      .from('conversations')
      .update({ contact_id: contactId })
      .eq('id', conversation_id)

    return NextResponse.json({
      success: true,
      data: { contact_id: contactId },
    })
  } catch (error) {
    console.error('Lead capture error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
