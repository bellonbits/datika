'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Zap, Shield, Globe, Bot, Triangle, FileCode, Paintbrush, Sparkles, Cat, Database, RefreshCw, Link2, TreePine, Mic, Smartphone, CreditCard, KeyRound, CircleUserRound, Cloud, Globe2, Settings, BarChart3 } from 'lucide-react';

const STACK = [
  {
    layer: 'Frontend',
    accent: '#00d4ff',
    items: [
      { name: 'Next.js 14', desc: 'App Router, RSC, server actions', icon: <Triangle size={16} /> },
      { name: 'TypeScript', desc: 'End-to-end type safety', icon: <FileCode size={16} /> },
      { name: 'Tailwind CSS', desc: 'Utility-first styling system', icon: <Paintbrush size={16} /> },
      { name: 'Framer Motion', desc: 'Fluid animations and transitions', icon: <Sparkles size={16} /> },
    ],
  },
  {
    layer: 'Backend',
    accent: '#f97316',
    items: [
      { name: 'NestJS', desc: 'Modular, scalable Node.js framework', icon: <Cat size={16} /> },
      { name: 'PostgreSQL', desc: 'Relational DB with full-text search', icon: <Database size={16} /> },
      { name: 'Redis', desc: 'Session caching and job queues', icon: <Zap size={16} /> },
      { name: 'BullMQ', desc: 'Background job processing', icon: <RefreshCw size={16} /> },
    ],
  },
  {
    layer: 'AI & ML',
    accent: '#a855f7',
    items: [
      { name: 'OpenAI GPT-4o', desc: 'AI Tutor, grading, content generation', icon: <Bot size={16} /> },
      { name: 'LangChain', desc: 'Orchestration for AI pipelines', icon: <Link2 size={16} /> },
      { name: 'Pinecone', desc: 'Vector DB for semantic search', icon: <TreePine size={16} /> },
      { name: 'Whisper', desc: 'Transcription for live sessions', icon: <Mic size={16} /> },
    ],
  },
  {
    layer: 'Payments & Auth',
    accent: '#10b981',
    items: [
      { name: 'M-Pesa STK Push', desc: 'Safaricom Daraja API integration', icon: <Smartphone size={16} /> },
      { name: 'Stripe', desc: 'International card payments', icon: <CreditCard size={16} /> },
      { name: 'JWT + OAuth2', desc: 'Secure authentication flows', icon: <KeyRound size={16} /> },
      { name: 'Google OAuth', desc: 'One-click social sign-in', icon: <CircleUserRound size={16} /> },
    ],
  },
  {
    layer: 'Infrastructure',
    accent: '#f59e0b',
    items: [
      { name: 'AWS ECS', desc: 'Containerised microservices', icon: <Cloud size={16} /> },
      { name: 'CloudFront + S3', desc: 'Global CDN for video & assets', icon: <Globe2 size={16} /> },
      { name: 'GitHub Actions', desc: 'CI/CD with automated testing', icon: <Settings size={16} /> },
      { name: 'Datadog', desc: 'Monitoring, APM, and alerting', icon: <BarChart3 size={16} /> },
    ],
  },
];

const PRINCIPLES = [
  { icon: <Zap size={24} />, title: 'Performance-first', desc: 'Sub-2s page loads on 3G. Videos stream adaptively. Every millisecond counts for learners on mobile.', accent: '#f59e0b' },
  { icon: <Shield size={24} />, title: 'Security by design', desc: 'SOC 2-aligned, GDPR-ready, and locally compliant. Data never leaves the African region without consent.', accent: '#10b981' },
  { icon: <Globe size={24} />, title: 'Africa-optimised', desc: 'Edge nodes in Nairobi, Lagos, and Johannesburg. M-Pesa-native payments. Low-bandwidth video mode.', accent: '#00d4ff' },
  { icon: <Bot size={24} />, title: 'AI-native architecture', desc: 'AI isn\'t a bolt-on. Every data model, every API, and every UI was designed with AI augmentation in mind from day one.', accent: '#a855f7' },
];

export default function TechnologyPage() {
  return (
    <>
      <section className="pt-40 pb-20 px-8 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(168,85,247,0.06) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: '#f97316' }}>Technology</span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-5 leading-[1.1]">
            Built for <span style={{ color: '#00d4ff' }}>scale and speed</span>
          </h1>
          <p className="text-white/45 text-xl max-w-xl mx-auto">A modern, AI-native stack designed to deliver world-class education to every corner of Africa.</p>
        </motion.div>
      </section>

      {/* Principles */}
      <section className="py-16 px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {PRINCIPLES.map((p, i) => (
            <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
              className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-3" style={{ background: `${p.accent}15`, color: p.accent }}>{p.icon}</div>
              <h3 className="text-white font-semibold mb-2">{p.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stack */}
      <section className="py-20 px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-3">Our technology stack</h2>
            <p className="text-white/40">Every tool chosen for reliability, performance, and developer experience.</p>
          </motion.div>
          <div className="space-y-10">
            {STACK.map((layer, li) => (
              <motion.div key={layer.layer} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: li * 0.05 }}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-2 h-2 rounded-full" style={{ background: layer.accent }} />
                  <h3 className="text-sm font-semibold uppercase tracking-wider" style={{ color: layer.accent }}>{layer.layer}</h3>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {layer.items.map((item) => (
                    <div key={item.name} className="p-4 rounded-xl flex items-start gap-3"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                      <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 text-sm font-bold"
                        style={{ background: `${layer.accent}15`, color: layer.accent }}>
                        {item.icon}
                      </div>
                      <div>
                        <p className="text-white/85 font-semibold text-sm">{item.name}</p>
                        <p className="text-white/35 text-xs mt-0.5 leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl font-extrabold text-white mb-4">Want to build on Datika?</h2>
          <p className="text-white/40 mb-8 max-w-md mx-auto">Check out our API docs or get in touch with our engineering team.</p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/docs"><button className="h-12 px-8 rounded-xl font-semibold text-white text-sm"
              style={{ background: 'linear-gradient(135deg,#a855f7,#7c3aed)', boxShadow: '0 0 20px rgba(168,85,247,0.25)' }}>
              Read the docs
            </button></Link>
            <Link href="/contact"><button className="h-12 px-8 rounded-xl font-medium text-sm text-white/60 hover:text-white transition-colors"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
              Contact engineering
            </button></Link>
          </div>
        </motion.div>
      </section>
    </>
  );
}
