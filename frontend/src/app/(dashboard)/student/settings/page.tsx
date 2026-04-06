'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '@/lib/store/auth.store';
import { useRouter } from 'next/navigation';

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 };

const TABS = ['Profile', 'Notifications', 'Privacy', 'Billing', 'Danger Zone'];

function Toggle({ on, onChange }: { on: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className="relative w-10 h-5.5 rounded-full transition-all flex-shrink-0"
      style={{ background: on ? '#00d4ff' : 'rgba(255,255,255,0.1)', width: 40, height: 22 }}>
      <div className="absolute top-0.5 rounded-full w-4.5 h-4.5 bg-white transition-all"
        style={{ width: 18, height: 18, left: on ? 19 : 2, top: 2, transition: 'left 0.15s' }} />
    </button>
  );
}

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const { clearAuth } = useAuthStore();
  const router = useRouter();
  const [tab, setTab] = useState('Profile');

  // Profile state
  const [name, setName] = useState(user?.name ?? '');
  const [email] = useState(user?.email ?? '');
  const [bio, setBio] = useState('Aspiring data scientist. Learning Python, SQL, and ML on Datika.');
  const [phone, setPhone] = useState('');
  const [country, setCountry] = useState('Kenya');
  const [saved, setSaved] = useState(false);

  // Notification prefs
  const [notifs, setNotifs] = useState({
    courseUpdates: true,
    liveSessionReminders: true,
    aiTutorResponses: false,
    weeklyProgress: true,
    promotions: false,
    newCourses: true,
  });

  // Privacy
  const [privacy, setPrivacy] = useState({
    showProgress: true,
    showCertificates: true,
    allowAnalytics: true,
  });

  const toggleNotif = (k: keyof typeof notifs) => setNotifs((p) => ({ ...p, [k]: !p[k] }));
  const togglePrivacy = (k: keyof typeof privacy) => setPrivacy((p) => ({ ...p, [k]: !p[k] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="p-6 h-full overflow-auto text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">Settings</h1>
        <p className="text-white/40 text-sm">Manage your account, preferences, and privacy</p>
      </motion.div>

      <div className="flex gap-6">

        {/* Sidebar tabs */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}
          className="w-48 flex-shrink-0">
          <div className="p-2 rounded-2xl space-y-0.5" style={card}>
            {TABS.map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={tab === t
                  ? { background: 'rgba(0,212,255,0.12)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }
                  : { color: 'rgba(255,255,255,0.45)', border: '1px solid transparent' }}
                onMouseEnter={(e) => { if (tab !== t) e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; }}
                onMouseLeave={(e) => { if (tab !== t) e.currentTarget.style.background = 'transparent'; }}>
                {t === 'Danger Zone' ? <span style={{ color: tab === t ? '#f87171' : '#f8717166' }}>{t}</span> : t}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="flex-1 min-w-0 space-y-4">

          {/* ── PROFILE ── */}
          {tab === 'Profile' && (
            <>
              <div className="p-6 rounded-2xl" style={card}>
                <h2 className="text-white font-semibold mb-5">Profile information</h2>

                {/* Avatar */}
                <div className="flex items-center gap-5 mb-6 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold"
                    style={{ background: 'linear-gradient(135deg,rgba(0,212,255,0.3),rgba(13,110,253,0.3))', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}>
                    {name?.[0]?.toUpperCase() ?? 'U'}
                  </div>
                  <div>
                    <button className="h-8 px-4 rounded-xl text-xs font-semibold text-white transition-all mb-1.5"
                      style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      Upload photo
                    </button>
                    <p className="text-white/30 text-xs">JPG, PNG or GIF · max 2MB</p>
                  </div>
                </div>

                {/* Fields */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Full name', value: name, onChange: setName, placeholder: 'Your full name' },
                    { label: 'Email address', value: email, onChange: () => {}, placeholder: '', disabled: true },
                    { label: 'Phone number', value: phone, onChange: setPhone, placeholder: '+254 7xx xxx xxx' },
                    { label: 'Country', value: country, onChange: setCountry, placeholder: 'Kenya' },
                  ].map((f) => (
                    <div key={f.label}>
                      <label className="block text-xs font-medium text-white/50 mb-1.5">{f.label}</label>
                      <input value={f.value} onChange={(e) => f.onChange(e.target.value)}
                        placeholder={f.placeholder} disabled={f.disabled}
                        className="w-full h-10 px-3 rounded-xl text-sm text-white placeholder:text-white/20 outline-none transition-all"
                        style={{
                          background: f.disabled ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)',
                          border: '1px solid rgba(255,255,255,0.08)',
                          opacity: f.disabled ? 0.5 : 1,
                        }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                      />
                    </div>
                  ))}
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-white/50 mb-1.5">Bio</label>
                    <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3}
                      className="w-full px-3 py-2.5 rounded-xl text-sm text-white placeholder:text-white/20 outline-none resize-none transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mt-5 pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {saved && <span className="text-xs font-medium" style={{ color: '#10b981' }}>Changes saved successfully</span>}
                  {!saved && <span />}
                  <button onClick={handleSave} className="h-9 px-6 rounded-xl text-sm font-semibold text-white transition-all"
                    style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 0 16px rgba(249,115,22,0.2)' }}>
                    Save changes
                  </button>
                </div>
              </div>

              {/* Password */}
              <div className="p-6 rounded-2xl" style={card}>
                <h2 className="text-white font-semibold mb-5">Change password</h2>
                <div className="space-y-3">
                  {['Current password', 'New password', 'Confirm new password'].map((label) => (
                    <div key={label}>
                      <label className="block text-xs font-medium text-white/50 mb-1.5">{label}</label>
                      <input type="password" placeholder="••••••••"
                        className="w-full h-10 px-3 rounded-xl text-sm text-white placeholder:text-white/20 outline-none"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
                        onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.35)'; }}
                        onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end mt-4">
                  <button className="h-9 px-6 rounded-xl text-sm font-semibold text-white/70 transition-all"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    Update password
                  </button>
                </div>
              </div>
            </>
          )}

          {/* ── NOTIFICATIONS ── */}
          {tab === 'Notifications' && (
            <div className="p-6 rounded-2xl" style={card}>
              <h2 className="text-white font-semibold mb-5">Email notifications</h2>
              <div className="space-y-0">
                {[
                  { key: 'courseUpdates', label: 'Course updates', desc: 'New lessons, announcements from instructors' },
                  { key: 'liveSessionReminders', label: 'Live session reminders', desc: '24h and 1h before a registered session' },
                  { key: 'aiTutorResponses', label: 'AI Tutor email digests', desc: 'Weekly summary of your AI Tutor conversations' },
                  { key: 'weeklyProgress', label: 'Weekly progress report', desc: 'Your learning stats every Monday morning' },
                  { key: 'promotions', label: 'Promotions & offers', desc: 'Discounts, new courses, and special events' },
                  { key: 'newCourses', label: 'New courses', desc: 'When a new course in your interest areas is published' },
                ].map((item, i) => (
                  <div key={item.key} className="flex items-center justify-between py-4"
                    style={{ borderBottom: i < 5 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                    <div>
                      <p className="text-white/80 text-sm font-medium">{item.label}</p>
                      <p className="text-white/35 text-xs mt-0.5">{item.desc}</p>
                    </div>
                    <Toggle on={notifs[item.key as keyof typeof notifs]} onChange={() => toggleNotif(item.key as keyof typeof notifs)} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── PRIVACY ── */}
          {tab === 'Privacy' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl" style={card}>
                <h2 className="text-white font-semibold mb-5">Privacy settings</h2>
                <div className="space-y-0">
                  {[
                    { key: 'showProgress', label: 'Show my progress publicly', desc: 'Other learners can see your course completion rates' },
                    { key: 'showCertificates', label: 'Public certificates', desc: 'Your earned certificates are visible on your profile' },
                    { key: 'allowAnalytics', label: 'Learning analytics', desc: 'Allow Datika to use anonymised data to improve the platform' },
                  ].map((item, i) => (
                    <div key={item.key} className="flex items-center justify-between py-4"
                      style={{ borderBottom: i < 2 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                      <div>
                        <p className="text-white/80 text-sm font-medium">{item.label}</p>
                        <p className="text-white/35 text-xs mt-0.5">{item.desc}</p>
                      </div>
                      <Toggle on={privacy[item.key as keyof typeof privacy]} onChange={() => togglePrivacy(item.key as keyof typeof privacy)} />
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-6 rounded-2xl" style={card}>
                <h2 className="text-white font-semibold mb-2">Download your data</h2>
                <p className="text-white/40 text-sm mb-4 leading-relaxed">Request a copy of all your personal data including course progress, submissions, and chat history. We'll email it within 48 hours.</p>
                <button className="h-9 px-5 rounded-xl text-sm font-medium text-white/60 transition-all"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  Request data export
                </button>
              </div>
            </div>
          )}

          {/* ── BILLING ── */}
          {tab === 'Billing' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl" style={{ ...card, background: 'rgba(0,212,255,0.04)', borderColor: 'rgba(0,212,255,0.15)' }}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#00d4ff' }}>Current Plan</p>
                    <p className="text-2xl font-extrabold text-white">Free</p>
                    <p className="text-white/40 text-sm mt-1">10 AI Tutor messages/day · Access to free course previews</p>
                  </div>
                  <button onClick={() => router.push('/pricing')}
                    className="h-10 px-6 rounded-xl text-sm font-semibold text-white transition-all"
                    style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 0 16px rgba(249,115,22,0.2)' }}>
                    Upgrade to Pro
                  </button>
                </div>
              </div>

              <div className="p-6 rounded-2xl" style={card}>
                <h2 className="text-white font-semibold mb-1">Pro Plan — KES 2,500/month</h2>
                <p className="text-white/40 text-sm mb-4">Unlimited AI Tutor · All courses · Live sessions · Certificates</p>
                <div className="grid grid-cols-2 gap-2 mb-4">
                  {['Unlimited AI Tutor messages', 'All 24+ courses', 'Weekly live sessions', 'Verifiable certificates', 'Download lesson notes', 'Priority support'].map((f) => (
                    <div key={f} className="flex items-center gap-2 text-sm text-white/60">
                      <span style={{ color: '#10b981' }}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <button onClick={() => router.push('/pricing')}
                  className="w-full h-10 rounded-xl text-sm font-semibold text-white transition-all"
                  style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
                  Pay with M-Pesa · KES 2,500/month
                </button>
              </div>

              <div className="p-6 rounded-2xl" style={card}>
                <h2 className="text-white font-semibold mb-4">Payment history</h2>
                <p className="text-white/30 text-sm text-center py-6">No payment history yet.</p>
              </div>
            </div>
          )}

          {/* ── DANGER ZONE ── */}
          {tab === 'Danger Zone' && (
            <div className="space-y-4">
              <div className="p-6 rounded-2xl" style={{ ...card, borderColor: 'rgba(239,68,68,0.2)' }}>
                <h2 className="font-semibold mb-1" style={{ color: '#f87171' }}>Sign out of all devices</h2>
                <p className="text-white/40 text-sm mb-4">This will invalidate all active sessions and require you to log in again on all devices.</p>
                <button onClick={() => { clearAuth(); router.replace('/login'); }}
                  className="h-9 px-5 rounded-xl text-sm font-medium transition-all"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
                  Sign out everywhere
                </button>
              </div>

              <div className="p-6 rounded-2xl" style={{ ...card, borderColor: 'rgba(239,68,68,0.2)' }}>
                <h2 className="font-semibold mb-1" style={{ color: '#f87171' }}>Delete account</h2>
                <p className="text-white/40 text-sm mb-4 leading-relaxed">
                  Permanently delete your account, all course progress, certificates, and data. This action cannot be undone. You will lose access to any paid courses.
                </p>
                <button className="h-9 px-5 rounded-xl text-sm font-medium transition-all"
                  style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#f87171' }}>
                  Delete my account
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
