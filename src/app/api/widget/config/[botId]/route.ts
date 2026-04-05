import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ botId: string }> }
) {
  try {
    const { botId } = await params
    const supabase = createAdminClient()

    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('id, name, greeting_message, require_lead_capture, lead_capture_after_messages, widget_configs(*)')
      .eq('id', botId)
      .eq('status', 'active')
      .single()

    if (!chatbot) {
      return NextResponse.json(
        { success: false, error: 'Chatbot not found' },
        { status: 404 }
      )
    }

    const config = Array.isArray(chatbot.widget_configs)
      ? chatbot.widget_configs[0]
      : chatbot.widget_configs

    return NextResponse.json({
      success: true,
      data: {
        bot_id: chatbot.id,
        name: chatbot.name,
        greeting_message: chatbot.greeting_message,
        require_lead_capture: chatbot.require_lead_capture,
        lead_capture_after_messages: chatbot.lead_capture_after_messages,
        accent_color: config?.accent_color ?? '#4493f2',
        position: config?.position ?? 'bottom-right',
        avatar_url: config?.avatar_url,
        logo_url: config?.logo_url,
        header_title: config?.header_title ?? chatbot.name,
        header_subtitle: config?.header_subtitle ?? 'Online -- We reply instantly',
        show_voice_button: config?.show_voice_button ?? false,
        show_branding: config?.show_branding ?? true,
        bubble_style: config?.bubble_style ?? 'circle',
        theme: config?.theme ?? 'light',
      },
    })
  } catch (error) {
    console.error('Widget config error:', error)
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    )
  }
}
