'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { coursesApi } from '@/lib/api/courses.api';
import { useAuthStore } from '@/lib/store/auth.store';

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 };

const STATUS_COLOR: Record<string, string> = {
  PUBLISHED: '#10b981',
  DRAFT: '#f97316',
  ARCHIVED: '#6b7280',
};

interface CourseItem {
  id: string;
  title: string;
  status: string;
  level: string;
  price: number;
  currency: string;
  tags: string[];
  createdAt: string;
  _count: { enrollments: number; sections: number };
  sections: { _count: { lessons: number } }[];
}

export default function InstructorCoursesPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['instructor-courses', user?.id],
    queryFn: () => coursesApi.myCourses() as Promise<{ data: CourseItem[] }>,
    enabled: !!user,
  });

  const courses: CourseItem[] = (data as unknown as { data: CourseItem[] })?.data ?? [];

  const filtered = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase())
  );

  const totalStudents = courses.reduce((a, c) => a + (c._count?.enrollments ?? 0), 0);

  return (
    <div className="p-6 h-full overflow-auto text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white mb-1">My Courses</h1>
          <p className="text-white/40 text-sm">Manage your published and draft courses</p>
        </div>
        <button
          className="h-9 px-5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 0 16px rgba(249,115,22,0.2)' }}
          onClick={() => router.push('/instructor')}>
          + New Course
        </button>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'Total Courses', value: isLoading ? '—' : courses.length, accent: '#00d4ff' },
          { label: 'Published', value: isLoading ? '—' : courses.filter((c) => c.status === 'PUBLISHED').length, accent: '#10b981' },
          { label: 'Total Students', value: isLoading ? '—' : totalStudents, accent: '#f97316' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.05 }}
            className="p-4 rounded-2xl" style={card}>
            <p className="text-2xl font-extrabold mb-0.5" style={{ color: s.accent }}>{s.value}</p>
            <p className="text-white/40 text-xs">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Search */}
      <div className="relative max-w-xs mb-5">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
        </svg>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search courses..."
          className="w-full h-9 pl-9 pr-3 rounded-xl text-sm text-white placeholder:text-white/25 outline-none"
          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
      </div>

      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 rounded-2xl animate-pulse" style={card}>
              <div className="h-4 rounded w-1/2 mb-2" style={{ background: 'rgba(255,255,255,0.06)' }} />
              <div className="h-3 rounded w-1/4" style={{ background: 'rgba(255,255,255,0.04)' }} />
            </div>
          ))}
        </div>
      )}

      {isError && (
        <div className="p-5 rounded-2xl text-center" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <p className="text-red-400 text-sm">Failed to load courses.</p>
        </div>
      )}

      {!isLoading && !isError && (
        <div className="space-y-3">
          {filtered.map((course, i) => {
            const statusColor = STATUS_COLOR[course.status] ?? '#6b7280';
            const totalLessons = course.sections?.reduce((a, s) => a + (s._count?.lessons ?? 0), 0) ?? 0;
            return (
              <motion.div key={course.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
                className="p-5 rounded-2xl cursor-pointer transition-all" style={card}
                onClick={() => router.push(`/courses/${course.id}`)}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-white font-semibold leading-snug">{course.title}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0"
                        style={{ background: `${statusColor}12`, color: statusColor, border: `1px solid ${statusColor}20` }}>
                        {course.status.charAt(0) + course.status.slice(1).toLowerCase()}
                      </span>
                    </div>
                    <p className="text-white/35 text-xs">
                      {course._count.sections} sections · {totalLessons} lessons · {course._count.enrollments} students
                    </p>
                    <div className="flex gap-1.5 mt-2 flex-wrap">
                      {course.tags?.map((t) => (
                        <span key={t} className="text-xs px-2 py-0.5 rounded-md text-white/35"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>{t}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-white font-semibold text-sm">
                      {!course.price || course.price === 0 ? 'Free' : `${course.currency ?? 'KES'} ${course.price.toLocaleString()}`}
                    </p>
                    <p className="text-white/30 text-xs mt-1">{course.level.charAt(0) + course.level.slice(1).toLowerCase()}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}

          {filtered.length === 0 && (
            <div className="text-center py-16 text-white/25">
              <p className="text-3xl mb-3">📖</p>
              <p>{courses.length === 0 ? "You haven't created any courses yet." : 'No courses match your search.'}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
