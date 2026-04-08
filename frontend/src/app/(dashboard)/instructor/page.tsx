'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store/auth.store';
import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api/client';
import { 
  Users, 
  BookOpen, 
  CreditCard, 
  TrendingUp,
  Plus,
  Bot,
  Database,
  Terminal,
  BarChart3
} from 'lucide-react';

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 };

interface Course {
  id: string;
  title: string;
  status: string;
  _count: { enrollments: number; sections: number };
}

interface Enrollment {
  id: string;
  name: string;
  email: string;
  courseTitle: string;
  enrolledAt: string;
}

export default function InstructorDashboard() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  // 1. Fetch Instructor Courses
  const { data: coursesData, isLoading: coursesLoading } = useQuery({
    queryKey: ['instructor-courses-dashboard'],
    queryFn: () => apiClient.get('/courses/my-courses') as Promise<{ data: Course[] }>,
  });

  // 2. Fetch Recent Students/Enrollments
  const { data: studentsData, isLoading: studentsLoading } = useQuery({
    queryKey: ['instructor-students-dashboard'],
    queryFn: () => apiClient.get('/courses/instructor/students') as Promise<{ data: Enrollment[] }>,
  });

  const courses: Course[] = (coursesData as any)?.data ?? [];
  const enrollments: Enrollment[] = (studentsData as any)?.data ?? [];

  // Derive stats
  const totalStudents = enrollments.length;
  const activeCourses = courses.filter(c => c.status === 'PUBLISHED').length;
  const draftCourses = courses.length - activeCourses;

  const statsList = [
    { label: 'Total students', value: totalStudents, delta: 'All time', accent: '#00d4ff', icon: <Users size={16} /> },
    { label: 'Active courses', value: activeCourses, delta: `${draftCourses} in draft`, accent: '#a855f7', icon: <BookOpen size={16} /> },
    { label: 'Platform Status', value: 'Active', delta: 'System online', accent: '#10b981', icon: <TrendingUp size={16} /> },
    { label: 'Resources', value: courses.reduce((acc, c) => acc + (c._count?.sections ?? 0), 0), delta: 'Total sections', accent: '#f97316', icon: <Database size={16} /> },
  ];

  return (
    <div className="p-6 space-y-5 text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-extrabold text-white">Good day, {user?.name?.split(' ')[0]}</h1>
        <p className="text-white/35 text-sm mt-0.5">Here's what's happening with your courses</p>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsList.map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className="p-5 rounded-2xl" style={card}>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `${s.accent}15`, color: s.accent }}>
                {s.icon}
              </div>
            </div>
            <div className="text-2xl font-extrabold text-white">{s.value}</div>
            <div className="text-xs text-white/35 mt-0.5">{s.label}</div>
            <div className="text-xs mt-2 font-medium" style={{ color: s.accent }}>{s.delta}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Courses */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="lg:col-span-2 overflow-hidden rounded-2xl" style={card}>
          <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <h2 className="font-semibold text-white/80">My courses</h2>
            <button onClick={() => router.push('/instructor/courses')} className="text-xs hover:text-white/60 transition-colors" style={{ color: '#00d4ff' }}>Manage all →</button>
          </div>
          <div>
            {coursesLoading && <p className="p-5 text-white/20">Loading courses...</p>}
            {!coursesLoading && courses.length === 0 && <p className="p-5 text-white/20">No courses yet.</p>}
            {courses.map((c, i) => (
              <div key={c.id} className="flex items-center gap-4 px-5 py-3.5 transition-all cursor-pointer"
                onClick={() => router.push(`/instructor/courses/${c.id}`)}
                style={{ borderBottom: i < courses.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center" 
                  style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
                  <BookOpen size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/75 truncate">{c.title}</p>
                  <p className="text-xs text-white/30">{c._count?.enrollments ?? 0} students</p>
                </div>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full flex-shrink-0"
                  style={c.status === 'PUBLISHED'
                    ? { background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }
                    : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  {c.status === 'PUBLISHED' ? 'Live' : 'Draft'}
                </span>
              </div>
            ))}
          </div>
          <div className="px-5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
            <button onClick={() => router.push('/instructor/courses/new')}
              className="w-full h-9 rounded-xl text-xs font-medium transition-all text-white/25 hover:text-white/50"
              style={{ border: '1px dashed rgba(255,255,255,0.1)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'; e.currentTarget.style.color = '#00d4ff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.25)'; }}>
              + Create new course
            </button>
          </div>
        </motion.div>

        {/* Enrollments + AI CTA */}
        <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
          className="flex flex-col gap-4">
          <div className="rounded-2xl overflow-hidden flex-1" style={card}>
            <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
              <h2 className="font-semibold text-white/80">New enrollments</h2>
              <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center" style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff' }}>{enrollments.length}</span>
            </div>
            {studentsLoading && <p className="p-5 text-white/20">Loading enrollments...</p>}
            {enrollments.slice(0, 5).map((e, i) => (
              <div key={e.id + e.courseTitle} className="flex items-center gap-3 px-5 py-3.5" style={{ borderBottom: i < enrollments.slice(0, 5).length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                  style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: '#00d4ff' }}>
                  {e.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white/70 truncate">{e.name}</p>
                  <p className="text-xs text-white/30 truncate">{e.courseTitle}</p>
                </div>
                <span className="text-xs text-white/25">Recently</span>
              </div>
            ))}
          </div>

          {/* AI CTA */}
          <div className="p-4 rounded-2xl relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, rgba(0,212,255,0.08), rgba(13,110,253,0.12))', border: '1px solid rgba(0,212,255,0.2)' }}>
            <div className="absolute -top-3 -right-3 w-16 h-16 rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)' }} />
            <p className="text-sm font-bold text-white mb-1 relative">AI Content Studio</p>
            <p className="text-xs text-white/35 mb-3 relative">Generate lessons, quizzes, and assignments with AI.</p>
            <button onClick={() => router.push('/instructor/ai-tools')}
              className="w-full h-8 text-xs font-semibold rounded-xl transition-all relative"
              style={{ background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(0,212,255,0.25)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(0,212,255,0.15)'; }}>
              Open AI Studio →
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
