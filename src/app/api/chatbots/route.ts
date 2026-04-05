import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { z } from 'zod'

const createSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z.string().min(1).max(100),
  model: z.string().default('gpt-4o'),
  system_prompt: z.string().default('You are a helpful assistant.'),
  greeting_message: z.string().default('Hi! How can I help you today?'),
  temperature: z.number().min(0).max(2).default(0.7),
})

export async function GET() {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { data: chatbots, error } = await supabase
      .from('chatbots')
      .select('*, widget_configs(*)')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json({ success: true, data: chatbots })
  } catch (error) {
    console.error('List chatbots error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const parsed = createSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const { data: member } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .not('accepted_at', 'is', null)
      .limit(1)
      .single()

    if (!member) {
      return NextResponse.json(
        { success: false, error: 'No workspace found' },
        { status: 400 }
      )
    }

    const { data: chatbot, error } = await supabase
      .from('chatbots')
      .insert({
        ...parsed.data,
        workspace_id: member.workspace_id,
        status: 'active',
      })
      .select()
      .single()

    if (error || !chatbot) throw error ?? new Error('Failed to create chatbot')

    await supabase.from('widget_configs').insert({
      chatbot_id: chatbot.id,
    })

    return NextResponse.json({ success: true, data: chatbot }, { status: 201 })
  } catch (error) {
    console.error('Create chatbot error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
