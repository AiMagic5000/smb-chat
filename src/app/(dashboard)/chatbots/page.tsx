'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Bot, MoreVertical, Loader2 } from 'lucide-react'
import { useFetch } from '@/hooks/use-fetch'

interface Chatbot {
  id: string
  name: string
  status: string
  model: string
  total_conversations: number
  total_messages: number
}

export default function ChatbotsPage() {
  const { data: chatbots, loading } = useFetch<Chatbot[]>('/api/chatbots')

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Chatbots</h1>
        <Link href="/chatbots/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Chatbot
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : !chatbots || chatbots.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Bot className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No chatbots yet</h3>
            <p className="text-gray-500 mb-4">Create your first chatbot to start engaging visitors.</p>
            <Link href="/chatbots/new">
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Create Chatbot
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {chatbots.map((bot) => (
            <Link key={bot.id} href={`/chatbots/${bot.id}`}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <Bot className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{bot.name}</h3>
                        <p className="text-xs text-gray-500">{bot.model}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <Badge variant={bot.status === 'active' ? 'default' : 'secondary'}>
                      {bot.status}
                    </Badge>
                    <span>{bot.total_conversations ?? 0} conversations</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
