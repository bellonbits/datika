'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  BookOpen, 
  CreditCard, 
  Bot, 
  ClipboardList, 
  BarChart3, 
  Settings,
  Plus
} from 'lucide-react';

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 };

const STATS = [
  { label: 'Total users', value: '1,284', delta: '+34 this week', accent: '#00d4ff', icon: <Users size={24} /> },
  { label: 'Active courses', value: '24', delta: '6 pending review', accent: '#a855f7', icon: <BookOpen size={24} /> },
  { label: 'Revenue (KES)', value: '342,800', delta: '+22% this month', accent: '#f97316', icon: <CreditCard size={24} /> },
  { label: 'AI generations', value: '8,420', delta: 'Last 30 days', accent: '#10b981', icon: <Bot size={24} /> },
];

const USERS = [
  { name: 'Jane Wanjiku', email: 'jane@example.com', role: 'STUDENT', joined: '2h ago', color: '#00d4ff' },
  { name: 'Dr. Kamau', email: 'kamau@example.com', role: 'INSTRUCTOR', joined: '5h ago', color: '#a855f7' },
  { name: 'Aisha Mwangi', email: 'aisha@example.com', role: 'STUDENT', joined: 'Yesterday', color: '#10b981' },
  { name: 'Brian Otieno', email: 'brian@example.com', role: 'STUDENT', joined: 'Yesterday', color: '#f97316' },
  { name: 'Prof. Njoroge', email: 'njoroge@example.com', role: 'INSTRUCTOR', joined: '2 days ago', color: '#00d4ff' },
];

const PAYMENTS = [
  { user: 'Jane Wanjiku', course: 'Machine Learning', amount: 2500, status: 'COMPLETED', time: '1h ago' },
  { user: 'Brian Otieno', course: 'Python for Data Science', amount: 1800, status: 'COMPLETED', time: '3h ago' },
  { user: 'Mary Akinyi', course: 'SQL Mastery', amount: 1500, status: 'PENDING', time: '6h ago' },
  { user: 'John Kariuki', course: 'Machine Learning', amount: 2500, status: 'FAILED', time: 'Yesterday' },
];

const ROLE_COLOR: Record<string, string> = { STUDENT: '#00d4ff', INSTRUCTOR: '#a855f7', ADMIN: '#f97316' };
const PAY_COLOR: Record<string, string> = { COMPLETED: '#10b981', PENDING: '#f97316', FAILED: '#ef4444' };

export default function AdminDashboard() {
  const router = useRouter();

  return (
    <div className="p-6 space-y-5 text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-white">Admin Overview</h1>
        <p className="text-white/35 text-sm mt-0.5">Platform performance at a glance</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="p-5 rounded-2xl" style={card}>
            <div className="mb-4" style={{ color: s.accent }}>{s.icon}</div>
            <div className="text-2xl font-extrabold text-white">{s.value}</div>
            <div className="text-xs text-white/35 mt-0.5">{s.label}</div>
            <div className="text-xs mt-2 font-medium" style={{ color: s.accent }}>{s.delta}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Users */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl overflow-hidden" style={card}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="font-semibold text-white/80">Recent users</h2>
            <button onClick={() => router.push('/admin/users')} className="text-xs transition-colors" style={{ color: '#00d4ff' }}>View all →</button>
          </div>
          {USERS.map((u, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5 transition-all cursor-pointer"
              style={{ borderBottom: i < USERS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background: `${u.color}20`, border: `1px solid ${u.color}35`, color: u.color }}>
                {u.name[0]}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/70 truncate">{u.name}</p>
                <p className="text-xs text-white/25 truncate">{u.email}</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0"
                style={{ background: `${ROLE_COLOR[u.role] ?? '#00d4ff'}15`, color: ROLE_COLOR[u.role] ?? '#00d4ff', border: `1px solid ${ROLE_COLOR[u.role] ?? '#00d4ff'}25` }}>
                {u.role.charAt(0) + u.role.slice(1).toLowerCase()}
              </span>
              <span className="text-xs text-white/25 flex-shrink-0 hidden sm:block ml-2">{u.joined}</span>
            </div>
          ))}
        </motion.div>

        {/* Payments */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl overflow-hidden" style={card}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="font-semibold text-white/80">Recent payments</h2>
            <button onClick={() => router.push('/admin/revenue')} className="text-xs transition-colors" style={{ color: '#00d4ff' }}>View all →</button>
          </div>
          {PAYMENTS.map((p, i) => (
            <div key={i} className="flex items-center gap-3 px-5 py-3.5"
              style={{ borderBottom: i < PAYMENTS.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white/70 truncate">{p.user}</p>
                <p className="text-xs text-white/25 truncate">{p.course}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-bold text-white/80">KES {p.amount.toLocaleString()}</p>
                <p className="text-xs text-white/25">{p.time}</p>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0"
                style={{ background: `${PAY_COLOR[p.status] ?? '#00d4ff'}15`, color: PAY_COLOR[p.status] ?? '#00d4ff', border: `1px solid ${PAY_COLOR[p.status] ?? '#00d4ff'}25` }}>
                {p.status.charAt(0) + p.status.slice(1).toLowerCase()}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Quick actions */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'User Management', icon: <Users size={24} />, path: '/admin/users', accent: '#00d4ff' },
          { label: 'All Courses', icon: <BookOpen size={24} />, path: '/admin/courses', accent: '#a855f7' },
          { label: 'Revenue Report', icon: <BarChart3 size={24} />, path: '/admin/revenue', accent: '#10b981' },
          { label: 'Platform Settings', icon: <Settings size={24} />, path: '/admin/settings', accent: '#f97316' },
        ].map((a) => (
          <button key={a.label} onClick={() => router.push(a.path)}
            className="p-4 rounded-2xl text-left transition-all"
            style={card}
            onMouseEnter={(e) => { e.currentTarget.style.background = `${a.accent}08`; e.currentTarget.style.borderColor = `${a.accent}30`; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            <div className="mb-3" style={{ color: a.accent }}>{a.icon}</div>
            <p className="text-sm font-semibold text-white/70">{a.label}</p>
          </button>
        ))}
      </motion.div>
    </div>
  );
}
