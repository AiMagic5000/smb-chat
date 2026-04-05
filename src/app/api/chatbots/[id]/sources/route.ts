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

    const { data: sources } = await supabase
      .from('knowledge_sources')
      .select('*')
      .eq('chatbot_id', id)
      .order('created_at', { ascending: false })

    return NextResponse.json({ success: true, data: sources ?? [] })
  } catch (error) {
    console.error('List sources error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
