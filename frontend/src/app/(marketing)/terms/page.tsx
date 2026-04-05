'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const SECTIONS = [
  {
    title: '1. Acceptance of terms',
    content: `By creating a Datika account, subscribing to a plan, or using any part of the Datika platform, you agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree, do not use the platform.

These Terms constitute a legally binding agreement between you and **Datika Learning Ltd**, a company incorporated in Kenya.`,
  },
  {
    title: '2. Eligibility',
    content: `You must be at least **16 years of age** to use Datika. By using the platform, you represent that you meet this requirement. If you are under 18, a parent or legal guardian must review and agree to these Terms on your behalf.`,
  },
  {
    title: '3. Your account',
    content: `You are responsible for:

• Maintaining the confidentiality of your password and account credentials.
• All activity that occurs under your account.
• Notifying Datika immediately of any unauthorised use of your account at support@datika.co.ke.

You may not share your account or login credentials with others. Each subscription is for a single named user only.`,
  },
  {
    title: '4. Payments and subscriptions',
    content: `**M-Pesa payments**: Payments processed via Lipa na M-Pesa are subject to Safaricom's terms and conditions. Datika is not responsible for M-Pesa network failures or delays.

**Billing**: Pro and Teams subscriptions are billed monthly or annually as selected. Annual subscriptions are non-refundable after 14 days.

**Free trial**: New accounts receive a 7-day free Pro trial. Your plan will automatically revert to Free at the end of the trial unless you subscribe.

**Refunds**: We offer a 14-day money-back guarantee for first-time Pro subscriptions. To request a refund, email billing@datika.co.ke within 14 days of purchase.`,
  },
  {
    title: '5. Acceptable use',
    content: `You agree not to:

• Copy, reproduce, or redistribute any Datika course content without written permission.
• Use automated tools (bots, scrapers) to access platform content.
• Attempt to reverse-engineer, decompile, or extract course materials.
• Use the AI Tutor to generate content for resale or commercial distribution.
• Harass, bully, or discriminate against other community members.
• Circumvent any authentication, access controls, or payment systems.

Violation of these rules may result in immediate account termination without refund.`,
  },
  {
    title: '6. Intellectual property',
    content: `All course content, AI-generated materials, curricula, branding, and software on the Datika platform are the intellectual property of Datika Learning Ltd, unless otherwise stated. Your subscription grants a **personal, non-transferable, non-exclusive licence** to access content for your own learning purposes only.

Content you submit (forum posts, discussion comments) remains yours. By submitting it, you grant Datika a non-exclusive licence to display it on the platform.`,
  },
  {
    title: '7. AI-generated content',
    content: `Datika uses AI models including Meta Llama 4 Scout to generate course content, assessments, and tutor responses. While we review AI-generated content for accuracy, we do not guarantee it is error-free. You should not rely solely on AI-generated content for professional licensing, medical, legal, or financial decisions.

AI Tutor conversations are logged and may be reviewed to improve our models and platform quality.`,
  },
  {
    title: '8. Certificates',
    content: `Datika certificates are issued upon successful completion of all course requirements. They are:

• **Non-academic**: Datika certificates are professional learning credentials, not accredited academic qualifications.
• **Verifiable**: Each carries a unique QR code and verification ID accessible at datika.co.ke/verify.
• **Permanent**: Certificates do not expire and remain verifiable even if you cancel your subscription.`,
  },
  {
    title: '9. Limitation of liability',
    content: `To the maximum extent permitted by Kenyan law, Datika shall not be liable for:

• Loss of data or business resulting from platform downtime.
• Inaccuracies in AI-generated course content.
• Indirect, incidental, or consequential damages arising from your use of the platform.

Our total liability shall not exceed the amount you paid to Datika in the 12 months preceding the claim.`,
  },
  {
    title: '10. Termination',
    content: `You may delete your account at any time from your account settings. Datika may suspend or terminate accounts that violate these Terms. On termination:

• Your access to paid content will cease immediately.
• Your certificates will remain verifiable.
• Datika will retain your data per our Privacy Policy and applicable law.`,
  },
  {
    title: '11. Governing law',
    content: `These Terms are governed by the laws of the Republic of Kenya. Any disputes shall be resolved exclusively in the courts of Nairobi, Kenya. If you are located outside Kenya, you consent to the jurisdiction of Kenyan courts.`,
  },
  {
    title: '12. Changes to these terms',
    content: `Datika reserves the right to update these Terms at any time. Material changes will be communicated via email and an in-platform notice at least **14 days** before they take effect. Continued use after that date constitutes acceptance of the revised Terms.`,
  },
];

export default function TermsPage() {
  return (
    <>
      <section className="pt-40 pb-16 px-8 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.05) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: '#f97316' }}>Legal</span>
          <h1 className="text-4xl font-extrabold text-white mb-4">Terms of Service</h1>
          <p className="text-white/40 text-sm">Last updated: April 1, 2026 · Effective: April 1, 2026</p>
        </motion.div>
      </section>

      <section className="py-12 px-8 pb-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="p-5 rounded-2xl mb-8" style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.15)' }}>
            <p className="text-white/60 text-sm leading-relaxed">
              Please read these Terms of Service carefully before using the Datika platform. By accessing Datika, you agree to these terms.
              Questions? Email <a href="mailto:legal@datika.co.ke" style={{ color: '#f97316' }}>legal@datika.co.ke</a> or see our{' '}
              <Link href="/privacy" style={{ color: '#00d4ff' }}>Privacy Policy</Link>.
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

          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
            className="mt-12 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex flex-wrap gap-4">
              <Link href="/privacy" className="text-sm transition-colors" style={{ color: 'rgba(0,212,255,0.7)' }}>← Privacy Policy</Link>
              <Link href="/cookies" className="text-sm transition-colors" style={{ color: 'rgba(0,212,255,0.7)' }}>Cookie Policy →</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
