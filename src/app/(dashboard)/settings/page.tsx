'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2 } from 'lucide-react'
import { useFetch } from '@/hooks/use-fetch'
import { createClient } from '@/lib/supabase/client'

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

export default function SettingsPage() {
  const router = useRouter()
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

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
  }

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
