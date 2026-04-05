'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Search, Filter, Download, MessageSquare, Loader2 } from 'lucide-react'
import { useFetch } from '@/hooks/use-fetch'

interface Conversation {
  id: string
  channel: string
  status: string
  message_count: number
  last_message_at: string
  contacts: { name: string | null; email: string | null } | null
  chatbots: { name: string } | null
}

export default function ConversationsPage() {
  const [search, setSearch] = useState('')
  const { data: conversations, loading } = useFetch<Conversation[]>(
    `/api/conversations${search ? `?q=${encodeURIComponent(search)}` : ''}`
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Chatlogs</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations by name or email..."
            className="pl-10"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : !conversations || conversations.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <MessageSquare className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No conversations yet</h3>
            <p className="text-gray-500">Conversations will appear here once visitors start chatting.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Chatbot</th>
                  <th className="px-4 py-3 font-medium">Channel</th>
                  <th className="px-4 py-3 font-medium">Messages</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Last Activity</th>
                </tr>
              </thead>
              <tbody>
                {conversations.map((conv) => (
                  <tr key={conv.id} className="border-b hover:bg-gray-50 cursor-pointer">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{conv.contacts?.name ?? 'Anonymous'}</div>
                      <div className="text-xs text-gray-500">{conv.contacts?.email}</div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">{conv.chatbots?.name ?? '--'}</td>
                    <td className="px-4 py-3"><Badge variant="secondary">{conv.channel ?? 'web'}</Badge></td>
                    <td className="px-4 py-3 text-sm text-gray-600">{conv.message_count ?? 0}</td>
                    <td className="px-4 py-3">
                      <Badge variant={conv.status === 'active' ? 'default' : 'secondary'}>{conv.status}</Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {conv.last_message_at ? new Date(conv.last_message_at).toLocaleString() : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
