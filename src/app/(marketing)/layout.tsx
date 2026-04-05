import Link from 'next/link'
import { Bot } from 'lucide-react'

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <Bot className="h-7 w-7 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">SMB Chat</span>
          </Link>
          <nav className="flex items-center gap-6">
            <Link href="/features" className="text-sm text-gray-600 hover:text-gray-900">Features</Link>
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</Link>
            <Link href="/login" className="text-sm text-gray-600 hover:text-gray-900">Sign In</Link>
            <Link href="/signup" className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Get Started Free
            </Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="border-t bg-gray-50">
        <div className="mx-auto max-w-6xl px-6 py-12">
          <div className="flex items-center justify-between">
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
