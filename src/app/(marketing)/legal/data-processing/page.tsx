import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Data Processing Agreement - SMB Chat',
  description: 'Data Processing Agreement for SMB Chat, an AI chatbot platform by Start My Business Inc.',
}

export default function DataProcessingPage() {
  return (
    <article className="prose prose-gray max-w-none prose-headings:scroll-mt-24">
      <div className="mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Data Processing Agreement</h1>
        <p className="text-sm text-gray-500">
          Effective Date: April 5, 2026 | Last Updated: April 5, 2026
        </p>
      </div>

      <p>
        This Data Processing Agreement ("DPA") forms part of the Terms of Service between Start My Business Inc.
        ("Processor," "we," "us") and the entity agreeing to these terms ("Controller," "you"). This DPA applies
        when we process personal data on your behalf in connection with the SMB Chat Service.
      </p>
      <p>
        This DPA is designed to meet the requirements of the General Data Protection Regulation ("GDPR"), the UK
        GDPR, the California Consumer Privacy Act ("CCPA"), and other applicable data protection laws.
      </p>

      {/* 1. Definitions */}
      <section id="dpa-definitions">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">1. Definitions</h2>
        <ul>
          <li><strong>"Personal Data"</strong> means any information relating to an identified or identifiable natural person processed through the Service on behalf of the Controller.</li>
          <li><strong>"Processing"</strong> means any operation performed on Personal Data, including collection, recording, storage, retrieval, use, disclosure, and deletion.</li>
          <li><strong>"Data Subject"</strong> means the identified or identifiable natural person to whom the Personal Data relates.</li>
          <li><strong>"Sub-Processor"</strong> means a third party engaged by the Processor to process Personal Data on behalf of the Controller.</li>
          <li><strong>"Security Incident"</strong> means a breach of security leading to the accidental or unlawful destruction, loss, alteration, unauthorized disclosure of, or access to Personal Data.</li>
          <li><strong>"Standard Contractual Clauses" or "SCCs"</strong> means the contractual clauses approved by the European Commission for international data transfers (Commission Implementing Decision (EU) 2021/914).</li>
          <li><strong>"Controller"</strong> means the entity that determines the purposes and means of Processing Personal Data (you, the account holder).</li>
          <li><strong>"Processor"</strong> means the entity that processes Personal Data on behalf of the Controller (Start My Business Inc.).</li>
        </ul>
      </section>

      {/* 2. Scope & Purpose */}
      <section id="dpa-scope">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">2. Scope & Purpose of Processing</h2>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.1 Subject Matter</h3>
        <p>
          The Processor processes Personal Data on behalf of the Controller to provide the SMB Chat Service,
          including chatbot deployment, conversation processing, analytics, and lead capture functionality.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.2 Categories of Data Subjects</h3>
        <ul>
          <li>End users who interact with chatbots deployed by the Controller</li>
          <li>The Controller's employees and authorized users who access the Service dashboard</li>
          <li>Individuals whose personal data appears in content uploaded by the Controller for chatbot training</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.3 Types of Personal Data</h3>
        <ul>
          <li>Names, email addresses, and phone numbers submitted during chat conversations or lead capture</li>
          <li>Conversation content (free-text messages exchanged with chatbots)</li>
          <li>IP addresses and device information of end users</li>
          <li>Voice recordings (if voice chat features are enabled)</li>
          <li>Any personal data contained in content uploaded for chatbot training</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">2.4 Duration</h3>
        <p>
          Processing continues for the duration of the Controller's subscription to the Service. Upon termination,
          the Processor will delete or return Personal Data in accordance with Section 10 of this DPA.
        </p>
      </section>

      {/* 3. Controller & Processor Obligations */}
      <section id="controller-processor">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">3. Controller & Processor Obligations</h2>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.1 Controller Obligations</h3>
        <p>The Controller shall:</p>
        <ul>
          <li>Ensure it has a lawful basis for processing Personal Data and for instructing the Processor to process such data</li>
          <li>Provide clear, documented instructions regarding the processing of Personal Data</li>
          <li>Comply with all applicable data protection laws regarding the collection and use of Personal Data from end users</li>
          <li>Provide appropriate privacy notices to end users before deploying chatbots that collect personal information</li>
          <li>Respond to data subject requests directed to the Controller</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">3.2 Processor Obligations</h3>
        <p>The Processor shall:</p>
        <ul>
          <li>Process Personal Data only on documented instructions from the Controller, unless required by law</li>
          <li>Ensure that persons authorized to process Personal Data have committed to confidentiality obligations</li>
          <li>Implement and maintain appropriate technical and organizational security measures (see Section 5)</li>
          <li>Assist the Controller in responding to data subject requests where technically feasible</li>
          <li>Assist the Controller with data protection impact assessments and prior consultations with supervisory authorities where required</li>
          <li>Notify the Controller of any legally binding request for disclosure of Personal Data, unless prohibited by law</li>
          <li>Not process Personal Data for any purpose other than providing the Service, unless instructed by the Controller or required by law</li>
        </ul>
      </section>

      {/* 4. Sub-Processors */}
      <section id="sub-processors">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">4. Sub-Processors</h2>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.1 Authorization</h3>
        <p>
          The Controller provides general written authorization for the Processor to engage Sub-Processors to
          assist in providing the Service. The Processor maintains a list of current Sub-Processors, available
          upon request.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.2 Current Sub-Processors</h3>
        <p>As of the effective date, our Sub-Processors include:</p>
        <ul>
          <li><strong>Cloud infrastructure provider:</strong> Hosting and data storage (United States)</li>
          <li><strong>Stripe:</strong> Payment processing (United States)</li>
          <li><strong>AI model providers:</strong> Natural language processing for chatbot responses (United States)</li>
          <li><strong>Authentication provider:</strong> User authentication and identity management (United States)</li>
          <li><strong>Email service provider:</strong> Transactional email delivery (United States)</li>
          <li><strong>Analytics provider:</strong> Aggregated usage analytics (European Union)</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.3 Changes to Sub-Processors</h3>
        <p>
          We will notify the Controller at least 14 days before engaging a new Sub-Processor or replacing an
          existing one. The Controller may object to a new Sub-Processor within 14 days of notification. If the
          Controller objects and we cannot reasonably accommodate the objection, either party may terminate the
          affected portion of the Service.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">4.4 Sub-Processor Agreements</h3>
        <p>
          We impose data protection obligations on each Sub-Processor that are no less protective than those in
          this DPA. We remain fully liable for the acts and omissions of our Sub-Processors.
        </p>
      </section>

      {/* 5. Data Security Measures */}
      <section id="dpa-security">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">5. Data Security Measures</h2>
        <p>
          The Processor implements the following technical and organizational measures to protect Personal Data:
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.1 Technical Measures</h3>
        <ul>
          <li>Encryption of data in transit (TLS 1.2+) and at rest (AES-256)</li>
          <li>Network segmentation and firewall protections</li>
          <li>Automated vulnerability scanning and penetration testing</li>
          <li>Secure software development lifecycle practices</li>
          <li>Multi-factor authentication for internal system access</li>
          <li>Automated backup and disaster recovery procedures</li>
          <li>Database-level access controls and query logging</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">5.2 Organizational Measures</h3>
        <ul>
          <li>Background checks for employees with access to Personal Data</li>
          <li>Mandatory security awareness training for all staff</li>
          <li>Access limited to personnel who require it for their job function</li>
          <li>Written information security policies and procedures</li>
          <li>Regular review and update of security measures</li>
          <li>Vendor risk management program for Sub-Processors</li>
        </ul>
      </section>

      {/* 6. Breach Notification */}
      <section id="breach-notification">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">6. Breach Notification</h2>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.1 Notification Timeline</h3>
        <p>
          The Processor will notify the Controller of any confirmed Security Incident without undue delay and in
          any event within 48 hours of becoming aware of it. Where notification within 48 hours is not feasible,
          we will provide an initial notification with available information and supplement it as additional details
          become known.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.2 Notification Contents</h3>
        <p>The notification will include, to the extent known:</p>
        <ul>
          <li>The nature of the Security Incident, including the categories and approximate number of Data Subjects and records affected</li>
          <li>The likely consequences of the breach</li>
          <li>The measures taken or proposed to address the incident and mitigate its effects</li>
          <li>Contact information for the Processor's incident response team</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.3 Processor Obligations</h3>
        <p>
          The Processor will take all reasonable steps to contain and remediate the Security Incident. The
          Processor will cooperate with the Controller in investigating the incident and fulfilling any legal
          notification obligations the Controller may have.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">6.4 Documentation</h3>
        <p>
          The Processor will document all Security Incidents, including their effects and the corrective actions
          taken, and will make this documentation available to the Controller and supervisory authorities upon
          request.
        </p>
      </section>

      {/* 7. Data Subject Requests */}
      <section id="data-subject-requests">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">7. Data Subject Requests</h2>
        <p>
          The Controller is responsible for responding to data subject requests (access, correction, deletion,
          portability, restriction, or objection).
        </p>
        <p>
          The Processor will:
        </p>
        <ul>
          <li>Promptly forward any data subject request received directly to the Controller</li>
          <li>Provide the Controller with self-service tools in the dashboard to access, export, and delete end-user data</li>
          <li>Assist the Controller in responding to requests where the Controller cannot fulfill them independently, such as retrieving data from backups</li>
          <li>Not independently respond to data subject requests unless instructed by the Controller or required by law</li>
        </ul>
        <p>
          Reasonable assistance beyond self-service capabilities may be subject to additional fees, which will be
          communicated in advance.
        </p>
      </section>

      {/* 8. Cross-Border Transfers */}
      <section id="cross-border-transfers">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">8. Cross-Border Transfers</h2>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">8.1 Transfer Mechanisms</h3>
        <p>
          Personal Data may be transferred to and processed in the United States. For transfers from the EEA, UK,
          or Switzerland to the United States, we implement the following safeguards:
        </p>
        <ul>
          <li><strong>Standard Contractual Clauses:</strong> We incorporate the SCCs (Module Two: Controller to Processor) as approved by the European Commission, supplemented by the UK Addendum where applicable.</li>
          <li><strong>Transfer Impact Assessments:</strong> We conduct and maintain transfer impact assessments evaluating the legal framework of the destination country and the supplementary measures in place.</li>
          <li><strong>Supplementary measures:</strong> Encryption in transit and at rest, pseudonymization where feasible, access controls, and contractual commitments from Sub-Processors.</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">8.2 Government Access Requests</h3>
        <p>
          If the Processor receives a government request for access to Personal Data transferred under this DPA,
          the Processor will:
        </p>
        <ul>
          <li>Notify the Controller promptly, unless prohibited by law</li>
          <li>Challenge the request if there are reasonable grounds to consider it unlawful</li>
          <li>Provide only the minimum amount of data required to comply</li>
          <li>Document all government access requests and make records available to the Controller</li>
        </ul>
      </section>

      {/* 9. Audit Rights */}
      <section id="audit-rights">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">9. Audit Rights</h2>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">9.1 Information Access</h3>
        <p>
          The Processor will make available to the Controller all information reasonably necessary to demonstrate
          compliance with this DPA, including summaries of security assessments, certifications, and audit reports.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">9.2 Controller Audits</h3>
        <p>
          The Controller (or an independent third-party auditor appointed by the Controller) may conduct audits of
          the Processor's processing activities, subject to the following conditions:
        </p>
        <ul>
          <li>Reasonable advance notice of at least 30 days</li>
          <li>Audits conducted during normal business hours and no more than once per 12-month period (unless required by a supervisory authority)</li>
          <li>The auditor must sign a confidentiality agreement before accessing Processor facilities or systems</li>
          <li>The audit scope is limited to matters directly relevant to this DPA</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">9.3 Costs</h3>
        <p>
          The Controller bears the costs of audits it initiates. If an audit reveals material non-compliance, the
          Processor will bear the costs of remediation and, if requested, a follow-up audit to verify corrective
          measures.
        </p>
      </section>

      {/* 10. Term & Termination */}
      <section id="dpa-term">
        <h2 className="text-xl font-bold text-gray-900 mt-10 mb-4">10. Term & Termination</h2>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.1 Duration</h3>
        <p>
          This DPA takes effect when the Controller begins using the Service and remains in effect as long as the
          Processor processes Personal Data on behalf of the Controller.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.2 Data Return and Deletion</h3>
        <p>Upon termination of the Service:</p>
        <ul>
          <li>The Controller may export Personal Data using the dashboard's data export tools for up to 30 days following termination</li>
          <li>After the 30-day export period, the Processor will delete all Personal Data from active systems within 30 days</li>
          <li>Personal Data in backup systems will be deleted within 90 days of termination, or overwritten through normal backup rotation</li>
          <li>The Processor will certify deletion in writing upon the Controller's request</li>
        </ul>

        <h3 className="text-lg font-semibold text-gray-800 mt-6 mb-3">10.3 Survival</h3>
        <p>
          Obligations related to confidentiality, liability, and data deletion survive termination of this DPA.
        </p>
      </section>

      {/* Contact */}
      <section className="mt-12 pt-8 border-t border-gray-200">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Contact</h2>
        <p>For questions about this Data Processing Agreement:</p>
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
