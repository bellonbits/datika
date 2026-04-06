'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { usersApi } from '@/lib/api/users.api';

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 };

export default function InstructorSettingsPage() {
  const user = useAuthStore((s) => s.user);
  const { clearAuth } = useAuthStore();
  const router = useRouter();

  const [name, setName] = useState(user?.name ?? '');
  const [bio, setBio] = useState('');
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');

  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  const handleSave = async () => {
    setSaveError('');
    try {
      await usersApi.updateProfile({ name, bio });
      useAuthStore.getState().updateUser({ name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setSaveError(e?.response?.data?.message ?? 'Failed to save.');
    }
  };

  const handleChangePassword = async () => {
    setPwError('');
    if (!pwCurrent || !pwNew || !pwConfirm) { setPwError('All fields required.'); return; }
    if (pwNew !== pwConfirm) { setPwError('Passwords do not match.'); return; }
    if (pwNew.length < 8) { setPwError('Min 8 characters.'); return; }
    setPwLoading(true);
    try {
      await usersApi.changePassword({ currentPassword: pwCurrent, newPassword: pwNew });
      setPwSaved(true);
      setPwCurrent(''); setPwNew(''); setPwConfirm('');
      setTimeout(() => setPwSaved(false), 2500);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } } };
      setPwError(e?.response?.data?.message ?? 'Failed to update password.');
    } finally {
      setPwLoading(false);
    }
  };

  return (
    <div className="p-6 h-full overflow-auto text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">Settings</h1>
        <p className="text-white/40 text-sm">Manage your instructor profile and account</p>
      </motion.div>

      <div className="max-w-2xl space-y-4">
        {/* Profile */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="p-6 rounded-2xl" style={card}>
          <h2 className="text-white font-semibold mb-5">Profile</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Full name</label>
              <input value={name} onChange={(e) => setName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl text-sm text-white outline-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }} />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Email (read-only)</label>
              <input value={user?.email ?? ''} disabled
                className="w-full h-10 px-3 rounded-xl text-sm text-white/40 outline-none"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', opacity: 0.7 }} />
            </div>
            <div>
              <label className="block text-xs font-medium text-white/50 mb-1.5">Bio</label>
              <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
                placeholder="A short bio for your instructor profile..."
                className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder:text-white/20 outline-none resize-none"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)'; }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }} />
            </div>
          </div>
          <div className="flex items-center justify-between mt-5 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <div>
              {saved && <span className="text-xs" style={{ color: '#10b981' }}>Saved successfully</span>}
              {saveError && <span className="text-xs text-red-400">{saveError}</span>}
            </div>
            <button onClick={handleSave} className="h-9 px-6 rounded-xl text-sm font-semibold text-white"
              style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
              Save changes
            </button>
          </div>
        </motion.div>

        {/* Password */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl" style={card}>
          <h2 className="text-white font-semibold mb-5">Change password</h2>
          <div className="space-y-3">
            {[
              { label: 'Current password', value: pwCurrent, onChange: setPwCurrent },
              { label: 'New password', value: pwNew, onChange: setPwNew },
              { label: 'Confirm new password', value: pwConfirm, onChange: setPwConfirm },
            ].map((f) => (
              <div key={f.label}>
                <label className="block text-xs font-medium text-white/50 mb-1.5">{f.label}</label>
                <input type="password" value={f.value} onChange={(e) => f.onChange(e.target.value)} placeholder="••••••••"
                  className="w-full h-10 px-3 rounded-xl text-sm text-white placeholder:text-white/20 outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }} />
              </div>
            ))}
          </div>
          {pwError && <p className="text-red-400 text-xs mt-3">{pwError}</p>}
          {pwSaved && <p className="text-xs mt-3" style={{ color: '#10b981' }}>Password updated</p>}
          <div className="flex justify-end mt-4">
            <button onClick={handleChangePassword} disabled={pwLoading}
              className="h-9 px-6 rounded-xl text-sm font-semibold text-white/70 disabled:opacity-50"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {pwLoading ? 'Updating...' : 'Update password'}
            </button>
          </div>
        </motion.div>

        {/* Danger */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="p-6 rounded-2xl" style={{ ...card, borderColor: 'rgba(239,68,68,0.2)' }}>
          <h2 className="font-semibold mb-1" style={{ color: '#f87171' }}>Sign out</h2>
          <p className="text-white/40 text-sm mb-4">Sign out of your account on this device.</p>
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
