'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart3, Loader2 } from 'lucide-react'
import { useFetch } from '@/hooks/use-fetch'
import { PLANS } from '@/lib/constants'

interface ConversationPoint {
  date: string
  count: number
}

interface TopicItem {
  keyword: string
  count: number
}

interface UsageData {
  messages_used: number
  plan: string
  message_limit: number | null
}

export default function AnalyticsPage() {
  const { data: chartData, loading: chartLoading } = useFetch<ConversationPoint[]>('/api/analytics/conversations?days=30')
  const { data: topics, loading: topicsLoading } = useFetch<TopicItem[]>('/api/analytics/topics')
  const { data: usage, loading: usageLoading } = useFetch<UsageData>('/api/analytics/usage')

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h1>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Messages Over Time (30 days)</CardTitle></CardHeader>
          <CardContent>
            {chartLoading ? (
              <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
            ) : chartData && chartData.length > 0 ? (
              <div className="flex items-end gap-1 h-64">
                {chartData.map((point) => {
                  const max = Math.max(...chartData.map((p) => p.count), 1)
                  const height = (point.count / max) * 100
                  return (
                    <div key={point.date} className="flex-1 flex flex-col items-center gap-1">
                      <span className="text-[10px] text-gray-500">{point.count || ''}</span>
                      <div className="w-full bg-blue-500 rounded-t" style={{ height: `${Math.max(height, 2)}%` }} />
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">
                <div className="text-center">
                  <BarChart3 className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                  <p>No data yet</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Popular Topics</CardTitle></CardHeader>
          <CardContent>
            {topicsLoading ? (
              <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
            ) : topics && topics.length > 0 ? (
              <div className="space-y-3">
                {topics.slice(0, 10).map((topic) => {
                  const max = Math.max(...topics.map((t) => t.count), 1)
                  const width = (topic.count / max) * 100
                  return (
                    <div key={topic.keyword}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-gray-700">{topic.keyword}</span>
                        <span className="text-gray-500">{topic.count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 rounded-full">
                        <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${width}%` }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">No data yet</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Response Accuracy</CardTitle></CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-64 text-gray-400">
              Feedback data will appear here as visitors rate responses.
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Usage vs Plan Limits</CardTitle></CardHeader>
          <CardContent>
            {usageLoading ? (
              <div className="flex items-center justify-center h-64"><Loader2 className="h-6 w-6 animate-spin text-gray-400" /></div>
            ) : usage ? (
              <div className="flex flex-col items-center justify-center h-64">
                <p className="text-sm text-gray-500 mb-2">Plan: <span className="font-semibold text-gray-900 capitalize">{usage.plan}</span></p>
                <p className="text-4xl font-bold text-gray-900 mb-2">
                  {usage.messages_used.toLocaleString()}
                </p>
                <p className="text-sm text-gray-500">
                  of {usage.message_limit ? usage.message_limit.toLocaleString() : 'unlimited'} messages used
                </p>
                {usage.message_limit && (
                  <div className="w-full max-w-xs mt-4">
                    <div className="h-3 bg-gray-100 rounded-full">
                      <div
                        className={`h-3 rounded-full ${(usage.messages_used / usage.message_limit) > 0.9 ? 'bg-red-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min((usage.messages_used / usage.message_limit) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-400">No data yet</div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
