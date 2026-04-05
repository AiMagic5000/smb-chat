'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Sparkles, Check, X, Loader2 } from 'lucide-react'
import { useFetch } from '@/hooks/use-fetch'
import { Textarea } from '@/components/ui/textarea'

interface Correction {
  id: string
  chatbot_id: string
  message_id: string
  original_response: string
  corrected_response: string | null
  status: string
  created_at: string
}

export default function CorrectionsPage() {
  const { data: corrections, loading, refetch } = useFetch<Correction[]>('/api/corrections')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editText, setEditText] = useState('')

  const pendingCount = corrections?.filter((c) => c.status === 'pending').length ?? 0
  const approvedCount = corrections?.filter((c) => c.status === 'approved').length ?? 0

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">AI Corrections</h1>
        <div className="flex gap-2">
          <Badge variant="outline">Pending: {pendingCount}</Badge>
          <Badge variant="secondary">Approved: {approvedCount}</Badge>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : !corrections || corrections.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Sparkles className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No corrections to review</h3>
            <p className="text-gray-500 text-center max-w-md">
              When visitors give negative feedback on AI responses, corrections will appear here for your review. Approved corrections improve your chatbot over time.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {corrections.map((c) => (
            <Card key={c.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <Badge variant={c.status === 'pending' ? 'default' : c.status === 'approved' ? 'secondary' : 'destructive'}>
                    {c.status}
                  </Badge>
                  <span className="text-xs text-gray-500">{new Date(c.created_at).toLocaleString()}</span>
                </div>
                <div className="mb-3">
                  <p className="text-xs font-medium text-gray-500 mb-1">Original AI Response</p>
                  <p className="text-sm text-gray-700 bg-gray-50 rounded p-3">{c.original_response}</p>
                </div>
                {editingId === c.id ? (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-500 mb-1">Corrected Response</p>
                    <Textarea value={editText} onChange={(e) => setEditText(e.target.value)} rows={3} />
                    <div className="flex gap-2 mt-2">
                      <Button size="sm" onClick={() => setEditingId(null)}>Save & Approve</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>Cancel</Button>
                    </div>
                  </div>
                ) : c.status === 'pending' ? (
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => { setEditingId(c.id); setEditText(c.original_response) }}>
                      Edit & Approve
                    </Button>
                    <Button size="sm" variant="destructive">
                      <X className="h-3 w-3 mr-1" /> Reject
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
