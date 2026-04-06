'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 };

const COURSES = [
  {
    id: '1', title: 'Introduction to Machine Learning', instructor: 'Dr. James Omondi',
    lessons: 12, completedLessons: 7, progress: 58, accent: '#00d4ff',
    status: 'In Progress', lastLesson: 'Gradient Descent & Optimization', nextLesson: 'Support Vector Machines',
    tags: ['ML', 'Python'], enrolled: 'Jan 2026',
  },
  {
    id: '2', title: 'Python for Data Science', instructor: 'Prof. Aisha Mwangi',
    lessons: 8, completedLessons: 3, progress: 32, accent: '#f97316',
    status: 'In Progress', lastLesson: 'Pandas DataFrames', nextLesson: 'Data Cleaning & EDA',
    tags: ['Python', 'Pandas'], enrolled: 'Feb 2026',
  },
  {
    id: '3', title: 'SQL for Data Analysis', instructor: 'Brian Otieno',
    lessons: 10, completedLessons: 10, progress: 100, accent: '#10b981',
    status: 'Completed', lastLesson: 'Window Functions', nextLesson: null,
    tags: ['SQL', 'PostgreSQL'], enrolled: 'Nov 2025',
  },
  {
    id: '4', title: 'Data Visualisation with Power BI', instructor: 'Kevin Mwenda',
    lessons: 6, completedLessons: 0, progress: 0, accent: '#a855f7',
    status: 'Not Started', lastLesson: null, nextLesson: 'Introduction to Power BI',
    tags: ['BI', 'Power BI'], enrolled: 'Mar 2026',
  },
];

const FILTERS = ['All', 'In Progress', 'Completed', 'Not Started'];

const STATUS_COLOR: Record<string, string> = {
  'In Progress': '#00d4ff',
  'Completed': '#10b981',
  'Not Started': '#f97316',
};

export default function MyCoursesPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filtered = COURSES.filter((c) => {
    const matchFilter = filter === 'All' || c.status === filter;
    const matchSearch = c.title.toLowerCase().includes(search.toLowerCase()) || c.instructor.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const stats = {
    total: COURSES.length,
    inProgress: COURSES.filter((c) => c.status === 'In Progress').length,
    completed: COURSES.filter((c) => c.status === 'Completed').length,
    avgProgress: Math.round(COURSES.reduce((a, c) => a + c.progress, 0) / COURSES.length),
  };

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
          { label: 'Enrolled', value: stats.total, accent: '#00d4ff' },
          { label: 'In Progress', value: stats.inProgress, accent: '#f97316' },
          { label: 'Completed', value: stats.completed, accent: '#10b981' },
          { label: 'Avg Progress', value: `${stats.avgProgress}%`, accent: '#a855f7' },
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
              {f}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Course list */}
      <div className="space-y-3">
        {filtered.map((course, i) => (
          <motion.div key={course.id}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 + i * 0.06 }}
            className="p-5 rounded-2xl cursor-pointer transition-all"
            style={card}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${course.accent}30`; e.currentTarget.style.background = `${course.accent}06`; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}
            onClick={() => router.push(`/courses/${course.id}`)}>
            <div className="flex items-start gap-4">
              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center text-lg font-extrabold"
                style={{ background: `${course.accent}15`, border: `1px solid ${course.accent}25`, color: course.accent }}>
                {course.title.split(' ').map((w) => w[0]).join('').slice(0, 2)}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h3 className="text-white font-semibold leading-snug">{course.title}</h3>
                  <span className="flex-shrink-0 text-xs font-medium px-2.5 py-1 rounded-full"
                    style={{ background: `${STATUS_COLOR[course.status]}12`, color: STATUS_COLOR[course.status], border: `1px solid ${STATUS_COLOR[course.status]}20` }}>
                    {course.status}
                  </span>
                </div>
                <p className="text-white/35 text-xs mb-3">{course.instructor} · {course.completedLessons}/{course.lessons} lessons · Enrolled {course.enrolled}</p>

                {/* Progress bar */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                    <div className="h-full rounded-full transition-all" style={{ width: `${course.progress}%`, background: course.accent }} />
                  </div>
                  <span className="text-xs font-semibold flex-shrink-0" style={{ color: course.accent }}>{course.progress}%</span>
                </div>

                {/* Next lesson */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {course.tags.map((t) => (
                      <span key={t} className="text-xs px-2 py-0.5 rounded-md text-white/40"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>{t}</span>
                    ))}
                  </div>
                  {course.nextLesson && (
                    <span className="text-xs text-white/30">Next: <span className="text-white/50">{course.nextLesson}</span></span>
                  )}
                  {course.status === 'Completed' && (
                    <button className="text-xs font-semibold px-3 py-1 rounded-lg transition-all"
                      style={{ background: 'rgba(16,185,129,0.12)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }}
                      onClick={(e) => { e.stopPropagation(); router.push('/student/settings'); }}>
                      View certificate
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-white/25">
          <p className="text-4xl mb-3">📚</p>
          <p>No courses match your search.</p>
        </div>
      )}

      {/* Browse more */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
        className="mt-6 p-5 rounded-2xl flex items-center justify-between"
        style={{ background: 'rgba(249,115,22,0.05)', border: '1px solid rgba(249,115,22,0.15)' }}>
        <div>
          <p className="text-white font-semibold">Discover more courses</p>
          <p className="text-white/40 text-sm">24 courses available across SQL, Python, ML, and BI</p>
        </div>
        <button onClick={() => router.push('/courses')}
          className="h-10 px-6 rounded-xl font-semibold text-sm text-white flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 0 20px rgba(249,115,22,0.2)' }}>
          Browse courses →
        </button>
      </motion.div>
    </div>
  );
}
