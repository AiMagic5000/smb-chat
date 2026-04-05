'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Ticket, Loader2 } from 'lucide-react'
import { useFetch } from '@/hooks/use-fetch'

interface TicketItem {
  id: string
  subject: string
  status: string
  priority: string
  created_at: string
  contacts: { name: string | null; email: string | null } | null
  chatbots: { name: string } | null
}

export default function TicketsPage() {
  const { data: tickets, loading } = useFetch<TicketItem[]>('/api/tickets')

  const openCount = tickets?.filter((t) => t.status === 'open').length ?? 0
  const inProgressCount = tickets?.filter((t) => t.status === 'in_progress').length ?? 0
  const resolvedCount = tickets?.filter((t) => t.status === 'resolved').length ?? 0

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tickets</h1>
        <div className="flex gap-2">
          <Badge variant="outline">Open: {openCount}</Badge>
          <Badge variant="outline">In Progress: {inProgressCount}</Badge>
          <Badge variant="secondary">Resolved: {resolvedCount}</Badge>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            New Ticket
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
        </div>
      ) : !tickets || tickets.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Ticket className="h-12 w-12 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No tickets yet</h3>
            <p className="text-gray-500">Tickets are created from conversations or manually by your team.</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-sm text-gray-500">
                  <th className="px-4 py-3 font-medium">Subject</th>
                  <th className="px-4 py-3 font-medium">Contact</th>
                  <th className="px-4 py-3 font-medium">Chatbot</th>
                  <th className="px-4 py-3 font-medium">Priority</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((t) => (
                  <tr key={t.id} className="border-b hover:bg-gray-50 cursor-pointer">
                    <td className="px-4 py-3 font-medium text-gray-900">{t.subject}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{t.contacts?.name ?? t.contacts?.email ?? '--'}</td>
                    <td className="px-4 py-3 text-sm text-gray-600">{t.chatbots?.name ?? '--'}</td>
                    <td className="px-4 py-3">
                      <Badge variant={t.priority === 'high' ? 'destructive' : t.priority === 'medium' ? 'default' : 'secondary'}>
                        {t.priority}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={t.status === 'open' ? 'default' : t.status === 'in_progress' ? 'outline' : 'secondary'}>
                        {t.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">{new Date(t.created_at).toLocaleDateString()}</td>
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
