import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service - SMB Chat',
  description: 'Terms of Service for SMB Chat, an AI chatbot platform by Start My Business Inc.',
}

export default function TermsPage() {
  return (
    <article className="prose prose-gray max-w-none prose-headings:scroll-mt-24">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Terms of Service</h1>
        <p className="text-sm text-gray-500">
          Effective Date: April 5, 2026 | Last Updated: April 5, 2026
        </p>
      </div>

      <p>
        These Terms of Service ("Terms") govern your access to and use of SMB Chat ("Service"), operated by
        Start My Business Inc. ("Company," "we," "us," or "our"). By creating an account or using the Service,
        you agree to these Terms in full. If you do not agree, do not use the Service.
      </p>

      {/* 1. Service Description */}
      <section id="service-description">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">1. Service Description</h2>
        <p>
          SMB Chat is a software-as-a-service ("SaaS") platform that allows businesses to build, train, and
          deploy AI-powered chatbots. The Service includes:
        </p>
        <ul>
          <li>A web-based dashboard for creating and managing chatbots</li>
          <li>AI training tools that index your content (websites, documents, FAQs) to generate responses</li>
          <li>Embeddable chat widgets for deployment on third-party websites</li>
          <li>Conversation analytics and lead capture tools</li>
          <li>Live chat handoff to human operators (on eligible plans)</li>
          <li>Voice chat capabilities (on eligible plans)</li>
          <li>API access for programmatic integration (on eligible plans)</li>
        </ul>
        <p>
          We reserve the right to modify, suspend, or discontinue any part of the Service at any time, with
          reasonable notice where practicable.
        </p>
      </section>

      {/* 2. Account Registration */}
      <section id="account-registration">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">2. Account Registration & Eligibility</h2>
        <p>To use the Service, you must:</p>
        <ul>
          <li>Be at least 18 years old or the age of majority in your jurisdiction</li>
          <li>Provide accurate, complete registration information</li>
          <li>Maintain the security of your account credentials</li>
          <li>Have legal authority to bind the entity you represent (if applicable)</li>
        </ul>
        <p>
          You are responsible for all activity under your account. Notify us immediately at{' '}
          <a href="mailto:legal@smbchat.com" className="text-violet-600 hover:text-violet-700">
            legal@smbchat.com
          </a>{' '}
          if you suspect unauthorized access.
        </p>
        <p>
          We may refuse registration, suspend, or terminate accounts at our discretion if we believe
          these Terms have been violated or if required by law.
        </p>
      </section>

      {/* 3. Subscription & Billing */}
      <section id="subscription-billing">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">3. Subscription Plans & Billing</h2>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.1 Plans</h3>
        <p>
          The Service offers multiple subscription tiers with varying features and usage limits. Plan details,
          including pricing, message limits, and feature availability, are listed on our pricing page and may
          change with 30 days' notice.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.2 Free Trial</h3>
        <p>
          New accounts may receive a free trial period. At the end of the trial, you must select a paid plan to
          continue using the Service. We will not charge you without your explicit authorization.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.3 Billing</h3>
        <p>
          Paid subscriptions are billed monthly or annually in advance via Stripe. All fees are quoted in US
          dollars unless stated otherwise. You authorize us to charge the payment method on file for recurring
          subscription fees.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.4 Refunds</h3>
        <p>
          Subscription fees are non-refundable except where required by applicable law. If you cancel mid-cycle,
          you retain access through the end of the current billing period.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.5 Overage</h3>
        <p>
          If your usage exceeds plan limits (message count, chatbot count, or storage), we may throttle the
          Service, prompt you to upgrade, or charge overage fees as specified in your plan terms.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.6 Taxes</h3>
        <p>
          You are responsible for all applicable taxes. If we are required to collect taxes, they will be added to
          your invoice.
        </p>
      </section>

      {/* 4. Acceptable Use */}
      <section id="acceptable-use">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">4. Acceptable Use</h2>
        <p>
          Your use of the Service is subject to our{' '}
          <a href="/legal/acceptable-use" className="text-violet-600 hover:text-violet-700">
            Acceptable Use Policy
          </a>
          , which is incorporated into these Terms by reference. You agree not to use the Service to:
        </p>
        <ul>
          <li>Violate any applicable law or regulation</li>
          <li>Infringe third-party intellectual property rights</li>
          <li>Transmit malware, spam, or harmful content</li>
          <li>Impersonate any person or entity</li>
          <li>Attempt to reverse-engineer, decompile, or extract the source code of the Service</li>
          <li>Circumvent usage limits, rate limits, or security measures</li>
          <li>Train competing AI models using our outputs</li>
          <li>Generate content that violates applicable laws regarding harassment, threats, or discrimination</li>
        </ul>
      </section>

      {/* 5. Intellectual Property */}
      <section id="intellectual-property">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">5. Intellectual Property</h2>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.1 Our IP</h3>
        <p>
          The Service, including its software, design, branding, documentation, and AI models, is owned by Start
          My Business Inc. and protected by copyright, trademark, and other intellectual property laws. Nothing in
          these Terms grants you ownership rights in the Service.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.2 Your Content</h3>
        <p>
          You retain ownership of all content you upload to the Service ("Your Content"). By uploading content,
          you grant us a limited, non-exclusive, worldwide license to process, store, and use Your Content solely
          to operate and improve the Service on your behalf.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.3 AI-Generated Output</h3>
        <p>
          Chatbot responses generated by the Service ("Output") are derived from Your Content and our AI models.
          You may use Output for your business purposes. We do not claim ownership of Output, but we make no
          guarantee of its accuracy, completeness, or fitness for any particular purpose.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.4 Feedback</h3>
        <p>
          If you submit suggestions, ideas, or feedback about the Service, you grant us a perpetual, irrevocable,
          royalty-free license to use that feedback without obligation to you.
        </p>
      </section>

      {/* 6. Data Processing & Storage */}
      <section id="data-processing-storage">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">6. Data Processing & Storage</h2>
        <p>
          Our handling of personal data is governed by our{' '}
          <a href="/legal/privacy" className="text-violet-600 hover:text-violet-700">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="/legal/data-processing" className="text-violet-600 hover:text-violet-700">
            Data Processing Agreement
          </a>
          .
        </p>
        <p>
          You are responsible for ensuring that your use of the Service complies with data protection laws
          applicable to your business and your end users. If you process personal data of EU residents through
          the Service, you must enter into our Data Processing Agreement.
        </p>
        <p>
          We store data on servers located in the United States. If you operate in a jurisdiction with data
          localization requirements, it is your responsibility to assess whether the Service meets those
          requirements.
        </p>
      </section>

      {/* 7. Service Availability & SLA */}
      <section id="service-availability">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">7. Service Availability & SLA</h2>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">7.1 Uptime Target</h3>
        <p>
          We target 99.9% monthly uptime for the core Service (dashboard and chatbot widget delivery). This
          target excludes scheduled maintenance and force majeure events.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">7.2 Maintenance</h3>
        <p>
          We perform scheduled maintenance during low-traffic periods and will provide at least 24 hours' notice
          for planned downtime. Emergency maintenance may occur without advance notice.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">7.3 No Guarantee</h3>
        <p>
          The Service is provided "as is." While we work to maintain high availability, we do not guarantee
          uninterrupted or error-free service. We are not liable for losses resulting from downtime.
        </p>
      </section>

      {/* 8. Limitation of Liability */}
      <section id="limitation-liability">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">8. Limitation of Liability</h2>
        <p>
          TO THE MAXIMUM EXTENT PERMITTED BY LAW, START MY BUSINESS INC., ITS OFFICERS, DIRECTORS, EMPLOYEES,
          AND AGENTS SHALL NOT BE LIABLE FOR:
        </p>
        <ul>
          <li>Any indirect, incidental, special, consequential, or punitive damages</li>
          <li>Loss of profits, revenue, data, or business opportunities</li>
          <li>Costs of procuring substitute services</li>
          <li>Damages arising from unauthorized access to your account or data</li>
        </ul>
        <p>
          OUR TOTAL AGGREGATE LIABILITY FOR ALL CLAIMS ARISING FROM OR RELATED TO THE SERVICE SHALL NOT EXCEED
          THE GREATER OF (A) THE AMOUNT YOU PAID US IN THE 12 MONTHS PRECEDING THE CLAIM OR (B) ONE HUNDRED
          US DOLLARS ($100).
        </p>
        <p>
          These limitations apply regardless of the legal theory (contract, tort, strict liability, or otherwise)
          and even if we have been advised of the possibility of such damages.
        </p>
      </section>

      {/* 9. Indemnification */}
      <section id="indemnification">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">9. Indemnification</h2>
        <p>
          You agree to indemnify, defend, and hold harmless Start My Business Inc. and its officers, directors,
          employees, and agents from any claims, damages, losses, liabilities, and expenses (including reasonable
          attorneys' fees) arising from:
        </p>
        <ul>
          <li>Your use of the Service</li>
          <li>Your Content or the content your chatbots generate for your end users</li>
          <li>Your violation of these Terms</li>
          <li>Your violation of any applicable law or third-party rights</li>
          <li>Any dispute between you and your end users related to the Service</li>
        </ul>
      </section>

      {/* 10. Termination */}
      <section id="termination">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">10. Termination</h2>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.1 By You</h3>
        <p>
          You may cancel your subscription at any time through your account dashboard. Cancellation takes effect
          at the end of the current billing period. You may request deletion of your account and data by emailing{' '}
          <a href="mailto:legal@smbchat.com" className="text-violet-600 hover:text-violet-700">
            legal@smbchat.com
          </a>
          .
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.2 By Us</h3>
        <p>
          We may suspend or terminate your access immediately if you breach these Terms, engage in fraudulent
          activity, or fail to pay fees when due. We may also terminate accounts that remain inactive for more
          than 12 months.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.3 Effect of Termination</h3>
        <p>
          Upon termination, your right to use the Service ends immediately. We will retain your data for up to
          30 days to allow export, after which it will be permanently deleted unless retention is required by law.
          Sections 5, 8, 9, 11, and 12 survive termination.
        </p>
      </section>

      {/* 11. Dispute Resolution */}
      <section id="dispute-resolution">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">11. Dispute Resolution</h2>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">11.1 Informal Resolution</h3>
        <p>
          Before filing any formal claim, you agree to attempt to resolve disputes by contacting us at{' '}
          <a href="mailto:legal@smbchat.com" className="text-violet-600 hover:text-violet-700">
            legal@smbchat.com
          </a>
          . We will work in good faith to resolve the matter within 30 days.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">11.2 Binding Arbitration</h3>
        <p>
          If informal resolution fails, disputes shall be resolved through binding arbitration administered by the
          American Arbitration Association ("AAA") under its Commercial Arbitration Rules. The arbitration will
          take place in the state where Start My Business Inc. maintains its principal office, or remotely at your
          election.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">11.3 Class Action Waiver</h3>
        <p>
          You agree that any dispute resolution proceedings will be conducted on an individual basis, not as a
          class action, collective action, or representative action. You waive any right to participate in class
          actions against us.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">11.4 Exceptions</h3>
        <p>
          Either party may seek injunctive relief in court for intellectual property infringement or unauthorized
          access to the Service. Small claims court is available where permitted.
        </p>
      </section>

      {/* 12. Governing Law */}
      <section id="governing-law">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">12. Governing Law</h2>
        <p>
          These Terms are governed by and construed in accordance with the laws of the State of Delaware, United
          States, without regard to conflict-of-law principles. Any legal action not subject to arbitration shall
          be brought in the state or federal courts located in Delaware.
        </p>
      </section>

      {/* 13. International Users */}
      <section id="international-users">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">13. International Users</h2>
        <p>
          The Service is operated from the United States. If you access the Service from outside the United States,
          you do so at your own risk and are responsible for compliance with local laws.
        </p>
        <p>
          For users in the European Economic Area ("EEA"), United Kingdom, or other regions with specific data
          protection regulations, additional provisions in our{' '}
          <a href="/legal/privacy" className="text-violet-600 hover:text-violet-700">
            Privacy Policy
          </a>{' '}
          and{' '}
          <a href="/legal/data-processing" className="text-violet-600 hover:text-violet-700">
            Data Processing Agreement
          </a>{' '}
          apply.
        </p>
        <p>
          We do not represent that the Service is appropriate or available for use in all jurisdictions. We may
          restrict access from certain countries where we cannot ensure legal compliance.
        </p>
      </section>

      {/* 14. Modifications */}
      <section id="modifications">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">14. Modifications to Terms</h2>
        <p>
          We may update these Terms from time to time. When we make changes, we will update the "Last Updated"
          date at the top of this page and notify you by email or through the Service dashboard at least 14 days
          before the changes take effect.
        </p>
        <p>
          Continued use of the Service after the effective date constitutes acceptance of the revised Terms. If
          you do not agree to the updated Terms, you must stop using the Service and cancel your account.
        </p>
        <p>
          For material changes that substantially affect your rights or obligations, we will provide at least 30
          days' notice and may require explicit consent.
        </p>
      </section>

      {/* Contact */}
      <section className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Contact</h2>
        <p>Questions about these Terms? Reach us at:</p>
        <p className="mt-2">
          <strong>Start My Business Inc.</strong>
          <br />
          Email:{' '}
          <a href="mailto:legal@smbchat.com" className="text-violet-600 hover:text-violet-700">
            legal@smbchat.com
          </a>
          <br />
          Website: smbchat.alwaysencrypted.com
        </p>
      </section>
    </article>
  )
}
