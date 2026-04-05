import { Sidebar } from '@/components/layout/sidebar'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-gray-50/80">
      <Sidebar />
      {/*
        Mobile: top bar = 56px (h-14), bottom tab bar = 56px (h-14)
        Desktop: no top/bottom offset needed since sidebar is on the left
      */}
      <main className="flex-1 overflow-y-auto pt-14 pb-20 lg:pt-0 lg:pb-0">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 sm:py-8">
          {children}
        </div>
      </main>
    </div>
  )
}
