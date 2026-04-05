import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const supabase = createAdminClient()

    const today = new Date().toISOString().split('T')[0]

    const [sessions, messages, activeConvs, resolvedConvs] = await Promise.all([
      supabase.from('conversations').select('id', { count: 'exact', head: true }),
      supabase.from('messages').select('id', { count: 'exact', head: true }).gte('created_at', today),
      supabase.from('conversations').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('conversations').select('id', { count: 'exact', head: true }).eq('status', 'resolved'),
    ])

    const totalSessions = sessions.count ?? 0
    const messagesToday = messages.count ?? 0
    const activeCount = activeConvs.count ?? 0
    const resolvedCount = resolvedConvs.count ?? 0
    const resolutionRate = totalSessions > 0 ? Math.round((resolvedCount / totalSessions) * 100) : 0

    return NextResponse.json({
      success: true,
      data: {
        total_sessions: totalSessions,
        messages_today: messagesToday,
        active_conversations: activeCount,
        resolution_rate: resolutionRate,
        satisfaction_avg: 0,
      },
    })
  } catch (error) {
    console.error('Dashboard analytics error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
