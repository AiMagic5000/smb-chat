import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

const installSchema = z.object({
  platform: z.string().min(1),
  website_url: z.string().min(1),
  login_url: z.string().optional().default(''),
  username: z.string().min(1),
  password: z.string().min(1),
  pin: z.string().optional().default(''),
  notes: z.string().optional().default(''),
  position: z.enum(['bottom-right', 'bottom-left']).optional().default('bottom-right'),
})

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: chatbotId } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const supabase = createAdminClient()
    const body = await req.json()
    const parsed = installSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 })
    }

    const { data: member } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', userId)
      .not('accepted_at', 'is', null)
      .limit(1)
      .single()

    if (!member) {
      return NextResponse.json({ success: false, error: 'No workspace found' }, { status: 400 })
    }

    const { data, error } = await supabase
      .from('install_requests')
      .insert({
        chatbot_id: chatbotId,
        workspace_id: member.workspace_id,
        platform: parsed.data.platform,
        website_url: parsed.data.website_url,
        login_url: parsed.data.login_url,
        username_encrypted: parsed.data.username,
        password_encrypted: parsed.data.password,
        pin_encrypted: parsed.data.pin,
        notes: parsed.data.notes,
        position_preference: parsed.data.position,
        status: 'pending',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data }, { status: 201 })
  } catch (error) {
    console.error('Install request error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
