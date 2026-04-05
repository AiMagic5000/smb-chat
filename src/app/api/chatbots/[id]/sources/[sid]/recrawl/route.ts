import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string; sid: string }> }
) {
  try {
    const { sid } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const supabase = createAdminClient()

    await supabase.from('knowledge_sources').update({ status: 'processing' }).eq('id', sid)

    // TODO: Trigger actual recrawl job via n8n or background worker
    return NextResponse.json({ success: true, data: { message: 'Recrawl queued' } })
  } catch (error) {
    console.error('Recrawl error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
