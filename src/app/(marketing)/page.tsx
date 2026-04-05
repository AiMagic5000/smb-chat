import Link from 'next/link'
import {
  MessageSquare,
  Zap,
  Shield,
  BarChart3,
  Users,
  ArrowRight,
  Check,
  Code,
  Brain,
  Lock,
  Sparkles,
  ChevronRight,
} from 'lucide-react'
import { PLANS } from '@/lib/constants'

const features = [
  {
    icon: Brain,
    title: 'Trained on Your Content',
    description: 'Point it at your website, upload documents, or paste FAQs. The chatbot learns your business and answers with accuracy.',
  },
  {
    icon: Code,
    title: 'One-Line Embed',
    description: 'Copy a single script tag into your site. Works with any platform -- WordPress, Shopify, Webflow, custom code.',
  },
  {
    icon: Shield,
    title: 'Human Handoff',
    description: 'When conversations need a person, the bot transfers seamlessly to your team with full context intact.',
  },
  {
    icon: BarChart3,
    title: 'Conversation Analytics',
    description: 'See what customers ask, track resolution rates, identify gaps in your knowledge base, and measure satisfaction.',
  },
  {
    icon: Users,
    title: 'Lead Collection',
    description: 'Capture emails and phone numbers during chat. Every lead flows directly into your contacts dashboard.',
  },
  {
    icon: Lock,
    title: 'Corrections and Control',
    description: 'Review bot responses and submit corrections. Your chatbot improves over time based on your feedback.',
  },
]

const steps = [
  {
    num: '01',
    title: 'Add your content',
    description: 'Paste website URLs or upload documents. The system crawls, chunks, and indexes everything automatically.',
  },
  {
    num: '02',
    title: 'Configure behavior',
    description: 'Set your greeting message, fallback responses, and personality. Adjust model settings to match your brand voice.',
  },
  {
    num: '03',
    title: 'Deploy anywhere',
    description: 'Grab the embed code and paste it on your site. Your chatbot starts handling conversations immediately.',
  },
]

const stats = [
  { value: '24/7', label: 'Availability' },
  { value: '<2s', label: 'Response Time' },
  { value: '85%', label: 'Resolution Rate' },
  { value: '5 min', label: 'Setup Time' },
]

