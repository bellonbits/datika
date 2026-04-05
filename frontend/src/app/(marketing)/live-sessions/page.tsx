'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const UPCOMING = [
  { title: 'SQL Window Functions Deep Dive', instructor: 'Brian Otieno', date: 'April 22, 2026 · 7 PM EAT', seats: 38, total: 100, accent: '#00d4ff' },
  { title: 'Building ML Pipelines with scikit-learn', instructor: 'Kevin Mwenda', date: 'April 29, 2026 · 6 PM EAT', seats: 61, total: 100, accent: '#f97316' },
  { title: 'Pandas for Real-World Data Cleaning', instructor: 'Prof. Jane Wangari', date: 'May 6, 2026 · 7 PM EAT', seats: 24, total: 80, accent: '#a855f7' },
  { title: 'Power BI for African Business Data', instructor: 'Aisha Kamau', date: 'May 13, 2026 · 6 PM EAT', seats: 52, total: 80, accent: '#10b981' },
];

const FEATURES = [
  { icon: '🎙️', title: 'Live Q&A', desc: 'Ask questions in real-time and get answers from expert instructors directly.' },
  { icon: '📼', title: 'Always recorded', desc: 'Can\'t make it live? Every session is recorded and available within 2 hours.' },
  { icon: '💻', title: 'Live coding', desc: 'Follow along as instructors code in real-time with shared screens and live notebooks.' },
  { icon: '👥', title: 'Breakout rooms', desc: 'Practice with other learners in small groups during hands-on exercises.' },
  { icon: '📋', title: 'Session notes', desc: 'Get structured notes, code snippets, and resource links after every session.' },
  { icon: '🏅', title: 'Attendance credit', desc: 'Attending sessions counts toward your certificate progress.' },
];

export default function LiveSessionsPage() {
  return (
    <>
      <section className="pt-40 pb-20 px-8 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(16,185,129,0.06) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: '#f97316' }}>Live Sessions</span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-5 leading-[1.1]">
            Learn live with <span style={{ color: '#00d4ff' }}>expert instructors</span>
          </h1>
          <p className="text-white/45 text-xl max-w-xl mx-auto mb-10">Weekly live sessions, interactive Q&A, and recorded replays. The best of a classroom — delivered online.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register"><button className="h-12 px-10 rounded-xl font-semibold text-white text-base"
              style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 0 24px rgba(249,115,22,0.3)' }}>
              Join a session
            </button></Link>
            <a href="#upcoming"><button className="h-12 px-8 rounded-xl font-medium text-sm text-white/60 hover:text-white transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              View schedule
            </button></a>
          </div>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-16 px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Upcoming sessions */}
      <section id="upcoming" className="py-20 px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <h2 className="text-3xl font-extrabold text-white mb-3">Upcoming live sessions</h2>
            <p className="text-white/40">Reserve your seat — spaces are limited.</p>
          </motion.div>
          <div className="space-y-4">
            {UPCOMING.map((s, i) => (
              <motion.div key={s.title} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <h3 className="text-white font-semibold">{s.title}</h3>
                    <p className="text-white/40 text-sm mt-0.5">{s.instructor} · {s.date}</p>
                  </div>
                  <Link href="/register">
                    <button className="flex-shrink-0 h-9 px-5 rounded-xl text-sm font-semibold transition-all text-white"
                      style={{ background: `${s.accent}20`, border: `1px solid ${s.accent}35`, color: s.accent }}>
                      Register
                    </button>
                  </Link>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${(s.seats / s.total) * 100}%`, background: s.accent }} />
                  </div>
                  <span className="text-xs text-white/30 flex-shrink-0">{s.total - s.seats} seats left</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pro access note */}
      <section className="py-16 px-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl mb-6"
            style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <span style={{ color: '#00d4ff' }}>✦</span>
            <span className="text-white/70 text-sm">Live sessions and recordings are included in the <strong className="text-white">Pro plan</strong></span>
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4">Upgrade to Pro</h2>
          <p className="text-white/40 mb-8 max-w-md mx-auto">Get unlimited access to all live sessions, recordings, and AI Tutor for KES 2,500/month.</p>
          <Link href="/pricing">
            <button className="h-12 px-10 rounded-xl font-semibold text-white text-base"
              style={{ background: 'linear-gradient(135deg,#00d4ff,#0d6efd)', boxShadow: '0 0 24px rgba(0,212,255,0.25)' }}>
              View pricing →
            </button>
          </Link>
        </motion.div>
      </section>
    </>
  );
}
