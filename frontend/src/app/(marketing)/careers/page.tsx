'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Globe, BookOpen, HeartPulse, Coins, Palmtree, Bot } from 'lucide-react';

const JOBS = [
  { title: 'Senior Full-Stack Engineer', dept: 'Engineering', location: 'Nairobi / Remote', type: 'Full-time', accent: '#00d4ff' },
  { title: 'AI/ML Engineer', dept: 'AI Research', location: 'Remote', type: 'Full-time', accent: '#a855f7' },
  { title: 'Curriculum Designer — Data Science', dept: 'Content', location: 'Nairobi', type: 'Full-time', accent: '#f97316' },
  { title: 'Product Designer (UX/UI)', dept: 'Design', location: 'Remote', type: 'Full-time', accent: '#10b981' },
  { title: 'Community Manager', dept: 'Growth', location: 'Nairobi', type: 'Full-time', accent: '#f59e0b' },
  { title: 'Data Science Instructor', dept: 'Content', location: 'Remote / Hybrid', type: 'Contract', accent: '#ec4899' },
];

const PERKS = [
  { icon: <Globe size={22} />, title: 'Remote-first', desc: 'Work from anywhere in Africa. We have hubs in Nairobi, Lagos, and Accra.', accent: '#00d4ff' },
  { icon: <BookOpen size={22} />, title: 'Learning budget', desc: 'KES 50,000/year for courses, conferences, and books.', accent: '#f97316' },
  { icon: <HeartPulse size={22} />, title: 'Health cover', desc: 'Full medical insurance for you and your immediate family.', accent: '#ec4899' },
  { icon: <Coins size={22} />, title: 'Equity', desc: 'Competitive salary + meaningful equity in a fast-growing startup.', accent: '#f59e0b' },
  { icon: <Palmtree size={22} />, title: 'Unlimited leave', desc: 'We trust you to manage your time. Take the rest you need.', accent: '#10b981' },
  { icon: <Bot size={22} />, title: 'AI tools', desc: 'Full access to all AI tools and Datika platform for your own learning.', accent: '#a855f7' },
];

export default function CareersPage() {
  const [filter, setFilter] = useState('All');
  const depts = ['All', ...Array.from(new Set(JOBS.map((j) => j.dept)))];
  const filtered = filter === 'All' ? JOBS : JOBS.filter((j) => j.dept === filter);

  return (
    <>
      {/* Hero */}
      <section className="pt-40 pb-20 px-8 text-center relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.06) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative max-w-3xl mx-auto">
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: '#f97316' }}>We're hiring</span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-5 leading-[1.1]">
            Build the future of <span style={{ color: '#00d4ff' }}>African EdTech</span>
          </h1>
          <p className="text-white/45 text-xl max-w-xl mx-auto">Join a team of builders, educators, and AI enthusiasts on a mission to democratise data science across Africa.</p>
        </motion.div>
      </section>

      {/* Perks */}
      <section className="py-16 px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white text-center mb-12">Why join Datika?</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PERKS.map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${p.accent}15`, color: p.accent }}>{p.icon}</div>
                <h3 className="text-white font-semibold mb-1">{p.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="py-20 px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-8">Open positions</h2>
          {/* Filter tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {depts.map((d) => (
              <button key={d} onClick={() => setFilter(d)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all"
                style={filter === d
                  ? { background: 'rgba(0,212,255,0.15)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }
                  : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {d}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {filtered.map((job, i) => (
              <motion.div key={job.title} initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                className="flex items-center gap-4 p-5 rounded-2xl cursor-pointer transition-all group"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${job.accent}30`; e.currentTarget.style.background = `${job.accent}06`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
                <div className="w-10 h-10 rounded-xl flex-shrink-0" style={{ background: `${job.accent}15`, border: `1px solid ${job.accent}25` }} />
                <div className="flex-1 min-w-0">
                  <p className="text-white/85 font-semibold">{job.title}</p>
                  <p className="text-white/35 text-sm mt-0.5">{job.dept} · {job.location}</p>
                </div>
                <span className="text-xs font-medium px-3 py-1 rounded-full flex-shrink-0"
                  style={{ background: `${job.accent}12`, color: job.accent, border: `1px solid ${job.accent}20` }}>
                  {job.type}
                </span>
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  className="flex-shrink-0 transition-transform group-hover:translate-x-1" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-white/30 text-sm mt-8">
            Don't see a fit?{' '}
            <Link href="/contact" className="underline hover:text-white/60 transition-colors">Send us your CV anyway →</Link>
          </p>
        </div>
      </section>
    </>
  );
}
