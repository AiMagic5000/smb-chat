'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Bot, Menu, X } from 'lucide-react'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  return (
    <div className="min-h-screen bg-white">
      {/* Nav */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ${
          scrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-100' : 'bg-white'
        }`}
      >
        <div className="mx-auto max-w-6xl flex h-16 items-center justify-between px-4 sm:px-6">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0 group">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 group-hover:bg-violet-700 transition-colors">
              <Bot className="h-4.5 w-4.5 text-white h-[18px] w-[18px]" />
            </div>
            <span className="text-[17px] font-bold text-gray-900 tracking-tight">SMB Chat</span>
          </Link>

          {/* Desktop center nav pill group */}
          <nav className="hidden md:flex items-center bg-gray-100 rounded-full px-1.5 py-1.5 gap-0.5">
            <Link
              href="/features"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-1.5 rounded-full hover:bg-white hover:shadow-sm transition-all duration-150"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-1.5 rounded-full hover:bg-white hover:shadow-sm transition-all duration-150"
            >
              Pricing
            </Link>
            <Link
              href="/sign-in"
              className="text-sm font-medium text-gray-600 hover:text-gray-900 px-4 py-1.5 rounded-full hover:bg-white hover:shadow-sm transition-all duration-150"
            >
              Log in
            </Link>
          </nav>

          {/* Desktop right CTA */}
          <div className="hidden md:flex items-center">
            <Link
              href="/sign-up"
              className="rounded-full bg-violet-600 px-5 py-2 text-sm font-semibold text-white hover:bg-violet-700 active:bg-violet-800 transition-colors shadow-sm"
            >
              Start Free Trial
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-full text-gray-600 hover:bg-gray-100 active:bg-gray-200 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          >
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 bg-white px-4 pt-3 pb-5 space-y-1">
            <Link
              href="/features"
              className="flex items-center text-sm font-medium text-gray-700 hover:text-violet-600 py-2.5 px-3 rounded-xl hover:bg-violet-50 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="flex items-center text-sm font-medium text-gray-700 hover:text-violet-600 py-2.5 px-3 rounded-xl hover:bg-violet-50 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/sign-in"
              className="flex items-center text-sm font-medium text-gray-700 hover:text-violet-600 py-2.5 px-3 rounded-xl hover:bg-violet-50 transition-colors"
            >
              Log in
            </Link>
            <div className="pt-2">
              <Link
                href="/sign-up"
                className="flex items-center justify-center rounded-full bg-violet-600 px-4 py-3 text-sm font-semibold text-white hover:bg-violet-700 active:bg-violet-800 transition-colors"
              >
                Start Free Trial
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Page offset for fixed nav */}
      <div className="h-16" />

      {children}

      {/* Footer */}
      <footer className="border-t bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-violet-600">
                <Bot className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-bold text-gray-900">SMB Chat</span>
            </div>
            <nav className="flex items-center gap-6">
              <Link href="/features" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Features</Link>
              <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Pricing</Link>
              <Link href="/sign-in" className="text-sm text-gray-500 hover:text-gray-900 transition-colors">Log in</Link>
            </nav>
            <p className="text-sm text-gray-400">Built by Start My Business Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
