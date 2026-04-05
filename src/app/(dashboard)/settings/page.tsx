'use client'

import { useState, useEffect, useCallback } from 'react'
import { useClerk } from '@clerk/nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Key, Copy, Check, Trash2, Plus, AlertCircle, BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import { useFetch } from '@/hooks/use-fetch'

interface Profile {
  id: string
  email: string
  full_name: string
  company: string
}

interface Membership {
  workspace_id: string
  role: string
  workspaces: { id: string; name: string } | null
}

interface ApiKey {
  id: string
  name: string
  key_prefix: string
  created_at: string
  key?: string
}

export default function SettingsPage() {
  const { signOut } = useClerk()
  const { data: profile, loading: profileLoading } = useFetch<Profile>('/api/settings/profile')
  const { data: memberships, loading: wsLoading } = useFetch<Membership[]>('/api/workspaces')

  const workspace = memberships?.[0]?.workspaces
  const workspaceId = workspace?.id

  const [fullName, setFullName] = useState('')
  const [wsName, setWsName] = useState('')
  const [saving, setSaving] = useState(false)
  const [wsSaving, setWsSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (profile) setFullName(profile.full_name ?? '')
  }, [profile])

  useEffect(() => {
    if (workspace) setWsName(workspace.name ?? '')
  }, [workspace])

  const saveProfile = async () => {
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/settings/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ full_name: fullName }),
      })
      const data = await res.json()
      setMessage(data.success ? 'Profile saved.' : data.error ?? 'Save failed.')
    } catch {
      setMessage('Network error.')
    } finally {
      setSaving(false)
    }
  }

  const saveWorkspace = async () => {
    if (!workspaceId) return
    setWsSaving(true)
    setMessage('')
    try {
      const res = await fetch(`/api/workspaces/${workspaceId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: wsName }),
      })
      const data = await res.json()
      setMessage(data.success ? 'Workspace updated.' : data.error ?? 'Update failed.')
    } catch {
      setMessage('Network error.')
    } finally {
      setWsSaving(false)
    }
  }

  const handleSignOut = () => {
    signOut({ redirectUrl: '/' })
  }

  // API Keys
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [keysLoading, setKeysLoading] = useState(true)
  const [newKeyName, setNewKeyName] = useState('')
  const [creatingKey, setCreatingKey] = useState(false)
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null)
  const [keyCopied, setKeyCopied] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const loadKeys = useCallback(async () => {
    try {
      const res = await fetch('/api/settings/api-keys')
      const json = await res.json()
      if (json.success) setApiKeys(json.data ?? [])
    } catch { /* ignore */ }
    setKeysLoading(false)
  }, [])

  useEffect(() => { loadKeys() }, [loadKeys])

  const createKey = async () => {
    if (!newKeyName.trim()) return
    setCreatingKey(true)
    try {
      const res = await fetch('/api/settings/api-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newKeyName.trim() }),
      })
      const json = await res.json()
      if (json.success) {
        setNewlyCreatedKey(json.data.key)
        setNewKeyName('')
        loadKeys()
      } else {
        setMessage(json.error ?? 'Failed to create key.')
      }
    } catch {
      setMessage('Network error.')
    } finally {
      setCreatingKey(false)
    }
  }

  const deleteKey = async (id: string) => {
    setDeletingId(id)
    try {
      await fetch('/api/settings/api-keys', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      setApiKeys((keys) => keys.filter((k) => k.id !== id))
    } catch { /* ignore */ }
    setDeletingId(null)
  }

  const [showDocs, setShowDocs] = useState(false)
  const [docCopied, setDocCopied] = useState<string | null>(null)

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key).then(() => {
      setKeyCopied(true)
      setTimeout(() => setKeyCopied(false), 2000)
    })
  }

  const copySnippet = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setDocCopied(id)
      setTimeout(() => setDocCopied(null), 2000)
    })
  }

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : ''

  if (profileLoading || wsLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Settings</h1>

      {message && (
        <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-700 mb-4">{message}</div>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your name" />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" disabled value={profile?.email ?? ''} />
          </div>
          <Button onClick={saveProfile} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Save Changes
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Workspace</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="ws-name">Workspace Name</Label>
            <Input id="ws-name" value={wsName} onChange={(e) => setWsName(e.target.value)} placeholder="My Business" />
          </div>
          <Button onClick={saveWorkspace} disabled={wsSaving || !workspaceId}>
            {wsSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
            Update Workspace
          </Button>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            API Keys
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-gray-50 border border-gray-200 p-4 space-y-2">
            <p className="text-sm text-gray-700 font-medium">What is this?</p>
            <p className="text-sm text-gray-500">
              SMB Chat provides its own REST API so you can send and receive chatbot messages from
              your own code, internal tools, or automation platforms like Zapier, Make, or n8n.
              This is not a third-party integration -- it connects directly to your chatbot on this platform.
            </p>
            <p className="text-sm text-gray-500">
              Use cases: embed chat in a custom app, connect to a CRM, trigger bot replies from a
              form submission, or build a mobile experience.
            </p>
          </div>

          {/* Create new key */}
          <div>
            <Label className="mb-1.5 block">Create a new key</Label>
            <div className="flex gap-2">
              <Input
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="Key name, e.g. Production"
                className="flex-1"
                onKeyDown={(e) => { if (e.key === 'Enter') createKey() }}
              />
              <Button onClick={createKey} disabled={creatingKey || !newKeyName.trim()}>
                {creatingKey ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                Generate
              </Button>
            </div>
          </div>

          {/* Newly created key banner */}
          {newlyCreatedKey && (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-3 space-y-2">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5 shrink-0" />
                <p className="text-sm text-amber-800 font-medium">
                  Copy your API key now. You will not be able to see it again.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <code className="flex-1 text-xs bg-gray-900 text-gray-100 rounded px-3 py-2 break-all">
                  {newlyCreatedKey}
                </code>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyKey(newlyCreatedKey)}
                  className="shrink-0"
                >
                  {keyCopied ? <Check className="h-3.5 w-3.5 text-green-500" /> : <Copy className="h-3.5 w-3.5" />}
                </Button>
              </div>
              <button
                type="button"
                onClick={() => setNewlyCreatedKey(null)}
                className="text-xs text-amber-600 hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}

          {/* Existing keys list */}
          {keysLoading ? (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            </div>
          ) : apiKeys.length === 0 ? (
            <p className="text-sm text-gray-400 text-center py-4">No API keys yet. Generate one above to get started.</p>
          ) : (
            <div className="divide-y divide-gray-100 border border-gray-100 rounded-lg">
              {apiKeys.map((k) => (
                <div key={k.id} className="flex items-center justify-between px-3 py-2.5">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{k.name}</p>
                    <p className="text-xs text-gray-400">
                      <code>{k.key_prefix}...</code> &middot; Created{' '}
                      {new Date(k.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteKey(k.id)}
                    disabled={deletingId === k.id}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    {deletingId === k.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* API Documentation toggle */}
          <div className="border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={() => setShowDocs((v) => !v)}
              className="flex items-center gap-2 text-sm font-medium text-violet-600 hover:text-violet-800"
            >
              <BookOpen className="h-4 w-4" />
              How to use the API
              {showDocs ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>

            {showDocs && (
              <div className="mt-4 space-y-5 text-sm">
                {/* Step 1 */}
                <div>
                  <p className="font-medium text-gray-900 mb-1">Step 1: Start a conversation</p>
                  <p className="text-gray-500 mb-2">
                    Create a session to get a <code className="text-xs bg-gray-100 px-1 py-0.5 rounded">conversation_id</code>. You will need your Bot ID (shown on your chatbot dashboard).
                  </p>
                  <div className="relative">
                    <pre className="text-xs bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
{`POST ${baseUrl}/api/widget/session
Content-Type: application/json

{
  "bot_id": "YOUR_BOT_ID"
}`}
                    </pre>
                    <button
                      type="button"
                      onClick={() => copySnippet('s1', `fetch('${baseUrl}/api/widget/session', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({ bot_id: 'YOUR_BOT_ID' })\n}).then(r => r.json()).then(console.log)`)}
                      className="absolute top-2 right-2 p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300"
                      title="Copy as fetch()"
                    >
                      {docCopied === 's1' ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Response: <code className="bg-gray-100 px-1 py-0.5 rounded">{`{ "success": true, "data": { "conversation_id": "..." } }`}</code>
                  </p>
                </div>

                {/* Step 2 */}
                <div>
                  <p className="font-medium text-gray-900 mb-1">Step 2: Send a message</p>
                  <p className="text-gray-500 mb-2">
                    Send a user message and get the AI reply back instantly.
                  </p>
                  <div className="relative">
                    <pre className="text-xs bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
{`POST ${baseUrl}/api/widget/chat
Content-Type: application/json

{
  "bot_id": "YOUR_BOT_ID",
  "conversation_id": "FROM_STEP_1",
  "message": "What services do you offer?"
}`}
                    </pre>
                    <button
                      type="button"
                      onClick={() => copySnippet('s2', `fetch('${baseUrl}/api/widget/chat', {\n  method: 'POST',\n  headers: { 'Content-Type': 'application/json' },\n  body: JSON.stringify({\n    bot_id: 'YOUR_BOT_ID',\n    conversation_id: 'FROM_STEP_1',\n    message: 'What services do you offer?'\n  })\n}).then(r => r.json()).then(console.log)`)}
                      className="absolute top-2 right-2 p-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-300"
                      title="Copy as fetch()"
                    >
                      {docCopied === 's2' ? <Check className="h-3.5 w-3.5 text-green-400" /> : <Copy className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Response: <code className="bg-gray-100 px-1 py-0.5 rounded">{`{ "success": true, "data": { "response": "We offer...", "conversation_id": "..." } }`}</code>
                  </p>
                </div>

                {/* Use cases */}
                <div className="rounded-lg bg-violet-50 border border-violet-100 p-3">
                  <p className="font-medium text-violet-800 mb-1.5">Common integrations</p>
                  <ul className="text-xs text-violet-700 space-y-1.5 list-disc list-inside">
                    <li><strong>Zapier / Make / n8n</strong> -- Use an HTTP Request module to call the endpoints above. Trigger from a form, email, or CRM event.</li>
                    <li><strong>Custom website or app</strong> -- Use JavaScript <code>fetch()</code> (examples above) to build your own chat UI.</li>
                    <li><strong>Mobile apps</strong> -- Call the REST API from any language (Swift, Kotlin, Python, etc.).</li>
                    <li><strong>Internal tools</strong> -- Connect your helpdesk, ticketing system, or Slack bot to route questions through your trained chatbot.</li>
                  </ul>
                </div>

                {/* Rate limits */}
                <div>
                  <p className="font-medium text-gray-900 mb-1">Rate limits</p>
                  <p className="text-xs text-gray-500">
                    Chat: 60 requests per minute per IP. Sessions: 10 per hour per IP. Messages count toward your plan's monthly limit.
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-red-600">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-4">
              Deleting your workspace will permanently remove all chatbots, conversations, and contacts.
            </p>
            <Button variant="destructive" disabled>Delete Workspace</Button>
          </div>
          <div className="border-t pt-4">
            <Button variant="outline" onClick={handleSignOut}>Sign Out</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
