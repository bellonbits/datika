'use client';

import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { enrollmentsApi } from '@/lib/api/courses.api';

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 };

const ACCENT_PALETTE = ['#00d4ff', '#f97316', '#10b981', '#a855f7', '#f59e0b', '#ec4899'];

interface LessonProgress { completed: boolean }
interface Enrollment {
  id: string;
  status: string;
  progress: number;
  enrolledAt: string;
  completedAt?: string;
  course: {
    id: string;
    title: string;
    instructor: { name: string };
    sections: { lessons: { id: string }[] }[];
  };
  lessonProgress: LessonProgress[];
}

export default function ProgressPage() {
  const { data, isLoading } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => enrollmentsApi.mine() as Promise<{ data: Enrollment[] }>,
  });

  const enrollments: Enrollment[] = (data as unknown as { data: Enrollment[] })?.data ?? [];

  const totalLessons = (e: Enrollment) =>
    e.course.sections?.reduce((a, s) => a + (s.lessons?.length ?? 0), 0) ?? 0;

  const completedLessons = (e: Enrollment) =>
    e.lessonProgress.filter((lp) => lp.completed).length;

  const overallProgress = enrollments.length
    ? Math.round(enrollments.reduce((a, e) => a + e.progress, 0) / enrollments.length)
    : 0;

  const completedCount = enrollments.filter((e) => e.status === 'COMPLETED').length;

  return (
    <div className="p-6 h-full overflow-auto text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">My Progress</h1>
        <p className="text-white/40 text-sm">Track your learning activity and course completion</p>
      </motion.div>

      {/* Top stats */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Overall Progress', value: isLoading ? '—' : `${overallProgress}%`, accent: '#00d4ff' },
          { label: 'Courses Enrolled', value: isLoading ? '—' : enrollments.length, accent: '#f97316' },
          { label: 'Courses Completed', value: isLoading ? '—' : completedCount, accent: '#a855f7' },
          { label: 'Certificates Earned', value: isLoading ? '—' : completedCount, accent: '#10b981' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.05 }}
            className="p-4 rounded-2xl" style={card}>
            <p className="text-2xl font-extrabold mb-0.5" style={{ color: s.accent }}>{s.value}</p>
            <p className="text-white/40 text-xs">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Course-by-course breakdown */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="p-5 rounded-2xl mb-4" style={card}>
        <h2 className="text-white font-semibold mb-5">Course Breakdown</h2>

        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2 animate-pulse">
                <div className="flex justify-between">
                  <div className="h-3 rounded w-1/2" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <div className="h-3 rounded w-12" style={{ background: 'rgba(255,255,255,0.04)' }} />
                </div>
                <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
              </div>
            ))}
          </div>
        )}

        {!isLoading && enrollments.length === 0 && (
          <p className="text-white/30 text-sm text-center py-8">No enrolled courses yet.</p>
        )}

        {!isLoading && enrollments.length > 0 && (
          <div className="space-y-4">
            {enrollments.map((e, i) => {
              const accent = ACCENT_PALETTE[i % ACCENT_PALETTE.length];
              const total = totalLessons(e);
              const done = completedLessons(e);
              return (
                <div key={e.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-white/75 text-sm font-medium">{e.course.title}</p>
                    <div className="flex items-center gap-4">
                      <span className="text-xs text-white/35">{e.course.instructor.name}</span>
                      <span className="text-xs text-white/40">{done}/{total} lessons</span>
                      <span className="text-sm font-bold w-10 text-right" style={{ color: accent }}>{e.progress}%</span>
                    </div>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                    <motion.div className="h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${e.progress}%` }}
                      transition={{ delay: 0.3 + i * 0.08, duration: 0.6, ease: 'easeOut' }}
                      style={{ background: accent }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Enrollment timeline */}
      {!isLoading && enrollments.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="p-5 rounded-2xl" style={card}>
          <h2 className="text-white font-semibold mb-4">Enrollment History</h2>
          <div className="space-y-3">
            {enrollments.map((e, i) => {
              const accent = ACCENT_PALETTE[i % ACCENT_PALETTE.length];
              const enrolledDate = new Date(e.enrolledAt).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' });
              const statusLabel = e.status === 'COMPLETED' ? 'Completed' : 'In Progress';
              return (
                <div key={e.id} className="flex items-start gap-2.5">
                  <div className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: accent }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white/70 text-xs font-medium leading-tight truncate">{e.course.title}</p>
                    <p className="text-white/35 text-xs mt-0.5">{statusLabel} · {e.progress}% complete</p>
                  </div>
                  <span className="text-white/20 text-xs flex-shrink-0">{enrolledDate}</span>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}
    </div>
  );
}
