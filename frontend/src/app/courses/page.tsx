'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { coursesApi } from '@/lib/api/courses.api';
import DatikaLogo from '@/components/ui/DatikaLogo';

const LEVEL_COLOR: Record<string, string> = {
  BEGINNER:     '#10b981',
  INTERMEDIATE: '#00d4ff',
  ADVANCED:     '#f97316',
};

const GRADIENTS = [
  'rgba(0,212,255,0.08), rgba(13,110,253,0.12)',
  'rgba(249,115,22,0.08), rgba(239,68,68,0.12)',
  'rgba(168,85,247,0.08), rgba(99,102,241,0.12)',
  'rgba(16,185,129,0.08), rgba(6,182,212,0.12)',
  'rgba(245,158,11,0.08), rgba(249,115,22,0.12)',
  'rgba(236,72,153,0.08), rgba(168,85,247,0.12)',
];

const BORDER_ACCENTS = ['#00d4ff', '#f97316', '#a855f7', '#10b981', '#f59e0b', '#ec4899'];

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  price: number | string;
  currency: string;
  level: string;
  tags: string[];
  instructor: { name: string; avatarUrl?: string };
  _count: { enrollments: number };
}

export default function CourseCatalogPage() {
  const router = useRouter();
  const [search, setSearch] = useState('');
  const [level, setLevel] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['courses', { search, level, page }],
    queryFn: () => coursesApi.list({ search: search || undefined, level: level || undefined, page, limit: 12 }),
  });

  const courses: Course[] = (data as { data?: { courses?: Course[] } } | undefined)?.data?.courses ?? [];
  const total: number = (data as { data?: { total?: number } } | undefined)?.data?.total ?? 0;
  const totalPages = Math.ceil(total / 12);

  return (
    <div
      className="min-h-screen text-white"
      style={{ fontFamily: 'Inter, system-ui, sans-serif', background: 'linear-gradient(135deg, #070b16 0%, #0d1421 50%, #0f0d1a 100%)' }}
    >
      {/* Grid bg */}
      <div className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,212,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.02) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      />

      {/* ── Nav ── */}
      <header className="sticky top-0 z-50 transition-all"
        style={{ background: 'rgba(7,11,22,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/"><DatikaLogo size={32} showText textColor="white" /></Link>
          <div className="flex items-center gap-3">
            <Link href="/login">
              <button className="text-sm text-white/50 hover:text-white transition-colors">Sign in</button>
            </Link>
            <Link href="/register">
              <button className="text-sm font-semibold px-5 py-2 rounded-full transition-all"
                style={{ border: '1px solid rgba(249,115,22,0.6)', color: '#f97316' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(249,115,22,0.1)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}>
                Get started
              </button>
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <div className="relative py-20 px-8 text-center overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)' }} />
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative">
          <span className="text-orange-400 text-xs font-semibold tracking-widest uppercase mb-4 block">Catalogue</span>
          <h1 className="text-5xl font-extrabold mb-4 leading-tight">
            <span style={{ color: '#00d4ff' }}>Data Science</span> Courses
          </h1>
          <p className="text-white/40 text-lg max-w-lg mx-auto">
            Learn SQL, Python, and advanced analytics with AI-powered content
          </p>
        </motion.div>
      </div>

      {/* ── Filters ── */}
      <div className="max-w-7xl mx-auto px-8 pb-6">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search courses..."
              className="w-full h-11 pl-11 pr-4 rounded-xl text-sm text-white placeholder:text-white/20 outline-none transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
            />
          </div>
          <select value={level} onChange={(e) => { setLevel(e.target.value); setPage(1); }}
            className="h-11 px-4 rounded-xl text-sm text-white/70 outline-none cursor-pointer min-w-[140px]"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <option value="" style={{ background: '#0d1421' }}>All levels</option>
            <option value="BEGINNER" style={{ background: '#0d1421' }}>Beginner</option>
            <option value="INTERMEDIATE" style={{ background: '#0d1421' }}>Intermediate</option>
            <option value="ADVANCED" style={{ background: '#0d1421' }}>Advanced</option>
          </select>
        </div>
        {!isLoading && (
          <p className="text-xs text-white/25 mt-3">{total} {total === 1 ? 'course' : 'courses'} found</p>
        )}
      </div>

      {/* ── Grid ── */}
      <div className="max-w-7xl mx-auto px-8 pb-20">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1,2,3,4,5,6].map((i) => (
              <div key={i} className="rounded-2xl overflow-hidden animate-pulse"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', height: 280 }} />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4 opacity-50">🔍</div>
            <p className="text-white/40 font-medium">No courses found</p>
            <p className="text-white/20 text-sm mt-1">Try a different search or filter</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course, i) => {
              const accent = BORDER_ACCENTS[i % BORDER_ACCENTS.length];
              const grad = GRADIENTS[i % GRADIENTS.length];
              const lvlColor = LEVEL_COLOR[course.level] ?? '#00d4ff';
              const tag = course.title.split(' ').map((w) => w[0]).join('').slice(0,3).toUpperCase();
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.04 }}
                  className="rounded-2xl overflow-hidden cursor-pointer flex flex-col transition-all duration-200"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                  onClick={() => router.push(`/courses/${course.id}`)}
                  onMouseEnter={(e) => { e.currentTarget.style.borderColor = `${accent}35`; e.currentTarget.style.transform = 'translateY(-3px)'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                  {/* Thumbnail */}
                  {course.thumbnail ? (
                    <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
                  ) : (
                    <div className="w-full h-40 relative overflow-hidden flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${grad})`, borderBottom: `1px solid rgba(255,255,255,0.05)` }}>
                      <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full" style={{ background: `radial-gradient(circle, ${accent}20, transparent)` }} />
                      <div className="absolute bottom-3 left-3 w-12 h-12 rounded-full" style={{ background: `${accent}10` }} />
                      <span className="font-black text-4xl" style={{ color: `${accent}30` }}>{tag}</span>
                    </div>
                  )}

                  <div className="p-4 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full"
                        style={{ background: `${lvlColor}15`, color: lvlColor, border: `1px solid ${lvlColor}25` }}>
                        {course.level.charAt(0) + course.level.slice(1).toLowerCase()}
                      </span>
                      {course.tags?.slice(0,2).map((t) => (
                        <span key={t} className="text-xs text-white/30 px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                          {t}
                        </span>
                      ))}
                    </div>

                    <h3 className="font-semibold text-white/80 text-sm leading-snug mb-1 line-clamp-2 flex-grow-0">{course.title}</h3>
                    <p className="text-xs text-white/30 line-clamp-2 mb-3 leading-relaxed flex-1">{course.description}</p>

                    <div className="flex items-center gap-2 text-xs text-white/25 mb-3">
                      <div className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-[9px]"
                        style={{ background: `${accent}20`, color: accent }}>
                        {course.instructor.name[0]}
                      </div>
                      <span>{course.instructor.name}</span>
                      <span>·</span>
                      <span>{course._count.enrollments} students</span>
                    </div>

                    <div className="flex items-center justify-between pt-3"
                      style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                      <div>
                        {Number(course.price) === 0 ? (
                          <span className="text-sm font-bold" style={{ color: '#10b981' }}>Free</span>
                        ) : (
                          <span className="text-sm font-bold text-white/80">
                            {course.currency} {Number(course.price).toLocaleString()}
                          </span>
                        )}
                      </div>
                      <button className="text-xs font-semibold px-4 py-1.5 rounded-lg transition-all"
                        style={{ background: `${accent}15`, border: `1px solid ${accent}30`, color: accent }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = `${accent}25`; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = `${accent}15`; }}>
                        {Number(course.price) === 0 ? 'Enrol free' : 'Enrol now'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-12">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
              className="w-9 h-9 rounded-xl text-sm flex items-center justify-center transition-all text-white/40 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'; e.currentTarget.style.color = '#00d4ff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className="w-9 h-9 rounded-xl text-sm font-medium transition-all"
                style={p === page
                  ? { background: 'rgba(0,212,255,0.15)', border: '1px solid rgba(0,212,255,0.4)', color: '#00d4ff' }
                  : { border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)' }}>
                {p}
              </button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
              className="w-9 h-9 rounded-xl text-sm flex items-center justify-center transition-all text-white/40 disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ border: '1px solid rgba(255,255,255,0.1)' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.3)'; e.currentTarget.style.color = '#00d4ff'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)'; }}>
              →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
