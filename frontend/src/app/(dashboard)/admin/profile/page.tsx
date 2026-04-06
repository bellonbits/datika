'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 };

export default function AdminProfilePage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  return (
    <div className="p-6 h-full overflow-auto text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">Admin Profile</h1>
        <p className="text-white/40 text-sm">Your administrator account</p>
      </motion.div>

      <div className="max-w-md">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="p-6 rounded-2xl" style={card}>
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold flex-shrink-0"
              style={{ background: 'rgba(168,85,247,0.15)', border: '1px solid rgba(168,85,247,0.3)', color: '#a855f7' }}>
              {user?.name?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="flex-1">
              <h2 className="text-white text-xl font-bold mb-0.5">{user?.name}</h2>
              <p className="text-white/40 text-sm mb-3">{user?.email}</p>
              <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{ background: 'rgba(168,85,247,0.1)', color: '#a855f7', border: '1px solid rgba(168,85,247,0.2)' }}>
                Administrator
              </span>
            </div>
          </div>

          <div className="mt-5 pt-5 flex justify-end" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={() => router.push('/admin/settings')}
              className="h-9 px-5 rounded-xl text-xs font-semibold"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
              Account settings →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
