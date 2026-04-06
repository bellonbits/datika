'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { User, Users, Search, Filter } from 'lucide-react';
import { useState } from 'react';

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
    queryFn: () => apiClient.get('/instructor/students') as Promise<{ students: Student[] }>,
  });

  const students = data?.students ?? [];
  const filtered = students.filter(s => 
    s.name.toLowerCase().includes(search.toLowerCase()) || 
    s.courseTitle.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 h-full overflow-auto text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">My Students</h1>
        <p className="text-white/40 text-sm">Overview of students enrolled in your courses</p>
      </motion.div>

      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" size={16} />
          <input 
            value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter by name or course..."
            className="w-full h-10 pl-10 pr-3 rounded-xl text-sm text-white placeholder:text-white/20 outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {isLoading && <p className="text-white/25">Loading learners...</p>}
        {filtered.length === 0 && !isLoading && <p className="text-white/20 text-center py-12">No students found.</p>}
        
        {filtered.map((s) => (
          <div key={s.id + s.courseTitle} className="p-4 rounded-2xl flex items-center justify-between" style={card}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400 font-bold border border-cyan-500/20">
                {s.name[0]}
              </div>
              <div>
                <p className="text-sm font-semibold text-white/80">{s.name}</p>
                <p className="text-xs text-white/30 truncate">{s.courseTitle}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-12">
              <div className="w-32">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-mono text-white/30 uppercase tracking-wider">Progress</span>
                  <span className="text-[10px] font-bold text-cyan-400">{s.progress}%</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden bg-white/5">
                  <div className="h-full rounded-full bg-cyan-500" style={{ width: `${s.progress}%` }} />
                </div>
              </div>
              <div className="text-right min-w-[80px]">
                <p className="text-[10px] text-white/25 mb-1 uppercase tracking-tighter">Joined</p>
                <p className="text-[11px] font-medium text-white/50">{new Date(s.enrolledAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
