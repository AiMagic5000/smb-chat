import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { PLANS } from '@/lib/constants'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const supabase = createAdminClient()

    const { data: member } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', userId)
      .not('accepted_at', 'is', null)
      .limit(1)
      .single()

    if (!member) return NextResponse.json({ success: false, error: 'No workspace' }, { status: 400 })

    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('workspace_id', member.workspace_id)
      .single()

    const planKey = (subscription?.plan ?? 'starter') as keyof typeof PLANS
    const planDetails = PLANS[planKey]

    return NextResponse.json({
      success: true,
      data: {
        ...subscription,
        plan_details: planDetails,
      },
    })
  } catch (error) {
    console.error('Get subscription error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
