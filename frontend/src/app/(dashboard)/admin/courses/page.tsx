'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { Book, User, Calendar, CheckCircle, Clock } from 'lucide-react';

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 };

interface Course {
  id: string;
  title: string;
  status: string;
  instructor: { name: string };
  _count: { enrollments: number };
  createdAt: string;
  price: number;
}

export default function AdminCoursesPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-courses'],
    queryFn: () => apiClient.get('/courses/admin/all') as Promise<{ courses: Course[] }>,
  });

  const courses = data?.courses ?? [];

  return (
    <div className="p-6 h-full overflow-auto text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">Global Course Management</h1>
        <p className="text-white/40 text-sm">Monitor and manage all educational content on the platform</p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4">
        {isLoading && <p className="text-white/20">Loading courses...</p>}
        {courses.map((c) => (
          <div key={c.id} className="p-4 rounded-2xl flex items-center justify-between" style={card}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Book size={24} />
              </div>
              <div>
                <h3 className="font-bold text-white/90">{c.title}</h3>
                <p className="text-xs text-white/30">By {c.instructor.name} • {c._count.enrollments} students</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                  c.status === 'PUBLISHED' ? 'bg-green-500/10 text-green-400' : 'bg-yellow-500/10 text-yellow-500'
                }`}>
                  {c.status}
                </span>
                <p className="text-[10px] text-white/20 mt-1">{new Date(c.createdAt).toLocaleDateString()}</p>
              </div>
              <button className="h-8 px-4 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold hover:bg-white/10 transition-all">
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
