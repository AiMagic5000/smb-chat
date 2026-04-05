import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'

export async function GET(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const url = new URL(req.url)
    const page = parseInt(url.searchParams.get('page') ?? '1')
    const limit = parseInt(url.searchParams.get('limit') ?? '25')
    const status = url.searchParams.get('status')
    const search = url.searchParams.get('q')
    const liveOnly = url.searchParams.get('live') === 'true'

    let query = supabase
      .from('conversations')
      .select('*, contacts(name, email), chatbots(name)', { count: 'exact' })
      .order('last_message_at', { ascending: false })
      .range((page - 1) * limit, page * limit - 1)

    if (status) query = query.eq('status', status)
    if (liveOnly) query = query.eq('is_live_chat', true)
    if (search) {
      const sanitized = search.replace(/[,()]/g, '')
      query = query.or(`contacts.name.ilike.%${sanitized}%,contacts.email.ilike.%${sanitized}%`)
    }

    const { data, count, error } = await query
    if (error) throw error

    return NextResponse.json({
      success: true,
      data: data ?? [],
      meta: { total: count ?? 0, page, limit },
    })
  } catch (error) {
    console.error('List conversations error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
