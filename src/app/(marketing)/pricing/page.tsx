import Link from 'next/link'
import { Check, X } from 'lucide-react'
import { PLANS, ADDON_MESSAGE_CREDITS } from '@/lib/constants'

const featureRows = [
  { label: 'Monthly messages', key: 'messages_per_month', format: (v: number | null) => v ? v.toLocaleString() : 'Unlimited' },
  { label: 'Chatbots', key: 'chatbots', format: (v: number | null) => v ? String(v) : 'Unlimited' },
  { label: 'Knowledge sources', key: 'knowledge_sources', format: (v: number | null) => v ? String(v) : 'Unlimited' },
  { label: 'Storage', key: 'storage_mb', format: (v: number | null) => v ? `${v >= 1000 ? `${v / 1000} GB` : `${v} MB`}` : 'Unlimited' },
  { label: 'Log retention', key: 'log_retention_days', format: (v: number | null) => v ? `${v} days` : 'Unlimited' },
  { label: 'Live chat handoff', key: 'live_chat', format: (v: boolean) => v },
  { label: 'API access', key: 'api_access', format: (v: boolean) => v },
  { label: 'Remove branding', key: 'remove_branding', format: (v: boolean) => v },
] as const

const faqs = [
  { q: 'Can I switch plans later?', a: 'Yes. Upgrade or downgrade anytime from your dashboard. Changes take effect on your next billing cycle.' },
  { q: 'What happens if I hit my message limit?', a: `Your chatbot will show a fallback message. You can buy additional message credits at $${ADDON_MESSAGE_CREDITS.price} per ${ADDON_MESSAGE_CREDITS.messages.toLocaleString()} messages.` },
  { q: 'Do you offer annual billing?', a: 'Yes. Annual plans get 2 months free. Contact us for details.' },
  { q: 'What counts as a "message"?', a: 'Each user message and AI response counts as one message each. System messages (greetings, handoff notices) are free.' },
  { q: 'Can I cancel anytime?', a: 'Absolutely. No contracts, no cancellation fees. Your chatbots stay active until the end of your billing period.' },
  { q: 'Is there a free trial?', a: 'Every plan starts with a 14-day free trial. No credit card required to start.' },
]

const plans = Object.entries(PLANS) as [string, typeof PLANS[keyof typeof PLANS]][]

export default function PricingPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1 className="text-4xl font-extrabold mb-4">Pricing</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">Simple plans that grow with your business. Start free, upgrade anytime.</p>
        </div>
      </section>

      {/* Plan cards */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {plans.map(([key, plan]) => (
              <div key={key} className={`rounded-xl border bg-white p-6 flex flex-col ${key === 'turbo' ? 'border-blue-600 ring-2 ring-blue-600 relative' : ''}`}>
                {key === 'turbo' && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-blue-600 px-3 py-0.5 text-xs font-semibold text-white">Most Popular</div>
                )}
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <div className="mt-4 mb-6">
                  {plan.price ? (
                    <>
                      <span className="text-4xl font-extrabold text-gray-900">${plan.price}</span>
                      <span className="text-gray-500">/month</span>
                    </>
                  ) : (
                    <span className="text-4xl font-extrabold text-gray-900">Custom</span>
                  )}
                </div>
                <ul className="space-y-3 text-sm text-gray-600 flex-1 mb-6">
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500 shrink-0" />{plan.messages_per_month ? `${plan.messages_per_month.toLocaleString()} messages/mo` : 'Unlimited messages'}</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500 shrink-0" />{plan.chatbots ? `${plan.chatbots} chatbot${plan.chatbots > 1 ? 's' : ''}` : 'Unlimited chatbots'}</li>
                  <li className="flex items-center gap-2"><Check className="h-4 w-4 text-green-500 shrink-0" />{plan.knowledge_sources ? `${plan.knowledge_sources} knowledge sources` : 'Unlimited sources'}</li>
                  <li className="flex items-center gap-2">
                    {plan.live_chat ? <Check className="h-4 w-4 text-green-500 shrink-0" /> : <X className="h-4 w-4 text-gray-300 shrink-0" />}
                    Live chat handoff
                  </li>
                  <li className="flex items-center gap-2">
                    {plan.api_access ? <Check className="h-4 w-4 text-green-500 shrink-0" /> : <X className="h-4 w-4 text-gray-300 shrink-0" />}
                    API access
                  </li>
                  <li className="flex items-center gap-2">
                    {plan.remove_branding ? <Check className="h-4 w-4 text-green-500 shrink-0" /> : <X className="h-4 w-4 text-gray-300 shrink-0" />}
                    Remove branding
                  </li>
                </ul>
                <Link href="/signup" className={`block text-center rounded-lg px-4 py-2.5 text-sm font-semibold transition ${key === 'turbo' ? 'bg-blue-600 text-white hover:bg-blue-700' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  {plan.price ? 'Start Free Trial' : 'Contact Sales'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison table */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Compare plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 pr-4 font-medium text-gray-500">Feature</th>
                  {plans.map(([key, plan]) => (
                    <th key={key} className="text-center py-3 px-4 font-semibold text-gray-900">{plan.name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {featureRows.map((row) => (
                  <tr key={row.label} className="border-b">
                    <td className="py-3 pr-4 text-gray-600">{row.label}</td>
                    {plans.map(([key, plan]) => {
                      const val = plan[row.key as keyof typeof plan]
                      const formatted = row.format(val as never)
                      return (
                        <td key={key} className="text-center py-3 px-4">
                          {typeof formatted === 'boolean' ? (
                            formatted ? <Check className="h-4 w-4 text-green-500 mx-auto" /> : <X className="h-4 w-4 text-gray-300 mx-auto" />
                          ) : (
                            <span className="text-gray-900">{formatted}</span>
                          )}
                        </td>
                      )
                    })}
                  </tr>
                ))}
                <tr className="border-b">
                  <td className="py-3 pr-4 text-gray-600">Channels</td>
                  {plans.map(([key, plan]) => (
                    <td key={key} className="text-center py-3 px-4 text-gray-900">{plan.channels.length === 1 ? 'Web' : `${plan.channels.length} channels`}</td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Add-ons */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-6">Add-ons</h2>
          <div className="max-w-md mx-auto rounded-xl border p-6 text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Extra Message Credits</h3>
            <p className="text-3xl font-extrabold text-gray-900 mb-1">${ADDON_MESSAGE_CREDITS.price}</p>
            <p className="text-sm text-gray-500 mb-4">per {ADDON_MESSAGE_CREDITS.messages.toLocaleString()} messages</p>
            <p className="text-sm text-gray-600">Buy as many as you need. Credits never expire and stack on top of your plan.</p>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="bg-gray-50 py-16">
        <div className="mx-auto max-w-3xl px-6">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Frequently asked questions</h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="font-semibold text-gray-900 mb-1">{faq.q}</h3>
                <p className="text-sm text-gray-600">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to get started?</h2>
          <p className="text-lg text-gray-600 mb-8">14-day free trial on every plan. No credit card required.</p>
          <Link href="/signup" className="inline-block rounded-lg bg-blue-600 px-8 py-3 text-base font-semibold text-white hover:bg-blue-700 transition">
            Start Your Free Trial
          </Link>
        </div>
      </section>
    </div>
  )
}
