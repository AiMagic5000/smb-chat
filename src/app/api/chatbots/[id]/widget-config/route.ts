import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { z } from 'zod'

const updateSchema = z.object({
  accent_color: z.string().optional(),
  position: z.enum(['bottom-right', 'bottom-left']).optional(),
  avatar_url: z.string().url().nullable().optional(),
  logo_url: z.string().url().nullable().optional(),
  header_title: z.string().max(100).optional(),
  header_subtitle: z.string().max(200).optional(),
  show_voice_button: z.boolean().optional(),
  show_branding: z.boolean().optional(),
  bubble_style: z.enum(['circle', 'pill']).optional(),
  theme: z.enum(['light', 'dark']).optional(),
})

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { data: config } = await supabase
      .from('widget_configs')
      .select('*')
      .eq('chatbot_id', id)
      .single()

    return NextResponse.json({ success: true, data: config })
  } catch (error) {
    console.error('Get widget config error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const parsed = updateSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 })

    const { data: config, error } = await supabase
      .from('widget_configs')
      .update({ ...parsed.data, updated_at: new Date().toISOString() })
      .eq('chatbot_id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, data: config })
  } catch (error) {
    console.error('Update widget config error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
