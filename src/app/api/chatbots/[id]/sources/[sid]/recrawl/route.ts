import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; sid: string }> }
) {
  try {
    const { sid } = await params
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    await supabase.from('knowledge_sources').update({ status: 'processing' }).eq('id', sid)

    // TODO: Trigger actual recrawl job via n8n or background worker
    return NextResponse.json({ success: true, data: { message: 'Recrawl queued' } })
  } catch (error) {
    console.error('Recrawl error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
