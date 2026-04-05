'use client'

import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  MessageSquare,
  Users,
  Clock,
  ThumbsUp,
  Bot,
  ArrowRight,
  TrendingUp,
  Zap,
  Plus,
  BarChart3,
} from 'lucide-react'
import { useFetch } from '@/hooks/use-fetch'
import { cn } from '@/lib/utils'

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

function StatCard({
  label,
  value,
  icon: Icon,
  loading,
  trend,
  color = 'violet',
}: {
  label: string
  value: string | number
  icon: React.ElementType
  loading?: boolean
  trend?: string
  color?: 'violet' | 'blue' | 'green' | 'amber'
}) {
  const colorMap = {
    violet: 'bg-violet-50 text-violet-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    amber: 'bg-amber-50 text-amber-600',
  }

  return (
    <Card className="border-gray-200/80 bg-white shadow-none hover:shadow-sm transition-shadow duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', colorMap[color])}>
            <Icon className="h-5 w-5" />
          </div>
          {trend && (
            <span className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 rounded-full px-2 py-0.5">
              <TrendingUp className="h-3 w-3" />
              {trend}
            </span>
          )}
        </div>
        <div>
          {loading ? (
            <div className="h-7 w-16 rounded-md bg-gray-100 animate-pulse mb-1" />
          ) : (
            <p className="text-2xl font-bold text-gray-900 tabular-nums">{value}</p>
          )}
          <p className="text-sm text-gray-500 mt-0.5">{label}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function BarChart({ data }: { data: ConversationPoint[] }) {
  const max = Math.max(...data.map((p) => p.count), 1)

  return (
    <div className="flex items-end gap-1.5 h-44 pt-2">
      {data.map((point) => {
        const pct = (point.count / max) * 100
        const date = new Date(point.date)
        const label = date.toLocaleDateString('en', { month: 'short', day: 'numeric' })

        return (
          <div key={point.date} className="group flex-1 flex flex-col items-center gap-1.5 min-w-0">
            <span className="text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity font-medium">
              {point.count}
            </span>
            <div className="w-full relative flex-1 flex items-end">
              <div
                className="w-full rounded-t-md bg-violet-100 group-hover:bg-violet-500 transition-colors duration-150"
                style={{ height: `${Math.max(pct, 4)}%` }}
              />
            </div>
            <span className="text-[9px] text-gray-400 truncate w-full text-center hidden sm:block">
              {label}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  actionHref,
}: {
  icon: React.ElementType
  title: string
  description: string
  action?: string
  actionHref?: string
}) {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 mb-4">
        <Icon className="h-6 w-6 text-gray-400" />
      </div>
      <p className="text-sm font-medium text-gray-900 mb-1">{title}</p>
      <p className="text-sm text-gray-400 max-w-xs leading-relaxed">{description}</p>
      {action && actionHref && (
        <Link
          href={actionHref}
          className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
        >
          {action}
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const { data: stats, loading: statsLoading } = useFetch<DashboardStats>('/api/analytics/dashboard')
  const { data: chartData } = useFetch<ConversationPoint[]>('/api/analytics/conversations?days=14')

  const statCards = [
    {
      label: 'Total Sessions',
      value: stats?.total_sessions?.toLocaleString() ?? '0',
      icon: MessageSquare,
      color: 'violet' as const,
      trend: '+12%',
    },
    {
      label: 'Messages Today',
      value: stats?.messages_today?.toLocaleString() ?? '0',
      icon: Clock,
      color: 'blue' as const,
    },
    {
      label: 'Active Chats',
      value: stats?.active_conversations ?? '0',
      icon: Users,
      color: 'green' as const,
    },
    {
      label: 'Resolution Rate',
      value: stats ? `${stats.resolution_rate}%` : '0%',
      icon: ThumbsUp,
      color: 'amber' as const,
    },
  ]

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-0.5">Overview of your chatbot performance</p>
        </div>
        <Link
          href="/chatbots/new"
          className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 active:bg-violet-800 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">New Chatbot</span>
          <span className="sm:hidden">New</span>
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        {statCards.map((stat) => (
          <StatCard key={stat.label} loading={statsLoading} {...stat} />
        ))}
      </div>

      {/* Charts and activity */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-5">

        {/* Chart -- 3 cols wide on lg */}
        <Card className="lg:col-span-3 border-gray-200/80 bg-white shadow-none">
          <CardHeader className="pb-2 px-5 pt-5">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[15px] font-semibold text-gray-900">
                Messages (Last 14 Days)
              </CardTitle>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50">
                <BarChart3 className="h-4 w-4 text-violet-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5">
            {chartData && chartData.length > 0 ? (
              <BarChart data={chartData} />
            ) : (
              <EmptyState
                icon={BarChart3}
                title="No data yet"
                description="Start conversations with your chatbot to see message volume here."
              />
            )}
          </CardContent>
        </Card>

        {/* Quick actions -- 2 cols wide on lg */}
        <Card className="lg:col-span-2 border-gray-200/80 bg-white shadow-none">
          <CardHeader className="pb-2 px-5 pt-5">
            <CardTitle className="text-[15px] font-semibold text-gray-900">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="px-5 pb-5 space-y-2">
            {[
              { href: '/chatbots/new', label: 'Create a chatbot', icon: Bot, desc: 'Train a new AI assistant' },
              { href: '/conversations', label: 'View conversations', icon: MessageSquare, desc: 'Browse recent chatlogs' },
              { href: '/analytics', label: 'See analytics', icon: BarChart3, desc: 'Track performance metrics' },
              { href: '/contacts', label: 'Manage contacts', icon: Users, desc: 'View captured leads' },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-xl p-3 hover:bg-gray-50 active:bg-gray-100 transition-colors group"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 group-hover:bg-violet-100 transition-colors shrink-0">
                  <item.icon className="h-4.5 w-4.5 h-[18px] w-[18px] text-violet-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">{item.label}</p>
                  <p className="text-xs text-gray-400 truncate">{item.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-gray-300 group-hover:text-gray-400 transition-colors shrink-0" />
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Recent conversations */}
      <Card className="border-gray-200/80 bg-white shadow-none">
        <CardHeader className="pb-2 px-5 pt-5">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[15px] font-semibold text-gray-900">Recent Conversations</CardTitle>
            <Link
              href="/conversations"
              className="text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors flex items-center gap-1"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-5">
          <EmptyState
            icon={MessageSquare}
            title="No conversations yet"
            description="Once visitors start chatting with your bot, conversations will appear here."
            action="Create your first chatbot"
            actionHref="/chatbots/new"
          />
        </CardContent>
      </Card>

      {/* Get started CTA -- shown when no chatbots */}
      {!statsLoading && (stats?.total_sessions ?? 0) === 0 && (
        <div className="rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 shrink-0">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-base font-semibold text-white mb-1">Build your first chatbot</h3>
              <p className="text-sm text-violet-100 leading-relaxed">
                Train an AI assistant on your website content and start handling customer questions in minutes.
              </p>
            </div>
            <Link
              href="/chatbots/new"
              className="shrink-0 inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-violet-700 hover:bg-violet-50 active:bg-violet-100 transition-colors"
            >
              Get Started
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}
