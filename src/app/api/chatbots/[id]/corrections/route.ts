import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const supabase = createAdminClient()

    const url = new URL(req.url)
    const status = url.searchParams.get('status') ?? 'pending'

    const { data: corrections } = await supabase
      .from('ai_corrections')
      .select('*, messages(content, conversation_id)')
      .eq('chatbot_id', id)
      .eq('status', status)
      .order('created_at', { ascending: false })

    return NextResponse.json({ success: true, data: corrections ?? [] })
  } catch (error) {
    console.error('List corrections error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const supabase = createAdminClient()

    const body = await req.json()
    const { correction_id, action, corrected_response } = body

    if (!correction_id || !action) {
      return NextResponse.json({ success: false, error: 'Missing fields' }, { status: 400 })
    }

    const updateData: Record<string, unknown> = {
      status: action, // approved, rejected, edited
      reviewed_by: userId,
      reviewed_at: new Date().toISOString(),
    }

    if (action === 'edited' && corrected_response) {
      updateData.corrected_response = corrected_response
    }

    const { data, error } = await supabase
      .from('ai_corrections')
      .update(updateData)
      .eq('id', correction_id)
      .eq('chatbot_id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Review correction error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
