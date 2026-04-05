'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Bot, Zap, BarChart3, CreditCard, Award, MessageSquare } from 'lucide-react';

const FEATURES = [
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: 'AI Optimization',
    desc: 'Collaborative ecosystem with open-source tools, curated datasets, and production-ready APIs.',
  },
  {
    icon: (
      <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 19.5V21M12 3v1.5m0 15V21m3.75-18v1.5m0 15V21m-9-1.5h10.5a2.25 2.25 0 002.25-2.25V6.75a2.25 2.25 0 00-2.25-2.25H6.75A2.25 2.25 0 004.5 6.75v10.5a2.25 2.25 0 002.25 2.25zm.75-12h9v9h-9v-9z" />
      </svg>
    ),
    title: 'Smart Analytics',
    desc: 'AI-powered grading, real-time feedback, and adaptive learning paths built for data professionals.',
  },
];

const NEWS = [
  {
    title: 'Llama 4 Scout Integration',
    desc: 'Our AI tutor now runs on Llama 4 Scout — multimodal, faster, and more accurate than ever.',
    gradient: 'from-cyan-500 to-blue-600',
  },
  {
    title: 'M-Pesa Instant Enrollment',
    desc: 'Pay and enrol in seconds via Lipa na M-Pesa — no credit card required.',
    gradient: 'from-orange-500 to-red-600',
  },
];

/* ── Animated AI brain visual ─────────────────────────────── */
function BrainVisual() {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Outer glow ring */}
      <div className="absolute w-80 h-80 rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)' }} />

      {/* Pulsing rings */}
      {[320, 260, 200].map((size, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-cyan-500/20"
          style={{ width: size, height: size }}
          animate={{ scale: [1, 1.04, 1], opacity: [0.3, 0.6, 0.3] }}
          transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.8 }}
        />
      ))}

      {/* Circuit base lines */}
      <svg className="absolute bottom-0 left-1/2 -translate-x-1/2" width="300" height="120" viewBox="0 0 300 120" fill="none">
        <path d="M150 0 L150 40 L80 40 L80 80 L40 80" stroke="rgba(0,212,255,0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M150 40 L220 40 L220 80 L260 80" stroke="rgba(0,212,255,0.25)" strokeWidth="1.5" strokeDasharray="4 4" />
        <path d="M150 0 L150 60 L150 100" stroke="rgba(0,212,255,0.3)" strokeWidth="1.5" />
        <path d="M80 80 L20 80" stroke="rgba(0,212,255,0.2)" strokeWidth="1" />
        <path d="M260 80 L300 80" stroke="rgba(0,212,255,0.2)" strokeWidth="1" />
        {/* Data nodes */}
        {[[150,0],[80,40],[220,40],[40,80],[150,100],[260,80]].map(([x,y],i) => (
          <circle key={i} cx={x} cy={y} r="3.5" fill="rgba(0,212,255,0.6)" />
        ))}
      </svg>

      {/* Brain sphere */}
      <div className="relative w-52 h-52 -mt-8">
        {/* Main glow */}
        <div className="absolute inset-0 rounded-full"
          style={{
            background: 'radial-gradient(circle at 38% 36%, rgba(0,212,255,0.35) 0%, rgba(0,100,200,0.5) 40%, rgba(0,20,80,0.9) 100%)',
            boxShadow: '0 0 60px rgba(0,212,255,0.4), 0 0 120px rgba(0,100,200,0.2)',
          }}
        />
        {/* Brain texture lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 200 200">
          <defs>
            <clipPath id="brainClip"><circle cx="100" cy="100" r="95" /></clipPath>
          </defs>
          <g clipPath="url(#brainClip)" stroke="rgba(0,212,255,0.3)" strokeWidth="1.2" fill="none">
            <path d="M50 80 Q80 60 110 80 Q140 100 160 80" />
            <path d="M40 100 Q70 80 100 100 Q130 120 160 100" />
            <path d="M50 120 Q80 100 110 120 Q140 140 160 120" />
            <path d="M60 70 Q90 50 120 70 Q150 90 170 70" />
            <path d="M100 40 Q100 60 80 80 Q60 100 80 120 Q100 140 100 160" />
            <path d="M80 40 Q100 55 120 40" />
            <path d="M70 150 Q100 140 130 150" />
          </g>
        </svg>
        {/* Highlight */}
        <div className="absolute top-8 left-10 w-16 h-10 rounded-full opacity-30"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 100%)' }} />
      </div>

      {/* Floating data particles */}
      {[
        { x: '-120px', y: '-60px', delay: 0 },
        { x: '100px', y: '-80px', delay: 0.5 },
        { x: '-80px', y: '80px', delay: 1 },
        { x: '120px', y: '60px', delay: 1.5 },
      ].map((p, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-cyan-400"
          style={{ left: `calc(50% + ${p.x})`, top: `calc(50% + ${p.y})` }}
          animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1.4, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: p.delay }}
        />
      ))}
    </div>
  );
}

