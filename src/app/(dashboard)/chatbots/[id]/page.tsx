'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Code, Paintbrush, Database, MessageSquare, Settings, Rocket,
  Copy, Check, Loader2, Trash2, RefreshCw, Send, Globe, Shield,
  ExternalLink, Eye,
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
  header_title: string | null
  header_subtitle: string | null
  theme: string
  show_branding: boolean
}

interface KnowledgeSource {
  id: string
  type: string
  name: string
  status: string
  chunk_count: number
  source_url: string | null
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
  const [websiteUrl, setWebsiteUrl] = useState('')
  const [crawling, setCrawling] = useState(false)
  const [testInput, setTestInput] = useState('')
  const [testMessages, setTestMessages] = useState<{ role: string; content: string }[]>([])
  const [testLoading, setTestLoading] = useState(false)
  const [testConvId, setTestConvId] = useState<string | null>(null)

  // Widget config form
  const [widgetForm, setWidgetForm] = useState({
    accent_color: '#4493f2',
    position: 'bottom-right',
    logo_url: '',
    header_title: '',
    header_subtitle: 'Online -- We reply instantly',
  })
  const [savingWidget, setSavingWidget] = useState(false)

  useEffect(() => {
    if (chatbot) {
      setForm({
        name: chatbot.name,
        system_prompt: chatbot.system_prompt,
        greeting_message: chatbot.greeting_message,
        fallback_message: chatbot.fallback_message ?? '',
        temperature: chatbot.temperature,
      })
      const wc = Array.isArray(chatbot.widget_configs) ? chatbot.widget_configs[0] : chatbot.widget_configs
      if (wc) {
        setWidgetForm({
          accent_color: wc.accent_color || '#4493f2',
          position: wc.position || 'bottom-right',
          logo_url: wc.logo_url || '',
          header_title: wc.header_title || '',
          header_subtitle: wc.header_subtitle || 'Online -- We reply instantly',
        })
      }
    }
  }, [chatbot])

  const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://smbchat.alwaysencrypted.com'

