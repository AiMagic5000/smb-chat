'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MessageSquare, Users, Clock, ThumbsUp } from 'lucide-react'
import { useFetch } from '@/hooks/use-fetch'

interface DashboardStats {
  total_sessions: number
  messages_today: number
  active_conversations: number
  resolution_rate: number
  satisfaction_avg: number
}

interface ConversationPoint {
  date: string
  count: number
}

export default function DashboardPage() {
  const { data: stats, loading: statsLoading } = useFetch<DashboardStats>('/api/analytics/dashboard')
  const { data: chartData } = useFetch<ConversationPoint[]>('/api/analytics/conversations?days=14')

  const statCards = [
    { label: 'Total Sessions', value: stats?.total_sessions ?? 0, icon: MessageSquare },
    { label: 'Messages Today', value: stats?.messages_today ?? 0, icon: Clock },
    { label: 'Active Chats', value: stats?.active_conversations ?? 0, icon: Users },
    { label: 'Resolution Rate', value: stats ? `${stats.resolution_rate}%` : '0%', icon: ThumbsUp },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-500">{stat.label}</CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statsLoading ? <span className="animate-pulse bg-gray-200 rounded h-7 w-12 inline-block" /> : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Messages (Last 14 Days)</CardTitle></CardHeader>
          <CardContent>
            {chartData && chartData.length > 0 ? (
              <div className="flex items-end gap-1 h-48">
                {chartData.map((point) => {
                  const max = Math.max(...chartData.map((p) => p.count), 1)
                  const height = (point.count / max) * 100
                  return (
                    <div key={point.date} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-xs text-gray-500">{point.count}</span>
                      <div className="w-full bg-blue-500 rounded-t" style={{ height: `${Math.max(height, 2)}%` }} />
                      <span className="text-[10px] text-gray-400">{new Date(point.date).toLocaleDateString('en', { month: 'short', day: 'numeric' })}</span>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-48 text-gray-400">
                No data yet. Create a chatbot to get started.
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Recent Conversations</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48 text-gray-400">
              No conversations yet.
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
