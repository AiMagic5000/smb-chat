export default function AcceptableUsePage() {
  return (
    <div className="prose prose-gray max-w-none">
      <h1 id="acceptable-use" className="text-3xl font-bold text-gray-900 mb-2">Acceptable Use Policy</h1>
      <p className="text-sm text-gray-500 mb-8">Effective Date: April 5, 2026</p>

      <p>
        This Acceptable Use Policy ("AUP") governs your use of SMB Chat, operated by Start My Business Inc.
        By accessing or using our platform, you agree to comply with this policy. Violations may result in
        suspension or termination of your account.
      </p>

      <h2 id="aup-prohibited-content" className="text-xl font-semibold text-gray-900 mt-10 mb-4">1. Prohibited Content</h2>
      <p>You may not use SMB Chat to create, distribute, or facilitate chatbots that contain or promote:</p>
      <ul className="list-disc pl-6 space-y-1.5">
        <li>Content that is illegal in any applicable jurisdiction</li>
        <li>Hate speech, harassment, or threats of violence against individuals or groups</li>
        <li>Sexually explicit or pornographic material</li>
        <li>Content that exploits or endangers minors</li>
        <li>Fraudulent, deceptive, or misleading information presented as factual</li>
        <li>Content that infringes on intellectual property rights of others</li>
        <li>Malware, viruses, or other harmful code or links</li>
        <li>Personal, financial, or medical information of others without their consent</li>
        <li>Content designed to manipulate elections or democratic processes</li>
        <li>Impersonation of real individuals, companies, or government entities</li>
      </ul>

      <h2 id="aup-prohibited-activities" className="text-xl font-semibold text-gray-900 mt-10 mb-4">2. Prohibited Activities</h2>
      <p>You may not engage in the following activities while using SMB Chat:</p>
      <ul className="list-disc pl-6 space-y-1.5">
        <li>Attempting to gain unauthorized access to other accounts, systems, or data</li>
        <li>Reverse engineering, decompiling, or disassembling any part of the platform</li>
        <li>Using automated tools to scrape, crawl, or extract data from the platform beyond normal API usage</li>
        <li>Launching denial-of-service attacks or intentionally overloading the service</li>
        <li>Circumventing rate limits, usage quotas, or other platform restrictions</li>
        <li>Reselling, sublicensing, or redistributing the service without written authorization</li>
        <li>Using the platform to collect personal data without proper consent or legal basis</li>
        <li>Deploying chatbots that impersonate human agents without disclosure</li>
        <li>Using the service to send unsolicited communications (spam)</li>
        <li>Intentionally training chatbots to produce harmful, misleading, or discriminatory responses</li>
      </ul>

      <h2 id="aup-rate-limits" className="text-xl font-semibold text-gray-900 mt-10 mb-4">3. Rate Limiting and Fair Use</h2>
      <p>
        SMB Chat enforces rate limits and usage quotas to maintain service quality for all users.
        These limits vary by subscription plan:
      </p>
      <div className="overflow-x-auto mt-4 mb-4">
        <table className="min-w-full border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="border-b px-4 py-2 text-left font-medium">Plan</th>
              <th className="border-b px-4 py-2 text-left font-medium">Messages/Month</th>
              <th className="border-b px-4 py-2 text-left font-medium">Chatbots</th>
              <th className="border-b px-4 py-2 text-left font-medium">Knowledge Sources</th>
            </tr>
          </thead>
          <tbody>
            <tr><td className="border-b px-4 py-2">Starter</td><td className="border-b px-4 py-2">1,000</td><td className="border-b px-4 py-2">1</td><td className="border-b px-4 py-2">5</td></tr>
            <tr><td className="border-b px-4 py-2">Basic</td><td className="border-b px-4 py-2">5,000</td><td className="border-b px-4 py-2">3</td><td className="border-b px-4 py-2">25</td></tr>
            <tr><td className="border-b px-4 py-2">Turbo</td><td className="border-b px-4 py-2">25,000</td><td className="border-b px-4 py-2">10</td><td className="border-b px-4 py-2">100</td></tr>
            <tr><td className="border-b px-4 py-2">Enterprise</td><td className="border-b px-4 py-2">Custom</td><td className="border-b px-4 py-2">Unlimited</td><td className="border-b px-4 py-2">Unlimited</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Widget API endpoints are rate-limited to 60 requests per minute per visitor and 10 sessions per hour.
        Exceeding these limits will result in temporary throttling (HTTP 429 responses).
      </p>

      <h2 id="aup-api-usage" className="text-xl font-semibold text-gray-900 mt-10 mb-4">4. API Usage Guidelines</h2>
      <ul className="list-disc pl-6 space-y-1.5">
        <li>API keys are confidential. Do not expose them in client-side code, public repositories, or logs.</li>
        <li>Implement proper error handling and respect retry-after headers on rate-limited responses.</li>
        <li>Do not use the API to build a competing chatbot service without written permission.</li>
        <li>Cache responses where appropriate to reduce unnecessary API calls.</li>
        <li>Include a descriptive User-Agent header in API requests for identification purposes.</li>
        <li>All API traffic must use HTTPS. Plaintext HTTP connections are rejected.</li>
      </ul>

      <h2 id="aup-reporting" className="text-xl font-semibold text-gray-900 mt-10 mb-4">5. Reporting Violations</h2>
      <p>
        If you become aware of any violation of this Acceptable Use Policy, please report it to us
        at <a href="mailto:legal@smbchat.com" className="text-violet-600 hover:underline">legal@smbchat.com</a>.
        Include the following information:
      </p>
      <ul className="list-disc pl-6 space-y-1.5">
        <li>A description of the violation</li>
        <li>The URL or identifier of the chatbot or content involved</li>
        <li>Any supporting evidence (screenshots, conversation logs, etc.)</li>
        <li>Your contact information for follow-up</li>
      </ul>
      <p>We investigate all reports and respond within 5 business days.</p>

      <h2 id="aup-enforcement" className="text-xl font-semibold text-gray-900 mt-10 mb-4">6. Enforcement and Consequences</h2>
      <p>
        We take violations of this policy seriously. Depending on the severity and frequency of the violation,
        we may take one or more of the following actions:
      </p>
      <ul className="list-disc pl-6 space-y-1.5">
        <li><strong>Warning:</strong> A written notice identifying the violation and requesting immediate correction.</li>
        <li><strong>Temporary Suspension:</strong> Restricting access to your account for a defined period (typically 7 to 30 days).</li>
        <li><strong>Content Removal:</strong> Removing or disabling the offending chatbot or content without notice.</li>
        <li><strong>Permanent Termination:</strong> Closing your account and revoking all access to the platform.</li>
        <li><strong>Legal Action:</strong> Pursuing civil or criminal remedies where the violation involves illegal activity.</li>
      </ul>
      <p>
        We reserve the right to act without prior notice in cases involving immediate risk to users,
        the platform, or third parties. Where possible, we will provide an opportunity to address the
        violation before taking escalated action.
      </p>

      <h2 id="aup-modifications" className="text-xl font-semibold text-gray-900 mt-10 mb-4">7. Modifications</h2>
      <p>
        We may update this Acceptable Use Policy from time to time. Material changes will be communicated
        through the platform dashboard or by email at least 30 days before they take effect. Continued use
        of SMB Chat after changes become effective constitutes acceptance of the updated policy.
      </p>

      <div className="mt-12 border-t pt-6">
        <p className="text-sm text-gray-500">
          Questions about this policy? Contact us at{' '}
          <a href="mailto:legal@smbchat.com" className="text-violet-600 hover:underline">legal@smbchat.com</a>.
        </p>
      </div>
    </div>
  )
}
