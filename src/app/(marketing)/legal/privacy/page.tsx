import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy - SMB Chat',
  description: 'Privacy Policy for SMB Chat, an AI chatbot platform by Start My Business Inc.',
}

export default function PrivacyPage() {
  return (
    <article className="prose prose-gray max-w-none prose-headings:scroll-mt-24">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Privacy Policy</h1>
        <p className="text-sm text-gray-500">
          Effective Date: April 5, 2026 | Last Updated: April 5, 2026
        </p>
      </div>

      <p>
        This Privacy Policy describes how Start My Business Inc. ("Company," "we," "us," or "our") collects,
        uses, discloses, and protects personal information when you use SMB Chat ("Service"). This policy applies
        to all users of the Service, including account holders and end users who interact with chatbots powered by
        the Service.
      </p>

      {/* 1. Information We Collect */}
      <section id="info-we-collect">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">1. Information We Collect</h2>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.1 Information You Provide</h3>
        <ul>
          <li><strong>Account data:</strong> Name, email address, password (hashed), company name, billing address, and payment information when you create an account or subscribe</li>
          <li><strong>Content data:</strong> Documents, website URLs, FAQs, and other materials you upload to train your chatbots</li>
          <li><strong>Chatbot configuration:</strong> Greeting messages, branding settings, fallback responses, and behavioral preferences</li>
          <li><strong>Conversation data:</strong> Messages exchanged between end users and your chatbots, including any personal information end users voluntarily share during conversations</li>
          <li><strong>Support requests:</strong> Information you provide when contacting our support team</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.2 Information Collected Automatically</h3>
        <ul>
          <li><strong>Usage data:</strong> Pages visited, features used, chatbot interactions, click patterns, and session duration</li>
          <li><strong>Device data:</strong> Browser type and version, operating system, screen resolution, language preference, and device identifiers</li>
          <li><strong>Network data:</strong> IP address, approximate geographic location (city/region level), referring URL, and ISP</li>
          <li><strong>Cookies and similar technologies:</strong> Session tokens, authentication cookies, analytics identifiers, and preference cookies (see Section 14)</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">1.3 Information From Third Parties</h3>
        <ul>
          <li><strong>Authentication providers:</strong> If you sign in through a third-party service (e.g., Google, GitHub), we receive your name, email, and profile photo from that service</li>
          <li><strong>Payment processors:</strong> Stripe provides us with transaction confirmations, card type (last four digits only), and billing address</li>
          <li><strong>Analytics services:</strong> Aggregated usage data from our analytics provider</li>
        </ul>
      </section>

      {/* 2. How We Use Information */}
      <section id="how-we-use-info">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">2. How We Use Information</h2>
        <p>We use collected information for the following purposes:</p>
        <ul>
          <li><strong>Service operation:</strong> To create accounts, process payments, deliver chatbot functionality, and provide customer support</li>
          <li><strong>AI training:</strong> To train and improve chatbot responses using the content you upload (we do not use your content to train models for other customers)</li>
          <li><strong>Analytics:</strong> To understand usage patterns, improve the Service, and develop new features</li>
          <li><strong>Communication:</strong> To send transactional emails (account confirmations, billing receipts, security alerts) and, with your consent, marketing communications</li>
          <li><strong>Security:</strong> To detect fraud, prevent abuse, and maintain the integrity of the Service</li>
          <li><strong>Legal compliance:</strong> To comply with applicable laws, regulations, and legal processes</li>
        </ul>
        <p>
          We do not sell personal information. We do not use end-user conversation data for advertising purposes.
        </p>
      </section>

      {/* 3. Data Sharing */}
      <section id="data-sharing">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">3. Data Sharing & Third Parties</h2>
        <p>We share personal information only in the following circumstances:</p>
        <ul>
          <li><strong>Service providers:</strong> We use third-party vendors for hosting (cloud infrastructure), payment processing (Stripe), email delivery, analytics, and authentication. These vendors are contractually bound to use data only for the services they provide to us.</li>
          <li><strong>AI model providers:</strong> We may send conversation content to third-party AI model providers (e.g., OpenAI, Anthropic) to generate chatbot responses. This data is sent under data processing agreements that prohibit the provider from using it for model training.</li>
          <li><strong>Legal requirements:</strong> We may disclose information to comply with a subpoena, court order, government investigation, or other legal obligation.</li>
          <li><strong>Business transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred to the acquiring entity. We will notify you before your data becomes subject to a different privacy policy.</li>
          <li><strong>With your consent:</strong> We may share data for purposes not listed here if you give explicit consent.</li>
        </ul>
        <p>
          We do not share personal information with advertisers or data brokers.
        </p>
      </section>

      {/* 4. Data Retention */}
      <section id="data-retention">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">4. Data Retention</h2>
        <ul>
          <li><strong>Account data:</strong> Retained for the duration of your account plus 30 days after deletion request</li>
          <li><strong>Conversation logs:</strong> Retained for 90 days by default, configurable by account holders. Account holders may delete logs at any time.</li>
          <li><strong>Content data:</strong> Retained until you delete it or your account is terminated</li>
          <li><strong>Analytics data:</strong> Aggregated and anonymized after 24 months</li>
          <li><strong>Billing records:</strong> Retained for 7 years as required by tax and financial regulations</li>
          <li><strong>Server logs:</strong> Retained for 90 days, then automatically purged</li>
        </ul>
        <p>
          When data reaches its retention limit, it is permanently deleted from active systems and backups within
          30 days.
        </p>
      </section>

      {/* 5. Security Measures */}
      <section id="security-measures">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">5. Security Measures</h2>
        <p>We implement technical and organizational measures to protect personal information:</p>
        <ul>
          <li><strong>Encryption:</strong> All data transmitted between your browser and our servers is encrypted using TLS 1.2 or higher. Sensitive data at rest is encrypted using AES-256.</li>
          <li><strong>Access controls:</strong> Internal access to personal data is restricted to authorized personnel on a need-to-know basis, with role-based access controls and audit logging.</li>
          <li><strong>Infrastructure:</strong> We host the Service on enterprise-grade cloud infrastructure with SOC 2 Type II certified data centers.</li>
          <li><strong>Authentication:</strong> We support multi-factor authentication for account access. Passwords are hashed using bcrypt.</li>
          <li><strong>Monitoring:</strong> We use automated monitoring to detect unauthorized access attempts, unusual activity, and potential security incidents.</li>
          <li><strong>Incident response:</strong> We maintain an incident response plan and will notify affected users of security breaches in accordance with applicable law.</li>
        </ul>
        <p>
          No system is completely secure. While we take reasonable precautions, we cannot guarantee absolute
          security of your data.
        </p>
      </section>

      {/* 6. User Rights */}
      <section id="user-rights">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">6. User Rights</h2>
        <p>
          Depending on your location, you may have the following rights regarding your personal information:
        </p>
        <ul>
          <li><strong>Access:</strong> Request a copy of the personal data we hold about you</li>
          <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
          <li><strong>Deletion:</strong> Request deletion of your personal data, subject to legal retention requirements</li>
          <li><strong>Portability:</strong> Request your data in a structured, machine-readable format (JSON or CSV)</li>
          <li><strong>Restriction:</strong> Request that we limit processing of your data under certain conditions</li>
          <li><strong>Objection:</strong> Object to processing of your data for direct marketing or legitimate interest purposes</li>
          <li><strong>Withdraw consent:</strong> Where processing is based on consent, withdraw it at any time without affecting the lawfulness of prior processing</li>
        </ul>
        <p>
          To exercise any of these rights, email{' '}
          <a href="mailto:legal@smbchat.com" className="text-violet-600 hover:text-violet-700">
            legal@smbchat.com
          </a>{' '}
          with your request. We will respond within 30 days (or sooner if required by applicable law). We may ask
          you to verify your identity before processing the request.
        </p>
      </section>

      {/* 7. Children's Privacy */}
      <section id="childrens-privacy">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">7. Children's Privacy</h2>
        <p>
          The Service is not directed at children under the age of 13 (or 16 in the EEA). We do not knowingly
          collect personal information from children. If you believe a child under the applicable age has provided
          us with personal information, contact us at{' '}
          <a href="mailto:legal@smbchat.com" className="text-violet-600 hover:text-violet-700">
            legal@smbchat.com
          </a>{' '}
          and we will delete it promptly.
        </p>
        <p>
          Account holders who deploy chatbots on websites directed at children are responsible for configuring
          their chatbots to comply with COPPA and equivalent regulations. This includes disabling data collection
          features for interactions with minors.
        </p>
      </section>

      {/* 8. International Data Transfers */}
      <section id="international-transfers">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">8. International Data Transfers</h2>
        <p>
          The Service is hosted in the United States. If you access the Service from outside the United States,
          your personal information will be transferred to and processed in the United States, where data
          protection laws may differ from those in your country.
        </p>
        <p>
          For transfers from the EEA, UK, or Switzerland, we rely on:
        </p>
        <ul>
          <li>Standard Contractual Clauses ("SCCs") approved by the European Commission</li>
          <li>Data Processing Agreements with all sub-processors that include appropriate transfer safeguards</li>
          <li>Additional technical measures (encryption, pseudonymization) to supplement SCCs where necessary</li>
        </ul>
        <p>
          You may request a copy of the applicable transfer mechanism by contacting us at{' '}
          <a href="mailto:legal@smbchat.com" className="text-violet-600 hover:text-violet-700">
            legal@smbchat.com
          </a>
          .
        </p>
      </section>

      {/* 9. GDPR */}
      <section id="gdpr">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">9. GDPR Compliance (EU/EEA Users)</h2>
        <p>
          If you are located in the European Economic Area ("EEA") or United Kingdom ("UK"), the General Data
          Protection Regulation ("GDPR") and UK GDPR apply to our processing of your personal data.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">9.1 Legal Bases for Processing</h3>
        <ul>
          <li><strong>Contract performance:</strong> Processing necessary to provide the Service you subscribed to (account management, chatbot delivery, billing)</li>
          <li><strong>Legitimate interests:</strong> Analytics, fraud prevention, Service improvement, and security monitoring -- balanced against your rights and interests</li>
          <li><strong>Consent:</strong> Marketing communications and non-essential cookies</li>
          <li><strong>Legal obligation:</strong> Tax reporting, regulatory compliance, and response to lawful government requests</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">9.2 Data Controller & Processor Roles</h3>
        <p>
          Start My Business Inc. acts as a data controller for account holder data and as a data processor for
          end-user conversation data processed on behalf of account holders. Account holders act as data
          controllers for the personal data of their end users.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">9.3 Supervisory Authority</h3>
        <p>
          You have the right to lodge a complaint with your local supervisory authority if you believe your data
          protection rights have been violated.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">9.4 Data Protection Officer</h3>
        <p>
          For GDPR-related inquiries, contact our designated data protection point of contact at{' '}
          <a href="mailto:legal@smbchat.com" className="text-violet-600 hover:text-violet-700">
            legal@smbchat.com
          </a>
          .
        </p>
      </section>

      {/* 10. CCPA */}
      <section id="ccpa">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">10. CCPA Compliance (California Users)</h2>
        <p>
          If you are a California resident, the California Consumer Privacy Act ("CCPA") and California Privacy
          Rights Act ("CPRA") provide you with additional rights.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.1 Categories of Information</h3>
        <p>In the preceding 12 months, we have collected these categories of personal information:</p>
        <ul>
          <li>Identifiers (name, email, IP address)</li>
          <li>Commercial information (subscription plan, billing history)</li>
          <li>Internet or electronic network activity (usage logs, device data)</li>
          <li>Geolocation data (approximate location derived from IP)</li>
          <li>Professional or employment-related information (company name, job title if provided)</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.2 Your Rights Under CCPA</h3>
        <ul>
          <li><strong>Right to know:</strong> Request the categories and specific pieces of personal information we have collected about you</li>
          <li><strong>Right to delete:</strong> Request deletion of personal information we hold, subject to exceptions</li>
          <li><strong>Right to correct:</strong> Request correction of inaccurate information</li>
          <li><strong>Right to opt out of sale/sharing:</strong> We do not sell personal information. We do not share personal information for cross-context behavioral advertising.</li>
          <li><strong>Right to non-discrimination:</strong> We will not discriminate against you for exercising your rights</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.3 Exercising Your Rights</h3>
        <p>
          Submit requests to{' '}
          <a href="mailto:legal@smbchat.com" className="text-violet-600 hover:text-violet-700">
            legal@smbchat.com
          </a>
          . We will verify your identity using information already associated with your account. Authorized agents
          may submit requests on your behalf with written authorization.
        </p>
      </section>

      {/* 11. LGPD */}
      <section id="lgpd">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">11. LGPD Compliance (Brazil)</h2>
        <p>
          If you are located in Brazil, the Lei Geral de Protecao de Dados ("LGPD") provides you with rights
          regarding your personal data.
        </p>
        <ul>
          <li>You may request confirmation of processing, access, correction, anonymization, portability, deletion, and information about third parties with whom data is shared.</li>
          <li>We process your data based on consent, contract performance, legitimate interest, or legal obligation.</li>
          <li>You may revoke consent at any time by contacting us at{' '}
            <a href="mailto:legal@smbchat.com" className="text-violet-600 hover:text-violet-700">
              legal@smbchat.com
            </a>
            .
          </li>
          <li>You may file a complaint with the Autoridade Nacional de Protecao de Dados ("ANPD") if you believe your rights have been violated.</li>
        </ul>
      </section>

      {/* 12. PIPEDA */}
      <section id="pipeda">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">12. PIPEDA Compliance (Canada)</h2>
        <p>
          If you are located in Canada, the Personal Information Protection and Electronic Documents Act ("PIPEDA")
          and applicable provincial legislation govern our processing of your personal information.
        </p>
        <ul>
          <li>We collect personal information with your knowledge and consent, limited to what is necessary for the purposes identified.</li>
          <li>You may access, correct, or withdraw consent for your personal information at any time.</li>
          <li>We retain personal information only as long as needed for the identified purposes or as required by law.</li>
          <li>Cross-border transfers to the United States are governed by contractual protections and this Privacy Policy.</li>
          <li>Complaints may be directed to the Office of the Privacy Commissioner of Canada.</li>
        </ul>
      </section>

      {/* 13. Australian Privacy Act */}
      <section id="australian-privacy">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">13. Australian Privacy Act Compliance</h2>
        <p>
          If you are located in Australia, the Privacy Act 1988 (Cth) and the Australian Privacy Principles
          ("APPs") apply to our handling of your personal information.
        </p>
        <ul>
          <li>We collect personal information that is reasonably necessary for our functions and activities, and we do so by lawful and fair means.</li>
          <li>We will not use or disclose personal information for a purpose other than the purpose of collection, unless you consent or an exception applies.</li>
          <li>You may request access to and correction of your personal information.</li>
          <li>We take reasonable steps to protect personal information from misuse, interference, loss, and unauthorized access.</li>
          <li>Before disclosing personal information to an overseas recipient (our US-based servers), we take reasonable steps to ensure the recipient complies with the APPs.</li>
          <li>Complaints may be directed to the Office of the Australian Information Commissioner ("OAIC").</li>
        </ul>
      </section>

      {/* 14. Cookie Policy */}
      <section id="cookie-policy">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">14. Cookie Policy</h2>
        <p>We use the following types of cookies and similar technologies:</p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">14.1 Strictly Necessary Cookies</h3>
        <p>
          Required for the Service to function. These include session tokens, authentication cookies, and CSRF
          protection tokens. These cannot be disabled.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">14.2 Functional Cookies</h3>
        <p>
          Remember your preferences such as language, timezone, and dashboard layout. These improve your
          experience but are not strictly required.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">14.3 Analytics Cookies</h3>
        <p>
          Help us understand how users interact with the Service. We use privacy-focused analytics that do not
          track users across websites. Analytics data is aggregated and cannot be used to identify individual
          users.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">14.4 Managing Cookies</h3>
        <p>
          You can control cookies through your browser settings. Disabling non-essential cookies may reduce
          functionality but will not prevent you from using the core Service. We respect browser-level cookie
          preferences.
        </p>
      </section>

      {/* 15. Do Not Track */}
      <section id="do-not-track">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">15. Do Not Track Signals</h2>
        <p>
          We honor Do Not Track ("DNT") browser signals. When we detect a DNT signal, we disable non-essential
          analytics cookies and do not track your browsing activity across third-party websites.
        </p>
        <p>
          We also respect the Global Privacy Control ("GPC") signal as a valid opt-out request under applicable
          state laws, including the CCPA.
        </p>
      </section>

      {/* 16. Contact */}
      <section id="privacy-contact">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">16. Contact Information</h2>
        <p>For privacy-related questions or requests:</p>
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
        <p className="mt-4">
          We will acknowledge your inquiry within 48 hours and provide a substantive response within 30 days
          (or sooner if required by applicable law).
        </p>
      </section>
    </article>
  )
}
