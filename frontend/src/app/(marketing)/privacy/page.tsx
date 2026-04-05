'use client';
import { motion } from 'framer-motion';

const SECTIONS = [
  {
    title: '1. Information we collect',
    content: `We collect information you provide directly, including:

• **Account information**: name, email address, phone number, and password when you register.
• **Payment information**: M-Pesa phone number or card details processed securely via Safaricom Daraja API and Stripe. We never store raw card numbers.
• **Learning data**: course progress, quiz answers, assignment submissions, AI Tutor conversations, and certificate completions.
• **Device and usage data**: IP address, browser type, device identifiers, pages visited, and time spent on the platform.`,
  },
  {
    title: '2. How we use your information',
    content: `We use your information to:

• Provide, operate, and improve the Datika platform.
• Personalise your learning experience and AI Tutor responses.
• Process payments and prevent fraud.
• Send transactional emails (receipts, certificate issuance, session reminders).
• Send marketing communications — only with your explicit consent, and you can unsubscribe at any time.
• Comply with legal obligations under Kenyan law, including the Data Protection Act 2019.`,
  },
  {
    title: '3. Data sharing',
    content: `We do not sell your personal data. We share data only with:

• **Service providers**: AWS (hosting), Stripe (payments), Safaricom Daraja (M-Pesa), OpenAI (AI Tutor), Mailgun (email). All are bound by data processing agreements.
• **Academic partners**: Anonymised, aggregated learning outcomes for curriculum review only.
• **Legal requirements**: When required by Kenyan courts or regulatory authorities.

We will always notify you of material changes to data sharing practices.`,
  },
  {
    title: '4. Data storage and security',
    content: `Your data is stored on AWS infrastructure with servers in the eu-west-1 and af-south-1 regions. We apply:

• AES-256 encryption at rest for all personal data.
• TLS 1.3 for all data in transit.
• Role-based access controls — only authorised staff can access user data.
• Regular third-party security audits.

We retain your account data for as long as your account is active, plus 7 years for financial records as required by Kenyan law.`,
  },
  {
    title: '5. Your rights',
    content: `Under the Kenya Data Protection Act 2019 and GDPR (for EU residents), you have the right to:

• **Access**: Request a copy of all personal data we hold about you.
• **Correction**: Update inaccurate or incomplete data.
• **Deletion**: Request deletion of your account and associated data.
• **Portability**: Receive your learning data in a machine-readable format.
• **Objection**: Opt out of marketing communications at any time.

To exercise any of these rights, email privacy@datika.co.ke. We will respond within 30 days.`,
  },
  {
    title: '6. Cookies',
    content: `We use cookies and similar technologies. See our Cookie Policy for full details. Essential cookies cannot be disabled as they are required for the platform to function. You can manage analytics and marketing cookies in your account settings or via our cookie banner.`,
  },
  {
    title: '7. Children\'s privacy',
    content: `Datika is intended for users aged 16 and over. We do not knowingly collect personal data from children under 16. If you believe a child has provided us with personal data, contact privacy@datika.co.ke immediately.`,
  },
  {
    title: '8. Changes to this policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of material changes via email and a notice on the platform at least 14 days before the changes take effect. Continued use of Datika after that date constitutes acceptance of the updated policy.`,
  },
];

export default function PrivacyPage() {
  return (
    <>
      <section className="pt-40 pb-16 px-8 text-center relative">
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: '#f97316' }}>Legal</span>
          <h1 className="text-4xl font-extrabold text-white mb-4">Privacy Policy</h1>
          <p className="text-white/40 text-sm">Last updated: April 1, 2026 · Effective: April 1, 2026</p>
        </motion.div>
      </section>

      <section className="py-12 px-8 pb-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="p-5 rounded-2xl mb-8" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <p className="text-white/60 text-sm leading-relaxed">
              <strong className="text-white">Datika Learning Ltd</strong> ("Datika", "we", "us") is committed to protecting your privacy.
              This policy explains how we collect, use, and protect your personal data when you use datika.co.ke.
              Questions? Email <a href="mailto:privacy@datika.co.ke" style={{ color: '#00d4ff' }}>privacy@datika.co.ke</a>.
            </p>
          </motion.div>

          <div className="space-y-8">
            {SECTIONS.map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                <h2 className="text-white font-bold text-lg mb-3">{s.title}</h2>
                <div className="text-white/50 text-sm leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ __html: s.content.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white/80">$1</strong>') }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
