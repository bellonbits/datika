'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { GraduationCap, Building2, Lightbulb, Globe } from 'lucide-react';

const PARTNERS = [
  { name: 'University of Nairobi', type: 'Academic', desc: 'Curriculum review and co-accreditation partnership.', accent: '#00d4ff', initials: 'UON' },
  { name: 'Safaricom', type: 'Technology', desc: 'M-Pesa payment integration and enterprise training.', accent: '#10b981', initials: 'SAF' },
  { name: 'Andela', type: 'Talent', desc: 'Graduate placement and talent pipeline partner.', accent: '#f97316', initials: 'AND' },
  { name: 'Google Africa', type: 'Technology', desc: 'Cloud infrastructure credits and AI research collaboration.', accent: '#a855f7', initials: 'GAF' },
  { name: 'Africa Development Bank', type: 'Funding', desc: 'Digital skills initiative grant recipient.', accent: '#f59e0b', initials: 'ADB' },
  { name: 'iHub Nairobi', type: 'Community', desc: 'Co-working space partner for in-person events.', accent: '#ec4899', initials: 'iHUB' },
];

const PARTNER_TYPES = [
  { icon: <GraduationCap size={22} />, title: 'Academic partners', desc: 'Co-develop curriculum, validate learning outcomes, and offer co-branded certification.', accent: '#00d4ff' },
  { icon: <Building2 size={22} />, title: 'Enterprise partners', desc: 'Train your data teams at scale with custom learning paths and a dedicated account manager.', accent: '#f97316' },
  { icon: <Lightbulb size={22} />, title: 'Technology partners', desc: 'Integrate your developer tools, datasets, or APIs into Datika\'s learning environment.', accent: '#a855f7' },
  { icon: <Globe size={22} />, title: 'NGO & government', desc: 'Subsidised access to Datika for public sector digital skills programs.', accent: '#10b981' },
];

export default function PartnersPage() {
  return (
    <>
      <section className="pt-40 pb-20 px-8 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(16,185,129,0.06) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: '#f97316' }}>Partners</span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-5 leading-[1.1]">
            Growing Africa's data talent <span style={{ color: '#00d4ff' }}>together</span>
          </h1>
          <p className="text-white/45 text-xl max-w-xl mx-auto mb-10">We work with universities, enterprises, and organisations that share our vision for African digital excellence.</p>
          <Link href="/contact">
            <button className="h-12 px-10 rounded-xl font-semibold text-white text-base"
              style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 0 24px rgba(249,115,22,0.3)' }}>
              Become a partner
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Partner types */}
      <section className="py-16 px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PARTNER_TYPES.map((p, i) => (
            <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${p.accent}15`, color: p.accent }}>{p.icon}</div>
              <h3 className="text-white font-semibold mb-2">{p.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Current partners */}
      <section className="py-20 px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12 text-center">
            <h2 className="text-3xl font-extrabold text-white mb-3">Our partners</h2>
            <p className="text-white/40">Organisations building Africa's data-driven future alongside us.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PARTNERS.map((p, i) => (
              <motion.div key={p.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0"
                    style={{ background: `${p.accent}15`, color: p.accent, border: `1px solid ${p.accent}25` }}>
                    {p.initials}
                  </div>
                  <div>
                    <p className="text-white font-semibold">{p.name}</p>
                    <p className="text-xs" style={{ color: p.accent }}>{p.type}</p>
                  </div>
                </div>
                <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-extrabold text-white mb-4">Partner with Datika</h2>
          <p className="text-white/40 mb-8 max-w-md mx-auto">Let's build something meaningful for African learners together. Contact our partnerships team.</p>
          <Link href="/contact">
            <button className="h-12 px-10 rounded-xl font-semibold text-white text-base"
              style={{ background: 'linear-gradient(135deg,#10b981,#059669)', boxShadow: '0 0 24px rgba(16,185,129,0.25)' }}>
              Get in touch →
            </button>
          </Link>
        </motion.div>
      </section>
    </>
  );
}
