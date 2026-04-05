import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const widgetUrl = process.env.NEXT_PUBLIC_WIDGET_URL ?? 'https://brandmetrics.us/widget'

    const embedCode = `<script\n  src="${widgetUrl}/smb-chat-widget.min.js"\n  data-bot-id="${id}"\n  async\n></script>`

    return NextResponse.json({ success: true, data: { embed_code: embedCode, bot_id: id } })
  } catch (error) {
    console.error('Get embed code error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
