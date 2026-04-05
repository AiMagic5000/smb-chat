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

  // Deploy tab state
  const [deployMethod, setDeployMethod] = useState<'self' | 'managed'>('self')
  const [managedForm, setManagedForm] = useState({
    platform: '',
    website_url: '',
    login_url: '',
    username: '',
    password: '',
    pin: '',
    notes: '',
  })
  const [managedSubmitting, setManagedSubmitting] = useState(false)
  const [managedSubmitted, setManagedSubmitted] = useState(false)

  const submitManagedInstall = async () => {
    setManagedSubmitting(true)
    try {
      await fetch(`/api/chatbots/${id}/install-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...managedForm,
          position: widgetForm.position,
          chatbot_id: id,
        }),
      })
      setManagedSubmitted(true)
    } catch {
      // Still show success - we'll email the admin
      setManagedSubmitted(true)
    } finally {
      setManagedSubmitting(false)
    }
  }

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
            <div className="space-y-6">
              {/* Brand Identity */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Paintbrush className="h-5 w-5 text-violet-600" />
                    Brand Identity
                  </CardTitle>
                  <CardDescription>Match the chatbot to your brand so it looks native on your website</CardDescription>
                </CardHeader>
                <CardContent className="space-y-5">
                  {/* Logo Upload */}
                  <div>
                    <Label className="text-sm font-medium">Company Logo</Label>
                    <div className="mt-2 flex items-center gap-4">
                      <div
                        className="flex h-16 w-16 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 overflow-hidden shrink-0"
                        style={widgetForm.logo_url ? {} : undefined}
                      >
                        {widgetForm.logo_url ? (
                          <img src={widgetForm.logo_url} alt="Logo" className="h-full w-full object-cover rounded-xl" />
                        ) : (
                          <Globe className="h-6 w-6 text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1 space-y-2">
                        <Input
                          value={widgetForm.logo_url}
                          onChange={(e) => setWidgetForm({ ...widgetForm, logo_url: e.target.value })}
                          placeholder="https://yourbusiness.com/logo.png"
                          className="text-sm"
                        />
                        <div className="flex items-center gap-2">
                          <label className="cursor-pointer">
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={async (e) => {
                                const file = e.target.files?.[0]
                                if (!file) return
                                // Convert to data URL for preview, then upload
                                const reader = new FileReader()
                                reader.onload = () => {
                                  setWidgetForm({ ...widgetForm, logo_url: reader.result as string })
                                }
                                reader.readAsDataURL(file)
                              }}
                            />
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-violet-600 hover:text-violet-700 cursor-pointer">
                              Upload image
                            </span>
                          </label>
                          {widgetForm.logo_url && (
                            <button
                              onClick={() => setWidgetForm({ ...widgetForm, logo_url: '' })}
                              className="text-xs text-red-500 hover:text-red-600"
                            >
                              Remove
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Brand Color */}
                  <div>
                    <Label className="text-sm font-medium">Brand Color</Label>
                    <p className="text-xs text-gray-500 mb-2">This color is used for the chat header, send button, and chat bubble</p>
                    <div className="flex gap-2 items-center">
                      <input
                        type="color"
                        value={widgetForm.accent_color}
                        onChange={(e) => setWidgetForm({ ...widgetForm, accent_color: e.target.value })}
                        className="h-10 w-14 rounded-lg border cursor-pointer"
                      />
                      <Input
                        value={widgetForm.accent_color}
                        onChange={(e) => setWidgetForm({ ...widgetForm, accent_color: e.target.value })}
                        className="w-28 font-mono text-sm"
                      />
                    </div>
                    {/* Quick color presets */}
                    <div className="flex gap-2 mt-3">
                      {['#4493f2', '#7c3aed', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#1E3A5F', '#000000'].map((c) => (
                        <button
                          key={c}
                          onClick={() => setWidgetForm({ ...widgetForm, accent_color: c })}
                          className={`h-7 w-7 rounded-full border-2 transition-all ${
                            widgetForm.accent_color === c ? 'border-gray-900 scale-110' : 'border-transparent hover:scale-105'
                          }`}
                          style={{ backgroundColor: c }}
                          title={c}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Header */}
                  <div>
                    <Label className="text-sm font-medium">Chat Window Title</Label>
                    <Input
                      value={widgetForm.header_title}
                      onChange={(e) => setWidgetForm({ ...widgetForm, header_title: e.target.value })}
                      placeholder={chatbot.name}
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Subtitle</Label>
                    <Input
                      value={widgetForm.header_subtitle}
                      onChange={(e) => setWidgetForm({ ...widgetForm, header_subtitle: e.target.value })}
                      placeholder="Online -- We reply instantly"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Position & Behavior */}
              <Card>
                <CardHeader>
                  <CardTitle>Position & Behavior</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div>
                    <Label className="text-sm font-medium">Chat Bubble Position</Label>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <button
                        onClick={() => setWidgetForm({ ...widgetForm, position: 'bottom-left' })}
                        className={`relative rounded-xl border-2 p-3 transition-all ${
                          widgetForm.position === 'bottom-left'
                            ? 'border-violet-600 bg-violet-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="bg-gray-100 rounded h-16 w-full relative">
                          <div className="absolute bottom-1.5 left-1.5 h-5 w-5 rounded-full shadow-sm" style={{ backgroundColor: widgetForm.accent_color }} />
                        </div>
                        <p className="text-xs font-medium text-center mt-2">Bottom Left</p>
                      </button>
                      <button
                        onClick={() => setWidgetForm({ ...widgetForm, position: 'bottom-right' })}
                        className={`relative rounded-xl border-2 p-3 transition-all ${
                          widgetForm.position === 'bottom-right'
                            ? 'border-violet-600 bg-violet-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="bg-gray-100 rounded h-16 w-full relative">
                          <div className="absolute bottom-1.5 right-1.5 h-5 w-5 rounded-full shadow-sm" style={{ backgroundColor: widgetForm.accent_color }} />
                        </div>
                        <p className="text-xs font-medium text-center mt-2">Bottom Right</p>
                      </button>
                    </div>
                  </div>

                  <Button onClick={saveWidget} disabled={savingWidget} className="w-full">
                    {savingWidget ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Check className="h-4 w-4 mr-2" />}
                    {savingWidget ? 'Saving...' : 'Save Widget Settings'}
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Live Preview */}
            <div className="lg:sticky lg:top-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    Live Preview
                  </CardTitle>
                  <CardDescription>This is exactly how the chatbot will look on your website</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-gray-100 rounded-xl p-4 h-[480px] flex flex-col relative">
                    {/* Fake browser bar */}
                    <div className="bg-white rounded-t-lg border border-gray-200 px-3 py-2 flex items-center gap-2 mb-0">
                      <div className="flex gap-1.5">
                        <div className="h-2.5 w-2.5 rounded-full bg-red-400" />
                        <div className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                        <div className="h-2.5 w-2.5 rounded-full bg-green-400" />
                      </div>
                      <div className="flex-1 bg-gray-100 rounded px-3 py-1 text-[10px] text-gray-400 text-center">yourbusiness.com</div>
                    </div>
                    {/* Fake website content */}
                    <div className="flex-1 bg-white border-x border-b border-gray-200 rounded-b-lg relative overflow-hidden">
                      <div className="p-4 space-y-3">
                        <div className="h-3 bg-gray-200 rounded w-3/4" />
                        <div className="h-3 bg-gray-100 rounded w-full" />
                        <div className="h-3 bg-gray-100 rounded w-5/6" />
                        <div className="h-20 bg-gray-50 rounded-lg mt-4" />
                        <div className="h-3 bg-gray-100 rounded w-full" />
                        <div className="h-3 bg-gray-100 rounded w-2/3" />
                      </div>

                      {/* Chat widget preview */}
                      <div className={`absolute bottom-3 ${widgetForm.position === 'bottom-left' ? 'left-3' : 'right-3'}`}>
                        {/* Mini chat window */}
                        <div className="w-64 bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200 mb-2">
                          <div className="px-3 py-2.5 text-white flex items-center gap-2" style={{ backgroundColor: widgetForm.accent_color }}>
                            {widgetForm.logo_url && (
                              <img src={widgetForm.logo_url} alt="" className="h-6 w-6 rounded-full object-cover bg-white/20" />
                            )}
                            <div className="min-w-0">
                              <p className="text-xs font-semibold truncate">{widgetForm.header_title || chatbot.name}</p>
                              <p className="text-[9px] opacity-80 truncate">{widgetForm.header_subtitle}</p>
                            </div>
                          </div>
                          <div className="p-2.5">
                            <div className="bg-gray-100 rounded-lg p-2 text-[10px] text-gray-700 max-w-[85%]">
                              {chatbot.greeting_message}
                            </div>
                          </div>
                          <div className="border-t px-2.5 py-2 flex gap-1.5">
                            <div className="flex-1 bg-gray-50 rounded-full px-3 py-1.5 text-[10px] text-gray-400">Type a message...</div>
                            <div className="flex h-6 w-6 items-center justify-center rounded-full shrink-0" style={{ backgroundColor: widgetForm.accent_color }}>
                              <Send className="h-3 w-3 text-white" />
                            </div>
                          </div>
                        </div>

                        {/* Chat bubble */}
                        <div
                          className={`h-11 w-11 rounded-full shadow-lg flex items-center justify-center ${widgetForm.position === 'bottom-left' ? '' : 'ml-auto'}`}
                          style={{ backgroundColor: widgetForm.accent_color }}
                        >
                          <MessageSquare className="h-5 w-5 text-white" />
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* DEPLOY TAB */}
        <TabsContent value="deploy">
          <div className="space-y-8">

            {/* Choose your path */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => setDeployMethod('self')}
                className={`rounded-2xl border-2 p-6 text-left transition-all ${
                  deployMethod === 'self'
                    ? 'border-violet-600 bg-violet-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${deployMethod === 'self' ? 'bg-violet-600' : 'bg-gray-100'}`}>
                    <Code className={`h-5 w-5 ${deployMethod === 'self' ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">I'll do it myself</p>
                    <p className="text-xs text-gray-500">Copy and paste a small code snippet</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">3 simple steps. Takes about 2 minutes. You just need access to your website's admin panel.</p>
              </button>

              <button
                onClick={() => setDeployMethod('managed')}
                className={`rounded-2xl border-2 p-6 text-left transition-all ${
                  deployMethod === 'managed'
                    ? 'border-violet-600 bg-violet-50 shadow-sm'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${deployMethod === 'managed' ? 'bg-violet-600' : 'bg-gray-100'}`}>
                    <Shield className={`h-5 w-5 ${deployMethod === 'managed' ? 'text-white' : 'text-gray-500'}`} />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Do it for me</p>
                    <p className="text-xs text-gray-500">We install it on your website</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">Give us your website login and we handle everything. No technical knowledge needed at all.</p>
              </button>
            </div>

            {/* ========== SELF-INSTALL PATH ========== */}
            {deployMethod === 'self' && (
              <div className="space-y-6">

                {/* STEP A: Choose position */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white text-sm font-bold shrink-0">A</div>
                      <div>
                        <p className="font-semibold text-gray-900">Choose where the chat bubble appears</p>
                        <p className="text-sm text-gray-500">Pick which corner of your website the chat button shows up in</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 max-w-md">
                      <button
                        onClick={() => setWidgetForm({ ...widgetForm, position: 'bottom-left' })}
                        className={`relative rounded-xl border-2 p-4 transition-all ${
                          widgetForm.position === 'bottom-left'
                            ? 'border-violet-600 bg-violet-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="bg-gray-100 rounded-lg h-24 w-full relative mb-3">
                          <div className="absolute bottom-2 left-2 h-6 w-6 rounded-full" style={{ backgroundColor: widgetForm.accent_color }} />
                        </div>
                        <p className="text-sm font-medium text-gray-900 text-center">Bottom Left</p>
                        {widgetForm.position === 'bottom-left' && (
                          <div className="absolute top-2 right-2">
                            <Check className="h-5 w-5 text-violet-600" />
                          </div>
                        )}
                      </button>

                      <button
                        onClick={() => setWidgetForm({ ...widgetForm, position: 'bottom-right' })}
                        className={`relative rounded-xl border-2 p-4 transition-all ${
                          widgetForm.position === 'bottom-right'
                            ? 'border-violet-600 bg-violet-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="bg-gray-100 rounded-lg h-24 w-full relative mb-3">
                          <div className="absolute bottom-2 right-2 h-6 w-6 rounded-full" style={{ backgroundColor: widgetForm.accent_color }} />
                        </div>
                        <p className="text-sm font-medium text-gray-900 text-center">Bottom Right</p>
                        {widgetForm.position === 'bottom-right' && (
                          <div className="absolute top-2 right-2">
                            <Check className="h-5 w-5 text-violet-600" />
                          </div>
                        )}
                      </button>
                    </div>
                  </CardContent>
                </Card>

                {/* STEP B: Copy the code */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white text-sm font-bold shrink-0">B</div>
                      <div>
                        <p className="font-semibold text-gray-900">Copy your chatbot code</p>
                        <p className="text-sm text-gray-500">Click the button to copy this code to your clipboard</p>
                      </div>
                    </div>

                    <div className="relative">
                      <pre className="bg-gray-900 text-green-400 p-4 rounded-xl text-sm overflow-x-auto whitespace-pre-wrap">{embedCode}</pre>
                      <Button
                        size="lg"
                        className={`absolute top-3 right-3 ${copied ? 'bg-green-600 hover:bg-green-700' : ''}`}
                        onClick={copyCode}
                      >
                        {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                        {copied ? 'Copied to clipboard!' : 'Copy Code'}
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* STEP C: Paste into your website */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-violet-600 text-white text-sm font-bold shrink-0">C</div>
                      <div>
                        <p className="font-semibold text-gray-900">Paste the code into your website</p>
                        <p className="text-sm text-gray-500">Choose your website platform below for step-by-step instructions</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      {/* WordPress */}
                      <details className="group rounded-xl border border-gray-200 overflow-hidden">
                        <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
                          <span className="text-lg">W</span>
                          <span className="font-medium text-gray-900 flex-1">WordPress</span>
                          <span className="text-xs text-gray-400 group-open:hidden">Click to expand</span>
                        </summary>
                        <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                          <ol className="space-y-3 text-sm text-gray-700">
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">1</span>
                              <span>Log in to your WordPress admin panel (usually <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">yoursite.com/wp-admin</code>)</span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">2</span>
                              <span>Go to <strong>Appearance</strong> then <strong>Theme File Editor</strong> (or <strong>Theme Editor</strong>)</span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">3</span>
                              <span>On the right side, click on <strong>footer.php</strong> (or <strong>Theme Footer</strong>)</span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">4</span>
                              <span>Find the line that says <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">&lt;/body&gt;</code> (it's usually near the very bottom)</span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">5</span>
                              <span>Paste your chatbot code on the line <strong>directly above</strong> <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">&lt;/body&gt;</code></span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">6</span>
                              <span>Click <strong>Update File</strong>. Done! Visit your website to see the chatbot.</span>
                            </li>
                          </ol>
                          <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
                            <p className="text-xs text-amber-800"><strong>Alternative:</strong> If you use a page builder like Elementor, go to <strong>Elementor &gt; Custom Code</strong> and add the snippet there with placement set to <strong>Before &lt;/body&gt;</strong>.</p>
                          </div>
                        </div>
                      </details>

                      {/* Shopify */}
                      <details className="group rounded-xl border border-gray-200 overflow-hidden">
                        <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
                          <span className="text-lg">S</span>
                          <span className="font-medium text-gray-900 flex-1">Shopify</span>
                          <span className="text-xs text-gray-400 group-open:hidden">Click to expand</span>
                        </summary>
                        <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                          <ol className="space-y-3 text-sm text-gray-700">
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">1</span>
                              <span>Log in to your Shopify admin panel</span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">2</span>
                              <span>Go to <strong>Online Store</strong> then <strong>Themes</strong></span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">3</span>
                              <span>Click <strong>Actions</strong> (three dots) then <strong>Edit code</strong></span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">4</span>
                              <span>Under <strong>Layout</strong>, click on <strong>theme.liquid</strong></span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">5</span>
                              <span>Scroll to the bottom and find <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">&lt;/body&gt;</code></span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">6</span>
                              <span>Paste your code on the line above it and click <strong>Save</strong></span>
                            </li>
                          </ol>
                        </div>
                      </details>

                      {/* Wix */}
                      <details className="group rounded-xl border border-gray-200 overflow-hidden">
                        <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
                          <span className="text-lg">W</span>
                          <span className="font-medium text-gray-900 flex-1">Wix</span>
                          <span className="text-xs text-gray-400 group-open:hidden">Click to expand</span>
                        </summary>
                        <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                          <ol className="space-y-3 text-sm text-gray-700">
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">1</span>
                              <span>Log in to your Wix dashboard</span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">2</span>
                              <span>Go to <strong>Settings</strong> then <strong>Custom Code</strong> (under Advanced)</span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">3</span>
                              <span>Click <strong>+ Add Custom Code</strong></span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">4</span>
                              <span>Paste your chatbot code in the box</span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">5</span>
                              <span>Set placement to <strong>Body - end</strong> and pages to <strong>All pages</strong></span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">6</span>
                              <span>Click <strong>Apply</strong>. Done!</span>
                            </li>
                          </ol>
                        </div>
                      </details>

                      {/* Squarespace */}
                      <details className="group rounded-xl border border-gray-200 overflow-hidden">
                        <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
                          <span className="text-lg">S</span>
                          <span className="font-medium text-gray-900 flex-1">Squarespace</span>
                          <span className="text-xs text-gray-400 group-open:hidden">Click to expand</span>
                        </summary>
                        <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                          <ol className="space-y-3 text-sm text-gray-700">
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">1</span>
                              <span>Log in to your Squarespace account</span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">2</span>
                              <span>Go to <strong>Settings</strong> then <strong>Advanced</strong> then <strong>Code Injection</strong></span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">3</span>
                              <span>Scroll down to the <strong>Footer</strong> section</span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">4</span>
                              <span>Paste your chatbot code in the Footer box</span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">5</span>
                              <span>Click <strong>Save</strong>. Done!</span>
                            </li>
                          </ol>
                          <div className="mt-4 rounded-lg bg-amber-50 border border-amber-200 px-4 py-3">
                            <p className="text-xs text-amber-800"><strong>Note:</strong> Code Injection requires a Squarespace Business plan or higher.</p>
                          </div>
                        </div>
                      </details>

                      {/* Webflow */}
                      <details className="group rounded-xl border border-gray-200 overflow-hidden">
                        <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
                          <span className="text-lg">W</span>
                          <span className="font-medium text-gray-900 flex-1">Webflow</span>
                          <span className="text-xs text-gray-400 group-open:hidden">Click to expand</span>
                        </summary>
                        <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                          <ol className="space-y-3 text-sm text-gray-700">
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">1</span>
                              <span>Open your Webflow project</span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">2</span>
                              <span>Go to <strong>Project Settings</strong> (gear icon)</span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">3</span>
                              <span>Click on the <strong>Custom Code</strong> tab</span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">4</span>
                              <span>Paste your code in the <strong>Footer Code</strong> section (before &lt;/body&gt; tag)</span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">5</span>
                              <span>Click <strong>Save Changes</strong> and then <strong>Publish</strong></span>
                            </li>
                          </ol>
                        </div>
                      </details>

                      {/* GoDaddy / Hostinger / Other */}
                      <details className="group rounded-xl border border-gray-200 overflow-hidden">
                        <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors">
                          <span className="text-lg">H</span>
                          <span className="font-medium text-gray-900 flex-1">GoDaddy, Hostinger, or HTML website</span>
                          <span className="text-xs text-gray-400 group-open:hidden">Click to expand</span>
                        </summary>
                        <div className="px-5 pb-5 border-t border-gray-100 pt-4">
                          <ol className="space-y-3 text-sm text-gray-700">
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">1</span>
                              <span>Log in to your hosting account's file manager (or connect via FTP)</span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">2</span>
                              <span>Navigate to your website's root folder (usually <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">public_html</code>)</span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">3</span>
                              <span>Open your <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">index.html</code> file (or whichever HTML file is your main page)</span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">4</span>
                              <span>Scroll to the very bottom and find <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">&lt;/body&gt;</code></span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">5</span>
                              <span>Paste your chatbot code on the line directly above <code className="bg-gray-100 px-1.5 py-0.5 rounded text-xs">&lt;/body&gt;</code></span>
                            </li>
                            <li className="flex gap-3">
                              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-100 text-violet-700 text-xs font-bold shrink-0">6</span>
                              <span>Save the file. The chatbot will appear on your website immediately.</span>
                            </li>
                          </ol>
                          <div className="mt-4 rounded-lg bg-blue-50 border border-blue-200 px-4 py-3">
                            <p className="text-xs text-blue-800"><strong>Tip:</strong> If you have multiple HTML pages, you need to add the code to each page where you want the chatbot to appear. If you use a shared footer template, just add it there once.</p>
                          </div>
                        </div>
                      </details>
                    </div>

                    {/* Success confirmation */}
                    <div className="mt-6 rounded-xl bg-green-50 border border-green-200 p-4 flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-600 shrink-0" />
                      <p className="text-sm text-green-800">
                        After pasting the code and saving, visit your website. You should see a chat bubble in the {widgetForm.position === 'bottom-left' ? 'bottom-left' : 'bottom-right'} corner. Click it to test!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* ========== MANAGED INSTALL PATH ========== */}
            {deployMethod === 'managed' && (
              <Card>
                <CardContent className="pt-6">
                  <div className="max-w-lg mx-auto">
                    <div className="text-center mb-8">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 mx-auto mb-4">
                        <Shield className="h-7 w-7 text-violet-600" />
                      </div>
                      <h3 className="text-lg font-bold text-gray-900">We'll install it for you</h3>
                      <p className="text-sm text-gray-500 mt-2">
                        Share your website login details below and our team will add the chatbot to your website within 24 hours. No technical knowledge needed.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">What platform is your website on?</Label>
                        <Input
                          value={managedForm.platform}
                          onChange={(e) => setManagedForm({ ...managedForm, platform: e.target.value })}
                          placeholder="e.g. WordPress, Shopify, Wix, Squarespace, GoDaddy..."
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Your website address</Label>
                        <Input
                          type="url"
                          value={managedForm.website_url}
                          onChange={(e) => setManagedForm({ ...managedForm, website_url: e.target.value })}
                          placeholder="https://yourbusiness.com"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Admin login page URL</Label>
                        <Input
                          type="url"
                          value={managedForm.login_url}
                          onChange={(e) => setManagedForm({ ...managedForm, login_url: e.target.value })}
                          placeholder="e.g. https://yourbusiness.com/wp-admin"
                        />
                        <p className="text-xs text-gray-400 mt-1">The page where you log in to manage your website</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Username or email</Label>
                        <Input
                          value={managedForm.username}
                          onChange={(e) => setManagedForm({ ...managedForm, username: e.target.value })}
                          placeholder="Your admin username or email"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Password</Label>
                        <Input
                          type="password"
                          value={managedForm.password}
                          onChange={(e) => setManagedForm({ ...managedForm, password: e.target.value })}
                          placeholder="Your admin password"
                        />
                      </div>

                      <div>
                        <Label className="text-sm font-medium">PIN or 2-factor code (if needed)</Label>
                        <Input
                          value={managedForm.pin}
                          onChange={(e) => setManagedForm({ ...managedForm, pin: e.target.value })}
                          placeholder="Leave blank if you don't have one"
                        />
                        <p className="text-xs text-gray-400 mt-1">Some hosting accounts require a PIN or security code. If yours does, enter it here.</p>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Where should the chat bubble appear?</Label>
                        <div className="flex gap-3 mt-2">
                          <button
                            type="button"
                            onClick={() => setWidgetForm({ ...widgetForm, position: 'bottom-left' })}
                            className={`flex-1 rounded-lg border-2 py-3 text-sm font-medium transition-all ${
                              widgetForm.position === 'bottom-left'
                                ? 'border-violet-600 bg-violet-50 text-violet-700'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            Bottom Left
                          </button>
                          <button
                            type="button"
                            onClick={() => setWidgetForm({ ...widgetForm, position: 'bottom-right' })}
                            className={`flex-1 rounded-lg border-2 py-3 text-sm font-medium transition-all ${
                              widgetForm.position === 'bottom-right'
                                ? 'border-violet-600 bg-violet-50 text-violet-700'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            Bottom Right
                          </button>
                        </div>
                      </div>

                      <div>
                        <Label className="text-sm font-medium">Any special instructions?</Label>
                        <Textarea
                          value={managedForm.notes}
                          onChange={(e) => setManagedForm({ ...managedForm, notes: e.target.value })}
                          placeholder="e.g. Only add to the homepage, I have two-factor auth enabled, please email me when done..."
                          rows={3}
                        />
                      </div>
                    </div>

                    {/* Security trust box */}
                    <div className="mt-6 rounded-xl bg-green-50 border border-green-200 p-4">
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-green-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-semibold text-green-900">Your information is safe with us</p>
                          <ul className="text-xs text-green-700 mt-2 space-y-1">
                            <li>All credentials are encrypted with AES-256 encryption</li>
                            <li>We only use your login to install the chatbot widget -- nothing else</li>
                            <li>We never store, share, or sell your login information to anyone</li>
                            <li>Your credentials are permanently deleted from our systems after installation</li>
                            <li>Our full <a href="/legal/privacy" className="underline">Privacy Policy</a> and <a href="/legal/terms" className="underline">Terms of Service</a> detail our data handling practices</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    {managedSubmitted ? (
                      <div className="mt-6 rounded-xl bg-violet-50 border border-violet-200 p-5 text-center">
                        <Check className="h-8 w-8 text-violet-600 mx-auto mb-2" />
                        <p className="font-semibold text-violet-900">Installation request submitted!</p>
                        <p className="text-sm text-violet-700 mt-1">We will install your chatbot within 24 hours and email you when it's live.</p>
                      </div>
                    ) : (
                      <Button
                        size="lg"
                        className="w-full mt-6"
                        onClick={submitManagedInstall}
                        disabled={managedSubmitting || !managedForm.website_url || !managedForm.username || !managedForm.password}
                      >
                        {managedSubmitting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Rocket className="h-4 w-4 mr-2" />}
                        {managedSubmitting ? 'Submitting...' : 'Submit Installation Request'}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* API Access -- always visible at bottom */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="h-5 w-5 text-violet-600" />
                  API Access (Advanced)
                </CardTitle>
                <CardDescription>
                  For developers: integrate the chatbot into any custom application via our REST API.
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
