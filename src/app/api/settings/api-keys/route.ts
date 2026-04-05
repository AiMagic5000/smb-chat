import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { randomBytes, createHash } from 'crypto'

export async function GET() {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { data: keys } = await supabase
      .from('api_keys')
      .select('id, name, key_prefix, scopes, last_used_at, expires_at, created_at')
      .order('created_at', { ascending: false })

    return NextResponse.json({ success: true, data: keys ?? [] })
  } catch (error) {
    console.error('List API keys error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { name } = await req.json()
    if (!name) return NextResponse.json({ success: false, error: 'Name required' }, { status: 400 })

    const { data: member } = await supabase
      .from('workspace_members')
      .select('workspace_id')
      .eq('user_id', user.id)
      .not('accepted_at', 'is', null)
      .limit(1)
      .single()

    if (!member) return NextResponse.json({ success: false, error: 'No workspace' }, { status: 400 })

    const rawKey = `smb_${randomBytes(32).toString('hex')}`
    const keyHash = createHash('sha256').update(rawKey).digest('hex')
    const keyPrefix = rawKey.slice(0, 12)

    const { data: apiKey, error } = await supabase
      .from('api_keys')
      .insert({ workspace_id: member.workspace_id, name, key_hash: keyHash, key_prefix: keyPrefix })
      .select('id, name, key_prefix, created_at')
      .single()

    if (error) throw error

    // Return the raw key only on creation -- never again
    return NextResponse.json({
      success: true,
      data: { ...apiKey, key: rawKey },
    }, { status: 201 })
  } catch (error) {
    console.error('Create API key error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const { id } = await req.json()
    const { error } = await supabase.from('api_keys').delete().eq('id', id)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Delete API key error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
