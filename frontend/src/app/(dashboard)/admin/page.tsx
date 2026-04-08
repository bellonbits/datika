'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
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

const ROLE_COLOR: Record<string, string> = { STUDENT: '#00d4ff', INSTRUCTOR: '#a855f7', ADMIN: '#f97316' };
const PAY_COLOR: Record<string, string> = { COMPLETED: '#10b981', PENDING: '#f97316', FAILED: '#ef4444' };

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Payment {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  user?: { name: string; email: string };
  course?: { title: string };
}

export default function AdminDashboard() {
  const router = useRouter();

  // 1. Fetch User Stats
  const { data: userStats, isLoading: isLoadingUserStats } = useQuery({
    queryKey: ['admin-user-stats'],
    queryFn: () => apiClient.get('/users/stats') as Promise<{ total: number; students: number; instructors: number; newUsersToday: number }>,
  });

  // 2. Fetch Course Stats
  const { data: courseStats, isLoading: isLoadingCourseStats } = useQuery({
    queryKey: ['admin-course-stats'],
    queryFn: () => apiClient.get('/courses/admin/stats') as Promise<{ total: number; published: number; totalEnrollments: number; totalRevenue: number }>,
  });

  // 3. Fetch Recent Users
  const { data: recentUsersData, isLoading: isLoadingRecentUsers } = useQuery({
    queryKey: ['admin-recent-users'],
    queryFn: () => apiClient.get('/users?limit=5') as Promise<{ users: User[] }>,
  });

  // 4. Fetch Recent Payments
  const { data: revenueData, isLoading: isLoadingRecentPayments, isError: isRevenueError } = useQuery({
    queryKey: ['admin-revenue-dashboard'],
    queryFn: () => apiClient.get('/payments/admin/revenue') as Promise<{ recentPayments: Payment[] }>,
  });

  const uStats = (userStats as any)?.data;
  const cStats = (courseStats as any)?.data;
  const statsList = [
    { label: 'Total users', value: isLoadingUserStats ? null : uStats?.total, delta: `+${uStats?.newUsersToday ?? 0} today`, accent: '#00d4ff', icon: <Users size={24} /> },
    { label: 'Active courses', value: isLoadingCourseStats ? null : cStats?.published, delta: `${cStats?.total ?? 0} total`, accent: '#a855f7', icon: <BookOpen size={24} /> },
    { label: 'Revenue (KES)', value: isLoadingCourseStats ? null : ((cStats?.totalRevenue ?? 0) as number).toLocaleString(), delta: 'Life-time', accent: '#f97316', icon: <CreditCard size={24} /> },
    { label: 'Enrollments', value: isLoadingCourseStats ? null : cStats?.totalEnrollments, delta: 'Total platform', accent: '#10b981', icon: <ClipboardList size={24} /> },
  ];

  const recentUsers: User[] = (recentUsersData as any)?.data?.users ?? [];
  const recentPayments: Payment[] = (revenueData as any)?.data?.recentPayments ?? [];

  return (
    <div className="p-6 space-y-5 text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-white">Admin Overview</h1>
        <p className="text-white/35 text-sm mt-0.5">Platform performance at a glance</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsList.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="p-5 rounded-2xl relative overflow-hidden" style={card}>
            <div className="mb-4" style={{ color: s.accent }}>{s.icon}</div>
            
            {s.value === null ? (
               <div className="h-8 w-24 rounded bg-white/5 animate-pulse mb-1" />
            ) : (
               <div className="text-2xl font-extrabold text-white">{s.value}</div>
            )}
            
            <div className="text-xs text-white/35 mt-0.5">{s.label}</div>
            <div className="text-xs mt-2 font-medium" style={{ color: s.accent }}>{s.delta}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Users */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="rounded-2xl overflow-hidden min-h-[400px] flex flex-col" style={card}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="font-semibold text-white/80">Recent users</h2>
            <button onClick={() => router.push('/admin/users')} className="text-xs transition-colors" style={{ color: '#00d4ff' }}>View all →</button>
          </div>
          
          <div className="flex-1">
            {isLoadingRecentUsers ? (
              <div className="p-5 space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : recentUsers.length === 0 ? (
              <div className="h-full flex items-center justify-center text-white/20 text-sm italic py-10">
                No new users recently.
              </div>
            ) : (
              recentUsers.map((u, i) => {
                const timeAgo = i === 0 ? 'Recently' : i === 1 ? 'Today' : 'Yesterday';
                return (
                  <div key={u.id} className="flex items-center gap-3 px-5 py-3.5 transition-all cursor-pointer"
                    style={{ borderBottom: i < recentUsers.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                      style={{ background: `${ROLE_COLOR[u.role]}20`, border: `1px solid ${ROLE_COLOR[u.role]}35`, color: ROLE_COLOR[u.role] }}>
                      {u.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white/70 truncate">{u.name}</p>
                      <p className="text-xs text-white/25 truncate">{u.email}</p>
                    </div>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: `${ROLE_COLOR[u.role]}15`, color: ROLE_COLOR[u.role], border: `1px solid ${ROLE_COLOR[u.role]}25` }}>
                      {u.role.charAt(0) + u.role.slice(1).toLowerCase()}
                    </span>
                    <span className="text-xs text-white/25 flex-shrink-0 hidden sm:block ml-2">{timeAgo}</span>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>

        {/* Payments */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="rounded-2xl overflow-hidden min-h-[400px] flex flex-col" style={card}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="font-semibold text-white/80">Recent payments</h2>
            <button onClick={() => router.push('/admin/revenue')} className="text-xs transition-colors" style={{ color: '#00d4ff' }}>View all →</button>
          </div>
          
          <div className="flex-1">
            {isLoadingRecentPayments ? (
              <div className="p-5 space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-12 rounded-xl bg-white/5 animate-pulse" />
                ))}
              </div>
            ) : isRevenueError ? (
              <div className="h-full flex items-center justify-center text-red-500/30 text-xs italic py-10 px-6 text-center">
                Access restricted. Admin permissions required for payment data.
              </div>
            ) : recentPayments.length === 0 ? (
              <div className="h-full flex items-center justify-center text-white/20 text-sm italic py-10">
                No payments recorded.
              </div>
            ) : (
              recentPayments.slice(0, 5).map((p, i) => (
                <div key={p.id} className="flex items-center gap-3 px-5 py-3.5"
                  style={{ borderBottom: i < recentPayments.slice(0, 5).length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-white/70 truncate">{p.user?.name ?? 'Unknown'}</p>
                    <p className="text-xs text-white/25 truncate">{p.course?.title ?? '—'}</p>
                  </div>
                  <div className="text-right flex-shrink-0 pr-2">
                    <p className="text-sm font-bold text-white/80">KES {p.amount.toLocaleString()}</p>
                    <p className="text-xs text-white/25">Recently</p>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-tighter flex-shrink-0"
                    style={{ background: `${PAY_COLOR[p.status] ?? '#00d4ff'}15`, color: PAY_COLOR[p.status] ?? '#00d4ff', border: `1px solid ${PAY_COLOR[p.status] ?? '#00d4ff'}25` }}>
                    {p.status}
                  </span>
                </div>
              ))
            )}
          </div>
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

      {/* Admin Action: Create Course */}
      <div className="flex justify-end">
        <button onClick={() => router.push('/admin/courses/new')}
           className="h-12 px-6 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-[#070b16] font-bold flex items-center gap-2 transform transition-all active:scale-95 shadow-lg shadow-cyan-500/20">
           <Plus size={20} />
           Create Platform Course
        </button>
      </div>
    </div>
  );
}

