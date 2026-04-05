'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Globe, Bot, GraduationCap, LockOpen } from 'lucide-react';

const TEAM = [
  { name: 'Dr. Amina Osei', role: 'CEO & Co-Founder', bio: 'Former data scientist at M-Kopa. PhD in Machine Learning from University of Nairobi.', accent: '#00d4ff', initials: 'AO' },
  { name: 'Brian Otieno', role: 'CTO & Co-Founder', bio: '10+ years building scalable systems. Previously at Andela and Flutterwave.', accent: '#f97316', initials: 'BO' },
  { name: 'Prof. Jane Wangari', role: 'Head of Curriculum', bio: 'Associate Professor of Data Science. Published author with 20+ academic papers.', accent: '#a855f7', initials: 'JW' },
  { name: 'Kevin Mwenda', role: 'Head of AI', bio: 'Built production ML systems at Safaricom and leading pan-African fintech.', accent: '#10b981', initials: 'KM' },
  { name: 'Aisha Kamau', role: 'Head of Product', bio: 'Product veteran with 8 years in edtech. Former VP Product at uLesson.', accent: '#f59e0b', initials: 'AK' },
  { name: 'David Njoroge', role: 'Head of Community', bio: 'Community builder and data evangelist. Organiser of PyCon Africa.', accent: '#ec4899', initials: 'DN' },
];

const VALUES = [
  { icon: <Globe size={24} />, title: 'Africa First', desc: 'Built for African learners — M-Pesa payments, relevant datasets, local use cases.', accent: '#00d4ff' },
  { icon: <Bot size={24} />, title: 'AI-Native', desc: 'Every lesson, quiz, and piece of feedback is powered by state-of-the-art AI.', accent: '#f97316' },
  { icon: <GraduationCap size={24} />, title: 'Academic Rigour', desc: 'University-grade content that meets international accreditation standards.', accent: '#a855f7' },
  { icon: <LockOpen size={24} />, title: 'Open Access', desc: 'Free introductory content for every learner, regardless of financial background.', accent: '#10b981' },
];

function PageHero({ label, title, accent, sub }: { label: string; title: React.ReactNode; accent?: string; sub: string }) {
  return (
    <section className="pt-40 pb-20 px-8 text-center relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
        style={{ background: `radial-gradient(ellipse, ${accent ?? 'rgba(0,212,255,0.06)'} 0%, transparent 70%)` }} />
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="relative max-w-3xl mx-auto">
        <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: '#f97316' }}>{label}</span>
        <h1 className="text-5xl md:text-6xl font-extrabold mb-5 leading-[1.1] tracking-tight">{title}</h1>
        <p className="text-white/45 text-xl max-w-xl mx-auto leading-relaxed">{sub}</p>
      </motion.div>
    </section>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageHero
        label="About Datika"
        title={<><span style={{ color: '#00d4ff' }}>Democratising</span> Data Science Education</>}
        accent="rgba(0,212,255,0.05)"
        sub="We're on a mission to make world-class data science education accessible to every African professional."
      />

      {/* Mission */}
      <section id="story" className="py-20 px-8">
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <span className="text-xs font-semibold tracking-widest uppercase mb-3 block" style={{ color: '#00d4ff' }}>Our Story</span>
            <h2 className="text-4xl font-extrabold text-white mb-6 leading-tight">From a classroom in Nairobi to 1,200+ learners</h2>
            <p className="text-white/45 leading-relaxed mb-4">
              Datika was founded in 2023 by two data scientists frustrated by the lack of quality, affordable, and locally-relevant data science education in Africa.
            </p>
            <p className="text-white/45 leading-relaxed mb-4">
              What started as weekend workshops in a Nairobi co-working space quickly grew into a full platform — powered by the latest AI models — serving learners across Kenya, Nigeria, Ghana, and Rwanda.
            </p>
            <p className="text-white/45 leading-relaxed">
              Today, Datika combines rigorous academic content with intelligent assessments and a community of peers, all accessible via M-Pesa.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            className="grid grid-cols-2 gap-4">
            {[['2023', 'Founded'], ['1,200+', 'Learners'], ['24', 'Courses'], ['95%', 'Satisfaction']].map(([v, l]) => (
              <div key={l} className="p-6 rounded-2xl text-center"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="text-3xl font-extrabold mb-1" style={{ color: '#00d4ff' }}>{v}</div>
                <div className="text-white/40 text-sm">{l}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest uppercase mb-3 block" style={{ color: '#f97316' }}>Our Values</span>
            <h2 className="text-4xl font-extrabold text-white">What we stand for</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((v, i) => (
              <motion.div key={v.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: `${v.accent}15`, color: v.accent }}>{v.icon}</div>
                <h3 className="text-white font-semibold mb-2">{v.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="text-xs font-semibold tracking-widest uppercase mb-3 block" style={{ color: '#00d4ff' }}>The Team</span>
            <h2 className="text-4xl font-extrabold text-white">Built by practitioners, for learners</h2>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {TEAM.map((m, i) => (
              <motion.div key={m.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-lg font-bold text-white mb-4"
                  style={{ background: `${m.accent}25`, border: `1px solid ${m.accent}40`, color: m.accent }}>
                  {m.initials}
                </div>
                <h3 className="text-white font-semibold">{m.name}</h3>
                <p className="text-xs mb-3 font-medium" style={{ color: m.accent }}>{m.role}</p>
                <p className="text-white/40 text-sm leading-relaxed">{m.bio}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-extrabold text-white mb-4">Join the Datika community</h2>
          <p className="text-white/40 mb-8 max-w-md mx-auto">Start learning data science today with AI-powered courses and a supportive community.</p>
          <Link href="/register">
            <button className="h-12 px-10 rounded-xl font-semibold text-white text-base transition-all"
              style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 0 24px rgba(249,115,22,0.3)' }}>
              Get started free →
            </button>
          </Link>
        </motion.div>
      </section>
    </>
  );
}
