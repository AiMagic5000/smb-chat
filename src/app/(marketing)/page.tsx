import Link from 'next/link'
import { Bot, MessageSquare, Zap, Shield, BarChart3, Globe, Users, ArrowRight, Check } from 'lucide-react'
import { PLANS } from '@/lib/constants'

const features = [
  { icon: MessageSquare, title: 'AI-Powered Chat', description: 'Train your chatbot on your website, docs, and files. It answers customer questions 24/7 with accurate, on-brand responses.' },
  { icon: Zap, title: 'Instant Setup', description: 'Go from signup to live chatbot in under 5 minutes. Paste your website URL and we handle the rest.' },
  { icon: Shield, title: 'Human Handoff', description: 'Seamlessly transfer complex conversations to your team with full context preserved.' },
  { icon: BarChart3, title: 'Analytics Dashboard', description: 'Track conversations, satisfaction scores, popular topics, and usage patterns in real time.' },
  { icon: Globe, title: 'Multi-Channel', description: 'Deploy across your website, WhatsApp, Messenger, Instagram, and Discord from one dashboard.' },
  { icon: Users, title: 'Lead Capture', description: 'Collect visitor emails and phone numbers before or during chat. Every lead flows into your CRM.' },
]

const steps = [
  { step: '1', title: 'Add Your Content', description: 'Paste URLs, upload PDFs, or type FAQs. Our AI processes and indexes everything.' },
  { step: '2', title: 'Customize Your Bot', description: 'Set your brand colors, greeting message, and personality. Make it yours.' },
  { step: '3', title: 'Embed & Go Live', description: 'Copy one line of code to your site. Your AI chatbot is live in seconds.' },
]

export default function LandingPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white">
        <div className="mx-auto max-w-6xl px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-sm font-medium mb-8">
            <Zap className="h-4 w-4" /> Now with GPT-4o support
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl mb-6">
            Custom AI Chatbots<br />for Your Business
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-blue-100 mb-10">
            Train a chatbot on your website content, documents, and FAQs. Deploy it anywhere in minutes. Answer customer questions 24/7 without lifting a finger.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/signup" className="rounded-lg bg-white px-8 py-3 text-base font-semibold text-blue-700 hover:bg-blue-50 transition">
              Start Free Trial
            </Link>
            <Link href="/features" className="rounded-lg border border-white/30 px-8 py-3 text-base font-semibold text-white hover:bg-white/10 transition">
              See Features
            </Link>
          </div>
          <p className="mt-4 text-sm text-blue-200">No credit card required. 14-day free trial.</p>
        </div>
      </section>

      {/* Social proof */}
      <section className="border-b bg-gray-50 py-8">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <p className="text-sm text-gray-500 mb-4">Trusted by small businesses everywhere</p>
          <div className="flex items-center justify-center gap-12 text-gray-400">
            <span className="text-lg font-semibold">500+ Chatbots</span>
            <span className="text-lg font-semibold">2M+ Messages</span>
            <span className="text-lg font-semibold">98% Uptime</span>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything you need to automate support</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">One platform to build, deploy, and manage AI chatbots that actually help your customers.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <div key={f.title} className="rounded-xl border p-6 hover:shadow-md transition">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 mb-4">
                  <f.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-50 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Live in 3 steps</h2>
            <p className="text-lg text-gray-600">No coding required. No developers needed.</p>
          </div>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-600 text-white text-xl font-bold mb-4">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-600">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section className="py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-lg text-gray-600">Start free. Upgrade when you grow.</p>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {(Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]).map(([key, plan]) => (
              <div key={key} className={`rounded-xl border p-6 ${key === 'turbo' ? 'border-blue-600 ring-2 ring-blue-600' : ''}`}>
                {key === 'turbo' && <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">Most Popular</span>}
                <h3 className="text-lg font-bold text-gray-900 mt-1">{plan.name}</h3>
                <div className="mt-3 mb-4">
                  {plan.price ? (
                    <span className="text-3xl font-extrabold text-gray-900">${plan.price}<span className="text-base font-normal text-gray-500">/mo</span></span>
                  ) : (
                    <span className="text-3xl font-extrabold text-gray-900">Custom</span>
                  )}
                </div>
                <ul className="space-y-2 text-sm text-gray-600 mb-6">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" />{plan.messages_per_month ? `${plan.messages_per_month.toLocaleString()} messages/mo` : 'Unlimited messages'}</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" />{plan.chatbots ? `${plan.chatbots} chatbot${plan.chatbots > 1 ? 's' : ''}` : 'Unlimited chatbots'}</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" />{plan.live_chat ? 'Live chat handoff' : 'AI-only chat'}</li>
                  {plan.api_access && <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500" />API access</li>}
                </ul>
                <Link href="/signup" className={`block text-center rounded-lg px-4 py-2 text-sm font-medium transition ${key === 'turbo' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border text-gray-700 hover:bg-gray-50'}`}>
                  {plan.price ? 'Start Free Trial' : 'Contact Sales'}
                </Link>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link href="/pricing" className="text-sm text-blue-600 hover:underline inline-flex items-center gap-1">
              See full pricing details <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to automate your customer support?</h2>
          <p className="text-lg text-blue-100 mb-8">Join hundreds of businesses already using SMB Chat to handle support around the clock.</p>
          <Link href="/signup" className="inline-block rounded-lg bg-white px-8 py-3 text-base font-semibold text-blue-700 hover:bg-blue-50 transition">
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  )
}
