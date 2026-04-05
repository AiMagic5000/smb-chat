import { Bot } from 'lucide-react'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Bot className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">SMB Chat</span>
          </div>
          <p className="text-gray-500">AI-powered chatbots for your business</p>
        </div>
        {children}
      </div>
    </div>
  )
}
