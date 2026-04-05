import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { z } from 'zod'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    const supabase = createAdminClient()

    const { data: tests } = await supabase
      .from('evaluation_tests')
      .select('*')
      .eq('chatbot_id', id)
      .order('created_at', { ascending: false })

    return NextResponse.json({ success: true, data: tests ?? [] })
  } catch (error) {
    console.error('List evaluations error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

const createSchema = z.object({
  name: z.string().min(1),
  input_message: z.string().min(1),
  expected_output: z.string().optional(),
  match_type: z.enum(['contains', 'exact', 'regex', 'semantic']).default('contains'),
})

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
    const parsed = createSchema.safeParse(body)
    if (!parsed.success) return NextResponse.json({ success: false, error: 'Invalid data' }, { status: 400 })

    const { data: test, error } = await supabase
      .from('evaluation_tests')
      .insert({ ...parsed.data, chatbot_id: id })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, data: test }, { status: 201 })
  } catch (error) {
    console.error('Create evaluation error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
