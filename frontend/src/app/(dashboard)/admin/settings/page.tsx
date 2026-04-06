'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 };

export default function AdminSettingsPage() {
  const user = useAuthStore((s) => s.user);
  const { clearAuth } = useAuthStore();
  const router = useRouter();

  return (
    <div className="p-6 h-full overflow-auto text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">Admin Settings</h1>
        <p className="text-white/40 text-sm">Platform configuration and administration</p>
      </motion.div>

      <div className="max-w-2xl space-y-4">
        {/* Account */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="p-6 rounded-2xl" style={card}>
          <h2 className="text-white font-semibold mb-4">Admin account</h2>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-extrabold"
              style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#a855f7' }}>
              {user?.name?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div>
              <p className="text-white font-medium">{user?.name}</p>
              <p className="text-white/40 text-sm">{user?.email}</p>
              <span className="text-xs px-2 py-0.5 rounded-full mt-1 inline-block"
                style={{ background: 'rgba(168,85,247,0.12)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.2)' }}>
                Administrator
              </span>
            </div>
          </div>
        </motion.div>

        {/* Platform settings */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl" style={card}>
          <h2 className="text-white font-semibold mb-4">Platform</h2>
          <div className="space-y-3">
            {[
              { label: 'Platform name', value: 'Datika' },
              { label: 'Support email', value: 'support@datika.io' },
              { label: 'Currency', value: 'KES (Kenyan Shilling)' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2"
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                <span className="text-white/50 text-sm">{item.label}</span>
                <span className="text-white/80 text-sm font-medium">{item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Danger */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="p-6 rounded-2xl" style={{ ...card, borderColor: 'rgba(239,68,68,0.2)' }}>
          <h2 className="font-semibold mb-1" style={{ color: '#f87171' }}>Sign out</h2>
          <p className="text-white/40 text-sm mb-4">Sign out of the admin panel.</p>
          <button onClick={() => { clearAuth(); router.replace('/login'); }}
            className="h-9 px-5 rounded-xl text-sm font-medium"
            style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
            Sign out
          </button>
        </motion.div>
      </div>
    </div>
  );
}
