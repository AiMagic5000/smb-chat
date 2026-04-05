'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MODELS } from '@/lib/constants'
import { Globe, Bot, Loader2, Shield, Sparkles } from 'lucide-react'

export default function NewChatbotPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [crawling, setCrawling] = useState(false)
  const [crawlStatus, setCrawlStatus] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: '',
    website_url: '',
    model: 'gpt-4o',
    system_prompt: 'You are a helpful assistant for our business. Answer questions about our products and services accurately and professionally.',
    greeting_message: 'Hi! How can I help you today?',
    temperature: 0.7,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch('/api/chatbots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          model: form.model,
          system_prompt: form.system_prompt,
          greeting_message: form.greeting_message,
          temperature: form.temperature,
          slug: form.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
        }),
      })

      if (res.ok) {
        const { data } = await res.json()

        // If website URL provided, start crawling in the background
        if (form.website_url.trim()) {
          setCrawling(true)
          setCrawlStatus('Scanning your website...')

          fetch(`/api/chatbots/${data.id}/sources/crawl`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: form.website_url.trim() }),
          }).then(async (crawlRes) => {
            if (crawlRes.ok) {
              setCrawlStatus('Website scan started! Your chatbot will be trained automatically.')
            } else {
              setCrawlStatus('Website scan queued. You can add more sources from the chatbot settings.')
            }
          }).catch(() => {
            setCrawlStatus('Website scan queued. You can add more sources from the chatbot settings.')
          }).finally(() => {
            setTimeout(() => router.push(`/chatbots/${data.id}`), 1500)
          })
        } else {
          router.push(`/chatbots/${data.id}`)
        }
      }
    } finally {
      if (!crawling) setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Create Chatbot</h1>
        <p className="text-gray-500 mt-1">Set up an AI chatbot trained on your website content</p>
      </div>

      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5 text-violet-600" />
              Basic Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Chatbot Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Customer Support Bot"
                required
              />
            </div>

            <div>
              <Label htmlFor="model">AI Model</Label>
              <Select value={form.model} onValueChange={(v: string | null) => { if (v) setForm({ ...form, model: v }) }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MODELS.map((m) => (
                    <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="greeting">Greeting Message</Label>
              <Input
                id="greeting"
                value={form.greeting_message}
                onChange={(e) => setForm({ ...form, greeting_message: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-violet-600" />
              Train on Your Website
            </CardTitle>
            <CardDescription>
              Enter your website URL and we will automatically scan and index your content so the chatbot can answer questions about your business.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="website_url">Website URL</Label>
              <Input
                id="website_url"
                type="url"
                value={form.website_url}
                onChange={(e) => setForm({ ...form, website_url: e.target.value })}
                placeholder="https://yourbusiness.com"
              />
              <p className="text-xs text-gray-500 mt-1.5">
                We will scan up to 50 pages from your website. You can add more sources later.
              </p>
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-violet-50 p-3">
              <Shield className="h-4 w-4 text-violet-600 mt-0.5 shrink-0" />
              <p className="text-xs text-violet-700">
                Your website content is processed securely and used only to train your chatbot. We never share your data with third parties.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-violet-600" />
              AI Configuration
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="prompt">System Prompt</Label>
              <Textarea
                id="prompt"
                value={form.system_prompt}
                onChange={(e) => setForm({ ...form, system_prompt: e.target.value })}
                rows={6}
                className="font-mono text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Instructions that define your chatbot's personality and knowledge scope.
              </p>
            </div>

            <div>
              <Label htmlFor="temp">Temperature ({form.temperature})</Label>
              <input
                id="temp"
                type="range"
                min="0"
                max="2"
                step="0.1"
                value={form.temperature}
                onChange={(e) => setForm({ ...form, temperature: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Precise</span>
                <span>Creative</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {crawlStatus && (
          <div className="mb-6 rounded-lg border border-violet-200 bg-violet-50 p-4 flex items-center gap-3">
            <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
            <p className="text-sm text-violet-700">{crawlStatus}</p>
          </div>
        )}

        <div className="flex gap-3">
          <Button type="submit" disabled={loading || crawling || !form.name}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            {loading ? 'Creating...' : 'Create Chatbot'}
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
}
