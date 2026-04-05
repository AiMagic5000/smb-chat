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
          <Link href="/" className="flex items-center gap-2">
            <Bot className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">SMB Chat</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/features" className="text-sm text-gray-600 hover:text-gray-900">Features</Link>
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link href="/sign-in" className="text-sm text-gray-600 hover:text-gray-900">Sign In</Link>
            <Link href="/sign-up" className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800">
              Get Started Free
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button className="md:hidden p-1 text-gray-600" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile nav */}
        {menuOpen && (
          <div className="md:hidden border-t px-4 py-4 space-y-3 bg-white">
            <Link href="/features" className="block text-sm text-gray-600 hover:text-gray-900" onClick={() => setMenuOpen(false)}>Features</Link>
            <Link href="/pricing" className="block text-sm text-gray-600 hover:text-gray-900" onClick={() => setMenuOpen(false)}>Pricing</Link>
            <Link href="/sign-in" className="block text-sm text-gray-600 hover:text-gray-900" onClick={() => setMenuOpen(false)}>Sign In</Link>
            <Link href="/sign-up" className="block rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white text-center hover:bg-gray-800" onClick={() => setMenuOpen(false)}>
              Get Started Free
            </Link>
          </div>
        )}
      </header>

      {children}

      <footer className="border-t bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-semibold text-gray-900">SMB Chat</span>
            </div>
            <p className="text-sm text-gray-500">Built by Start My Business Inc.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
