'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronDown, ChevronRight } from 'lucide-react'

interface TocSection {
  id: string
  label: string
}

interface TocCategory {
  label: string
  color: string
  activeBg: string
  hoverBg: string
  dotBg: string
  href: string
  sections: TocSection[]
}

const TOC: TocCategory[] = [
  {
    label: 'Terms of Service',
    color: 'text-blue-600',
    activeBg: 'bg-blue-50 border-blue-200',
    hoverBg: 'hover:bg-blue-50/60',
    dotBg: 'bg-blue-500',
    href: '/legal/terms',
    sections: [
      { id: 'service-description', label: 'Service Description' },
      { id: 'account-registration', label: 'Account Registration' },
      { id: 'subscription-billing', label: 'Subscription & Billing' },
      { id: 'acceptable-use', label: 'Acceptable Use' },
      { id: 'intellectual-property', label: 'Intellectual Property' },
      { id: 'data-processing-storage', label: 'Data Processing & Storage' },
      { id: 'service-availability', label: 'Service Availability & SLA' },
      { id: 'limitation-liability', label: 'Limitation of Liability' },
      { id: 'indemnification', label: 'Indemnification' },
      { id: 'termination', label: 'Termination' },
      { id: 'dispute-resolution', label: 'Dispute Resolution' },
      { id: 'governing-law', label: 'Governing Law' },
      { id: 'international-users', label: 'International Users' },
      { id: 'modifications', label: 'Modifications to Terms' },
    ],
  },
  {
    label: 'Privacy Policy',
    color: 'text-emerald-600',
    activeBg: 'bg-emerald-50 border-emerald-200',
    hoverBg: 'hover:bg-emerald-50/60',
    dotBg: 'bg-emerald-500',
    href: '/legal/privacy',
    sections: [
      { id: 'info-we-collect', label: 'Information We Collect' },
      { id: 'how-we-use-info', label: 'How We Use Information' },
      { id: 'data-sharing', label: 'Data Sharing & Third Parties' },
      { id: 'data-retention', label: 'Data Retention' },
      { id: 'security-measures', label: 'Security Measures' },
      { id: 'user-rights', label: 'User Rights' },
      { id: 'childrens-privacy', label: "Children's Privacy" },
      { id: 'international-transfers', label: 'International Data Transfers' },
      { id: 'gdpr', label: 'GDPR Compliance' },
      { id: 'ccpa', label: 'CCPA Compliance' },
      { id: 'lgpd', label: 'LGPD Compliance' },
      { id: 'pipeda', label: 'PIPEDA Compliance' },
      { id: 'australian-privacy', label: 'Australian Privacy Act' },
      { id: 'cookie-policy', label: 'Cookie Policy' },
      { id: 'do-not-track', label: 'Do Not Track Signals' },
      { id: 'privacy-contact', label: 'Contact Information' },
    ],
  },
  {
    label: 'Data Processing',
    color: 'text-amber-600',
    activeBg: 'bg-amber-50 border-amber-200',
    hoverBg: 'hover:bg-amber-50/60',
    dotBg: 'bg-amber-500',
    href: '/legal/data-processing',
    sections: [
      { id: 'dpa-definitions', label: 'Definitions' },
      { id: 'dpa-scope', label: 'Scope & Purpose' },
      { id: 'controller-processor', label: 'Controller & Processor Obligations' },
      { id: 'sub-processors', label: 'Sub-Processors' },
      { id: 'dpa-security', label: 'Data Security Measures' },
      { id: 'breach-notification', label: 'Breach Notification' },
      { id: 'data-subject-requests', label: 'Data Subject Requests' },
      { id: 'cross-border-transfers', label: 'Cross-Border Transfers' },
      { id: 'audit-rights', label: 'Audit Rights' },
      { id: 'dpa-term', label: 'Term & Termination' },
    ],
  },
  {
    label: 'Biometric Data',
    color: 'text-red-600',
    activeBg: 'bg-red-50 border-red-200',
    hoverBg: 'hover:bg-red-50/60',
    dotBg: 'bg-red-500',
    href: '/legal/biometric',
    sections: [
      { id: 'bio-what-we-collect', label: 'What We Collect' },
      { id: 'bio-purpose', label: 'Purpose of Collection' },
      { id: 'bio-storage', label: 'Storage & Retention' },
      { id: 'bio-consent', label: 'Consent Mechanisms' },
      { id: 'bipa', label: 'Illinois BIPA Compliance' },
      { id: 'texas-cubi', label: 'Texas CUBI Compliance' },
      { id: 'washington-biometric', label: 'Washington Biometric Law' },
      { id: 'other-state-laws', label: 'Other State Laws' },
      { id: 'bio-user-rights', label: 'User Rights' },
      { id: 'bio-deletion', label: 'Deletion Procedures' },
    ],
  },
  {
    label: 'Acceptable Use',
    color: 'text-violet-600',
    activeBg: 'bg-violet-50 border-violet-200',
    hoverBg: 'hover:bg-violet-50/60',
    dotBg: 'bg-violet-500',
    href: '/legal/acceptable-use',
    sections: [
      { id: 'prohibited-content', label: 'Prohibited Content' },
      { id: 'prohibited-activities', label: 'Prohibited Activities' },
      { id: 'rate-limiting', label: 'Rate Limiting & Fair Use' },
      { id: 'api-usage', label: 'API Usage Guidelines' },
      { id: 'reporting-violations', label: 'Reporting Violations' },
      { id: 'enforcement', label: 'Enforcement & Consequences' },
    ],
  },
]

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState<string>('')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set())
  const observerRef = useRef<IntersectionObserver | null>(null)

  const activeCategory = TOC.find((cat) => cat.href === pathname)

  // Auto-expand the current page category
  useEffect(() => {
    if (activeCategory) {
      setExpandedCategories((prev) => {
        const next = new Set(prev)
        next.add(activeCategory.label)
        return next
      })
    }
  }, [activeCategory])

  // Intersection observer for scroll spy
  useEffect(() => {
    if (!activeCategory) return

    const sectionIds = activeCategory.sections.map((s) => s.id)

    if (observerRef.current) {
      observerRef.current.disconnect()
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

        if (visible.length > 0) {
          setActiveSection(visible[0].target.id)
        }
      },
      { rootMargin: '-80px 0px -60% 0px', threshold: 0 }
    )

    observerRef.current = observer

    // Small delay to let the page render section IDs
    const timer = setTimeout(() => {
      sectionIds.forEach((id) => {
        const el = document.getElementById(id)
        if (el) observer.observe(el)
      })
    }, 100)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
    }
  }, [pathname, activeCategory])

  useEffect(() => {
    setMobileOpen(false)
  }, [pathname])

  const toggleCategory = useCallback((label: string) => {
    setExpandedCategories((prev) => {
      const next = new Set(prev)
      if (next.has(label)) {
        next.delete(label)
      } else {
        next.add(label)
      }
      return next
    })
  }, [])

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id)
    if (el) {
      const yOffset = -88
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset
      window.scrollTo({ top: y, behavior: 'smooth' })
      setActiveSection(id)
      setMobileOpen(false)
    }
  }, [])

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex gap-8 lg:gap-12">

        {/* Desktop sidebar */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24">
            <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
              Legal Documents
            </h2>
            <nav className="space-y-1">
              {TOC.map((cat) => {
                const isActive = cat.href === pathname
                const isExpanded = expandedCategories.has(cat.label)

                return (
                  <div key={cat.label}>
                    <div className="flex items-center">
                      <Link
                        href={cat.href}
                        className={`flex-1 flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? `${cat.activeBg} ${cat.color} border`
                            : `text-gray-600 ${cat.hoverBg} border border-transparent`
                        }`}
                      >
                        <span className={`h-2 w-2 rounded-full shrink-0 ${cat.dotBg}`} />
                        {cat.label}
                      </Link>
                      <button
                        onClick={() => toggleCategory(cat.label)}
                        className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label={isExpanded ? 'Collapse' : 'Expand'}
                      >
                        {isExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>

                    {isExpanded && isActive && (
                      <div className="ml-5 pl-3 border-l border-gray-200 mt-1 mb-2 space-y-0.5">
                        {cat.sections.map((section) => (
                          <button
                            key={section.id}
                            onClick={() => scrollToSection(section.id)}
                            className={`block w-full text-left px-2.5 py-1.5 text-[13px] rounded-md transition-colors ${
                              activeSection === section.id
                                ? `${cat.color} font-medium bg-gray-50`
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {section.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
        </aside>

        {/* Mobile TOC toggle */}
        <div className="lg:hidden fixed bottom-4 right-4 z-40">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center gap-2 rounded-full bg-gray-900 px-4 py-3 text-sm font-medium text-white shadow-lg hover:bg-gray-800 transition-colors"
          >
            <span className="h-2 w-2 rounded-full bg-violet-400" />
            Table of Contents
            {mobileOpen ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Mobile TOC panel */}
        {mobileOpen && (
          <>
            <div
              className="lg:hidden fixed inset-0 bg-black/30 z-40"
              onClick={() => setMobileOpen(false)}
            />
            <div className="lg:hidden fixed bottom-16 right-4 z-50 w-72 max-h-[70vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-gray-200 p-4">
              <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                Legal Documents
              </h3>
              <nav className="space-y-1">
                {TOC.map((cat) => {
                  const isActive = cat.href === pathname
                  return (
                    <div key={cat.label}>
                      <Link
                        href={cat.href}
                        className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? `${cat.activeBg} ${cat.color} border`
                            : `text-gray-600 ${cat.hoverBg} border border-transparent`
                        }`}
                        onClick={() => setMobileOpen(false)}
                      >
                        <span className={`h-2 w-2 rounded-full shrink-0 ${cat.dotBg}`} />
                        {cat.label}
                      </Link>
                      {isActive && (
                        <div className="ml-5 pl-3 border-l border-gray-200 mt-1 mb-2 space-y-0.5">
                          {cat.sections.map((section) => (
                            <button
                              key={section.id}
                              onClick={() => scrollToSection(section.id)}
                              className={`block w-full text-left px-2.5 py-1.5 text-[13px] rounded-md transition-colors ${
                                activeSection === section.id
                                  ? `${cat.color} font-medium bg-gray-50`
                                  : 'text-gray-500 hover:text-gray-700'
                              }`}
                            >
                              {section.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </nav>
            </div>
          </>
        )}

        {/* Main content */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  )
}
