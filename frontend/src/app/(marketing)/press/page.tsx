'use client';
import { motion } from 'framer-motion';

const COVERAGE = [
  { outlet: 'TechCabal', title: 'Datika is the edtech startup bringing AI tutoring to African data scientists', date: 'March 2026', accent: '#00d4ff' },
  { outlet: 'Disrupt Africa', title: 'Kenyan startup Datika closes $1.2M pre-seed to expand AI learning platform', date: 'January 2026', accent: '#f97316' },
  { outlet: 'The Continent', title: 'How a weekend workshop became Africa\'s fastest-growing data science platform', date: 'December 2025', accent: '#a855f7' },
  { outlet: 'BD Africa', title: 'Datika partners with University of Nairobi to offer accredited data science paths', date: 'November 2025', accent: '#10b981' },
  { outlet: 'Wired UK', title: 'The African edtech startups reshaping who gets to learn AI', date: 'October 2025', accent: '#f59e0b' },
];

const ASSETS = [
  { name: 'Datika Logo Pack (SVG + PNG)', size: '2.1 MB', desc: 'Full logo, icon-only, white and dark variants' },
  { name: 'Brand Guidelines', size: '4.8 MB PDF', desc: 'Colours, typography, usage dos and don\'ts' },
  { name: 'Product Screenshots', size: '18 MB ZIP', desc: 'Dashboard, courses, AI Tutor — light & dark' },
  { name: 'Founder Headshots', size: '12 MB ZIP', desc: 'High-res professional photos of co-founders' },
  { name: 'Company Factsheet', size: '1.2 MB PDF', desc: 'Key stats, founding story, funding, team' },
];

export default function PressPage() {
  return (
    <>
      <section className="pt-40 pb-20 px-8 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.05) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: '#f97316' }}>Press & Media</span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-5 leading-[1.1]">
            Datika in the <span style={{ color: '#00d4ff' }}>news</span>
          </h1>
          <p className="text-white/45 text-xl max-w-xl mx-auto mb-8">Press enquiries: <a href="mailto:press@datika.co.ke" style={{ color: '#00d4ff' }}>press@datika.co.ke</a></p>
        </motion.div>
      </section>

      {/* Coverage */}
      <section className="py-16 px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-white mb-8">Media coverage</h2>
          <div className="space-y-4">
            {COVERAGE.map((c, i) => (
              <motion.div key={c.title} initial={{ opacity: 0, x: -16 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="flex items-start gap-5 p-5 rounded-2xl cursor-pointer transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${c.accent}25`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
                <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center font-bold text-xs"
                  style={{ background: `${c.accent}15`, color: c.accent, border: `1px solid ${c.accent}25` }}>
                  {c.outlet.slice(0, 2).toUpperCase()}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold mb-1" style={{ color: c.accent }}>{c.outlet}</p>
                  <p className="text-white/80 font-medium text-sm leading-snug">{c.title}</p>
                </div>
                <span className="text-xs text-white/25 flex-shrink-0">{c.date}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Assets */}
      <section className="py-20 px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-extrabold text-white mb-3">Press kit</h2>
          <p className="text-white/40 mb-8 text-sm">Download official assets for editorial use.</p>
          <div className="space-y-3">
            {ASSETS.map((a, i) => (
              <motion.div key={a.name} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.2)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)' }}>
                  <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#00d4ff" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white/80 font-medium text-sm">{a.name}</p>
                  <p className="text-white/30 text-xs mt-0.5">{a.desc}</p>
                </div>
                <span className="text-white/25 text-xs flex-shrink-0">{a.size}</span>
              </motion.div>
            ))}
          </div>
          <p className="text-white/30 text-xs mt-6">
            Assets are available for editorial and journalistic use only. For commercial use, contact <a href="mailto:press@datika.co.ke" style={{ color: '#00d4ff' }}>press@datika.co.ke</a>.
          </p>
        </div>
      </section>
    </>
  );
}