export default function LandingPage() {
  return (
    <div className="overflow-hidden">

      {/* Hero */}
      <section className="pt-16 pb-20 sm:pt-24 sm:pb-28 lg:pt-28 lg:pb-36">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">

          {/* Pill badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-semibold text-violet-700 mb-8">
            <Sparkles className="h-3.5 w-3.5" />
            No-code AI chatbots for small business
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight leading-[1.05] mb-6">
            Automate Your{' '}
            <span className="text-violet-600">Customer Support</span>
          </h1>

          <p className="text-lg sm:text-xl text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto">
            Build an AI chatbot trained on your content. It handles questions around the clock so your team can focus on what matters.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-8 py-3.5 text-[15px] font-semibold text-white hover:bg-violet-700 active:bg-violet-800 transition-colors shadow-sm shadow-violet-200"
            >
              Start Free Trial
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/sign-in"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-8 py-3.5 text-[15px] font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 active:bg-gray-100 transition-colors"
            >
              Sign in to your account
            </Link>
          </div>

          <p className="mt-5 text-sm text-gray-400">No credit card required. Free plan available.</p>
        </div>
      </section>

      {/* Chat widget illustration */}
      <section className="pb-20 sm:pb-28">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative rounded-3xl bg-gradient-to-br from-violet-700 via-violet-600 to-indigo-600 p-8 sm:p-12 overflow-hidden">

            {/* Background decorations */}
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-white/5" />
              <div className="absolute -bottom-16 -left-8 h-48 w-48 rounded-full bg-white/5" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-violet-500/20 blur-3xl" />
            </div>

            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">

              {/* Left copy */}
              <div>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 leading-tight">
                  See it in action
                </h2>
                <p className="text-violet-100 text-base sm:text-lg leading-relaxed mb-8">
                  A fully customizable chat widget that matches your brand. Set colors, greeting messages, lead capture forms, and more from a simple dashboard.
                </p>
                <Link
                  href="/features"
                  className="inline-flex items-center gap-2 rounded-full bg-white/15 border border-white/25 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/25 transition-colors backdrop-blur-sm"
                >
                  Explore all features
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              {/* Right -- chat widget mockup */}
              <div className="mx-auto w-full max-w-xs">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-black/5">

                  {/* Widget header */}
                  <div className="bg-gradient-to-r from-gray-900 to-gray-800 px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-500">
                        <MessageSquare className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-white">Support Assistant</p>
                        <div className="flex items-center gap-1.5">
                          <div className="h-1.5 w-1.5 rounded-full bg-green-400" />
                          <p className="text-xs text-gray-400">Online now</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="p-4 space-y-3 bg-gray-50/50">
                    <div className="bg-white rounded-2xl rounded-tl-sm border border-gray-100 p-3 text-sm text-gray-700 max-w-[88%] shadow-sm">
                      Hi there! How can I help you today?
                    </div>
                    <div className="bg-violet-600 rounded-2xl rounded-tr-sm p-3 text-sm text-white ml-auto max-w-[88%]">
                      What plans do you offer?
                    </div>
                    <div className="bg-white rounded-2xl rounded-tl-sm border border-gray-100 p-3 text-sm text-gray-700 max-w-[88%] shadow-sm">
                      We have four plans starting at $29/mo. Want me to walk you through them?
                    </div>
                  </div>

                  {/* Input */}
                  <div className="border-t bg-white px-3 py-3">
                    <div className="flex items-center gap-2 bg-gray-100 rounded-full px-4 py-2">
                      <span className="flex-1 text-sm text-gray-400">Type a message...</span>
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-600">
                        <ArrowRight className="h-3 w-3 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y border-gray-100 bg-gray-50/70">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 sm:py-14">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1.5 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-14 sm:mb-18">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Everything you need to automate support
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
              One platform to build, train, deploy, and manage AI chatbots that work for your business.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div
                key={f.title}
                className="group rounded-2xl border border-gray-200 bg-white p-6 hover:border-violet-200 hover:shadow-md hover:shadow-violet-50 transition-all duration-200 cursor-default"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 group-hover:bg-violet-100 transition-colors mb-4">
                  <f.icon className="h-5 w-5 text-violet-600" />
                </div>
                <h3 className="text-[15px] font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Three steps to go live
            </h2>
            <p className="text-lg text-gray-500">No code required. No developers needed.</p>
          </div>
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3 relative">
            {/* Connecting line on desktop */}
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-gradient-to-r from-violet-200 via-violet-300 to-violet-200" />
            {steps.map((s, i) => (
              <div key={s.num} className="relative text-center">
                <div className="relative inline-flex">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 text-white font-bold text-sm shadow-md shadow-violet-200 mb-5 mx-auto">
                    {s.num}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed max-w-xs mx-auto">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              Simple pricing
            </h2>
            <p className="text-lg text-gray-500">Start free. Scale as you grow. No hidden fees.</p>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).map(([key, plan]) => {
              const isPopular = key === 'turbo'
              return (
                <div
                  key={key}
                  className={`relative rounded-2xl bg-white p-6 flex flex-col ${
                    isPopular
                      ? 'border-2 border-violet-600 shadow-lg shadow-violet-100'
                      : 'border border-gray-200'
                  }`}
                >
                  {isPopular && (
                    <div className="absolute -top-3.5 left-0 right-0 flex justify-center">
                      <span className="rounded-full bg-violet-600 px-3 py-0.5 text-xs font-semibold text-white">
                        Most Popular
                      </span>
                    </div>
                  )}

                  <div className="mb-4">
                    <h3 className="text-base font-bold text-gray-900">{plan.name}</h3>
                    <div className="mt-3">
                      {plan.price ? (
                        <div className="flex items-baseline gap-1">
                          <span className="text-3xl font-bold text-gray-900">${plan.price}</span>
                          <span className="text-sm text-gray-400">/mo</span>
                        </div>
                      ) : (
                        <span className="text-3xl font-bold text-gray-900">Custom</span>
                      )}
                    </div>
                  </div>

                  <ul className="space-y-2.5 text-sm text-gray-600 mb-6 flex-1">
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-violet-500 shrink-0 mt-0.5" />
                      {plan.messages_per_month
                        ? `${plan.messages_per_month.toLocaleString()} messages/mo`
                        : 'Unlimited messages'}
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-violet-500 shrink-0 mt-0.5" />
                      {plan.chatbots
                        ? `${plan.chatbots} chatbot${plan.chatbots > 1 ? 's' : ''}`
                        : 'Unlimited chatbots'}
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-4 w-4 text-violet-500 shrink-0 mt-0.5" />
                      {plan.live_chat ? 'Live chat handoff' : 'AI-only chat'}
                    </li>
                    {plan.api_access && (
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-violet-500 shrink-0 mt-0.5" />
                        API access
                      </li>
                    )}
                  </ul>

                  <Link
                    href="/sign-up"
                    className={`block text-center rounded-full py-2.5 text-sm font-semibold transition-colors ${
                      isPopular
                        ? 'bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800 shadow-sm'
                        : 'border border-gray-200 text-gray-700 hover:border-gray-300 hover:bg-gray-50 active:bg-gray-100'
                    }`}
                  >
                    {plan.price ? 'Start Free Trial' : 'Contact Sales'}
                  </Link>
                </div>
              )
            })}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-violet-600 transition-colors"
            >
              Compare all plan features
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-20 sm:py-28 bg-gradient-to-b from-white to-violet-50/60">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            Ready to put your support on autopilot?
          </h2>
          <p className="text-lg text-gray-500 mb-10 leading-relaxed">
            Set up your first chatbot in under five minutes. No credit card, no commitment.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-10 py-3.5 text-[15px] font-semibold text-white hover:bg-violet-700 active:bg-violet-800 transition-colors shadow-sm shadow-violet-200"
            >
              Get Started Free
              <ChevronRight className="h-4 w-4" />
            </Link>
            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center rounded-full border border-gray-200 px-10 py-3.5 text-[15px] font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              View pricing
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
