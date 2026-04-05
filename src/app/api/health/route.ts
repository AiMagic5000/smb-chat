import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET() {
  try {
    const supabase = createAdminClient()
    const { error } = await supabase.from('workspaces').select('id').limit(1)

    return NextResponse.json({
      status: error ? 'degraded' : 'ok',
      db: error ? 'error' : 'connected',
      timestamp: new Date().toISOString(),
    })
  } catch {
    return NextResponse.json(
      { status: 'error', db: 'disconnected', timestamp: new Date().toISOString() },
      { status: 503 }
    )
  }
}