  const embedCode = `<script
  src="${appUrl}/widget/smb-chat.min.js"
  data-webhook="${appUrl}/api/widget/chat"
  data-accent="${widgetForm.accent_color}"
  data-position="${widgetForm.position}"
  data-greeting="${chatbot?.greeting_message || 'Hi! How can I help you today?'}"${widgetForm.logo_url ? `\n  data-logo="${widgetForm.logo_url}"` : ''}
  data-bot-id="${id}"
  data-auto-open="off"
  defer
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

  const saveWidget = async () => {
    setSavingWidget(true)
    await fetch(`/api/chatbots/${id}/widget-config`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(widgetForm),
    })
    setSavingWidget(false)
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

  const crawlWebsite = async () => {
    if (!websiteUrl.trim()) return
    setCrawling(true)
    await fetch(`/api/chatbots/${id}/sources/crawl`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: websiteUrl }),
    })
    setWebsiteUrl('')
    setCrawling(false)
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
          <p className="text-gray-500 text-sm mt-1">Configure your chatbot behavior, knowledge, and deployment</p>
        </div>
        <Badge variant={chatbot.status === 'active' ? 'default' : 'secondary'}>{chatbot.status}</Badge>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="flex-wrap">
          <TabsTrigger value="general"><Settings className="h-4 w-4 mr-2" />General</TabsTrigger>
          <TabsTrigger value="knowledge"><Database className="h-4 w-4 mr-2" />Knowledge</TabsTrigger>
          <TabsTrigger value="widget"><Paintbrush className="h-4 w-4 mr-2" />Widget</TabsTrigger>
          <TabsTrigger value="deploy"><Rocket className="h-4 w-4 mr-2" />Deploy</TabsTrigger>
          <TabsTrigger value="test"><MessageSquare className="h-4 w-4 mr-2" />Test</TabsTrigger>
        </TabsList>

        {/* GENERAL TAB */}
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

        {/* KNOWLEDGE TAB */}
        <TabsContent value="knowledge">
          <div className="space-y-6">
            {/* Crawl entire website */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="h-5 w-5 text-violet-600" />
                  Scan Entire Website
                </CardTitle>
                <CardDescription>
                  Enter your website URL and we will automatically scan up to 50 pages and train your chatbot on the content.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    placeholder="https://yourbusiness.com"
                    className="flex-1"
                  />
                  <Button onClick={crawlWebsite} disabled={crawling || !websiteUrl.trim()}>
                    {crawling ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Globe className="h-4 w-4 mr-2" />}
                    {crawling ? 'Scanning...' : 'Scan Website'}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Add individual URLs */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Knowledge Sources ({sources.length})</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2 mb-6">
                  <Input value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="https://example.com/specific-page" className="flex-1" />
                  <Button onClick={addUrl} disabled={addingUrl}>
                    {addingUrl ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Add Page
                  </Button>
                </div>

                {sources.length === 0 ? (
                  <div className="flex items-center justify-center py-12 text-gray-400">
                    <div className="text-center">
                      <Database className="h-10 w-10 mx-auto mb-3 text-gray-300" />
                      <p>No knowledge sources added yet</p>
                      <p className="text-xs mt-1">Scan your website or add individual pages above</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sources.map((src) => (
                      <div key={src.id} className="flex items-center justify-between rounded-lg border p-3">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{src.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs text-gray-500">{src.type}</span>
                            <span className="text-xs text-gray-400">-</span>
                            <span className="text-xs text-gray-500">{src.chunk_count} chunks</span>
                            <Badge variant={src.status === 'ready' ? 'secondary' : src.status === 'failed' ? 'destructive' : 'outline'} className="text-[10px]">
                              {src.status}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <Button size="sm" variant="ghost"><RefreshCw className="h-3 w-3" /></Button>
                          <Button size="sm" variant="ghost" onClick={() => deleteSource(src.id)}><Trash2 className="h-3 w-3 text-red-500" /></Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* WIDGET TAB */}
        <TabsContent value="widget">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Widget Appearance</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Accent Color</Label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={widgetForm.accent_color}
                      onChange={(e) => setWidgetForm({ ...widgetForm, accent_color: e.target.value })}
                      className="h-9 w-14 rounded border cursor-pointer"
                    />
                    <Input
                      value={widgetForm.accent_color}
                      onChange={(e) => setWidgetForm({ ...widgetForm, accent_color: e.target.value })}
                      className="flex-1 font-mono text-sm"
                    />
                  </div>
                </div>
                <div>
                  <Label>Position</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant={widgetForm.position === 'bottom-right' ? 'default' : 'outline'}
                      onClick={() => setWidgetForm({ ...widgetForm, position: 'bottom-right' })}
                    >
                      Bottom Right
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant={widgetForm.position === 'bottom-left' ? 'default' : 'outline'}
                      onClick={() => setWidgetForm({ ...widgetForm, position: 'bottom-left' })}
                    >
                      Bottom Left
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Logo URL</Label>
                  <Input
                    value={widgetForm.logo_url}
                    onChange={(e) => setWidgetForm({ ...widgetForm, logo_url: e.target.value })}
                    placeholder="https://yourbusiness.com/logo.png"
                  />
                </div>
                <div>
                  <Label>Header Title</Label>
                  <Input
                    value={widgetForm.header_title}
                    onChange={(e) => setWidgetForm({ ...widgetForm, header_title: e.target.value })}
                    placeholder={chatbot.name}
                  />
                </div>
                <div>
                  <Label>Header Subtitle</Label>
                  <Input
                    value={widgetForm.header_subtitle}
                    onChange={(e) => setWidgetForm({ ...widgetForm, header_subtitle: e.target.value })}
                  />
                </div>
                <Button onClick={saveWidget} disabled={savingWidget}>
                  {savingWidget ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                  Save Widget Settings
                </Button>
              </CardContent>
            </Card>

            {/* Live Preview */}
            <Card>
              <CardHeader><CardTitle className="flex items-center gap-2"><Eye className="h-4 w-4" />Preview</CardTitle></CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-lg p-4 h-96 flex items-end justify-end relative">
                  <div className="w-80 bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="p-4 text-white" style={{ backgroundColor: widgetForm.accent_color }}>
                      <div className="flex items-center gap-3">
                        {widgetForm.logo_url && (
                          <img src={widgetForm.logo_url} alt="" className="h-8 w-8 rounded-full bg-white/20 object-cover" />
                        )}
                        <div>
                          <p className="font-semibold text-sm">{widgetForm.header_title || chatbot.name}</p>
                          <p className="text-xs opacity-80">{widgetForm.header_subtitle}</p>
                        </div>
                      </div>
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
          </div>
        </TabsContent>

        {/* DEPLOY TAB */}
        <TabsContent value="deploy">
          <div className="space-y-6">
            {/* Embed Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5 text-violet-600" />
                  Embed Code
                </CardTitle>
                <CardDescription>
                  Copy this code and paste it before the closing &lt;/body&gt; tag on your website. The chatbot will appear as a floating widget.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-sm overflow-x-auto whitespace-pre-wrap">{embedCode}</pre>
                  <Button size="sm" variant="secondary" className="absolute top-2 right-2" onClick={copyCode}>
                    {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    {copied ? 'Copied!' : 'Copy'}
                  </Button>
                </div>

                <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 p-4">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">How to install</h4>
                  <ol className="text-sm text-blue-800 space-y-1.5 list-decimal list-inside">
                    <li>Copy the embed code above</li>
                    <li>Open your website's HTML editor or CMS</li>
                    <li>Paste the code just before the closing <code className="bg-blue-100 px-1 rounded">&lt;/body&gt;</code> tag</li>
                    <li>Save and publish your changes</li>
                    <li>The chat widget will appear on your website</li>
                  </ol>
                </div>
              </CardContent>
            </Card>

            {/* Managed Installation */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Rocket className="h-5 w-5 text-violet-600" />
                  Managed Installation
                </CardTitle>
                <CardDescription>
                  Want us to install the chatbot for you? Provide your website access details and our team will handle everything.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-w-lg">
                  <div>
                    <Label>Website Platform</Label>
                    <Input placeholder="e.g. WordPress, Shopify, Wix, Squarespace, custom..." />
                  </div>
                  <div>
                    <Label>Admin Login URL</Label>
                    <Input type="url" placeholder="https://yourbusiness.com/wp-admin" />
                  </div>
                  <div>
                    <Label>Username / Email</Label>
                    <Input placeholder="Your website admin username" />
                  </div>
                  <div>
                    <Label>Password</Label>
                    <Input type="password" placeholder="Your website admin password" />
                  </div>

                  <div className="flex items-start gap-3 rounded-lg bg-green-50 border border-green-200 p-3">
                    <Shield className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-green-900">Your credentials are encrypted and secure</p>
                      <p className="text-xs text-green-700 mt-1">
                        All login information is encrypted with AES-256 at rest and in transit. We use your credentials solely to install the chatbot widget on your website. We never store, share, or disclose your login information to any third parties. You can revoke access at any time. See our <a href="/legal/privacy" className="underline">Privacy Policy</a> and <a href="/legal/terms" className="underline">Terms of Service</a>.
                      </p>
                    </div>
                  </div>

                  <Button>
                    <Rocket className="h-4 w-4 mr-2" />
                    Request Installation
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* API Key */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-violet-600" />
                  API Access
                </CardTitle>
                <CardDescription>
                  Use our REST API to integrate the chatbot into any application or custom setup.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg bg-gray-50 border p-4">
                  <p className="text-sm text-gray-600 mb-3">Your chatbot API endpoint:</p>
                  <code className="block bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
                    POST {appUrl}/api/widget/chat
                  </code>
                  <p className="text-xs text-gray-500 mt-3">
                    Bot ID: <code className="bg-gray-200 px-1 rounded">{id}</code>
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Manage API keys from <a href="/settings" className="text-violet-600 hover:underline">Settings</a>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TEST TAB */}
        <TabsContent value="test">
          <Card>
            <CardHeader><CardTitle>Test Your Chatbot</CardTitle></CardHeader>
            <CardContent>
              <div className="bg-gray-50 rounded-lg p-4 h-80 overflow-y-auto mb-4 space-y-3">
                {testMessages.length === 0 ? (
                  <p className="text-center text-gray-400 pt-20">Send a message to test your chatbot</p>
                ) : testMessages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] rounded-lg px-3 py-2 text-sm ${msg.role === 'user' ? 'bg-violet-600 text-white' : 'bg-white border text-gray-900'}`}>
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
                <Input
                  value={testInput}
                  onChange={(e) => setTestInput(e.target.value)}
                  placeholder="Type a test message..."
                  onKeyDown={(e) => { if (e.key === 'Enter') sendTestMessage() }}
                />
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
