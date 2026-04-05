'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { MessageCircle, BookOpen, Brain, CheckCircle2, Flame, Map, Bot } from 'lucide-react';

const FEATURES = [
  { icon: <MessageCircle size={20} />, title: 'Unlimited conversations', desc: 'Ask anything, anytime. The AI Tutor never gets tired, never judges, and always explains in plain language.', accent: '#00d4ff' },
  { icon: <BookOpen size={20} />, title: 'Course-aware context', desc: 'It knows exactly which lesson you\'re on and tailors every answer to your current learning stage.', accent: '#f97316' },
  { icon: <Brain size={20} />, title: 'Adaptive explanations', desc: 'Struggling with a concept? It tries a different approach — analogy, code example, visual description — until it clicks.', accent: '#a855f7' },
  { icon: <CheckCircle2 size={20} />, title: 'AI assignment grading', desc: 'Submit code or written answers and get instant, detailed feedback with suggestions for improvement.', accent: '#10b981' },
  { icon: <Flame size={20} />, title: 'Practice problem generator', desc: 'Request more practice problems on any topic. The AI generates fresh, never-seen exercises at the right difficulty level.', accent: '#f59e0b' },
  { icon: <Map size={20} />, title: 'Learning path guidance', desc: 'Ask "what should I learn next?" and get a personalised roadmap based on your goals and progress.', accent: '#ec4899' },
];

const CHAT_DEMO = [
  { role: 'user', text: 'I don\'t understand the difference between a list and a tuple in Python' },
  { role: 'ai', text: 'Great question! Both store ordered collections, but the key difference is **mutability**.\n\nA **list** can be changed after creation — you can add, remove, or update items:\n```python\nfruits = ["apple", "banana"]\nfruits.append("mango")  # ✅ works\n```\n\nA **tuple** is **immutable** — once created, it cannot change:\n```python\ncoords = (1.234, 36.817)  # Nairobi GPS\ncoords[0] = 0  # ❌ TypeError!\n```\n\nUse tuples when data should never change (like GPS coordinates or RGB colours). Use lists when you need to modify the collection. Does that help?' },
  { role: 'user', text: 'Yes! Can you give me a practice problem?' },
  { role: 'ai', text: 'Sure! Here\'s one:\n\n**Task**: You\'re tracking Nairobi matatu routes. Create a tuple for a fixed route (CBD → Westlands → Parklands) and a list for passengers that can board and alight. Write a function that adds a passenger and prints the updated list.\n\nTry it yourself and paste your solution — I\'ll review it!' },
];

export default function AITutorPage() {
  return (
    <>
      <section className="pt-40 pb-20 px-8 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(0,212,255,0.07) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: '#f97316' }}>AI Tutor</span>
          <h1 className="text-5xl md:text-6xl font-extrabold mb-5 leading-[1.1]">
            Your personal <span style={{ color: '#00d4ff' }}>data science tutor</span><br />available 24/7
          </h1>
          <p className="text-white/45 text-xl max-w-xl mx-auto mb-10">Powered by GPT-4o. Trained on your course content. Always patient, always available.</p>
          <Link href="/register">
            <button className="h-12 px-10 rounded-xl font-semibold text-white text-base"
              style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 0 24px rgba(249,115,22,0.3)' }}>
              Try AI Tutor free →
            </button>
          </Link>
        </motion.div>
      </section>

      {/* Demo chat */}
      <section className="py-16 px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            {/* Chat header */}
            <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}><Bot size={18} /></div>
              <div>
                <p className="text-white font-semibold text-sm">Datika AI Tutor</p>
                <p className="text-xs" style={{ color: '#10b981' }}>● Online — ready to help</p>
              </div>
            </div>
            {/* Messages */}
            <div className="p-5 space-y-4">
              {CHAT_DEMO.map((msg, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}
                    style={msg.role === 'user'
                      ? { background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.25)', color: 'rgba(255,255,255,0.85)' }
                      : { background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.15)', color: 'rgba(255,255,255,0.75)' }}>
                    <pre className="whitespace-pre-wrap font-sans">{msg.text}</pre>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-white mb-3">Everything a great tutor does</h2>
            <p className="text-white/40">Just faster, cheaper, and always available.</p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {FEATURES.map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className="p-6 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-4"
                  style={{ background: `${f.accent}15`, border: `1px solid ${f.accent}25` }}>
                  {f.icon}
                </div>
                <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing note */}
      <section className="py-16 px-8 text-center" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-2xl mb-6"
            style={{ background: 'rgba(0,212,255,0.07)', border: '1px solid rgba(0,212,255,0.15)' }}>
            <span style={{ color: '#00d4ff' }}>✦</span>
            <span className="text-white/70 text-sm">Free plan: 10 messages/day &nbsp;·&nbsp; Pro plan: unlimited</span>
          </div>
          <h2 className="text-4xl font-extrabold text-white mb-4">Start a conversation now</h2>
          <p className="text-white/40 mb-8 max-w-md mx-auto">No signup needed to try the first 3 free messages.</p>
          <Link href="/register">
            <button className="h-12 px-10 rounded-xl font-semibold text-white text-base"
              style={{ background: 'linear-gradient(135deg,#00d4ff,#0d6efd)', boxShadow: '0 0 24px rgba(0,212,255,0.25)' }}>
              Get started free →
            </button>
          </Link>
        </motion.div>
      </section>
    </>
  );
}
