import Link from 'next/link'
import { MessageSquare, Zap, Shield, BarChart3, Globe, Users, ArrowRight, Check, Code, Clock, Brain, Lock } from 'lucide-react'
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
    title: 'Corrections & Control',
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
    description: 'Set your system prompt, greeting message, and fallback responses. Adjust temperature and model settings.',
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
    <div>
      {/* Hero */}
      <section className="py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-3xl">
            <p className="text-sm font-medium text-blue-600 mb-4 tracking-wide uppercase">AI Customer Support</p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight mb-6">
              Your website deserves a smarter support agent
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 leading-relaxed mb-8 max-w-2xl">
              Build a custom AI chatbot trained on your content. It handles customer questions around the clock so your team can focus on what matters.
            </p>
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <Link
                href="/sign-up"
                className="w-full sm:w-auto text-center rounded-lg bg-gray-900 px-8 py-3 text-base font-medium text-white hover:bg-gray-800 transition"
              >
                Start Free Trial
              </Link>
              <Link
                href="/features"
                className="w-full sm:w-auto text-center rounded-lg border border-gray-300 px-8 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 transition"
              >
                See How It Works
              </Link>
            </div>
            <p className="mt-4 text-sm text-gray-500">No credit card required. 14-day free trial.</p>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="border-y bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 sm:gap-8">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{s.value}</p>
                <p className="text-sm text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to automate support
            </h2>
            <p className="text-lg text-gray-600">
              One platform to build, train, deploy, and manage AI chatbots that work for your business.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border border-gray-200 p-6 hover:border-gray-300 transition">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 mb-4">
                  <f.icon className="h-5 w-5 text-gray-700" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Three steps to go live</h2>
            <p className="text-lg text-gray-600">No code required. No developers needed.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.num}>
                <span className="text-sm font-mono font-bold text-blue-600">{s.num}</span>
                <h3 className="text-lg font-semibold text-gray-900 mt-2 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Widget preview */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 items-center">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Looks native on every site
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Customize colors, position, greeting message, and branding. The widget adapts to your site and works on all devices.
              </p>
              <ul className="space-y-3">
                {['Custom brand colors and logos', 'Light and dark themes', 'Mobile-optimized interface', 'Lead capture forms', 'Voice input support'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gray-100 rounded-2xl p-6 sm:p-8">
              <div className="w-full max-w-sm mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
                <div className="bg-gray-900 p-4 text-white">
                  <p className="font-semibold text-sm">Support Assistant</p>
                  <p className="text-xs text-gray-400 mt-0.5">Online</p>
                </div>
                <div className="p-4 space-y-3">
                  <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-700 max-w-[85%]">
                    Hi there. How can I help you today?
                  </div>
                  <div className="bg-blue-600 rounded-lg p-3 text-sm text-white ml-auto max-w-[85%]">
                    What plans do you offer?
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-700 max-w-[85%]">
                    We have four plans starting at $29/mo. Each includes AI chat, analytics, and lead capture. Want me to walk you through them?
                  </div>
                </div>
                <div className="border-t p-3">
                  <div className="bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-400">
                    Type a message...
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="max-w-2xl mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Simple pricing</h2>
            <p className="text-lg text-gray-600">Start free. Scale as you grow. No hidden fees.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).map(([key, plan]) => (
              <div
                key={key}
                className={`rounded-xl border bg-white p-6 ${key === 'turbo' ? 'border-gray-900 ring-1 ring-gray-900' : 'border-gray-200'}`}
              >
                {key === 'turbo' && (
                  <span className="text-xs font-medium text-gray-900 uppercase tracking-wide">Most Popular</span>
                )}
                <h3 className="text-lg font-bold text-gray-900 mt-1">{plan.name}</h3>
                <div className="mt-3 mb-4">
                  {plan.price ? (
                    <span className="text-3xl font-bold text-gray-900">
                      ${plan.price}<span className="text-base font-normal text-gray-500">/mo</span>
                    </span>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900">Custom</span>
                  )}
                </div>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600 shrink-0" />
                    {plan.messages_per_month ? `${plan.messages_per_month.toLocaleString()} messages/mo` : 'Unlimited messages'}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600 shrink-0" />
                    {plan.chatbots ? `${plan.chatbots} chatbot${plan.chatbots > 1 ? 's' : ''}` : 'Unlimited chatbots'}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-600 shrink-0" />
                    {plan.live_chat ? 'Live chat handoff' : 'AI-only chat'}
                  </li>
                  {plan.api_access && (
                    <li className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-600 shrink-0" />API access
                    </li>
                  )}
                </ul>
                <Link
                  href="/sign-up"
                  className={`block text-center rounded-lg px-4 py-2 text-sm font-medium transition ${
                    key === 'turbo'
                      ? 'bg-gray-900 text-white hover:bg-gray-800'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {plan.price ? 'Start Free Trial' : 'Contact Sales'}
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/pricing" className="text-sm text-gray-600 hover:text-gray-900 inline-flex items-center gap-1">
              See full pricing details <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to put your support on autopilot?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Set up your first chatbot in under five minutes. No credit card, no commitment.
          </p>
          <Link
            href="/sign-up"
            className="inline-block rounded-lg bg-gray-900 px-8 py-3 text-base font-medium text-white hover:bg-gray-800 transition"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  )
}
