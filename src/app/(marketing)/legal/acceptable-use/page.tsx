import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Acceptable Use Policy - SMB Chat',
  description: 'Acceptable Use Policy for SMB Chat, an AI chatbot platform by Start My Business Inc.',
}

export default function AcceptableUsePage() {
  return (
    <article className="prose prose-gray max-w-none prose-headings:scroll-mt-24">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Acceptable Use Policy</h1>
        <p className="text-sm text-gray-500">
          Effective Date: April 5, 2026 | Last Updated: April 5, 2026
        </p>
      </div>

      <p>
        This Acceptable Use Policy ("AUP") governs your use of SMB Chat ("Service"), operated by Start My
        Business Inc. ("Company," "we," "us," or "our"). This AUP is incorporated into and forms part of our
        Terms of Service. Violation of this AUP may result in suspension or termination of your account.
      </p>

      {/* 1. Prohibited Content */}
      <section id="prohibited-content">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">1. Prohibited Content</h2>
        <p>
          You may not use the Service to create, store, distribute, or facilitate chatbots that generate or
          transmit any of the following:
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.1 Illegal Content</h3>
        <ul>
          <li>Content that violates any applicable federal, state, local, or international law</li>
          <li>Content that facilitates or promotes illegal activities, including fraud, money laundering, drug trafficking, or human trafficking</li>
          <li>Content that infringes intellectual property rights (copyrights, trademarks, trade secrets, patents) of any third party</li>
          <li>Child sexual abuse material ("CSAM") or any content sexualizing minors</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.2 Harmful Content</h3>
        <ul>
          <li>Content that threatens, harasses, bullies, intimidates, or incites violence against any individual or group</li>
          <li>Content that promotes self-harm, suicide, eating disorders, or other dangerous behaviors</li>
          <li>Content that promotes discrimination based on race, ethnicity, national origin, religion, gender, sexual orientation, disability, or other protected characteristics</li>
          <li>Malicious disinformation designed to cause public harm (e.g., false medical advice presented as professional guidance, election interference content)</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.3 Deceptive Content</h3>
        <ul>
          <li>Content designed to impersonate real individuals, organizations, or government entities without authorization</li>
          <li>Chatbots that falsely claim to be human when directly asked by an end user</li>
          <li>Phishing content or content designed to extract credentials or sensitive information through deception</li>
          <li>Fake reviews, testimonials, or endorsements</li>
          <li>Content that misleads end users about the nature or capabilities of the chatbot</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.4 Regulated Content Without Appropriate Safeguards</h3>
        <ul>
          <li>Medical, legal, or financial advice presented as professional counsel without appropriate disclaimers</li>
          <li>Content related to regulated industries (healthcare, financial services, legal services) that does not comply with applicable industry regulations</li>
          <li>Content that requires specific licenses or certifications to distribute in your jurisdiction</li>
        </ul>
      </section>

      {/* 2. Prohibited Activities */}
      <section id="prohibited-activities">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">2. Prohibited Activities</h2>
        <p>You may not use the Service to:</p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.1 Security Violations</h3>
        <ul>
          <li>Attempt to gain unauthorized access to the Service, other accounts, or connected systems</li>
          <li>Probe, scan, or test the vulnerability of the Service or any associated network</li>
          <li>Interfere with or disrupt the Service, servers, or networks connected to the Service</li>
          <li>Transmit viruses, malware, ransomware, or any other malicious code</li>
          <li>Conduct denial-of-service attacks or resource exhaustion attacks against the Service</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.2 Abuse of the Platform</h3>
        <ul>
          <li>Reverse-engineer, decompile, disassemble, or otherwise attempt to extract the source code of the Service or its AI models</li>
          <li>Use automated tools (bots, scripts, scrapers) to access the Service in ways that exceed normal usage patterns or violate rate limits</li>
          <li>Create multiple accounts to circumvent usage limits, bans, or enforcement actions</li>
          <li>Resell, sublicense, or redistribute access to the Service without written authorization</li>
          <li>Use the Service to develop a competing product or service</li>
          <li>Extract or harvest AI model weights, training data, or proprietary algorithms from the Service</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.3 Spam and Unsolicited Communications</h3>
        <ul>
          <li>Use the Service to send unsolicited bulk messages or commercial communications ("spam")</li>
          <li>Deploy chatbots that initiate contact with users who have not opted in to communication</li>
          <li>Use lead capture features to collect contact information for purposes unrelated to the conversation</li>
          <li>Violate CAN-SPAM, TCPA, GDPR direct marketing rules, or equivalent anti-spam laws</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.4 Data Misuse</h3>
        <ul>
          <li>Collect personal information from end users without appropriate legal basis and privacy notices</li>
          <li>Process sensitive personal data (biometric, health, financial) without proper consent and safeguards</li>
          <li>Transfer personal data to countries without adequate data protection unless lawful transfer mechanisms are in place</li>
          <li>Use conversation data for purposes not disclosed to end users</li>
        </ul>
      </section>

      {/* 3. Rate Limiting & Fair Use */}
      <section id="rate-limiting">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">3. Rate Limiting & Fair Use</h2>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.1 Message Limits</h3>
        <p>
          Each subscription plan includes a monthly message allocation. Messages are counted per chatbot
          interaction (one end-user message plus one chatbot response equals one message). Usage is tracked in
          your dashboard.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.2 Rate Limits</h3>
        <p>The following rate limits apply to prevent abuse and maintain service quality for all users:</p>
        <ul>
          <li><strong>Widget requests:</strong> Maximum 60 requests per minute per chatbot</li>
          <li><strong>API requests:</strong> Maximum 120 requests per minute per API key (varies by plan)</li>
          <li><strong>File uploads:</strong> Maximum 50 MB per file, 500 MB total storage per account (varies by plan)</li>
          <li><strong>Concurrent connections:</strong> Varies by plan (see your plan details)</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.3 Fair Use</h3>
        <p>
          Plans described as "unlimited" are subject to a fair use policy. Fair use means typical usage patterns
          for a business of your size and type. If your usage is significantly above normal patterns (e.g.,
          automated testing at scale, bulk data extraction), we may contact you to discuss upgrading or adjusting
          your usage.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.4 Exceeding Limits</h3>
        <p>If you exceed rate limits or your plan allocation:</p>
        <ul>
          <li>Requests may be temporarily throttled (HTTP 429 responses)</li>
          <li>We will notify you via email and dashboard alerts</li>
          <li>You may upgrade your plan or wait for the next billing cycle</li>
          <li>Persistent, intentional abuse of rate limits may result in account suspension</li>
        </ul>
      </section>

      {/* 4. API Usage Guidelines */}
      <section id="api-usage">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">4. API Usage Guidelines</h2>
        <p>
          If your plan includes API access, the following guidelines apply in addition to the general rules above:
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.1 Authentication</h3>
        <ul>
          <li>API keys are confidential. Do not expose them in client-side code, public repositories, or browser requests.</li>
          <li>Use server-side calls to the API. Never embed API keys in frontend JavaScript, mobile apps, or publicly accessible environments.</li>
          <li>Rotate API keys immediately if you suspect they have been compromised. You can regenerate keys from your dashboard.</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.2 Usage Requirements</h3>
        <ul>
          <li>Implement proper error handling and respect retry-after headers</li>
          <li>Cache responses where appropriate to minimize unnecessary API calls</li>
          <li>Do not use the API to scrape, index, or systematically download Service content</li>
          <li>Include a descriptive User-Agent header in API requests to help us identify and troubleshoot issues</li>
          <li>All API traffic must use HTTPS. Plaintext HTTP connections are rejected.</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.3 Integrations</h3>
        <ul>
          <li>Third-party integrations built on our API must comply with this AUP</li>
          <li>You are responsible for the behavior of any application or service that uses your API keys</li>
          <li>We reserve the right to revoke API access for integrations that violate this policy or degrade Service performance</li>
        </ul>
      </section>

      {/* 5. Reporting Violations */}
      <section id="reporting-violations">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">5. Reporting Violations</h2>
        <p>
          If you become aware of a violation of this AUP, please report it to us. We take all reports seriously
          and will investigate promptly.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.1 How to Report</h3>
        <ul>
          <li>Email:{' '}
            <a href="mailto:legal@smbchat.com" className="text-violet-600 hover:text-violet-700">
              legal@smbchat.com
            </a>
          </li>
          <li>Include the URL or identifier of the chatbot involved, a description of the violation, and any supporting evidence (screenshots, conversation logs)</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.2 Investigation Process</h3>
        <ul>
          <li>We acknowledge reports within 2 business days</li>
          <li>We investigate and take appropriate action within 10 business days for standard reports</li>
          <li>Reports involving CSAM, imminent threats of violence, or active fraud are escalated immediately and may involve law enforcement</li>
          <li>We will notify the reporter of the outcome where appropriate, subject to privacy and legal constraints</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.3 Good Faith Reporting</h3>
        <p>
          We will not retaliate against anyone who reports a violation in good faith. False or malicious reports
          may themselves constitute a violation of this policy.
        </p>
      </section>

      {/* 6. Enforcement */}
      <section id="enforcement">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">6. Enforcement & Consequences</h2>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.1 Graduated Response</h3>
        <p>
          We use a graduated enforcement approach, adjusting our response to the severity and frequency of
          violations:
        </p>
        <ul>
          <li><strong>Warning:</strong> For minor or first-time violations, we will notify you and request corrective action within a specified timeframe (typically 48 hours).</li>
          <li><strong>Content removal:</strong> We may remove or disable specific chatbots or content that violates this policy.</li>
          <li><strong>Feature restriction:</strong> We may temporarily restrict access to specific features (API access, voice chat, new chatbot creation).</li>
          <li><strong>Account suspension:</strong> For repeated or serious violations, we may suspend your account pending resolution.</li>
          <li><strong>Account termination:</strong> For severe violations (CSAM, malware distribution, systematic fraud), we may immediately and permanently terminate your account.</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.2 Immediate Action</h3>
        <p>We reserve the right to take immediate action without prior notice when:</p>
        <ul>
          <li>The violation poses an immediate threat to the safety of any individual</li>
          <li>The violation involves illegal content (particularly CSAM)</li>
          <li>The violation is actively causing harm to the Service or other users</li>
          <li>We are required to act by law or legal process</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.3 Appeals</h3>
        <p>
          If you believe an enforcement action was taken in error, you may appeal by emailing{' '}
          <a href="mailto:legal@smbchat.com" className="text-violet-600 hover:text-violet-700">
            legal@smbchat.com
          </a>{' '}
          with the subject line "AUP Appeal" and a detailed explanation. We will review appeals within 10
          business days and notify you of the outcome.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.4 Law Enforcement</h3>
        <p>
          We cooperate with law enforcement when required by law or when we believe in good faith that disclosure
          is necessary to prevent serious harm. We may report illegal activity to the appropriate authorities
          without notice to you.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.5 No Waiver</h3>
        <p>
          Our failure to enforce any provision of this AUP does not constitute a waiver of that provision.
          Enforcement of one violation does not prevent us from enforcing the same or different provisions in
          the future.
        </p>
      </section>

      {/* Contact */}
      <section className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Contact</h2>
        <p>For questions about this Acceptable Use Policy:</p>
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
