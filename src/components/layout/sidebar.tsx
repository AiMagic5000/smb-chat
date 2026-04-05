'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useClerk } from '@clerk/nextjs'
import {
  LayoutDashboard,
  Bot,
  MessageSquare,
  Headphones,
  Ticket,
  Sparkles,
  Users,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/chatbots', label: 'Chatbots', icon: Bot },
  { href: '/conversations', label: 'Chatlogs', icon: MessageSquare },
  { href: '/live-chat', label: 'Live Chat', icon: Headphones },
  { href: '/tickets', label: 'Tickets', icon: Ticket },
  { href: '/corrections', label: 'Corrections', icon: Sparkles },
  { href: '/contacts', label: 'Contacts', icon: Users },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
]

const bottomNavItems = [
  { href: '/settings', label: 'Settings', icon: Settings },
]

// Bottom tab bar -- max 5 items, pick the most-used ones
const tabItems = [
  { href: '/dashboard', label: 'Home', icon: LayoutDashboard },
  { href: '/chatbots', label: 'Chatbots', icon: Bot },
  { href: '/conversations', label: 'Chats', icon: MessageSquare },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/settings', label: 'Settings', icon: Settings },
]

function NavLink({
  href,
  label,
  icon: Icon,
  onClick,
}: {
  href: string
  label: string
  icon: React.ElementType
  onClick?: () => void
}) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'))

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-150',
        isActive
          ? 'bg-violet-50 text-violet-700'
          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
      )}
    >
      <Icon
        className={cn(
          'h-[18px] w-[18px] shrink-0 transition-colors',
          isActive ? 'text-violet-600' : 'text-gray-400 group-hover:text-gray-600'
        )}
      />
      <span className="truncate">{label}</span>
      {isActive && <ChevronRight className="ml-auto h-3.5 w-3.5 text-violet-400" />}
    </Link>
  )
}

function TabBarItem({
  href,
  label,
  icon: Icon,
}: {
  href: string
  label: string
  icon: React.ElementType
}) {
  const pathname = usePathname()
  const isActive = pathname === href || (href !== '/dashboard' && pathname.startsWith(href + '/'))

  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center justify-center gap-1 min-w-0 flex-1 py-2 transition-colors relative',
        isActive ? 'text-violet-600' : 'text-gray-400 hover:text-gray-600 active:text-gray-700'
      )}
    >
      {isActive && (
        <span className="absolute top-0 left-1/2 -translate-x-1/2 h-0.5 w-8 rounded-b-full bg-violet-600" />
      )}
      <Icon className={cn('h-[22px] w-[22px]', isActive && 'stroke-[2.2]')} />
      <span className={cn('text-[10px] font-medium tracking-wide', isActive && 'font-semibold')}>
        {label}
      </span>
    </Link>
  )
}

export function Sidebar() {
  const { signOut } = useClerk()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleSignOut = () => {
    signOut({ redirectUrl: '/' })
  }

  const closeMobile = () => setMobileOpen(false)

  // Shared nav content used by both desktop sidebar and mobile slide-out
  const navContent = (
    <div className="flex flex-col h-full">

      {/* Logo header */}
      <div className="flex h-16 items-center justify-between px-5 border-b border-gray-100 shrink-0">
        <Link href="/dashboard" className="flex items-center gap-2.5 group" onClick={closeMobile}>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 group-hover:bg-violet-700 transition-colors shrink-0">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <span className="text-[16px] font-bold text-gray-900 tracking-tight">SMB Chat</span>
        </Link>
        <button
          className="lg:hidden flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
          onClick={closeMobile}
          aria-label="Close menu"
        >
          <X className="h-4.5 w-4.5 h-[18px] w-[18px]" />
        </button>
      </div>

      {/* Primary nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink key={item.href} {...item} onClick={closeMobile} />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-gray-100 px-3 py-3 space-y-0.5 shrink-0">
        {bottomNavItems.map((item) => (
          <NavLink key={item.href} {...item} onClick={closeMobile} />
        ))}
        <button
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-150 group"
        >
          <LogOut className="h-[18px] w-[18px] shrink-0 text-gray-400 group-hover:text-gray-600 transition-colors" />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* ---- MOBILE ---- */}

      {/* Mobile sticky top header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex h-14 items-center justify-between border-b border-gray-100 bg-white/95 backdrop-blur-sm px-4">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-600 group-hover:bg-violet-700 transition-colors">
            <Bot className="h-3.5 w-3.5 text-white" />
          </div>
          <span className="text-[15px] font-bold text-gray-900">SMB Chat</span>
        </Link>
        <div className="flex items-center gap-1">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            aria-label="Notifications"
          >
            <Bell className="h-[18px] w-[18px]" />
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-[18px] w-[18px]" />
          </button>
        </div>
      </header>

      {/* Mobile bottom tab bar */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-t border-gray-100"
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        <div className="flex items-stretch h-14">
          {tabItems.map((item) => (
            <TabBarItem key={item.href} {...item} />
          ))}
        </div>
      </nav>

      {/* Mobile overlay (backdrop) */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
          onClick={closeMobile}
          aria-hidden="true"
        />
      )}

      {/* Mobile slide-out full menu */}
      <aside
        className={cn(
          'lg:hidden fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-2xl transition-transform duration-200 ease-out',
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {navContent}
      </aside>

      {/* ---- DESKTOP ---- */}
      <aside className="hidden lg:flex h-screen w-64 flex-col bg-white border-r border-gray-100 shrink-0">
        {navContent}
      </aside>
    </>
  )
}
