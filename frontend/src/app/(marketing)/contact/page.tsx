'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, MapPin } from 'lucide-react';

const TOPICS = ['General enquiry', 'Sales & enterprise', 'Technical support', 'Press & media', 'Partnership', 'Other'];
const OFFICES = [
  { city: 'Nairobi', country: 'KE', address: 'Upper Hill, Nairobi, Kenya', email: 'nairobi@datika.co.ke' },
  { city: 'Lagos', country: 'NG', address: 'Victoria Island, Lagos, Nigeria', email: 'lagos@datika.co.ke' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', topic: '', message: '' });
  const [sent, setSent] = useState(false);

  const inputStyle = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' };
  const focusStyle = { borderColor: 'rgba(0,212,255,0.4)' };

  return (
    <>
      <section className="pt-40 pb-16 px-8 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.05) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: '#f97316' }}>Contact</span>
          <h1 className="text-5xl font-extrabold mb-4"><span style={{ color: '#00d4ff' }}>Get in touch</span></h1>
          <p className="text-white/45 text-xl">We'd love to hear from you. We usually respond within 24 hours.</p>
        </motion.div>
      </section>

      <section className="py-12 px-8 pb-24">
        <div className="max-w-5xl mx-auto grid lg:grid-cols-5 gap-12">
          {/* Form */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="lg:col-span-3">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-20 text-center rounded-2xl"
                style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 mx-auto" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}><CheckCircle2 size={28} /></div>
                <h3 className="text-white font-bold text-xl mb-2">Message sent!</h3>
                <p className="text-white/45 text-sm">We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSent(true); }} className="space-y-4"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 28 }}>
                <h2 className="text-white font-bold text-xl mb-6">Send us a message</h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Full name</label>
                    <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Jane Wanjiku" className="w-full h-11 px-4 rounded-xl text-sm outline-none placeholder:text-white/20"
                      style={inputStyle} onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)} onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }} />
                  </div>
                  <div>
                    <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Email</label>
                    <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="you@example.com" className="w-full h-11 px-4 rounded-xl text-sm outline-none placeholder:text-white/20"
                      style={inputStyle} onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)} onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Topic</label>
                  <select required value={form.topic} onChange={(e) => setForm({ ...form, topic: e.target.value })}
                    className="w-full h-11 px-4 rounded-xl text-sm outline-none cursor-pointer"
                    style={{ ...inputStyle, color: form.topic ? '#fff' : 'rgba(255,255,255,0.25)' }}>
                    <option value="" style={{ background: '#0d1421' }}>Select a topic...</option>
                    {TOPICS.map((t) => <option key={t} value={t} style={{ background: '#0d1421' }}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-white/40 uppercase tracking-wider mb-1.5">Message</label>
                  <textarea required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us how we can help..."
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none placeholder:text-white/20"
                    style={inputStyle} onFocus={(e) => Object.assign(e.currentTarget.style, focusStyle)} onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }} />
                </div>
                <button type="submit" className="w-full h-11 rounded-xl font-semibold text-white text-sm transition-all"
                  style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 0 20px rgba(249,115,22,0.25)' }}>
                  Send message →
                </button>
              </form>
            )}
          </motion.div>

          {/* Info */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="lg:col-span-2 space-y-5">
            {OFFICES.map((o) => (
              <div key={o.city} className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.12)', color: '#00d4ff' }}><MapPin size={16} /></div>
                  <span className="text-white font-semibold">{o.city}</span>
                  <span className="text-white/25 text-xs font-medium px-1.5 py-0.5 rounded" style={{ background: 'rgba(255,255,255,0.06)' }}>{o.country}</span>
                </div>
                <p className="text-white/40 text-sm mb-1">{o.address}</p>
                <a href={`mailto:${o.email}`} className="text-sm transition-colors" style={{ color: '#00d4ff' }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#fff'; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = '#00d4ff'; }}>
                  {o.email}
                </a>
              </div>
            ))}
            <div className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h4 className="text-white font-semibold mb-3">Response times</h4>
              {[['General', '< 24 hours'], ['Support', '< 4 hours'], ['Sales', '< 2 hours'], ['Press', '< 6 hours']].map(([k, v]) => (
                <div key={k} className="flex justify-between py-2 text-sm" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                  <span className="text-white/40">{k}</span>
                  <span className="text-white/70 font-medium">{v}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
