'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Code, Paintbrush, Database, MessageSquare, Settings,
  Copy, Check, Loader2, Trash2, RefreshCw, Send,
} from 'lucide-react'
import { useFetch } from '@/hooks/use-fetch'

interface Chatbot {
  id: string
  name: string
  model: string
  system_prompt: string
  greeting_message: string
  fallback_message: string | null
  temperature: number
  status: string
  widget_configs: WidgetConfig[] | WidgetConfig | null
  knowledge_sources: KnowledgeSource[]
}

interface WidgetConfig {
  accent_color: string
  position: string
  logo_url: string | null
  theme: string
}

interface KnowledgeSource {
  id: string
  type: string
  name: string
  status: string
  chunk_count: number
  created_at: string
}

export default function ChatbotDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: chatbot, loading, refetch } = useFetch<Chatbot>(`/api/chatbots/${id}`)

  const [form, setForm] = useState({ name: '', system_prompt: '', greeting_message: '', fallback_message: '', temperature: 0.7 })
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [urlInput, setUrlInput] = useState('')
  const [addingUrl, setAddingUrl] = useState(false)
  const [testInput, setTestInput] = useState('')
  const [testMessages, setTestMessages] = useState<{ role: string; content: string }[]>([])
  const [testLoading, setTestLoading] = useState(false)
  const [testConvId, setTestConvId] = useState<string | null>(null)

  useEffect(() => {
    if (chatbot) {
      setForm({
        name: chatbot.name,
        system_prompt: chatbot.system_prompt,
        greeting_message: chatbot.greeting_message,
        fallback_message: chatbot.fallback_message ?? '',
        temperature: chatbot.temperature,
      })
    }
  }, [chatbot])

  const embedCode = `<script
  src="${typeof window !== 'undefined' ? window.location.origin : ''}/widget/smb-chat.min.js"
  data-bot-id="${id}"
  async
></script>`

  const copyCode = () => {
    navigator.clipboard.writeText(embedCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const saveGeneral = async () => {
    setSaving(true)
    await fetch(`/api/chatbots/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    setSaving(false)
    refetch()
  }

  const addUrl = async () => {
    if (!urlInput.trim()) return
    setAddingUrl(true)
    await fetch(`/api/chatbots/${id}/sources/url`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: urlInput }),
    })
    setUrlInput('')
    setAddingUrl(false)
    refetch()
  }

  const deleteSource = async (sid: string) => {
    await fetch(`/api/chatbots/${id}/sources/${sid}`, { method: 'DELETE' })
    refetch()
  }

  const sendTestMessage = useCallback(async () => {
    if (!testInput.trim() || testLoading) return
    const msg = testInput.trim()
    setTestInput('')
    setTestMessages((prev) => [...prev, { role: 'user', content: msg }])
    setTestLoading(true)

    try {
      // Create session if needed
      let convId = testConvId
      if (!convId) {
        const sessionRes = await fetch('/api/widget/session', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ bot_id: id }),
        })
        const sessionData = await sessionRes.json()
        if (sessionData.success) {
          convId = sessionData.data.conversation_id
          setTestConvId(convId)
        }
      }

      if (!convId) throw new Error('No session')

      const res = await fetch('/api/widget/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bot_id: id, conversation_id: convId, message: msg }),
      })
      const data = await res.json()
      if (data.success) {
        setTestMessages((prev) => [...prev, { role: 'bot', content: data.data.response }])
      } else {
        setTestMessages((prev) => [...prev, { role: 'bot', content: data.error || 'Error getting response' }])
      }
    } catch {
      setTestMessages((prev) => [...prev, { role: 'bot', content: 'Error sending message' }])
    } finally {
      setTestLoading(false)
    }
  }, [testInput, testLoading, testConvId, id])

  const sources = chatbot?.knowledge_sources ?? []

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  if (!chatbot) {
    return <p className="text-gray-500">Chatbot not found.</p>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{chatbot.name}</h1>
          <p className="text-gray-500 text-sm mt-1">Configure your chatbot behavior and appearance</p>
        </div>
        <Badge variant={chatbot.status === 'active' ? 'default' : 'secondary'}>{chatbot.status}</Badge>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general"><Settings className="h-4 w-4 mr-2" />General</TabsTrigger>
          <TabsTrigger value="knowledge"><Database className="h-4 w-4 mr-2" />Knowledge</TabsTrigger>
          <TabsTrigger value="widget"><Paintbrush className="h-4 w-4 mr-2" />Widget</TabsTrigger>
          <TabsTrigger value="embed"><Code className="h-4 w-4 mr-2" />Embed</TabsTrigger>
          <TabsTrigger value="test"><MessageSquare className="h-4 w-4 mr-2" />Test</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card>
            <CardHeader><CardTitle>General Settings</CardTitle></CardHeader>
            <CardContent className="space-y-4 max-w-xl">
              <div>
                <Label>Chatbot Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div>
                <Label>System Prompt</Label>
                <Textarea rows={6} className="font-mono text-sm" value={form.system_prompt} onChange={(e) => setForm({ ...form, system_prompt: e.target.value })} />
              </div>
              <div>
                <Label>Greeting Message</Label>
                <Input value={form.greeting_message} onChange={(e) => setForm({ ...form, greeting_message: e.target.value })} />
              </div>
              <div>
                <Label>Fallback Message</Label>
                <Input value={form.fallback_message} onChange={(e) => setForm({ ...form, fallback_message: e.target.value })} />
              </div>
              <div>
                <Label>Temperature ({form.temperature})</Label>
                <input type="range" min="0" max="2" step="0.1" value={form.temperature} onChange={(e) => setForm({ ...form, temperature: parseFloat(e.target.value) })} className="w-full" />
              </div>
              <Button onClick={saveGeneral} disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Knowledge Sources ({sources.length})</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-6">
                <Input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="https://example.com/page" className="flex-1" />
                <Button onClick={addUrl} disabled={addingUrl}>
                  {addingUrl ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Add URL
                </Button>
              </div>

              {sources.length === 0 ? (
                <div className="flex items-center justify-center py-12 text-gray-400">
                  <div className="text-center">
                    <Database className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                    <p>No knowledge sources added yet</p>
                    <p className="text-xs mt-1">Add URLs to train your chatbot</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {sources.map((src) => (
                    <div key={src.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{src.name}</p>
                        <p className="text-xs text-gray-500">{src.type} - {src.chunk_count} chunks - <Badge variant={src.status === 'ready' ? 'secondary' : 'outline'}>{src.status}</Badge></p>
                      </div>
                      <div className="flex gap-1">
                        <Button size="sm" variant="ghost"><RefreshCw className="h-3 w-3" /></Button>
                        <Button size="sm" variant="ghost" onClick={() => deleteSource(src.id)}><Trash2 className="h-3 w-3 text-red-500" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="widget">
          <Card>
            <CardHeader><CardTitle>Widget Preview</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">Customize widget appearance from the Widget Config API. Use the Embed tab to get your embed code.</p>
              <div className="bg-gray-100 rounded-lg p-4 h-96 flex items-end justify-end">
                <div className="w-80 bg-white rounded-2xl shadow-xl overflow-hidden">
                  <div className="bg-blue-600 p-4 text-white">
                    <p className="font-semibold">{chatbot.name}</p>
                    <p className="text-xs opacity-80">Online</p>
                  </div>
                  <div className="p-4 h-48 flex items-end">
                    <div className="bg-gray-100 rounded-lg p-3 text-sm max-w-[80%]">{chatbot.greeting_message}</div>
                  </div>
                  <div className="border-t p-3 flex gap-2">
                    <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-400">Type a message...</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="embed">
          <Card>
            <CardHeader><CardTitle>Embed Code</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">
                Copy this code and paste it before the closing &lt;/body&gt; tag on your website.
              </p>
              <div className="relative">
                <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto">{embedCode}</pre>
                <Button size="sm" variant="secondary" className="absolute top-2 right-2" onClick={copyCode}>
                  {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                  {copied ? ' Copied!' : ' Copy'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="test">
          <Card>
            <CardHeader><CardTitle>Test Your Chatbot</CardTitle></CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 h-80 overflow-y-auto mb-4 space-y-3">
                {testMessages.length === 0 ? (
                  <p className="text-center text-gray-400 pt-20">Send a message to test your chatbot</p>
                ) : testMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${msg.role === 'user' ? 'bg-blue-600 text-white' : 'bg-white border text-gray-900'}`}>
                      {msg.content}
                    </div>
                  </div>
                ))}
                {testLoading && (
                  <div className="flex justify-start">
                    <div className="bg-white border rounded-lg px-3 py-2 text-sm text-gray-400">Thinking...</div>
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                <Input value={testInput} onChange={(e) => setTestInput(e.target.value)} placeholder="Type a test message..." onKeyDown={(e) => { if (e.key === 'Enter') sendTestMessage() }} />
                <Button onClick={sendTestMessage} disabled={testLoading}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
