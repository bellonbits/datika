'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Link2, Infinity, Globe, Landmark, GraduationCap } from 'lucide-react';

const CERTS = [
  { title: 'Data Science Fundamentals', level: 'Beginner', courses: 4, accent: '#10b981', hours: '40h' },
  { title: 'Python for Data Analysis', level: 'Intermediate', courses: 6, accent: '#00d4ff', hours: '60h' },
  { title: 'Machine Learning Engineer', level: 'Advanced', courses: 8, accent: '#a855f7', hours: '90h' },
  { title: 'SQL & Database Mastery', level: 'Intermediate', courses: 5, accent: '#f97316', hours: '50h' },
  { title: 'AI Product Manager', level: 'Professional', courses: 7, accent: '#f59e0b', hours: '70h' },
  { title: 'Data Engineering', level: 'Advanced', courses: 9, accent: '#ec4899', hours: '100h' },
];

const FEATURES = [
  { icon: <Link2 size={22} />, title: 'QR-verified', desc: 'Every certificate has a unique QR code. Employers can instantly verify authenticity online.', accent: '#00d4ff' },
  { icon: <Infinity size={22} />, title: 'Permanent', desc: 'Certificates never expire. Your achievements are yours forever.', accent: '#f97316' },
  { icon: <Globe size={22} />, title: 'Globally recognised', desc: 'Accepted by top employers across Africa, Europe, and North America.', accent: '#10b981' },
  { icon: <Landmark size={22} />, title: 'Accreditation-aligned', desc: 'Curriculum meets international standards reviewed by academic partners.', accent: '#a855f7' },
];

const LEVEL_COLOR: Record<string, string> = {
  Beginner: '#10b981',
  Intermediate: '#00d4ff',
  Advanced: '#a855f7',
  Professional: '#f97316',
};

export default function CertificatesPage() {
  return (
    <>
      <section className="pt-40 pb-20 px-8 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.06) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: '#f97316' }}>Certificates</span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-5 leading-[1.1]">
            Credentials that <span style={{ color: '#00d4ff' }}>open doors</span>
          </h1>
          <p className="text-white/45 text-xl max-w-xl mx-auto mb-10">Earn verifiable, employer-recognised certificates from completing Datika learning paths.</p>
          <Link href="/register">
            <button className="h-12 px-10 rounded-xl font-semibold text-white text-base"
              style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 0 24px rgba(249,115,22,0.3)' }}>
              Start earning →
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-16 px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {FEATURES.map((f, i) => (
            <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="p-6 rounded-2xl text-center" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${f.accent}15`, color: f.accent }}>{f.icon}</div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Certificate preview mockup */}
      <section className="py-20 px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-2xl mx-auto text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-extrabold text-white mb-3">What your certificate looks like</h2>
            <p className="text-white/40">Professional, digital-first, and shareable to LinkedIn in one click.</p>
          </motion.div>
        </div>
        <motion.div initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          className="max-w-2xl mx-auto p-10 rounded-3xl text-center"
          style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.05) 0%, rgba(168,85,247,0.05) 100%)', border: '1px solid rgba(0,212,255,0.2)', boxShadow: '0 0 60px rgba(0,212,255,0.07)' }}>
          <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center"
            style={{ background: 'rgba(0,212,255,0.12)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}><GraduationCap size={28} /></div>
          <p className="text-white/40 text-xs uppercase tracking-widest mb-2">Datika Academy</p>
          <h3 className="text-2xl font-extrabold text-white mb-1">Certificate of Completion</h3>
          <p className="text-white/40 text-sm mb-4">This certifies that</p>
          <p className="text-3xl font-extrabold mb-1" style={{ color: '#00d4ff' }}>Jane Wanjiku</p>
          <p className="text-white/40 text-sm mb-6">has successfully completed</p>
          <p className="text-xl font-bold text-white mb-6">Python for Data Analysis</p>
          <div className="flex items-center justify-center gap-6 text-xs text-white/30">
            <span>Issued: April 2026</span>
            <span>·</span>
            <span>ID: DAT-2026-PY-4821</span>
            <span>·</span>
            <span style={{ color: '#10b981' }}>✓ Verified</span>
          </div>
        </motion.div>
      </section>

      {/* Learning paths */}
      <section className="py-20 px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-10">
            <h2 className="text-3xl font-extrabold text-white mb-3">Available certificates</h2>
            <p className="text-white/40">Complete a learning path to earn your credential.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {CERTS.map((c, i) => (
              <motion.div key={c.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="p-5 rounded-2xl cursor-pointer transition-all"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${c.accent}30`; e.currentTarget.style.background = `${c.accent}06`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ background: `${LEVEL_COLOR[c.level]}15`, color: LEVEL_COLOR[c.level], border: `1px solid ${LEVEL_COLOR[c.level]}25` }}>
                    {c.level}
                  </span>
                  <span className="text-xs text-white/25">{c.hours}</span>
                </div>
                <h3 className="text-white font-semibold mb-2">{c.title}</h3>
                <p className="text-white/35 text-xs">{c.courses} courses</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
