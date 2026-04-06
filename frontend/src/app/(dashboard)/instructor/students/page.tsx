'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { 
  Users, 
  Search, 
  Mail, 
  Calendar, 
  GraduationCap, 
  Activity,
  ArrowUpRight,
  TrendingUp,
  Award,
  MoreVertical
} from 'lucide-react';

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 };

interface Student {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  enrolledAt: string;
  courseTitle: string;
  progress: number;
}

export default function InstructorStudentsPage() {
  const [search, setSearch] = useState('');
  
  const { data, isLoading } = useQuery({
    queryKey: ['instructor-students'],
    queryFn: () => apiClient.get('/courses/instructor/students') as Promise<Student[]>,
  });

  const students = data ?? [];
  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.courseTitle.toLowerCase().includes(search.toLowerCase())
  );

  const stats = {
    total: students.length,
    active: students.filter(s => s.progress > 0 && s.progress < 100).length,
    completed: students.filter(s => s.progress === 100).length,
  };

  return (
    <div className="p-6 h-full overflow-auto text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1">My Learners</h1>
          <p className="text-white/40 text-sm">Track progress and engage with your students</p>
        </div>
        <div className="flex -space-x-2">
          {[1,2,3,4].map(i => (
             <div key={i} className="w-8 h-8 rounded-full border-2 border-[#0a0f1d] bg-white/10 flex items-center justify-center text-[10px] font-bold">
               {String.fromCharCode(64 + i)}
             </div>
          ))}
          <div className="w-8 h-8 rounded-full border-2 border-[#0a0f1d] bg-white/5 flex items-center justify-center text-[10px] font-bold text-white/40">
            +{stats.total > 4 ? stats.total - 4 : 0}
          </div>
        </div>
      </motion.div>

      {/* Stats row */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Enrolled', value: isLoading ? '—' : stats.total, accent: '#00d4ff', icon: <Users size={16} /> },
          { label: 'Active Progress', value: isLoading ? '—' : stats.active, accent: '#f97316', icon: <TrendingUp size={16} /> },
          { label: 'Completed', value: isLoading ? '—' : stats.completed, accent: '#10b981', icon: <Award size={16} /> },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.05 }}
            className="p-4 rounded-2xl relative overflow-hidden" style={card}>
            <div className="p-1.5 rounded-lg w-fit mb-2" style={{ background: `${s.accent}15`, color: s.accent }}>{s.icon}</div>
            <p className="text-2xl font-extrabold" style={{ color: s.accent }}>{s.value}</p>
            <p className="text-white/30 text-[10px] uppercase tracking-widest font-bold">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" size={16} />
          <input 
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search students by name or course..."
            className="w-full h-10 pl-10 pr-3 rounded-xl text-sm text-white placeholder:text-white/20 outline-none transition-all focus:ring-1 focus:ring-cyan-500/50"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {isLoading && (
           [1,2,3].map(i => (
             <div key={i} className="h-20 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
           ))
        )}
        {filtered.length === 0 && !isLoading && (
          <div className="text-center py-16 rounded-3xl" style={card}>
             <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-white/10">
                <GraduationCap size={32} />
             </div>
             <p className="text-white/20 text-sm">No learners found matching your criteria</p>
          </div>
        )}
        
        {filtered.map((s, i) => (
          <motion.div key={s.id + s.courseTitle} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
            className="p-4 rounded-2xl flex items-center justify-between group hover:bg-white/[0.02] transition-all" style={card}>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 flex items-center justify-center text-cyan-400 font-bold border border-cyan-500/20 relative group-hover:scale-105 transition-transform">
                {s.name[0]}
                {s.progress === 100 && (
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-[#0a0f1d] flex items-center justify-center">
                    <Award size={8} className="text-white" />
                  </div>
                )}
              </div>
              <div>
                <h3 className="font-bold text-white/90 group-hover:text-cyan-400 transition-colors">{s.name}</h3>
                <div className="flex items-center gap-3 mt-0.5">
                  <span className="text-xs text-white/30 flex items-center gap-1"><Mail size={12} /> {s.email}</span>
                  <span className="w-1 h-1 rounded-full bg-white/10" />
                  <span className="text-xs text-cyan-400/80 font-medium">{s.courseTitle}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-8">
              <div className="w-40">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Course Progress</span>
                  <span className="text-[10px] font-bold text-cyan-400">{s.progress}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden bg-white/5">
                  <div className={`h-full rounded-full transition-all duration-700 ${s.progress === 100 ? 'bg-green-500' : 'bg-cyan-500'}`} 
                    style={{ width: `${s.progress}%` }} />
                </div>
              </div>
              <div className="text-right min-w-[100px]">
                <p className="text-[10px] text-white/20 mb-1 uppercase tracking-widest font-bold">Enrolled</p>
                <p className="text-xs font-semibold text-white/60">{new Date(s.enrolledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
              </div>
              <button className="p-2 rounded-xl bg-white/5 border border-white/10 text-white/20 group-hover:text-white group-hover:bg-white/10 transition-all">
                <MoreVertical size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
