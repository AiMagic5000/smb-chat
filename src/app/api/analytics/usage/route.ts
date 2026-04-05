import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const supabase = createAdminClient()

    const { data: member } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', userId)
      .not('accepted_at', 'is', null)
      .limit(1)
      .single()

    if (!member) return NextResponse.json({ success: false, error: 'No workspace' }, { status: 400 })

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('workspace_id', member.workspace_id)
      .single()

    return NextResponse.json({
      success: true,
      data: {
        plan: subscription?.plan ?? 'starter',
        messages_used: subscription?.messages_used ?? 0,
        message_limit: subscription?.message_limit ?? 1000,
        chatbot_limit: subscription?.chatbot_limit ?? 1,
        extra_credits: subscription?.extra_message_credits ?? 0,
        period_start: subscription?.current_period_start,
        period_end: subscription?.current_period_end,
      },
    })
  } catch (error) {
    console.error('Usage analytics error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
