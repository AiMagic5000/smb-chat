import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const supabase = createAdminClient()

    const { data: chatbot } = await supabase
      .from('chatbots')
      .select('*, widget_configs(*)')
      .eq('id', id)
      .single()

    if (!chatbot) {
      return NextResponse.json({ success: false, error: 'Chatbot not found' }, { status: 404 })
    }

    const wc = Array.isArray(chatbot.widget_configs) ? chatbot.widget_configs[0] : chatbot.widget_configs
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://smbchat.alwaysencrypted.com'

    const attrs = [
      `src="${appUrl}/widget/smb-chat.min.js"`,
      `data-webhook="${appUrl}/api/widget/chat"`,
      `data-bot-id="${id}"`,
      `data-accent="${wc?.accent_color || '#4493f2'}"`,
      `data-position="${wc?.position || 'bottom-right'}"`,
      `data-greeting="${chatbot.greeting_message || 'Hi! How can I help you today?'}"`,
    ]

    if (wc?.logo_url) attrs.push(`data-logo="${wc.logo_url}"`)

    attrs.push('data-auto-open="off"')
    attrs.push('defer')

    const embedCode = `<script\n  ${attrs.join('\n  ')}\n></script>`

    return NextResponse.json({
      success: true,
      data: { embed_code: embedCode, bot_id: id },
    })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
