import Link from 'next/link'
import {
  MessageSquare, Zap, Shield, BarChart3, Globe, Users,
  FileText, Code, Palette, Brain, RefreshCw, Headphones,
  Lock, Database, Webhook, Bot
} from 'lucide-react'

const categories = [
  {
    title: 'AI & Chat',
    features: [
      { icon: Brain, title: 'RAG-Powered Answers', description: 'Your chatbot retrieves relevant content from your knowledge base using vector search, then generates accurate answers grounded in your actual data.' },
      { icon: MessageSquare, title: 'Conversation Memory', description: 'The AI remembers context within each conversation. Follow-up questions work naturally without repeating information.' },
      { icon: Bot, title: 'Multiple AI Models', description: 'Choose between GPT-4o, GPT-4o Mini, or GPT-3.5 Turbo. Pick the right balance of quality and cost for your use case.' },
      { icon: RefreshCw, title: 'AI Corrections', description: 'When the AI gets something wrong, flag it. Review and approve corrections that improve future responses.' },
    ],
  },
  {
    title: 'Knowledge Base',
    features: [
      { icon: Globe, title: 'Website Crawling', description: 'Paste any URL and we automatically extract, chunk, and index the content. Keep it fresh with one-click recrawling.' },
      { icon: FileText, title: 'File Upload', description: 'Upload PDFs, Word docs, and text files. We process them into searchable chunks your chatbot can reference.' },
      { icon: Database, title: 'Vector Search', description: 'Content is embedded as 1536-dimension vectors using OpenAI embeddings. Queries find the most relevant chunks via cosine similarity.' },
      { icon: Zap, title: 'Smart Chunking', description: 'Documents are split at natural paragraph boundaries with overlap, so context is never lost at chunk edges.' },
    ],
  },
  {
    title: 'Widget & Deployment',
    features: [
      { icon: Palette, title: 'Full Customization', description: 'Set colors, position, greeting message, avatar, and more. The widget matches your brand perfectly.' },
      { icon: Code, title: 'One-Line Embed', description: 'A single script tag is all you need. Works on any website -- WordPress, Shopify, Webflow, custom HTML, or any platform.' },
      { icon: Users, title: 'Lead Capture', description: 'Collect name, email, and phone before or during chat. Every visitor becomes a contact in your dashboard.' },
      { icon: Shield, title: 'Rate Limiting', description: 'Built-in protection against abuse. Set limits per visitor per chatbot to keep costs predictable.' },
    ],
  },
  {
    title: 'Live Chat & Support',
    features: [
      { icon: Headphones, title: 'Human Handoff', description: 'Visitors can request a live agent at any time. Your team sees the full conversation history and can jump in instantly.' },
      { icon: MessageSquare, title: 'Ticket System', description: 'Create support tickets from conversations. Track status, assign priority, and never lose a customer issue.' },
      { icon: BarChart3, title: 'Satisfaction Tracking', description: 'Visitors rate individual AI responses. Negative feedback auto-creates correction entries for your review.' },
      { icon: Lock, title: 'Transcript Emails', description: 'When a conversation ends, optionally email the full transcript to your team or the visitor.' },
    ],
  },
  {
    title: 'Analytics & API',
    features: [
      { icon: BarChart3, title: 'Real-Time Dashboard', description: 'Track total sessions, messages, response accuracy, and popular topics. See exactly what your customers are asking.' },
      { icon: Webhook, title: 'REST API', description: 'Full API access on Turbo and Enterprise plans. Integrate chatbot conversations into your existing systems and workflows.' },
      { icon: Lock, title: 'API Key Management', description: 'Generate and revoke API keys from your dashboard. Keys are hashed at rest for security.' },
      { icon: Globe, title: 'Multi-Channel (coming soon)', description: 'Deploy the same chatbot across WhatsApp, Messenger, Instagram, and Discord. Manage everything from one place.' },
    ],
  },
]

export default function FeaturesPage() {
  return (
    <div>
      <section className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white py-16">
        <div className="mx-auto max-w-6xl px-6 text-center">
          <h1 className="text-4xl font-extrabold mb-4">Features</h1>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">Everything you need to build, deploy, and manage AI chatbots that deliver real results for your business.</p>
        </div>
      </section>

      {categories.map((cat) => (
        <section key={cat.title} className="py-16 odd:bg-white even:bg-gray-50">
          <div className="mx-auto max-w-6xl px-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">{cat.title}</h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {cat.features.map((f) => (
                <div key={f.title} className="flex gap-4 rounded-xl border bg-white p-6">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100">
                    <f.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">{f.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{f.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* CTA */}
      <section className="bg-blue-600 py-16">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">See it in action</h2>
          <p className="text-lg text-blue-100 mb-8">Create your first chatbot in under 5 minutes. No credit card required.</p>
          <Link href="/signup" className="inline-block rounded-lg bg-white px-8 py-3 text-base font-semibold text-blue-700 hover:bg-blue-50 transition">
            Start Free Trial
          </Link>
        </div>
      </section>
    </div>
  )
}
