import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const supabase = createAdminClient()

    const url = new URL(req.url)
    const days = parseInt(url.searchParams.get('days') ?? '30')
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - days)

    const { data: conversations } = await supabase
      .from('conversations')
      .select('started_at, status')
      .gte('started_at', startDate.toISOString())
      .order('started_at', { ascending: true })

    // Group by date
    const byDate: Record<string, number> = {}
    for (const conv of conversations ?? []) {
      const date = conv.started_at.split('T')[0]
      byDate[date] = (byDate[date] ?? 0) + 1
    }

    const chartData = Object.entries(byDate).map(([date, count]) => ({ date, count }))

    return NextResponse.json({ success: true, data: chartData })
  } catch (error) {
    console.error('Conversation analytics error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
