import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { ensureDbUser } from '@/lib/auth'
import { createAdminClient } from '@/lib/supabase/admin'
import { Sidebar } from '@/components/layout/sidebar'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  // Ensure the Clerk user has a DB record + workspace
  const supabase = createAdminClient()
  const user = await currentUser()
  await ensureDbUser(userId, supabase, {
    email: user?.emailAddresses[0]?.emailAddress,
    full_name: user?.fullName ?? undefined,
  })

  return (
    <div className="flex h-screen bg-gray-50/80">
      <Sidebar />
      <main className="flex-1 overflow-y-auto pt-14 pb-20 lg:pt-0 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
