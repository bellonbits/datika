'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const CHANNELS = [
  { name: '#general', desc: 'Introduce yourself and connect with fellow learners', members: 1240, accent: '#00d4ff' },
  { name: '#python-help', desc: 'Get help with Python syntax, pandas, and scripts', members: 843, accent: '#f97316' },
  { name: '#sql-queries', desc: 'Share and debug SQL queries with the community', members: 612, accent: '#a855f7' },
  { name: '#ml-projects', desc: 'Show off your machine learning projects', members: 489, accent: '#10b981' },
  { name: '#job-board', desc: 'Data science job listings and career advice', members: 1056, accent: '#f59e0b' },
  { name: '#ai-news', desc: 'Latest in AI research, tools, and industry news', members: 921, accent: '#ec4899' },
];

const EVENTS = [
  { title: 'Nairobi Data Science Meetup', date: 'April 19, 2026', type: 'In-Person', loc: 'iHub, Nairobi', accent: '#00d4ff' },
  { title: 'SQL Masterclass — Live Session', date: 'April 22, 2026', type: 'Online', loc: 'Zoom / Datika Platform', accent: '#f97316' },
  { title: 'PyCon Africa 2026', date: 'May 10–12, 2026', type: 'Conference', loc: 'Accra, Ghana', accent: '#a855f7' },
  { title: 'ML Project Showcase', date: 'May 30, 2026', type: 'Online', loc: 'Datika Live', accent: '#10b981' },
];

export default function CommunityPage() {
  return (
    <>
      <section className="pt-40 pb-20 px-8 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.06) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: '#f97316' }}>Community</span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-5 leading-[1.1]">
            Learn together, <span style={{ color: '#00d4ff' }}>grow faster</span>
          </h1>
          <p className="text-white/45 text-xl max-w-xl mx-auto mb-10">Join 1,200+ data science learners across Africa. Ask questions, share projects, find jobs.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/register"><button className="h-11 px-8 rounded-xl font-semibold text-white text-sm"
              style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 0 20px rgba(249,115,22,0.25)' }}>
              Join the community
            </button></Link>
            <a href="#events"><button className="h-11 px-8 rounded-xl font-medium text-sm text-white/60 hover:text-white transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              View events
            </button></a>
          </div>
        </motion.div>
      </section>

      {/* Channels */}
      <section className="py-16 px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-3">Community channels</h2>
          <p className="text-white/40 mb-10">Join our Discord server with dedicated channels for every topic.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CHANNELS.map((c, i) => (
              <motion.div key={c.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="p-5 rounded-2xl cursor-pointer transition-all group"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${c.accent}30`; e.currentTarget.style.background = `${c.accent}06`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-sm" style={{ color: c.accent }}>{c.name}</span>
                  <span className="text-xs text-white/25">{c.members.toLocaleString()} members</span>
                </div>
                <p className="text-white/45 text-sm leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <a href="#" className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm transition-all text-white/70 hover:text-white"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24"><path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 003.677 4.37a.07.07 0 00-.032.027C.533 9.046-.32 13.58.099 18.057.1 18.08.11 18.1.12 18.12a19.963 19.963 0 005.993 3.03.078.078 0 00.084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 00-.041-.106 13.107 13.107 0 01-1.872-.892.077.077 0 01-.008-.128 10.2 10.2 0 00.372-.292.074.074 0 01.077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 01.078.01c.12.098.246.198.373.292a.077.077 0 01-.006.127 12.299 12.299 0 01-1.873.892.077.077 0 00-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 00.084.028 19.839 19.839 0 006.002-3.03.077.077 0 00.032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 00-.031-.03z"/></svg>
              Join our Discord server
            </a>
          </div>
        </div>
      </section>

      {/* Events */}
      <section id="events" className="py-20 px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-extrabold text-white mb-3">Upcoming events</h2>
          <p className="text-white/40 mb-10">Meetups, live sessions, and conferences — online and across Africa.</p>
          <div className="space-y-4">
            {EVENTS.map((ev, i) => (
              <motion.div key={ev.title} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="flex items-center gap-5 p-5 rounded-2xl cursor-pointer group transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${ev.accent}25`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
                <div className="w-14 h-14 rounded-xl flex flex-col items-center justify-center flex-shrink-0 text-center"
                  style={{ background: `${ev.accent}15`, border: `1px solid ${ev.accent}25` }}>
                  <span className="text-xs font-bold" style={{ color: ev.accent }}>{ev.date.split(' ')[0].toUpperCase()}</span>
                  <span className="text-xl font-extrabold text-white leading-none">{ev.date.split(' ')[1].replace(',','')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/85 font-semibold">{ev.title}</p>
                  <p className="text-white/35 text-sm mt-0.5">{ev.loc}</p>
                </div>
                <span className="text-xs font-medium px-3 py-1 rounded-full flex-shrink-0"
                  style={{ background: `${ev.accent}12`, color: ev.accent, border: `1px solid ${ev.accent}20` }}>
                  {ev.type}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
