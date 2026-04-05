import Link from 'next/link'
import { MessageSquare, Zap, Shield, BarChart3, Globe, Users, ArrowRight, Check, Code, Brain, Lock } from 'lucide-react'
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
      {/* Hero - Centered like Wollo */}
      <section className="py-20 sm:py-28 lg:py-36">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-6">
            Automate Your Customer Support
          </h1>
          <p className="text-lg sm:text-xl text-gray-500 leading-relaxed mb-10 max-w-2xl mx-auto">
            Build an AI chatbot trained on your content. It handles questions around the clock so your team can focus on what matters.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/sign-up"
              className="w-full sm:w-auto text-center rounded-full bg-violet-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-violet-700 transition shadow-sm"
            >
              Start Free Trial
            </Link>
            <Link
              href="/sign-up"
              className="w-full sm:w-auto text-center rounded-full border border-gray-300 px-8 py-3.5 text-base font-semibold text-gray-700 hover:bg-gray-50 transition"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

      {/* Widget preview illustration */}
      <section className="pb-16 sm:pb-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="relative rounded-3xl bg-gradient-to-br from-violet-600 via-violet-500 to-indigo-500 p-6 sm:p-10 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]" />
            <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">See it in action</h2>
                <p className="text-violet-100 text-base leading-relaxed mb-6">
                  A fully customizable chat widget that matches your brand. Set colors, greeting messages, lead capture forms, and more.
                </p>
                <Link
                  href="/features"
                  className="inline-flex items-center gap-2 text-white font-semibold hover:underline"
                >
                  Explore features <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mx-auto w-full max-w-sm">
                <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <div className="bg-gray-900 p-4 text-white">
                    <p className="font-semibold text-sm">Support Assistant</p>
                    <p className="text-xs text-gray-400 mt-0.5">Online</p>
                  </div>
                  <div className="p-4 space-y-3">
                    <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-700 max-w-[85%]">
                      Hi there! How can I help you today?
                    </div>
                    <div className="bg-violet-600 rounded-lg p-3 text-sm text-white ml-auto max-w-[85%]">
                      What plans do you offer?
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-700 max-w-[85%]">
                      We have four plans starting at $29/mo. Want me to walk you through them?
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
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Everything you need to automate support
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              One platform to build, train, deploy, and manage AI chatbots that work for your business.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-2xl border border-gray-200 p-6 hover:border-violet-300 hover:shadow-sm transition">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 mb-4">
                  <f.icon className="h-5 w-5 text-violet-600" />
                </div>
                <h3 className="text-base font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Three steps to go live</h2>
            <p className="text-lg text-gray-500">No code required. No developers needed.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.num} className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-violet-100 text-violet-600 font-bold text-sm mb-4">
                  {s.num}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Simple pricing</h2>
            <p className="text-lg text-gray-500">Start free. Scale as you grow. No hidden fees.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).map(([key, plan]) => (
              <div
                key={key}
                className={`rounded-2xl border bg-white p-6 ${key === 'turbo' ? 'border-violet-600 ring-2 ring-violet-600 relative' : 'border-gray-200'}`}
              >
                {key === 'turbo' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-violet-600 px-3 py-0.5 text-xs font-semibold text-white">
                    Most Popular
                  </div>
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
                  className={`block text-center rounded-full px-4 py-2.5 text-sm font-semibold transition ${
                    key === 'turbo'
                      ? 'bg-violet-600 text-white hover:bg-violet-700'
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {plan.price ? 'Start Free Trial' : 'Contact Sales'}
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/pricing" className="text-sm text-gray-500 hover:text-gray-900 inline-flex items-center gap-1">
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
          <p className="text-lg text-gray-500 mb-8">
            Set up your first chatbot in under five minutes. No credit card, no commitment.
          </p>
          <Link
            href="/sign-up"
            className="inline-block rounded-full bg-violet-600 px-10 py-3.5 text-base font-semibold text-white hover:bg-violet-700 transition shadow-sm"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  )
}
