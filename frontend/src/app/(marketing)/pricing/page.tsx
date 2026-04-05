'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const PLANS = [
  {
    name: 'Free',
    price: { monthly: 0, annual: 0 },
    currency: 'KES',
    desc: 'Perfect for exploring data science.',
    accent: '#10b981',
    features: [
      '3 free introductory courses',
      'AI Tutor (10 messages/day)',
      'Community forum access',
      'Course completion badges',
      'Mobile & web access',
    ],
    cta: 'Get started free',
    href: '/register',
    popular: false,
  },
  {
    name: 'Pro',
    price: { monthly: 2500, annual: 1800 },
    currency: 'KES',
    desc: 'For serious learners building a career.',
    accent: '#00d4ff',
    features: [
      'All 24+ courses, unlimited access',
      'AI Tutor (unlimited messages)',
      'Live session recordings',
      'Verified certificates',
      'AI grading on all assignments',
      'Priority support',
      'Offline downloads',
    ],
    cta: 'Start Pro — pay with M-Pesa',
    href: '/register?plan=pro',
    popular: true,
  },
  {
    name: 'Teams',
    price: { monthly: 1800, annual: 1400 },
    currency: 'KES',
    desc: 'Per seat. For companies training their teams.',
    accent: '#f97316',
    features: [
      'Everything in Pro',
      'Team analytics dashboard',
      'Custom learning paths',
      'Dedicated account manager',
      'Invoice & bulk M-Pesa payments',
      'SSO / SAML integration',
      'Private community space',
    ],
    cta: 'Contact sales',
    href: '/contact',
    popular: false,
  },
];

const FAQ = [
  { q: 'How does M-Pesa payment work?', a: 'You enter your phone number, we send a push notification to your phone. Enter your M-Pesa PIN — done. Your account is activated instantly.' },
  { q: 'Can I switch plans at any time?', a: 'Yes. You can upgrade or downgrade your plan at any time from your account settings. Billing is prorated.' },
  { q: 'Is there a free trial for Pro?', a: 'Yes — all new accounts get a 7-day free Pro trial with no credit card or M-Pesa required.' },
  { q: 'Do certificates expire?', a: 'No. Your Datika certificates are permanent and verifiable via a unique QR code forever.' },
  { q: 'What if my team is large?', a: 'Contact our sales team for custom enterprise pricing and volume discounts for 20+ seats.' },
];

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-16 px-8 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.05) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: '#f97316' }}>Pricing</span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-5 leading-[1.1]">
            Simple, <span style={{ color: '#00d4ff' }}>honest</span> pricing
          </h1>
          <p className="text-white/45 text-xl mb-10">Pay with M-Pesa. Cancel anytime. No hidden fees.</p>
          {/* Toggle */}
          <div className="inline-flex items-center gap-3 rounded-2xl p-1.5" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <button onClick={() => setAnnual(false)}
              className="px-5 py-2 rounded-xl text-sm font-medium transition-all"
              style={!annual ? { background: 'rgba(0,212,255,0.15)', color: '#00d4ff' } : { color: 'rgba(255,255,255,0.4)' }}>
              Monthly
            </button>
            <button onClick={() => setAnnual(true)}
              className="px-5 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2"
              style={annual ? { background: 'rgba(0,212,255,0.15)', color: '#00d4ff' } : { color: 'rgba(255,255,255,0.4)' }}>
              Annual
              <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>Save 28%</span>
            </button>
          </div>
        </motion.div>
      </section>

      {/* Plans */}
      <section className="py-10 px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-5">
          {PLANS.map((plan, i) => (
            <motion.div key={plan.name} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className="relative flex flex-col rounded-2xl p-7"
              style={{
                background: plan.popular ? `rgba(0,212,255,0.05)` : 'rgba(255,255,255,0.03)',
                border: `1px solid ${plan.popular ? 'rgba(0,212,255,0.3)' : 'rgba(255,255,255,0.07)'}`,
                boxShadow: plan.popular ? '0 0 40px rgba(0,212,255,0.08)' : 'none',
              }}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold"
                  style={{ background: 'linear-gradient(135deg,#00d4ff,#0d6efd)', color: '#fff' }}>
                  Most Popular
                </div>
              )}
              <div>
                <span className="text-sm font-semibold" style={{ color: plan.accent }}>{plan.name}</span>
                <div className="mt-3 mb-1">
                  {plan.price.monthly === 0 ? (
                    <span className="text-4xl font-extrabold text-white">Free</span>
                  ) : (
                    <span className="text-4xl font-extrabold text-white">
                      KES {(annual ? plan.price.annual : plan.price.monthly).toLocaleString()}
                      <span className="text-base font-normal text-white/35">/mo</span>
                    </span>
                  )}
                </div>
                <p className="text-white/40 text-sm mb-6">{plan.desc}</p>
                <Link href={plan.href}>
                  <button className="w-full h-11 rounded-xl font-semibold text-sm transition-all mb-7"
                    style={plan.popular
                      ? { background: 'linear-gradient(135deg,#00d4ff,#0d6efd)', color: '#fff', boxShadow: '0 0 20px rgba(0,212,255,0.25)' }
                      : { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    {plan.cta}
                  </button>
                </Link>
              </div>
              <ul className="space-y-3 flex-1">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="flex-shrink-0 mt-0.5">
                      <circle cx="8" cy="8" r="7" fill={`${plan.accent}20`} stroke={plan.accent} strokeWidth="1" />
                      <path d="M5 8l2 2 4-4" stroke={plan.accent} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="text-sm text-white/60">{f}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white text-center mb-12">Frequently asked questions</h2>
          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <div key={i} className="rounded-2xl overflow-hidden cursor-pointer" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                <div className="flex items-center justify-between px-5 py-4">
                  <p className="text-white/80 font-medium text-sm">{item.q}</p>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                    className="flex-shrink-0 transition-transform" style={{ color: '#00d4ff', transform: openFaq === i ? 'rotate(180deg)' : 'none' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
                {openFaq === i && (
                  <div className="px-5 pb-4">
                    <p className="text-white/45 text-sm leading-relaxed">{item.a}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
