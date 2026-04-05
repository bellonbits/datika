'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';

const SECTIONS = [
  {
    title: 'Getting Started',
    accent: '#00d4ff',
    articles: [
      { title: 'Create your account', desc: 'Sign up with email, Google, or M-Pesa in under 2 minutes.' },
      { title: 'Choose a learning path', desc: 'Find the right track for your experience level and goals.' },
      { title: 'Take your first lesson', desc: 'Navigate the course player, notes, and AI Tutor.' },
      { title: 'Complete your profile', desc: 'Add your bio, skills, and learning goals.' },
    ],
  },
  {
    title: 'Courses & Learning',
    accent: '#f97316',
    articles: [
      { title: 'How courses are structured', desc: 'Modules, lessons, quizzes, and projects explained.' },
      { title: 'Submitting assignments', desc: 'Upload code or written answers for AI grading.' },
      { title: 'Using the AI Tutor', desc: 'Get help, explanations, and practice problems.' },
      { title: 'Live sessions', desc: 'Join, register, and access recordings.' },
    ],
  },
  {
    title: 'Certificates',
    accent: '#a855f7',
    articles: [
      { title: 'Earning a certificate', desc: 'Complete all courses in a learning path.' },
      { title: 'Sharing your certificate', desc: 'LinkedIn, Twitter, and downloadable PDF.' },
      { title: 'Verifying a certificate', desc: 'How employers can verify authenticity via QR code.' },
      { title: 'Certificate expiry', desc: 'They don\'t expire — your credentials are permanent.' },
    ],
  },
  {
    title: 'Billing & Payments',
    accent: '#10b981',
    articles: [
      { title: 'Pay with M-Pesa', desc: 'Step-by-step: STK push, PIN entry, instant activation.' },
      { title: 'Pay by card (Stripe)', desc: 'International Visa/Mastercard payments.' },
      { title: 'Upgrade or downgrade', desc: 'Change your plan at any time, prorated billing.' },
      { title: 'Request a refund', desc: 'Our 7-day no-questions-asked refund policy.' },
    ],
  },
  {
    title: 'Teams & Enterprise',
    accent: '#f59e0b',
    articles: [
      { title: 'Set up a team', desc: 'Invite members, assign courses, and track progress.' },
      { title: 'Team analytics', desc: 'Completion rates, time-on-platform, and skill gaps.' },
      { title: 'Custom learning paths', desc: 'Build bespoke paths for your organisation.' },
      { title: 'SSO / SAML setup', desc: 'Integrate with your company\'s identity provider.' },
    ],
  },
  {
    title: 'API & Integrations',
    accent: '#ec4899',
    articles: [
      { title: 'API overview', desc: 'REST API for enterprise integrations. Authentication, rate limits.' },
      { title: 'Webhooks', desc: 'Get notified when a learner completes a course or earns a cert.' },
      { title: 'LMS integrations', desc: 'Connect with Moodle, Canvas, and Google Classroom.' },
      { title: 'Zapier integration', desc: 'Automate workflows with 5,000+ apps.' },
    ],
  },
];

export default function DocsPage() {
  const [search, setSearch] = useState('');

  const filtered = SECTIONS.map((s) => ({
    ...s,
    articles: s.articles.filter(
      (a) =>
        search === '' ||
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.desc.toLowerCase().includes(search.toLowerCase())
    ),
  })).filter((s) => s.articles.length > 0);

  return (
    <>
      <section className="pt-40 pb-16 px-8 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.06) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: '#f97316' }}>Documentation</span>
          <h1 className="text-5xl font-extrabold mb-5 leading-[1.1]">
            <span style={{ color: '#00d4ff' }}>Help centre</span> & docs
          </h1>
          <p className="text-white/45 text-xl max-w-xl mx-auto mb-8">Everything you need to get the most out of Datika.</p>
          {/* Search */}
          <div className="max-w-md mx-auto relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="rgba(255,255,255,0.3)" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
            </svg>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search documentation..."
              className="w-full h-12 pl-11 pr-4 rounded-xl text-sm outline-none text-white placeholder:text-white/25"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </div>
        </motion.div>
      </section>

      <section className="py-12 px-8 pb-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((section, si) => (
            <motion.div key={section.title} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: si * 0.06 }}
              className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full" style={{ background: section.accent }} />
                <h2 className="text-sm font-semibold uppercase tracking-wider" style={{ color: section.accent }}>{section.title}</h2>
              </div>
              <div className="space-y-3">
                {section.articles.map((a) => (
                  <div key={a.title} className="cursor-pointer group"
                    onMouseEnter={(e) => { (e.currentTarget.querySelector('p:first-child') as HTMLElement)!.style.color = section.accent; }}
                    onMouseLeave={(e) => { (e.currentTarget.querySelector('p:first-child') as HTMLElement)!.style.color = 'rgba(255,255,255,0.8)'; }}>
                    <p className="text-white/80 text-sm font-medium transition-colors">{a.title}</p>
                    <p className="text-white/30 text-xs mt-0.5 leading-relaxed">{a.desc}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="text-center py-20 text-white/30">
            <p className="text-4xl mb-3">🔍</p>
            <p>No articles found for "<span className="text-white/50">{search}</span>"</p>
          </div>
        )}
      </section>
    </>
  );
}
