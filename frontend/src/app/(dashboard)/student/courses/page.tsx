'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { enrollmentsApi } from '@/lib/api/courses.api';

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 };

const FILTERS = ['All', 'ACTIVE', 'COMPLETED'];
const FILTER_LABELS: Record<string, string> = { All: 'All', ACTIVE: 'In Progress', COMPLETED: 'Completed' };

const STATUS_COLOR: Record<string, string> = {
  ACTIVE: '#00d4ff',
  COMPLETED: '#10b981',
  ENROLLED: '#f97316',
};

const ACCENT_PALETTE = ['#00d4ff', '#f97316', '#10b981', '#a855f7', '#f59e0b', '#ec4899'];

function getAccent(index: number) {
  return ACCENT_PALETTE[index % ACCENT_PALETTE.length];
}

interface LessonProgress { completed: boolean }
interface Enrollment {
  id: string;
  status: string;
  progress: number;
  enrolledAt: string;
  course: {
    id: string;
    title: string;
    tags: string[];
    instructor: { name: string };
    sections: { lessons: { id: string }[] }[];
    _count: { sections: number };
  };
  lessonProgress: LessonProgress[];
}

export default function MyCoursesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const { data, isLoading, isError } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => enrollmentsApi.mine() as Promise<{ data: Enrollment[] }>,
  });

  const enrollments: Enrollment[] = (data as unknown as { data: Enrollment[] })?.data ?? [];

  const filtered = enrollments.filter((e) => {
    const matchFilter = filter === 'All' || e.status === filter;
    const matchSearch =
      e.course.title.toLowerCase().includes(search.toLowerCase()) ||
      e.course.instructor.name.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = {
    total: enrollments.length,
    inProgress: enrollments.filter((e) => e.status === 'ACTIVE').length,
    completed: enrollments.filter((e) => e.status === 'COMPLETED').length,
    avgProgress: enrollments.length
      ? Math.round(enrollments.reduce((a, e) => a + e.progress, 0) / enrollments.length)
      : 0,
  };

  const totalLessons = (e: Enrollment) =>
    e.course.sections?.reduce((a, s) => a + (s.lessons?.length ?? 0), 0) ?? 0;

  const completedLessons = (e: Enrollment) =>
    e.lessonProgress.filter((lp) => lp.completed).length;

  return (
    <div className="p-6 h-full overflow-auto text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">My Courses</h1>
        <p className="text-white/40 text-sm">Track your enrolled courses and continue learning</p>
      </motion.div>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
        className="grid grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Enrolled', value: isLoading ? '—' : stats.total, accent: '#00d4ff' },
          { label: 'In Progress', value: isLoading ? '—' : stats.inProgress, accent: '#f97316' },
          { label: 'Completed', value: isLoading ? '—' : stats.completed, accent: '#10b981' },
          { label: 'Avg Progress', value: isLoading ? '—' : `${stats.avgProgress}%`, accent: '#a855f7' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 + i * 0.05 }}
            className="p-4 rounded-2xl" style={card}>
            <p className="text-2xl font-extrabold mb-0.5" style={{ color: s.accent }}>{s.value}</p>
            <p className="text-white/40 text-xs">{s.label}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Search + Filter */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        className="flex items-center gap-3 mb-5">
        <div className="relative flex-1 max-w-xs">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="8" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input value={search} onChange={(e) => setSearch(e.target.value)}
            placeholder="Search courses..."
            className="w-full h-9 pl-9 pr-3 rounded-xl text-sm text-white placeholder:text-white/25 outline-none"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }} />
        </div>
        <div className="flex items-center gap-1.5">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className="h-9 px-4 rounded-xl text-xs font-medium transition-all"
              style={filter === f
                ? { background: 'rgba(0,212,255,0.15)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.3)' }
                : { background: 'rgba(255,255,255,0.04)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.07)' }}>
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Loading */}
      {isLoading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-5 rounded-2xl animate-pulse" style={card}>
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-xl flex-shrink-0" style={{ background: 'rgba(255,255,255,0.06)' }} />
                <div className="flex-1 space-y-2">
                  <div className="h-4 rounded-lg w-2/3" style={{ background: 'rgba(255,255,255,0.06)' }} />
                  <div className="h-3 rounded-lg w-1/3" style={{ background: 'rgba(255,255,255,0.04)' }} />
                  <div className="h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="p-5 rounded-2xl text-center" style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.15)' }}>
          <p className="text-red-400 text-sm">Failed to load your courses. Please try again.</p>
        </div>
      )}

      {/* Course list */}
      {!isLoading && !isError && (
        <div className="space-y-3">
          {filtered.map((enrollment, i) => {
            const accent = getAccent(i);
            const total = totalLessons(enrollment);
            const completed = completedLessons(enrollment);
            const statusLabel = enrollment.status === 'ACTIVE' ? 'In Progress' : enrollment.status === 'COMPLETED' ? 'Completed' : 'Enrolled';
            const statusColor = STATUS_COLOR[enrollment.status] ?? '#f97316';
            const enrolled = new Date(enrollment.enrolledAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

            return (
              <motion.div key={enrollment.id}
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.06 }}
                className="p-5 rounded-2xl cursor-pointer transition-all"
                style={card}
                onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${accent}30`; e.currentTarget.style.background = `${accent}06`; }}
                onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
                onClick={() => router.push(`/courses/${enrollment.course.id}`)}>
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-lg font-extrabold"
                    style={{ background: `${accent}15`, border: `1px solid ${accent}25`, color: accent }}>
                    {enrollment.course.title.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="text-white font-semibold leading-snug">{enrollment.course.title}</h3>
                      <span className="flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full"
                        style={{ background: `${statusColor}12`, color: statusColor, border: `1px solid ${statusColor}20` }}>
                        {statusLabel}
                      </span>
                    </div>
                    <p className="text-white/35 text-xs mb-3">
                      {enrollment.course.instructor.name} · {completed}/{total} lessons · Enrolled {enrolled}
                    </p>

                    {/* Progress bar */}
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${enrollment.progress}%`, background: accent }} />
                      </div>
                      <span className="text-xs font-semibold flex-shrink-0" style={{ color: accent }}>{enrollment.progress}%</span>
                    </div>

                    {/* Tags + action */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 flex-wrap">
                        {enrollment.course.tags?.map((t) => (
                          <span key={t} className="text-xs px-2 py-0.5 rounded-md text-white/40"
                            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>{t}</span>
                        ))}
                      </div>
                      {enrollment.status === 'COMPLETED' && (
                        <button className="text-xs font-semibold px-3 py-1 rounded-lg transition-all"
                          style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}
                          onClick={(e) => { e.stopPropagation(); }}>
                          View certificate
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {!isLoading && !isError && filtered.length === 0 && enrollments.length > 0 && (
        <div className="text-center py-20 text-white/25">
          <p className="text-4xl mb-3">🔍</p>
          <p>No courses match your filter.</p>
        </div>
      )}

      {!isLoading && !isError && enrollments.length === 0 && (
        <div className="text-center py-20 text-white/25">
          <p className="text-4xl mb-3">📚</p>
          <p className="mb-4">You haven't enrolled in any courses yet.</p>
          <button onClick={() => router.push('/courses')}
            className="h-10 px-6 rounded-xl font-semibold text-sm text-white"
            style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)' }}>
            Browse courses →
          </button>
        </div>
      )}

      {/* Browse more */}
      {!isLoading && enrollments.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-6 p-5 rounded-2xl flex items-center justify-between"
          style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.15)' }}>
          <div>
            <p className="text-white font-semibold">Discover more courses</p>
            <p className="text-white/40 text-sm">Browse all available courses across SQL, Python, ML, and BI</p>
          </div>
          <button onClick={() => router.push('/courses')}
            className="h-10 px-6 rounded-xl font-semibold text-sm text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 0 20px rgba(249,115,22,0.2)' }}>
            Browse courses →
          </button>
        </motion.div>
      )}
    </div>
  );
}
