'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { MODELS } from '@/lib/constants'
import { buttonVariants } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Bot,
  Globe,
  Palette,
  Code2,
  CheckCircle2,
  Copy,
  Check,
  Loader2,
  Shield,
  Wrench,
  Upload,
  Link as LinkIcon,
  MessageSquare,
  AlertCircle,
  Rocket,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types & constants
// ---------------------------------------------------------------------------

const COLOR_PRESETS = [
  { name: 'White', value: '#ffffff' },
  { name: 'Violet', value: '#7c3aed' },
  { name: 'Blue', value: '#2563eb' },
  { name: 'Green', value: '#059669' },
  { name: 'Red', value: '#dc2626' },
  { name: 'Orange', value: '#ea580c' },
  { name: 'Pink', value: '#db2777' },
  { name: 'Teal', value: '#0d9488' },
  { name: 'Gray', value: '#4b5563' },
]

const PLATFORMS = [
  'WordPress',
  'Shopify',
  'Wix',
  'Squarespace',
  'Webflow',
  'GoDaddy Website Builder',
  'Hostinger Website Builder',
  'Other',
]

const PLATFORM_INSTRUCTIONS: Record<string, string> = {
  WordPress: 'In your WordPress admin, go to Appearance > Theme Editor (or use a plugin like Insert Headers and Footers). Paste the code before the </body> tag.',
  Shopify: 'In your Shopify admin go to Online Store > Themes > Edit Code. Open theme.liquid and paste the code just before the closing </body> tag.',
  Wix: 'In your Wix editor go to Settings > Custom Code > Add Custom Code. Set it to load in the body and on all pages.',
  Squarespace: 'In your Squarespace dashboard go to Settings > Advanced > Code Injection. Paste the code into the Footer section.',
  Webflow: 'In your Webflow project go to Site Settings > Custom Code. Paste the code in the Footer Code section, then publish.',
  'GoDaddy Website Builder': 'In your GoDaddy account go to Website > Edit > Settings > SEO > HTML Tag Editor and paste the code before </body>.',
  'Hostinger Website Builder': 'In your Hostinger Website Builder go to Settings > Tracking & Analytics and use the custom code section.',
  Other: 'Paste the code before the closing </body> tag on every page where you want the chatbot to appear.',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function buildEmbedCode(
  appUrl: string,
  chatbotId: string,
  accentColor: string,
  position: string,
  greetingMessage: string,
  logoUrl: string
): string {
  return `<script
  src="${appUrl}/widget/smb-chat.min.js"
  data-webhook="${appUrl}/api/widget/chat"
  data-accent="${accentColor}"
  data-position="${position}"
  data-greeting="${greetingMessage}"
  data-logo="${logoUrl}"
  data-bot-id="${chatbotId}"
  data-auto-open="off"
  defer
></script>`
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function ChatBubblePreview({
  color,
  position,
  logoUrl,
}: {
  color: string
  position: string
  logoUrl: string
}) {
  const isLeft = position === 'bottom-left'
  return (
    <div className="relative h-20 w-full rounded-xl bg-gray-50 border border-gray-200 overflow-hidden">
      <div
        className={[
          'absolute bottom-3 w-11 h-11 rounded-full flex items-center justify-center shadow-md',
          isLeft ? 'left-3' : 'right-3',
        ].join(' ')}
        style={{ backgroundColor: color }}
      >
        {logoUrl ? (
          <img src={logoUrl} alt="logo" className="w-7 h-7 rounded-full object-cover" />
        ) : (
          <MessageSquare className="w-5 h-5 text-white" />
        )}
      </div>
      <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 whitespace-nowrap">
        Preview
      </span>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function NewChatbotPage() {
  // Active tab
  const [activeTab, setActiveTab] = useState('create')

  // Step 1 form
  const [form, setForm] = useState({
    name: '',
    website_url: '',
    model: 'gpt-4o',
    system_prompt:
      'You are a helpful assistant for our business. Answer questions about our products and services accurately and professionally.',
    greeting_message: 'Hi! How can I help you today?',
    temperature: 0.7,
  })

  // Step 2 widget config
  const [widget, setWidget] = useState({
    accent_color: '#7c3aed',
    customHex: '',
    position: 'bottom-right' as 'bottom-right' | 'bottom-left',
    logo_url: '',
    logoInputMode: 'upload' as 'upload' | 'url',
  })

  // Step 3 deploy
  const [deployPath, setDeployPath] = useState<'self' | 'managed' | null>(null)
  const [install, setInstall] = useState({
    platform: '',
    website_url: '',
    login_url: '',
    username: '',
    password: '',
    pin: '',
    notes: '',
  })

  // API / loading state
  const [chatbotId, setChatbotId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [installSubmitted, setInstallSubmitted] = useState(false)
  const [installLoading, setInstallLoading] = useState(false)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const appUrl =
    typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_APP_URL ?? ''

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const result = ev.target?.result as string
      setWidget((w) => ({ ...w, logo_url: result }))
    }
    reader.readAsDataURL(file)
  }

  async function handleCreateChatbot() {
    if (!form.name.trim()) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/chatbots', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          model: form.model,
          system_prompt: form.system_prompt,
          greeting_message: form.greeting_message,
          temperature: form.temperature,
          slug: buildSlug(form.name),
        }),
      })
      const json = await res.json()
      if (!res.ok || !json.success) {
        setError(json.error ?? 'Failed to create chatbot. Please try again.')
        return
      }
      const id: string = json.data.id
      setChatbotId(id)

      // Non-blocking crawl
      if (form.website_url.trim()) {
        fetch(`/api/chatbots/${id}/sources/crawl`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: form.website_url.trim() }),
        }).catch(() => {})
      }

      setActiveTab('customize')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSaveWidget() {
    if (!chatbotId) {
      setError('Create your chatbot first before saving widget settings.')
      setActiveTab('create')
      return
    }
    setLoading(true)
    setError(null)
    try {
      const accentColor = widget.customHex.trim() || widget.accent_color
      const res = await fetch(`/api/chatbots/${chatbotId}/widget-config`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accent_color: accentColor,
          position: widget.position,
          logo_url: widget.logo_url || null,
        }),
      })
      if (!res.ok) {
        const json = await res.json().catch(() => ({}))
        setError(json.error ?? 'Failed to save widget config.')
        return
      }
      setActiveTab('deploy')
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  async function handleInstallSubmit() {
    if (!chatbotId) {
      setError('Create your chatbot first before requesting install.')
      setActiveTab('create')
      return
    }
    setInstallLoading(true)
    setError(null)
    try {
      await fetch(`/api/chatbots/${chatbotId}/install-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...install, position: widget.position }),
      })
      setInstallSubmitted(true)
    } catch {
      setInstallSubmitted(true)
    } finally {
      setInstallLoading(false)
    }
  }

  function handleCopy() {
    const accentColor = widget.customHex.trim() || widget.accent_color
    const code = buildEmbedCode(
      appUrl,
      chatbotId ?? '',
      accentColor,
      widget.position,
      form.greeting_message,
      widget.logo_url
    )
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // -------------------------------------------------------------------------
  // Render helpers
  // -------------------------------------------------------------------------

  const activeAccent = widget.customHex.trim() || widget.accent_color

  const embedCode = chatbotId
    ? buildEmbedCode(appUrl, chatbotId, activeAccent, widget.position, form.greeting_message, widget.logo_url)
    : ''

  // -------------------------------------------------------------------------
  // Step panels
  // -------------------------------------------------------------------------

  function renderCreateTab() {
    return (
      <div className="space-y-5">
        <div>
          <Label htmlFor="name">Chatbot Name <span className="text-red-500">*</span></Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="e.g. Customer Support Bot"
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="website_url">Website URL <span className="text-gray-400 font-normal text-xs">(optional -- for auto-training)</span></Label>
          <div className="relative mt-1">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="website_url"
              type="url"
              value={form.website_url}
              onChange={(e) => setForm({ ...form, website_url: e.target.value })}
              placeholder="https://yourbusiness.com"
              className="pl-9"
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">We will scan up to 50 pages automatically.</p>
        </div>

        <div>
          <Label htmlFor="model">AI Model</Label>
          <Select
            value={form.model}
            onValueChange={(v: string | null) => { if (v) setForm({ ...form, model: v }) }}
          >
            <SelectTrigger className="mt-1">
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
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="prompt">System Prompt</Label>
          <Textarea
            id="prompt"
            value={form.system_prompt}
            onChange={(e) => setForm({ ...form, system_prompt: e.target.value })}
            rows={5}
            className="mt-1 font-mono text-sm"
          />
          <p className="text-xs text-gray-500 mt-1">
            Instructions that define your chatbot's personality and scope.
          </p>
        </div>

        <div>
          <Label htmlFor="temp">Temperature -- <span className="font-normal">{form.temperature}</span></Label>
          <input
            id="temp"
            type="range"
            min="0"
            max="2"
            step="0.1"
            value={form.temperature}
            onChange={(e) => setForm({ ...form, temperature: parseFloat(e.target.value) })}
            className="w-full mt-1 accent-violet-600"
          />
          <div className="flex justify-between text-xs text-gray-400">
            <span>Precise</span>
            <span>Creative</span>
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="button"
            onClick={handleCreateChatbot}
            disabled={loading || !form.name.trim() || !!chatbotId}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            {chatbotId ? (
              <><Check className="h-4 w-4 mr-2 text-green-400" /> Chatbot Created</>
            ) : (
              'Create Chatbot'
            )}
          </Button>
          {chatbotId && (
            <p className="text-xs text-green-600 mt-2">Chatbot created successfully. You can now customize and deploy it.</p>
          )}
        </div>
      </div>
    )
  }

  function renderCustomizeTab() {
    return (
      <div className="space-y-6">
        {/* Logo */}
        <div>
          <Label>Chatbot Logo</Label>
          <div className="flex gap-2 mt-1 mb-2">
            <button
              type="button"
              onClick={() => setWidget((w) => ({ ...w, logoInputMode: 'upload' }))}
              className={[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors',
                widget.logoInputMode === 'upload'
                  ? 'bg-violet-50 border-violet-300 text-violet-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300',
              ].join(' ')}
            >
              <Upload className="h-3.5 w-3.5" /> Upload file
            </button>
            <button
              type="button"
              onClick={() => setWidget((w) => ({ ...w, logoInputMode: 'url' }))}
              className={[
                'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-colors',
                widget.logoInputMode === 'url'
                  ? 'bg-violet-50 border-violet-300 text-violet-700'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300',
              ].join(' ')}
            >
              <LinkIcon className="h-3.5 w-3.5" /> Paste URL
            </button>
          </div>

          {widget.logoInputMode === 'upload' ? (
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg p-6 cursor-pointer hover:border-violet-400 hover:bg-violet-50 transition-colors"
              >
                {widget.logo_url ? (
                  <img src={widget.logo_url} alt="Logo preview" className="h-14 w-14 rounded-full object-cover" />
                ) : (
                  <>
                    <Upload className="h-6 w-6 text-gray-400" />
                    <span className="text-sm text-gray-500">Click to upload image</span>
                    <span className="text-xs text-gray-400">PNG, JPG, SVG up to 2MB</span>
                  </>
                )}
              </div>
              {widget.logo_url && (
                <button
                  type="button"
                  onClick={() => setWidget((w) => ({ ...w, logo_url: '' }))}
                  className="mt-1.5 text-xs text-red-500 hover:underline"
                >
                  Remove logo
                </button>
              )}
            </div>
          ) : (
            <div className="relative">
              <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="url"
                value={widget.logo_url}
                onChange={(e) => setWidget((w) => ({ ...w, logo_url: e.target.value }))}
                placeholder="https://yourdomain.com/logo.png"
                className="pl-9"
              />
            </div>
          )}
        </div>

        {/* Color */}
        <div>
          <Label>Brand Color</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {COLOR_PRESETS.map((preset) => {
              const isActive = widget.accent_color === preset.value && !widget.customHex
              const isWhite = preset.value === '#ffffff'
              return (
                <button
                  key={preset.value}
                  type="button"
                  title={preset.name}
                  onClick={() => setWidget((w) => ({ ...w, accent_color: preset.value, customHex: '' }))}
                  className={[
                    'w-8 h-8 rounded-full border-2 transition-transform hover:scale-110',
                    isActive
                      ? 'border-gray-700 scale-110'
                      : isWhite
                      ? 'border-gray-300'
                      : 'border-transparent',
                  ].join(' ')}
                  style={{ backgroundColor: preset.value }}
                />
              )
            })}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <div
              className="w-8 h-8 rounded-full border border-gray-200 shrink-0"
              style={{ backgroundColor: activeAccent }}
            />
            <Input
              value={widget.customHex}
              onChange={(e) => setWidget((w) => ({ ...w, customHex: e.target.value }))}
              placeholder="Custom hex, e.g. #1a2b3c"
              className="max-w-[200px] font-mono text-sm"
              maxLength={7}
            />
          </div>
        </div>

        {/* Position */}
        <div>
          <Label>Widget Position</Label>
          <div className="flex gap-3 mt-2">
            {(['bottom-left', 'bottom-right'] as const).map((pos) => (
              <button
                key={pos}
                type="button"
                onClick={() => setWidget((w) => ({ ...w, position: pos }))}
                className={[
                  'flex-1 flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-colors',
                  widget.position === pos
                    ? 'border-violet-500 bg-violet-50 text-violet-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300',
                ].join(' ')}
              >
                <div className="relative w-16 h-10 rounded bg-gray-100 border border-gray-200">
                  <div
                    className="absolute bottom-1 w-5 h-5 rounded-full"
                    style={{
                      backgroundColor: activeAccent,
                      left: pos === 'bottom-left' ? 4 : undefined,
                      right: pos === 'bottom-right' ? 4 : undefined,
                    }}
                  />
                </div>
                <span className="text-xs font-medium capitalize">
                  {pos === 'bottom-left' ? 'Bottom Left' : 'Bottom Right'}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Live preview */}
        <div>
          <Label>Live Preview</Label>
          <div className="mt-2">
            <ChatBubblePreview
              color={activeAccent}
              position={widget.position}
              logoUrl={widget.logo_url}
            />
          </div>
        </div>

        <div className="pt-2">
          <Button
            type="button"
            onClick={handleSaveWidget}
            disabled={loading || !chatbotId}
          >
            {loading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
            Save Widget Settings
          </Button>
          {!chatbotId && (
            <p className="text-xs text-amber-600 mt-2">Create your chatbot first on the Create tab.</p>
          )}
        </div>
      </div>
    )
  }

  function renderDeployTab() {
    return (
      <div className="space-y-4">
        <p className="text-sm text-gray-600">How would you like to add the chatbot to your website?</p>

        {/* Path selector cards */}
        <div className="grid gap-3">
          <button
            type="button"
            onClick={() => setDeployPath('self')}
            className={[
              'w-full text-left p-4 rounded-xl border-2 transition-colors',
              deployPath === 'self'
                ? 'border-violet-500 bg-violet-50'
                : 'border-gray-200 hover:border-gray-300',
            ].join(' ')}
          >
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-violet-100 p-2 shrink-0">
                <Code2 className="h-5 w-5 text-violet-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">I'll do it myself</p>
                <p className="text-sm text-gray-500 mt-0.5">Copy and paste a single line of code into your website.</p>
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setDeployPath('managed')}
            className={[
              'w-full text-left p-4 rounded-xl border-2 transition-colors',
              deployPath === 'managed'
                ? 'border-violet-500 bg-violet-50'
                : 'border-gray-200 hover:border-gray-300',
            ].join(' ')}
          >
            <div className="flex items-start gap-3">
              <div className="rounded-lg bg-green-100 p-2 shrink-0">
                <Wrench className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">Do it for me <span className="ml-1 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Managed Install</span></p>
                <p className="text-sm text-gray-500 mt-0.5">Provide your login credentials and we'll install it within 24 hours.</p>
              </div>
            </div>
          </button>
        </div>

        {/* Self-install panel */}
        {deployPath === 'self' && (
          <div className="space-y-4 pt-2">
            <div>
              <Label>Platform</Label>
              <Select
                value={install.platform}
                onValueChange={(v: string | null) => { if (v) setInstall((s) => ({ ...s, platform: v })) }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {install.platform && (
              <div className="rounded-lg bg-blue-50 border border-blue-100 p-3">
                <p className="text-xs font-medium text-blue-700 mb-1">{install.platform} Instructions</p>
                <p className="text-xs text-blue-600">{PLATFORM_INSTRUCTIONS[install.platform] ?? PLATFORM_INSTRUCTIONS['Other']}</p>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <Label>Embed Code</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="h-7 px-2 text-xs"
                >
                  {copied ? <Check className="h-3.5 w-3.5 mr-1 text-green-500" /> : <Copy className="h-3.5 w-3.5 mr-1" />}
                  {copied ? 'Copied!' : 'Copy Code'}
                </Button>
              </div>
              <pre className="text-xs bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                {embedCode}
              </pre>
            </div>
          </div>
        )}

        {/* Managed install panel */}
        {deployPath === 'managed' && (
          <div className="space-y-4 pt-2">
            <div>
              <Label htmlFor="i-platform">Platform</Label>
              <Select
                value={install.platform}
                onValueChange={(v: string | null) => { if (v) setInstall((s) => ({ ...s, platform: v })) }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select your platform" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORMS.map((p) => (
                    <SelectItem key={p} value={p}>{p}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="i-website">Website URL</Label>
              <Input
                id="i-website"
                type="url"
                value={install.website_url}
                onChange={(e) => setInstall((s) => ({ ...s, website_url: e.target.value }))}
                placeholder="https://yourbusiness.com"
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="i-login">Hosting Login URL</Label>
              <Input
                id="i-login"
                type="url"
                value={install.login_url}
                onChange={(e) => setInstall((s) => ({ ...s, login_url: e.target.value }))}
                placeholder="https://wp-admin URL or hosting panel URL"
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="i-user">Username</Label>
                <Input
                  id="i-user"
                  value={install.username}
                  onChange={(e) => setInstall((s) => ({ ...s, username: e.target.value }))}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="i-pass">Password</Label>
                <Input
                  id="i-pass"
                  type="password"
                  value={install.password}
                  onChange={(e) => setInstall((s) => ({ ...s, password: e.target.value }))}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="i-pin">PIN / 2FA Code <span className="text-gray-400 font-normal text-xs">(optional)</span></Label>
              <Input
                id="i-pin"
                value={install.pin}
                onChange={(e) => setInstall((s) => ({ ...s, pin: e.target.value }))}
                className="mt-1"
              />
            </div>

            <div>
              <Label htmlFor="i-notes">Additional Notes <span className="text-gray-400 font-normal text-xs">(optional)</span></Label>
              <Textarea
                id="i-notes"
                value={install.notes}
                onChange={(e) => setInstall((s) => ({ ...s, notes: e.target.value }))}
                rows={3}
                placeholder="Any special instructions for our team..."
                className="mt-1"
              />
            </div>

            <div className="flex items-start gap-2.5 rounded-lg bg-green-50 border border-green-100 p-3">
              <Shield className="h-4 w-4 text-green-600 mt-0.5 shrink-0" />
              <p className="text-xs text-green-700">
                Your credentials are encrypted with AES-256 and used only to install your chatbot. We delete them within 48 hours.
              </p>
            </div>

            <Button
              type="button"
              onClick={handleInstallSubmit}
              disabled={installLoading || !install.platform || !install.website_url || !install.username || !install.password || !chatbotId}
            >
              {installLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
              {installSubmitted ? (
                <><Check className="h-4 w-4 mr-2 text-green-400" /> Install Requested</>
              ) : (
                'Request Managed Install'
              )}
            </Button>
          </div>
        )}

        {!chatbotId && (
          <p className="text-xs text-amber-600 mt-4">Create your chatbot first on the Create tab.</p>
        )}

        {/* Success banner */}
        {chatbotId && (deployPath === 'self' || installSubmitted) && (
          <div className="flex flex-col items-center text-center py-6 mt-4 border-t border-gray-100 space-y-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="h-7 w-7 text-green-600" />
            </div>
            <p className="text-sm text-gray-600 max-w-sm">
              {installSubmitted
                ? "We'll install your chatbot within 24 hours. Manage it from your dashboard."
                : 'Your embed code is ready. Paste it on your site and you are live.'}
            </p>
            <div className="flex gap-3">
              <Link href={`/chatbots/${chatbotId}`} className={buttonVariants({ variant: 'default', size: 'sm' })}>
                <Bot className="h-4 w-4 mr-2" /> Open Dashboard
              </Link>
              <Link href="/chatbots" className={buttonVariants({ variant: 'outline', size: 'sm' })}>
                All Chatbots
              </Link>
            </div>
          </div>
        )}
      </div>
    )
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <div className="max-w-xl mx-auto py-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">New Chatbot</h1>
        <p className="text-gray-500 mt-1 text-sm">Set up your chatbot, customize the widget, and deploy -- all from one page.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="create" className="flex items-center gap-1.5">
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">Create</span>
            {chatbotId && <Check className="h-3.5 w-3.5 text-green-500" />}
          </TabsTrigger>
          <TabsTrigger value="customize" className="flex items-center gap-1.5">
            <Palette className="h-4 w-4" />
            <span className="hidden sm:inline">Customize</span>
          </TabsTrigger>
          <TabsTrigger value="deploy" className="flex items-center gap-1.5">
            <Rocket className="h-4 w-4" />
            <span className="hidden sm:inline">Deploy</span>
          </TabsTrigger>
        </TabsList>

        {error && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 border border-red-100 p-3 mb-4">
            <AlertCircle className="h-4 w-4 text-red-500 mt-0.5 shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <Card>
          <CardContent className="pt-6">
            <TabsContent value="create" className="mt-0">
              {renderCreateTab()}
            </TabsContent>
            <TabsContent value="customize" className="mt-0">
              {renderCustomizeTab()}
            </TabsContent>
            <TabsContent value="deploy" className="mt-0">
              {renderDeployTab()}
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  )
}
