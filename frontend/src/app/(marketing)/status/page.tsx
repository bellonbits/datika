'use client';
import { motion } from 'framer-motion';

const SERVICES = [
  { name: 'Web Application', status: 'operational', uptime: '99.98%' },
  { name: 'API', status: 'operational', uptime: '99.97%' },
  { name: 'AI Tutor', status: 'operational', uptime: '99.91%' },
  { name: 'Video Streaming (CDN)', status: 'operational', uptime: '100%' },
  { name: 'M-Pesa Payments', status: 'operational', uptime: '99.95%' },
  { name: 'Authentication', status: 'operational', uptime: '100%' },
  { name: 'Live Sessions (Zoom)', status: 'operational', uptime: '99.89%' },
  { name: 'Email Notifications', status: 'degraded', uptime: '98.2%' },
];

const INCIDENTS = [
  {
    date: 'April 3, 2026',
    title: 'Email notification delays',
    status: 'Investigating',
    statusColor: '#f59e0b',
    desc: 'Some users are experiencing delays in receiving email notifications. Our engineering team is investigating. API and AI Tutor services are fully unaffected.',
    updates: [
      { time: '14:32 EAT', text: 'Identified root cause — SES quota limit reached. Increasing limit with AWS.' },
      { time: '13:15 EAT', text: 'Engineering team alerted and investigating delays reported.' },
    ],
  },
  {
    date: 'March 28, 2026',
    title: 'Brief AI Tutor slowdown — resolved',
    status: 'Resolved',
    statusColor: '#10b981',
    desc: 'AI Tutor experienced elevated response latency for 22 minutes due to upstream OpenAI rate limits. All services returned to normal at 09:41 EAT.',
    updates: [
      { time: '09:41 EAT', text: 'Resolved. Rate limit lifted. AI Tutor operating normally.' },
      { time: '09:19 EAT', text: 'Identified as upstream OpenAI rate limit. Applying fallback model.' },
    ],
  },
];

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  operational: { label: 'Operational', color: '#10b981', dot: '#10b981' },
  degraded: { label: 'Degraded', color: '#f59e0b', dot: '#f59e0b' },
  outage: { label: 'Outage', color: '#ef4444', dot: '#ef4444' },
};

const allOperational = SERVICES.every((s) => s.status === 'operational');

export default function StatusPage() {
  return (
    <>
      <section className="pt-40 pb-16 px-8 text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] rounded-full pointer-events-none"
          style={{ background: `radial-gradient(ellipse, ${allOperational ? 'rgba(16,185,129,0.06)' : 'rgba(245,158,11,0.06)'} 0%, transparent 70%)` }} />
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <span className="text-xs font-semibold tracking-widest uppercase mb-4 block" style={{ color: '#f97316' }}>System Status</span>
          <div className={`inline-flex items-center gap-3 px-5 py-2.5 rounded-full mb-6 ${allOperational ? '' : ''}`}
            style={{
              background: allOperational ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
              border: `1px solid ${allOperational ? 'rgba(16,185,129,0.25)' : 'rgba(245,158,11,0.25)'}`,
            }}>
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: allOperational ? '#10b981' : '#f59e0b' }} />
            <span className="font-semibold text-sm" style={{ color: allOperational ? '#10b981' : '#f59e0b' }}>
              {allOperational ? 'All systems operational' : 'Minor service disruption'}
            </span>
          </div>
          <h1 className="text-4xl font-extrabold text-white">datika.co.ke/status</h1>
          <p className="text-white/35 text-sm mt-3">Last updated: April 5, 2026 at 15:00 EAT</p>
        </motion.div>
      </section>

      {/* Services */}
      <section className="py-12 px-8" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold text-white mb-4">Services</h2>
          <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.07)' }}>
            {SERVICES.map((svc, i) => (
              <motion.div key={svc.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
                className="flex items-center justify-between px-5 py-4"
                style={{ borderBottom: i < SERVICES.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none', background: 'rgba(255,255,255,0.02)' }}>
                <span className="text-white/75 text-sm">{svc.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-white/30 text-xs">{svc.uptime} uptime</span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full" style={{ background: STATUS_CONFIG[svc.status]?.dot ?? '#fff' }} />
                    <span className="text-xs font-medium" style={{ color: STATUS_CONFIG[svc.status]?.color ?? '#fff' }}>
                      {STATUS_CONFIG[svc.status]?.label ?? svc.status}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Incidents */}
      <section className="py-12 px-8 pb-24" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-3xl mx-auto">
          <h2 className="text-lg font-semibold text-white mb-6">Recent incidents</h2>
          <div className="space-y-5">
            {INCIDENTS.map((inc, i) => (
              <motion.div key={inc.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="p-5 rounded-2xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <p className="text-white/40 text-xs mb-1">{inc.date}</p>
                    <h3 className="text-white font-semibold">{inc.title}</h3>
                  </div>
                  <span className="flex-shrink-0 text-xs font-medium px-3 py-1 rounded-full"
                    style={{ background: `${inc.statusColor}12`, color: inc.statusColor, border: `1px solid ${inc.statusColor}20` }}>
                    {inc.status}
                  </span>
                </div>
                <p className="text-white/40 text-sm mb-4 leading-relaxed">{inc.desc}</p>
                <div className="space-y-2">
                  {inc.updates.map((u, j) => (
                    <div key={j} className="flex gap-3 text-xs">
                      <span className="text-white/25 flex-shrink-0">{u.time}</span>
                      <span className="text-white/50">{u.text}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
