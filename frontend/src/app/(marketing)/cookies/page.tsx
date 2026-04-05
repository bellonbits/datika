'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const COOKIE_TYPES = [
  {
    name: 'Strictly Necessary',
    required: true,
    accent: '#10b981',
    desc: 'These cookies are essential for the Datika platform to function and cannot be disabled. They include session management, authentication, and security tokens.',
    examples: [
      { name: 'datika_session', purpose: 'Maintains your login session', duration: 'Session' },
      { name: 'datika_csrf', purpose: 'Cross-site request forgery protection', duration: 'Session' },
      { name: '__auth_token', purpose: 'Authentication JWT token (httpOnly)', duration: '7 days' },
    ],
  },
  {
    name: 'Analytics & Performance',
    required: false,
    accent: '#00d4ff',
    desc: 'These cookies help us understand how learners use the platform, which content is most popular, and where we can improve. All data is anonymised.',
    examples: [
      { name: '_plausible', purpose: 'Aggregated page views (Plausible Analytics — no cross-site tracking)', duration: '1 year' },
      { name: '_datika_perf', purpose: 'Tracks course completion funnel for UX improvements', duration: '90 days' },
    ],
  },
  {
    name: 'Functional',
    required: false,
    accent: '#a855f7',
    desc: 'These cookies enable enhanced features such as remembering your preferences, theme settings, and language choice.',
    examples: [
      { name: 'datika_prefs', purpose: 'Stores UI preferences (dark mode, language)', duration: '1 year' },
      { name: 'datika_player', purpose: 'Remembers video playback speed and progress', duration: '30 days' },
    ],
  },
  {
    name: 'Marketing',
    required: false,
    accent: '#f97316',
    desc: 'We use limited marketing cookies to understand how learners find us. We do not serve third-party advertising on the platform.',
    examples: [
      { name: '_fbp', purpose: 'Facebook Pixel — measures ad campaign effectiveness', duration: '90 days' },
      { name: '_gcl_au', purpose: 'Google Ads conversion tracking', duration: '90 days' },
    ],
  },
];

const SECTIONS = [
  {
    title: 'What are cookies?',
    content: `Cookies are small text files placed on your device when you visit a website. They allow websites to remember your preferences, keep you logged in, and collect anonymous usage statistics. Cookies cannot run programs or deliver viruses to your device.`,
  },
  {
    title: 'How we use cookies',
    content: `Datika uses cookies to:

• Keep you logged in between visits.
• Remember your course progress and preferences.
• Understand which features are most useful so we can improve the platform.
• Measure the effectiveness of our marketing so we only spend money on channels that work.

We do not use cookies to serve advertising to you, sell your data, or track you across third-party websites.`,
  },
  {
    title: 'Managing your cookie preferences',
    content: `**Strictly Necessary cookies** cannot be disabled as they are required for the platform to function.

For all other categories, you can update your preferences at any time:

• **Account settings**: If you are logged in, go to Settings → Privacy → Cookie Preferences.
• **Cookie banner**: The banner appears on your first visit and can be recalled from the footer.
• **Browser settings**: Most browsers allow you to view, delete, and block cookies. Note that blocking functional cookies may degrade your experience.

Your preferences are saved for 1 year. After that, we will ask again.`,
  },
  {
    title: 'Third-party cookies',
    content: `Some features embed content or services from third parties that may set their own cookies:

• **Vimeo** (course video player): May set analytics cookies. Controlled by Vimeo's privacy settings.
• **Safaricom Daraja** (M-Pesa payment widget): Session cookies required to complete payment.
• **Intercom** (support chat): Sets functional cookies to maintain your chat session.

We have evaluated each third party and selected providers with strong privacy practices.`,
  },
  {
    title: 'Do Not Track',
    content: `Datika respects the Do Not Track (DNT) browser signal. When DNT is enabled, we automatically disable all non-essential cookies and do not load analytics or marketing scripts.`,
  },
  {
    title: 'Updates to this policy',
    content: `We review this Cookie Policy regularly. Material changes will be notified via the platform cookie banner and email. The "last updated" date at the top reflects the most recent revision.`,
  },
];

export default function CookiesPage() {
  return (
    <>
      <section className="pt-40 pb-16 px-8 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.05) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: '#f97316' }}>Legal</span>
          <h1 className="text-4xl font-extrabold text-white mb-4">Cookie Policy</h1>
          <p className="text-white/40 text-sm">Last updated: April 1, 2026 · Effective: April 1, 2026</p>
        </motion.div>
      </section>

      <section className="py-12 px-8 pb-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="p-5 rounded-2xl mb-10" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <p className="text-white/60 text-sm leading-relaxed">
              This policy explains what cookies Datika uses, why we use them, and how you can control them.
              Questions? Email <a href="mailto:privacy@datika.co.ke" style={{ color: '#00d4ff' }}>privacy@datika.co.ke</a> or see our{' '}
              <Link href="/privacy" style={{ color: '#00d4ff' }}>Privacy Policy</Link>.
            </p>
          </motion.div>

          {/* Cookie type breakdown */}
          <div className="space-y-6 mb-12">
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
              className="text-white font-bold text-xl mb-6">Cookies we use</motion.h2>
            {COOKIE_TYPES.map((type, i) => (
              <motion.div key={type.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full" style={{ background: type.accent }} />
                    <span className="text-white font-semibold text-sm">{type.name}</span>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full font-medium"
                    style={type.required
                      ? { background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }
                      : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {type.required ? 'Always on' : 'Optional'}
                  </span>
                </div>
                <div className="p-6">
                  <p className="text-white/50 text-sm leading-relaxed mb-5">{type.desc}</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr style={{ color: 'rgba(255,255,255,0.3)' }}>
                          <th className="text-left pb-2 pr-4 font-medium">Name</th>
                          <th className="text-left pb-2 pr-4 font-medium">Purpose</th>
                          <th className="text-left pb-2 font-medium">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        {type.examples.map((ex) => (
                          <tr key={ex.name} style={{ color: 'rgba(255,255,255,0.5)' }}>
                            <td className="py-1.5 pr-4 font-mono" style={{ color: type.accent }}>{ex.name}</td>
                            <td className="py-1.5 pr-4">{ex.purpose}</td>
                            <td className="py-1.5 whitespace-nowrap">{ex.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Text sections */}
          <div className="space-y-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '2rem' }}>
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
              <Link href="/terms" className="text-sm transition-colors" style={{ color: 'rgba(0,212,255,0.7)' }}>← Terms of Service</Link>
              <Link href="/privacy" className="text-sm transition-colors" style={{ color: 'rgba(0,212,255,0.7)' }}>Privacy Policy →</Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
