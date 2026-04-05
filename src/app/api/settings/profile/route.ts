import { NextRequest, NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'

export async function GET() {
  try {
    const user = await currentUser()
    if (!user) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    return NextResponse.json({
      success: true,
      data: {
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress ?? '',
        full_name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim(),
        company: (user.publicMetadata?.company as string) ?? '',
        created_at: new Date(user.createdAt).toISOString(),
      },
    })
  } catch (error) {
    console.error('Get profile error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const clerk = await clerkClient()
    await clerk.users.updateUser(userId, {
      publicMetadata: { company: body.company },
      firstName: body.full_name?.split(' ')[0] ?? '',
      lastName: body.full_name?.split(' ').slice(1).join(' ') ?? '',
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 })
  }
}
