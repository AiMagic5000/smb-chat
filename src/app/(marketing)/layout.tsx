'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Bot, Menu, X } from 'lucide-react'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-4 py-4 sm:px-6">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Bot className="h-7 w-7 text-violet-600" />
            <span className="text-xl font-bold text-gray-900">SMB Chat</span>
          </Link>

          {/* Desktop nav - centered links */}
          <nav className="hidden md:flex items-center gap-1 bg-gray-100 rounded-full px-1 py-1">
            <Link href="/features" className="text-sm text-gray-600 hover:text-gray-900 px-4 py-1.5 rounded-full hover:bg-white transition">Features</Link>
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 px-4 py-1.5 rounded-full hover:bg-white transition">Pricing</Link>
          </nav>

          {/* Desktop right */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/sign-in" className="text-sm text-gray-600 hover:text-gray-900">Log in</Link>
            <Link href="/sign-up" className="rounded-full bg-gray-900 px-5 py-2 text-sm font-semibold text-white hover:bg-gray-800 transition">
              Start Free Trial
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-1 text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden border-t px-4 py-4 space-y-3 bg-white">
            <Link href="/features" className="block text-sm text-gray-600 hover:text-gray-900 py-1" onClick={() => setMenuOpen(false)}>Features</Link>
            <Link href="/pricing" className="block text-sm text-gray-600 hover:text-gray-900 py-1" onClick={() => setMenuOpen(false)}>Pricing</Link>
            <Link href="/sign-in" className="block text-sm text-gray-600 hover:text-gray-900 py-1" onClick={() => setMenuOpen(false)}>Log in</Link>
            <Link href="/sign-up" className="block rounded-full bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white text-center hover:bg-gray-800" onClick={() => setMenuOpen(false)}>
              Start Free Trial
            </Link>
          </div>
        )}
      </header>

      {children}

      <footer className="border-t bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-violet-600" />
              <span className="text-sm font-semibold text-gray-900">SMB Chat</span>
            </div>
            <p className="text-sm text-gray-500">Built by Start My Business Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
