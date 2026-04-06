'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Tooltip } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  BookOpen, 
  BarChart3, 
  Bot, 
  Settings, 
  LogOut, 
  Users,
  GraduationCap
} from 'lucide-react';
import { useAuthStore } from '@/lib/store/auth.store';
import DatikaLogo from '@/components/ui/DatikaLogo';

const studentNav = [
  { key: '/student', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { key: '/student/courses', icon: <BookOpen size={18} />, label: 'My Courses' },
  { key: '/student/progress', icon: <BarChart3 size={18} />, label: 'Progress' },
  { key: '/student/chat', icon: <Bot size={18} />, label: 'AI Tutor' },
  { key: '/student/settings', icon: <Settings size={18} />, label: 'Settings' },
];

const instructorNav = [
  { key: '/instructor', icon: <LayoutDashboard size={18} />, label: 'Dashboard' },
  { key: '/instructor/courses', icon: <BookOpen size={18} />, label: 'My Courses' },
  { key: '/instructor/students', icon: <Users size={18} />, label: 'My Students' },
  { key: '/instructor/ai-tools', icon: <Bot size={18} />, label: 'AI Studio' },
  { key: '/instructor/settings', icon: <Settings size={18} />, label: 'Settings' },
];

const adminNav = [
  { key: '/admin', icon: <LayoutDashboard size={18} />, label: 'Overview' },
  { key: '/admin/courses', icon: <BookOpen size={18} />, label: 'All Courses' },
  { key: '/admin/users', icon: <Users size={18} />, label: 'User Management' },
  { key: '/admin/revenue', icon: <BarChart3 size={18} />, label: 'Revenue' },
  { key: '/admin/settings', icon: <Settings size={18} />, label: 'Settings' },
];



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
              <LogOut size={18} />
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
