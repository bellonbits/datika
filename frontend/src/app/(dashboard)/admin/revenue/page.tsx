'use client';

import { motion } from 'framer-motion';
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
    queryFn: () => apiClient.get('/admin/revenue') as Promise<{ data: { payments: Payment[]; totalRevenue: number; thisMonth: number } }>,
  });

  const revenue = (data as unknown as { data: { payments: Payment[]; totalRevenue: number; thisMonth: number } })?.data;
  const payments = revenue?.payments ?? [];

  return (
    <div className="p-6 h-full overflow-auto text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">Revenue</h1>
        <p className="text-white/40 text-sm">Payment history and revenue analytics</p>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Revenue', value: isLoading ? '—' : `KES ${(revenue?.totalRevenue ?? 0).toLocaleString()}`, accent: '#10b981' },
          { label: 'This Month', value: isLoading ? '—' : `KES ${(revenue?.thisMonth ?? 0).toLocaleString()}`, accent: '#00d4ff' },
          { label: 'Total Transactions', value: isLoading ? '—' : payments.length, accent: '#f97316' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.05 }}
            className="p-4 rounded-2xl" style={card}>
            <p className="text-2xl font-extrabold mb-0.5" style={{ color: s.accent }}>{s.value}</p>
            <p className="text-white/40 text-xs">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {isError && (
        <div className="p-5 rounded-2xl text-center" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <p className="text-red-400 text-sm">Failed to load revenue data. Admin access required.</p>
        </div>
      )}

      {!isError && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden" style={card}>
          <div className="px-5 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider grid grid-cols-5"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="col-span-2">Customer / Course</span>
            <span>Amount</span>
            <span>Status</span>
            <span>Date</span>
          </div>

          {isLoading && (
            <div className="space-y-2 p-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 rounded-xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
              ))}
            </div>
          )}

          {!isLoading && payments.length === 0 && (
            <p className="text-white/25 text-sm text-center py-12">No payments recorded yet.</p>
          )}

          {!isLoading && payments.map((p, i) => {
            const statusColor = STATUS_COLOR[p.status] ?? '#6b7280';
            const date = new Date(p.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            return (
              <div key={p.id} className="grid grid-cols-5 items-center px-5 py-3.5"
                style={{ borderBottom: i < payments.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div className="col-span-2">
                  <p className="text-white/80 text-sm leading-tight">{p.user?.name ?? 'Unknown'}</p>
                  <p className="text-white/35 text-xs">{p.course?.title ?? p.user?.email ?? '—'}</p>
                </div>
                <span className="text-white font-semibold text-sm">{p.currency} {p.amount.toLocaleString()}</span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full w-fit"
                  style={{ background: `${statusColor}12`, color: statusColor, border: `1px solid ${statusColor}20` }}>
                  {p.status.charAt(0) + p.status.slice(1).toLowerCase()}
                </span>
                <span className="text-white/30 text-xs">{date}</span>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
