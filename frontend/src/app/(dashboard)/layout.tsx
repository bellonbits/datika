'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Tooltip } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/lib/store/auth.store';
import DatikaLogo from '@/components/ui/DatikaLogo';

const ICON_HOME = (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a1.5 1.5 0 012.092 0L22.25 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
  </svg>
);
const ICON_COURSES = (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);
const ICON_PROGRESS = (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
);
const ICON_AI = (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
  </svg>
);
const ICON_SETTINGS = (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);
const ICON_LOGOUT = (
  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
  </svg>
);

const studentNav = [
  { key: '/student', icon: ICON_HOME, label: 'Dashboard' },
  { key: '/student/courses', icon: ICON_COURSES, label: 'My Courses' },
  { key: '/student/progress', icon: ICON_PROGRESS, label: 'Progress' },
  { key: '/student/chat', icon: ICON_AI, label: 'AI Tutor' },
  { key: '/student/settings', icon: ICON_SETTINGS, label: 'Settings' },
];
const instructorNav = [
  { key: '/instructor', icon: ICON_HOME, label: 'Dashboard' },
  { key: '/instructor/courses', icon: ICON_COURSES, label: 'My Courses' },
  { key: '/instructor/ai-tools', icon: ICON_AI, label: 'AI Studio' },
  { key: '/instructor/settings', icon: ICON_SETTINGS, label: 'Settings' },
];
const adminNav = [
  { key: '/admin', icon: ICON_HOME, label: 'Overview' },
  { key: '/admin/users', icon: ICON_COURSES, label: 'Users' },
  { key: '/admin/revenue', icon: ICON_PROGRESS, label: 'Revenue' },
  { key: '/admin/settings', icon: ICON_SETTINGS, label: 'Settings' },
];

const PEER_COLORS = ['#00d4ff', '#f97316', '#a855f7'];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, clearAuth, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (!isAuthenticated) router.replace('/login');
  }, [isAuthenticated, router]);

  if (!user) return null;

  const nav = user.role === 'ADMIN' ? adminNav : user.role === 'INSTRUCTOR' ? instructorNav : studentNav;

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ fontFamily: 'Inter, system-ui, sans-serif', background: '#070b16' }}
    >
      {/* ── Dark icon sidebar ─────────────────────────────── */}
      <aside
        className="w-[72px] h-full flex flex-col items-center py-6 flex-shrink-0 relative"
        style={{
          background: 'rgba(255,255,255,0.02)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Subtle glow behind logo */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-12 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)' }} />

        {/* Logo mark */}
        <div className="relative mb-8 flex-shrink-0">
          <DatikaLogo size={34} showText={false} />
        </div>

        {/* Nav */}
        <nav className="flex flex-col items-center gap-1.5 flex-1">
          {nav.map((item) => {
            const isActive = pathname === item.key ||
              (item.key !== '/student' && item.key !== '/instructor' && item.key !== '/admin' &&
                pathname.startsWith(item.key + '/'));
            return (
              <Tooltip key={item.key} title={item.label} placement="right">
                <button
                  onClick={() => router.push(item.key)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-150 relative"
                  style={isActive
                    ? { background: 'rgba(0,212,255,0.15)', color: '#00d4ff', boxShadow: '0 0 12px rgba(0,212,255,0.2)' }
                    : { color: 'rgba(255,255,255,0.3)' }
                  }
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.color = 'rgba(255,255,255,0.7)'; } }}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.3)'; } }}
                >
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full" style={{ background: '#00d4ff' }} />
                  )}
                  {item.icon}
                </button>
              </Tooltip>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="flex flex-col items-center gap-2.5 flex-shrink-0">
          {/* Peer avatars */}
          {PEER_COLORS.map((color, i) => (
            <Tooltip key={i} title={`Peer ${i + 1}`} placement="right">
              <div className="w-7 h-7 rounded-full cursor-pointer ring-1 ring-white/10 hover:scale-110 transition-transform"
                style={{ background: `radial-gradient(circle at 35% 35%, ${color}cc, ${color}44)` }} />
            </Tooltip>
          ))}

          <div className="w-8 h-px my-1" style={{ background: 'rgba(255,255,255,0.08)' }} />

          {/* User avatar */}
          <Tooltip title={user.name} placement="right">
            <button
              onClick={() => router.push(`/${user.role.toLowerCase()}/profile`)}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ring-1 ring-cyan-500/30 transition-all"
              style={{ background: 'linear-gradient(135deg, #0d6efd, #0a58ca)' }}
            >
              {user.name?.[0]?.toUpperCase() ?? '?'}
            </button>
          </Tooltip>

          {/* Logout */}
          <Tooltip title="Sign out" placement="right">
            <button
              onClick={() => { clearAuth(); router.replace('/login'); }}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              style={{ color: 'rgba(255,255,255,0.25)' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239,68,68,0.1)'; e.currentTarget.style.color = '#f87171'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; }}
            >
              {ICON_LOGOUT}
            </button>
          </Tooltip>
        </div>
      </aside>

      {/* ── Page content ─────────────────────────────────── */}
      <main className="flex-1 overflow-auto min-w-0" style={{ background: '#070b16' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="h-full"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}