/* ── Scroll indicator ─────────────────────────────────────── */
function ScrollDown() {
  return (
    <div className="flex items-center gap-2 cursor-pointer group">
      <span className="text-orange-400 text-sm font-medium group-hover:text-orange-300 transition-colors">Scroll Down</span>
      <motion.div
        animate={{ y: [0, 4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="w-6 h-9 rounded-full border border-orange-400/60 flex items-start justify-center pt-1.5"
      >
        <div className="w-1 h-2 bg-orange-400 rounded-full" />
      </motion.div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col pt-24">
        {/* Top gradient overlay */}
        <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, #070b16 0%, transparent 100%)' }} />

        <div className="relative flex-1 max-w-7xl mx-auto w-full px-8 grid grid-cols-1 lg:grid-cols-3 gap-0 items-start pt-20">

          {/* ── Left column: Heading + features + scroll ── */}
          <div className="lg:col-span-1 flex flex-col justify-between h-full py-8">
            <div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-5xl lg:text-6xl font-extrabold leading-[1.08] tracking-tight mb-12"
              >
                <span style={{ color: '#00d4ff' }}>Next Gen</span>{' '}
                <span className="text-white">of Data Science</span>
                <br />
                <span className="text-white">&amp; AI Technology</span>
              </motion.h1>

              <div className="space-y-8">
                {FEATURES.map((f, i) => (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.15 }}
                    className="flex gap-4"
                  >
                    <div className="w-12 h-12 rounded-full border border-white/15 flex items-center justify-center text-white/60 flex-shrink-0"
                      style={{ background: 'rgba(255,255,255,0.04)' }}>
                      {f.icon}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold mb-1">{f.title}</h3>
                      <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mt-16"
            >
              <ScrollDown />
            </motion.div>
          </div>

          {/* ── Centre column: Brain visual ── */}
          <div className="lg:col-span-1 flex items-center justify-center h-[520px] lg:h-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-full h-96 lg:h-full"
            >
              <BrainVisual />
            </motion.div>
          </div>

          {/* ── Right column: Description + CTA + News ── */}
          <div className="lg:col-span-1 flex flex-col justify-between h-full py-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="text-right"
            >
              <p className="text-white/55 text-base leading-relaxed mb-8 max-w-xs ml-auto">
                From AI-generated lessons to real-time grading, we're working to ensure world-class data science education is accessible to everyone.
              </p>
              <Link href="/register">
                <button className="border border-orange-400/70 text-orange-400 hover:bg-orange-400/10 font-semibold px-8 py-3.5 rounded-full transition-all text-base inline-block">
                  Start Now
                </button>
              </Link>
            </motion.div>

            {/* News section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mt-12 lg:mt-0"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 20,
                padding: '24px',
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-white font-bold text-lg">News</h3>
                <Link href="/blog" className="text-orange-400 text-sm hover:text-orange-300 transition-colors">See All</Link>
              </div>
              <div className="space-y-4">
                {NEWS.map((n, i) => (
                  <div key={i} className="flex gap-3 cursor-pointer group">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white/90 text-sm font-semibold group-hover:text-cyan-400 transition-colors leading-snug mb-1">
                        {n.title}
                      </h4>
                      <p className="text-white/40 text-xs leading-relaxed line-clamp-2">{n.desc}</p>
                    </div>
                    <div className={`w-20 h-14 rounded-xl bg-gradient-to-br ${n.gradient} flex-shrink-0 opacity-80`} />
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Features section ─────────────────────────────────── */}
      <section id="features" className="py-32 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg, transparent 0%, rgba(0,212,255,0.02) 50%, transparent 100%)' }} />
        <div className="max-w-7xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-orange-400 text-sm font-semibold tracking-widest uppercase mb-4 block">Platform</span>
            <h2 className="text-5xl font-extrabold text-white mb-5 leading-tight">
              Built for the <span style={{ color: '#00d4ff' }}>Next Generation</span>
            </h2>
            <p className="text-white/50 text-lg max-w-xl mx-auto">
              A complete learning ecosystem designed for aspiring data scientists and AI professionals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon: <Bot size={24} />, title: 'AI-Generated Content', desc: 'Lessons, quizzes, and assignments generated by Llama 4 Scout — referenced, rigorous, and ready to use.', accent: '#00d4ff', href: '/ai-tutor' },
              { icon: <Zap size={24} />, title: 'Instant AI Grading', desc: 'Submit SQL, Python code, or written answers and receive detailed AI feedback within seconds.', accent: '#f97316', href: '/technology' },
              { icon: <BarChart3 size={24} />, title: 'Structured Curriculum', desc: 'Courses covering SQL, Python, pandas, data visualisation, EDA, and machine learning.', accent: '#00d4ff', href: '/courses' },
              { icon: <CreditCard size={24} />, title: 'M-Pesa Payments', desc: 'Enrol instantly via Lipa na M-Pesa — seamless, secure, no credit card required.', accent: '#f97316', href: '/pricing' },
              { icon: <Award size={24} />, title: 'Verified Certificates', desc: 'Earn shareable certificates with unique verification codes upon course completion.', accent: '#00d4ff', href: '/certificates' },
              { icon: <MessageSquare size={24} />, title: 'AI Tutor Chat', desc: 'Context-aware AI tutor trained on your course content, available 24/7.', accent: '#f97316', href: '/ai-tutor' },
            ].map((f, i) => (
              <Link key={f.title} href={f.href}>
                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.07 }}
                  className="group cursor-pointer p-6 rounded-2xl transition-all duration-200 hover:-translate-y-1 h-full"
                  style={{
                    background: 'rgba(255,255,255,0.03)',
                    border: '1px solid rgba(255,255,255,0.07)',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.border = `1px solid ${f.accent}30`; e.currentTarget.style.background = `${f.accent}08`; }}
                  onMouseLeave={(e) => { e.currentTarget.style.border = '1px solid rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                >
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${f.accent}15`, color: f.accent }}>{f.icon}</div>
                  <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                  <p className="text-white/45 text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────── */}
      <section className="py-16 border-y" style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(0,212,255,0.02)' }}>
        <div className="max-w-5xl mx-auto px-8 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[['24+','Courses'],['1.2K','Students'],['500+','AI Lessons'],['380+','Certificates']].map(([v,l]) => (
            <motion.div key={l} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              <div className="text-3xl font-extrabold mb-1" style={{ color: '#00d4ff' }}>{v}</div>
              <div className="text-white/45 text-sm">{l}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────── */}
      <section className="py-32">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-5xl font-extrabold mb-6 leading-tight">
              <span style={{ color: '#00d4ff' }}>Start your</span> data science<br />journey today
            </h2>
            <p className="text-white/50 text-lg mb-10">
              Join thousands of professionals learning on Datika. Pay with M-Pesa. Learn at your pace.
            </p>
            <Link href="/register">
              <button className="border border-orange-400/70 text-orange-400 hover:bg-orange-400/10 font-semibold px-12 py-4 rounded-full transition-all text-lg">
                Create Free Account
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
