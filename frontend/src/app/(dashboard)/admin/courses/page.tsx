'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { 
  BookOpen, 
  Users, 
  Calendar, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 };

interface Course {
  id: string;
  title: string;
  status: string;
  instructor: { name: string; email: string };
  _count: { enrollments: number; sections: number };
  createdAt: string;
  price: string;
}

export default function AdminCoursesPage() {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: () => apiClient.get('/courses/admin/all') as Promise<{ courses: Course[] }>,
  });

  const courses = data?.courses ?? [];

  return (
    <div className="p-6 h-full overflow-auto text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1">Global Content Management</h1>
          <p className="text-white/40 text-sm">Monitor and moderate all educational content on the platform</p>
        </div>
        <button 
          onClick={() => router.push('/instructor/courses/new')}
          className="h-10 px-4 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#070b16] text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-cyan-500/10">
          <Plus size={16} />
          Create Platform Course
        </button>
      </motion.div>

      {/* Filters Bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" size={14} />
          <input placeholder="Search courses or instructors..."
            className="w-full h-10 pl-10 pr-4 rounded-xl text-sm text-white placeholder:text-white/20 outline-none transition-all flex items-center gap-2 focus:ring-1 focus:ring-cyan-500/50"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
        </div>
        <button className="h-10 px-4 rounded-xl bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 transition-all flex items-center gap-2">
          <Filter size={14} /> Filters
        </button>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-32 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
          ))}
        </div>
      )}

      {isError && (
        <div className="text-center py-20 rounded-3xl" style={card}>
          <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4 text-red-500/50">
            <AlertCircle size={32} />
          </div>
          <p className="text-white/40 text-sm">Failed to load platform courses. Please check your permissions.</p>
        </div>
      )}

      {!isLoading && !isError && courses.length === 0 && (
        <div className="text-center py-20 rounded-3xl" style={card}>
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4 text-white/10">
            <BookOpen size={32} />
          </div>
          <p className="text-white/40 text-sm mb-6">No courses found on the platform.</p>
          <button 
            onClick={() => router.push('/instructor/courses/new')}
            className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-xs font-bold hover:bg-white/10 transition-all">
            Start Building Catalog
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!isLoading && !isError && courses.map((c, i) => (
          <motion.div key={c.id} initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
            className="p-5 rounded-2xl relative overflow-hidden group hover:border-white/20 transition-all cursor-pointer" 
            style={card}
            onClick={() => router.push(`/courses/${c.id}`)}>
            
            {/* Status gradient */}
            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-5 pointer-events-none ${
              c.status === 'PUBLISHED' ? 'bg-green-500' : 'bg-yellow-500'
            }`} />

            <div className="flex items-start justify-between mb-4 relative">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-white/10 to-transparent border border-white/10 flex items-center justify-center text-white/50">
                  <BookOpen size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-white/90 text-lg group-hover:text-cyan-400 transition-colors truncate max-w-[200px]">{c.title}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs text-white/40">By {c.instructor?.name ?? 'Unknown'}</span>
                    <span className="w-1 h-1 rounded-full bg-white/10" />
                    <span className="text-xs font-mono text-cyan-400/80">KES {(Number(c.price)).toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <button className="p-2 rounded-lg text-white/20 hover:text-white hover:bg-white/5 transition-all">
                <MoreVertical size={16} />
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-4 border-t border-white/5 relative">
              <div className="flex flex-col">
                <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Students</span>
                <span className="text-sm font-semibold text-white/70 flex items-center gap-1.5 mt-0.5">
                  <Users size={12} className="text-cyan-500/60" /> {c._count?.enrollments ?? 0}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Sections</span>
                <span className="text-sm font-semibold text-white/70 flex items-center gap-1.5 mt-0.5">
                  <CheckCircle2 size={12} className="text-green-500/60" /> {c._count?.sections ?? 0}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-white/20 uppercase tracking-widest font-bold">Status</span>
                <span className={`text-xs font-bold mt-1.5 flex items-center gap-1 ${
                  c.status === 'PUBLISHED' ? 'text-green-400' : 'text-yellow-500'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${c.status === 'PUBLISHED' ? 'bg-green-400' : 'bg-yellow-500'} animate-pulse`} />
                  {c.status}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

