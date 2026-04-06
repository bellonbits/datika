'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { 
  User as UserIcon, 
  Search, 
  Shield, 
  ShieldAlert, 
  UserX, 
  UserCheck, 
  Users,
  MoreVertical 
} from 'lucide-react';

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 };

const ROLE_COLOR: Record<string, string> = {
  STUDENT: '#00d4ff',
  INSTRUCTOR: '#f97316',
  ADMIN: '#a855f7',
};

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  avatarUrl?: string;
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-users'],
    queryFn: () => apiClient.get('/users') as Promise<{ users: User[]; total: number }>,
  });

  const toggleStatus = useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) => 
      apiClient.patch(`/users/${id}/${active ? 'deactivate' : 'activate'}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
    },
  });

  const users: User[] = (data as unknown as { users: User[] })?.users ?? [];

  const filtered = users.filter((u) => {
    const matchRole = roleFilter === 'All' || u.role === roleFilter;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchSearch;
  });

  const stats = {
    total: users.length,
    students: users.filter((u) => u.role === 'STUDENT').length,
    instructors: users.filter((u) => u.role === 'INSTRUCTOR').length,
    active: users.filter((u) => u.isActive).length,
  };

  return (
    <div className="p-6 h-full overflow-auto text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">User Management</h1>
        <p className="text-white/40 text-sm">Control access and roles across the platform</p>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Users', value: isLoading ? '—' : stats.total, accent: '#00d4ff', icon: <Users size={16} /> },
          { label: 'Learners', value: isLoading ? '—' : stats.students, accent: '#10b981', icon: <UserIcon size={16} /> },
          { label: 'Instructors', value: isLoading ? '—' : stats.instructors, accent: '#f97316', icon: <Shield size={16} /> },
          { label: 'Active Keys', value: isLoading ? '—' : stats.active, accent: '#a855f7', icon: <ShieldAlert size={16} /> },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.05 }}
            className="p-4 rounded-2xl" style={card}>
            <div className="flex items-center justify-between mb-2">
               <div className="p-1.5 rounded-lg" style={{ background: `${s.accent}15`, color: s.accent }}>{s.icon}</div>
            </div>
            <p className="text-2xl font-extrabold mb-0.5" style={{ color: s.accent }}>{s.value}</p>
            <p className="text-white/40 text-xs uppercase tracking-tight">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <div className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" size={14} />
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="w-full h-9 pl-9 pr-3 rounded-xl text-sm text-white placeholder:text-white/25 outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
        </div>
        <div className="flex items-center gap-1.5">
          {['All', 'STUDENT', 'INSTRUCTOR', 'ADMIN'].map((r) => (
            <button key={r} onClick={() => setRoleFilter(r)}
              className="h-9 px-4 rounded-xl text-xs font-medium transition-all"
              style={roleFilter === r
                ? { background: 'rgba(0,212,255,0.15)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }
                : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {r === 'All' ? 'All' : r.charAt(0) + r.slice(1).toLowerCase() + 's'}
            </button>
          ))}
        </div>
      </div>

      {isLoading && (
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-4 rounded-xl animate-pulse flex items-center gap-4" style={card}>
              <div className="w-9 h-9 rounded-xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 rounded w-1/3" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="h-2.5 rounded w-1/2" style={{ background: 'rgba(255,255,255,0.04)' }} />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="p-5 rounded-2xl text-center" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <p className="text-red-400 text-sm">Failed to load users. You may not have admin access.</p>
        </div>
      )}

      {!isLoading && !isError && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
          className="rounded-2xl overflow-hidden" style={card}>
          {/* Table header */}
          <div className="grid grid-cols-6 px-5 py-3 text-xs font-semibold text-white/30 uppercase tracking-wider"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <span className="col-span-2">User</span>
            <span>Role</span>
            <span>Status</span>
            <span>Joined</span>
            <span className="text-right">Actions</span>
          </div>

          {filtered.length === 0 && (
            <p className="text-white/25 text-sm text-center py-12">No users found.</p>
          )}

          {filtered.map((u, i) => {
            const roleColor = ROLE_COLOR[u.role] ?? '#6b7280';
            const joined = new Date(u.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
            return (
              <div key={u.id} className="grid grid-cols-6 items-center px-5 py-3.5 transition-all"
                style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.02)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}>
                <div className="col-span-2 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: `${roleColor}15`, color: roleColor }}>
                    {u.name[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="text-white/80 text-sm font-medium leading-tight">{u.name}</p>
                    <p className="text-white/30 text-xs">{u.email}</p>
                  </div>
                </div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full w-fit"
                  style={{ background: `${roleColor}12`, color: roleColor, border: `1px solid ${roleColor}20` }}>
                  {u.role.charAt(0) + u.role.slice(1).toLowerCase()}
                </span>
                <span className="text-xs font-medium flex items-center gap-1.5" style={{ color: u.isActive ? '#10b981' : '#ef4444' }}>
                  <span className={`w-1.5 h-1.5 rounded-full ${u.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  {u.isActive ? 'Active' : 'Inactive'}
                </span>
                <span className="text-white/30 text-xs">{joined}</span>
                <div className="text-right">
                   <button 
                     onClick={() => toggleStatus.mutate({ id: u.id, active: u.isActive })}
                     disabled={toggleStatus.isPending || u.role === 'ADMIN'}
                     className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all text-white/40 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                   >
                     {u.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                   </button>
                </div>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
