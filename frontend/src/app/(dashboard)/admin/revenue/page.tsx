'use client';

import { motion } from 'framer-motion';
import { 
  CreditCard, 
  TrendingUp, 
  Activity, 
  Search, 
  Filter, 
  ArrowUpRight, 
  Calendar 
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 };

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  user?: { name: string; email: string };
  course?: { title: string };
}

const STATUS_COLOR: Record<string, string> = {
  COMPLETED: '#10b981',
  PENDING: '#f97316',
  FAILED: '#f87171',
  REFUNDED: '#6b7280',
};

export default function AdminRevenuePage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-revenue'],
    queryFn: () => apiClient.get('/payments/admin/revenue') as Promise<{
      recentPayments: Payment[];
      totalRevenue: number;
      monthlyRevenue: number;
      totalTransactions: number;
      monthlyTransactions: number;
    }>,
  });

  const revenue = data;
  const payments = revenue?.recentPayments ?? [];

  return (
    <div className="p-6 h-full overflow-auto text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1">Revenue Analytics</h1>
          <p className="text-white/40 text-sm">Financial performance and transaction history</p>
        </div>
        <button className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 transition-all flex items-center gap-2">
          <Calendar size={14} />
          Last 30 Days
        </button>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Revenue', value: isLoading ? null : `KES ${(revenue?.totalRevenue ?? 0).toLocaleString()}`, accent: '#10b981', icon: <CreditCard size={18} /> },
          { label: 'Monthly Growth', value: isLoading ? null : `KES ${(revenue?.monthlyRevenue ?? 0).toLocaleString()}`, accent: '#00d4ff', icon: <TrendingUp size={18} /> },
          { label: 'Total Transactions', value: isLoading ? null : (revenue?.totalTransactions ?? 0).toLocaleString(), accent: '#f97316', icon: <Activity size={18} /> },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.05 }}
            className="p-5 rounded-2xl relative overflow-hidden" style={card}>
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 rounded-lg" style={{ background: `${s.accent}15`, color: s.accent }}>{s.icon}</div>
              <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{s.label}</span>
            </div>
            {isLoading ? (
              <div className="h-8 w-32 rounded bg-white/5 animate-pulse" />
            ) : (
              <p className="text-2xl font-extrabold" style={{ color: s.accent }}>{s.value}</p>
            )}
            <div className="absolute top-4 right-4 text-white/10"><ArrowUpRight size={24} /></div>
          </motion.div>
        ))}
      </div>

      {isError ? (
        <div className="p-12 rounded-3xl text-center" style={card}>
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-500/50">
            <Activity size={32} />
          </div>
          <h3 className="text-lg font-bold text-white mb-2">Access Restricted</h3>
          <p className="text-white/35 text-sm max-w-xs mx-auto mb-8">
            Failed to load revenue data. This section requires higher-level administrative privileges.
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all">
            Check Permissions & Retry
          </button>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden" style={card}>
          <div className="px-5 py-4 border-b border-white/5 flex items-center justify-between">
             <h2 className="font-bold text-white/80">Transaction History</h2>
             <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Latest 20 Records</span>
          </div>
          
          <div className="px-5 py-3 text-xs font-semibold text-white/20 uppercase tracking-wider grid grid-cols-5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span className="col-span-2">Customer / Course</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Date</span>
          </div>

          {isLoading && (
            <div className="p-5 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.03)' }} />
              ))}
            </div>
          )}

          {!isLoading && payments.length === 0 && (
            <div className="py-20 text-center">
               <p className="text-white/20 text-sm">No transactions found on the platform yet.</p>
            </div>
          )}

          {!isLoading && payments.map((p, i) => {
            const statusColor = STATUS_COLOR[p.status] ?? '#6b7280';
            const date = new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            return (
              <div key={p.id} className="grid grid-cols-5 items-center px-5 py-3.5 hover:bg-white/[0.01] transition-colors"
                style={{ borderBottom: i < payments.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div className="col-span-2">
                  <p className="text-white/80 text-sm leading-tight font-medium truncate pr-4">{p.user?.name ?? 'Unknown User'}</p>
                  <p className="text-white/30 text-[10px] truncate pr-4">{p.course?.title ?? p.user?.email ?? '—'}</p>
                </div>
                <span className="text-white/90 font-bold text-sm">KES {p.amount.toLocaleString()}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full w-fit"
                  style={{ background: `${statusColor}12`, color: statusColor, border: `1px solid ${statusColor}20` }}>
                  {p.status}
                </span>
                <span className="text-white/25 text-xs">{date}</span>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

