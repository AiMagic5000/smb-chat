'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Headphones, Send, Loader2 } from 'lucide-react'
import { useFetch } from '@/hooks/use-fetch'

interface LiveConversation {
  id: string
  status: string
  is_live_chat: boolean
  created_at: string
  contacts: { name: string | null; email: string | null } | null
  chatbots: { name: string } | null
}

interface Message {
  id: string
  role: string
  content: string
  created_at: string
}

export default function LiveChatPage() {
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [reply, setReply] = useState('')
  const { data: conversations, loading } = useFetch<LiveConversation[]>('/api/conversations?live=true')
  const { data: messages, refetch: refetchMessages } = useFetch<Message[]>(
    selectedId ? `/api/conversations/${selectedId}/messages` : null
  )

  const handleSend = async () => {
    if (!reply.trim() || !selectedId) return
    await fetch(`/api/conversations/${selectedId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: reply, role: 'agent' }),
    })
    setReply('')
    refetchMessages()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Live Chat</h1>
        <div className="flex gap-2">
          <Badge variant="outline">Queue: {conversations?.filter((c) => c.status === 'active' && c.is_live_chat).length ?? 0}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-4">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            <CardHeader className="border-b py-3">
              <CardTitle className="text-sm">Conversation Queue</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                </div>
              ) : !conversations || conversations.length === 0 ? (
                <div className="flex items-center justify-center h-full text-center text-gray-400 p-4">
                  <div>
                    <Headphones className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                    <p className="text-sm">No live conversations</p>
                    <p className="text-xs mt-1">Visitors can request live chat when the AI can&apos;t help</p>
                  </div>
                </div>
              ) : (
                <div className="divide-y">
                  {conversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedId(conv.id)}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition ${selectedId === conv.id ? 'bg-blue-50' : ''}`}
                    >
                      <div className="font-medium text-sm text-gray-900">{conv.contacts?.name ?? conv.contacts?.email ?? 'Anonymous'}</div>
                      <div className="text-xs text-gray-500">{conv.chatbots?.name} - {new Date(conv.created_at).toLocaleTimeString()}</div>
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-8">
          <Card className="h-[calc(100vh-200px)] flex flex-col">
            {selectedId ? (
              <>
                <CardContent className="flex-1 overflow-y-auto p-4 space-y-3">
                  {messages?.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                      <div className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${
                        msg.role === 'user' ? 'bg-gray-100 text-gray-900' :
                        msg.role === 'agent' ? 'bg-blue-600 text-white' :
                        msg.role === 'system' ? 'bg-yellow-50 text-yellow-800 text-xs italic' :
                        'bg-gray-800 text-white'
                      }`}>
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </CardContent>
                <div className="border-t p-4 flex gap-2">
                  <Input
                    value={reply}
                    onChange={(e) => setReply(e.target.value)}
                    placeholder="Type a reply..."
                    onKeyDown={(e) => { if (e.key === 'Enter') handleSend() }}
                  />
                  <Button onClick={handleSend}>
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <p className="text-gray-400">Select a conversation from the queue</p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
