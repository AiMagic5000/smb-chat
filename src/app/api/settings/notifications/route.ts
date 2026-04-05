import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const supabase = createAdminClient()

    // Notification preferences stored in workspace settings
    const { data: member } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', userId)
      .not('accepted_at', 'is', null)
      .limit(1)
      .single()

    if (!member) return NextResponse.json({ success: false, error: 'No workspace' }, { status: 400 })

    const { data: workspace } = await supabase
      .from('workspaces')
      .select('settings')
      .eq('id', member.workspace_id)
      .single()

    const settings = (workspace?.settings as Record<string, unknown>) ?? {}

    return NextResponse.json({
      success: true,
      data: {
        email_on_new_conversation: settings.email_on_new_conversation ?? true,
        email_on_live_chat_request: settings.email_on_live_chat_request ?? true,
        email_daily_digest: settings.email_daily_digest ?? false,
        sms_on_new_conversation: settings.sms_on_new_conversation ?? false,
        notification_email: settings.notification_email ?? '',
        notification_phone: settings.notification_phone ?? '',
      },
    })
  } catch (error) {
    console.error('Get notifications error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const supabase = createAdminClient()

    const body = await req.json()

    const { data: member } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', userId)
      .not('accepted_at', 'is', null)
      .limit(1)
      .single()

    if (!member) return NextResponse.json({ success: false, error: 'No workspace' }, { status: 400 })

    const { data: workspace } = await supabase
      .from('workspaces')
      .select('settings')
      .eq('id', member.workspace_id)
      .single()

    const currentSettings = (workspace?.settings as Record<string, unknown>) ?? {}
    const newSettings = { ...currentSettings, ...body }

    await supabase
      .from('workspaces')
      .update({ settings: newSettings })
      .eq('id', member.workspace_id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update notifications error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
