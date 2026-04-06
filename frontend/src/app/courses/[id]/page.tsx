'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { coursesApi } from '@/lib/api/courses.api';
import { apiClient } from '@/lib/api/client';
import { useAuthStore } from '@/lib/store/auth.store';

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 };

const LEVEL_COLOR: Record<string, string> = {
  BEGINNER: '#10b981',
  INTERMEDIATE: '#f97316',
  ADVANCED: '#f87171',
};

interface Lesson {
  id: string;
  title: string;
  type: string;
  duration?: number;
  isPreview: boolean;
  order: number;
}

interface Section {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  level: string;
  price: number;
  currency: string;
  tags: string[];
  thumbnailUrl?: string;
  isEnrolled: boolean;
  instructor: { id: string; name: string; avatarUrl?: string };
  sections: Section[];
  _count: { enrollments: number };
}

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState('');
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['course', id],
    queryFn: () => coursesApi.findOne(id) as Promise<{ data: Course }>,
    enabled: !!id,
  });

  const course: Course | undefined = (data as unknown as { data: Course })?.data;

  const handleEnroll = async () => {
    if (!isAuthenticated) { router.push('/login'); return; }
    setEnrolling(true);
    setEnrollError('');
    try {
      await apiClient.post(`/courses/${id}/enroll`, {});
      await refetch();
      router.push('/student/courses');
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setEnrollError(axiosErr?.response?.data?.message ?? 'Enrollment failed. Please try again.');
    } finally {
      setEnrolling(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  const totalLessons = course?.sections?.reduce((a, s) => a + s.lessons.length, 0) ?? 0;
  const previewLessons = course?.sections?.flatMap((s) => s.lessons.filter((l) => l.isPreview)) ?? [];

  if (isLoading) {
    return (
      <div className="min-h-screen text-white p-8" style={{ background: '#070b16' }}>
        <div className="max-w-5xl mx-auto animate-pulse space-y-6">
          <div className="h-8 rounded-xl w-2/3" style={{ background: 'rgba(255,255,255,0.06)' }} />
          <div className="h-4 rounded-xl w-full" style={{ background: 'rgba(255,255,255,0.04)' }} />
          <div className="h-4 rounded-xl w-4/5" style={{ background: 'rgba(255,255,255,0.04)' }} />
        </div>
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center" style={{ background: '#070b16' }}>
        <div className="text-center">
          <p className="text-white/40 text-lg mb-4">Course not found.</p>
          <button onClick={() => router.back()} className="h-10 px-6 rounded-xl text-sm font-semibold text-white"
            style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}>
            ← Go back
          </button>
        </div>
      </div>
    );
  }

  const isFree = !course.price || course.price === 0;
  const levelColor = LEVEL_COLOR[course.level] ?? '#00d4ff';

  return (
    <div className="min-h-screen text-white" style={{ background: '#070b16', fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Back nav */}
      <div className="sticky top-0 z-10 px-6 py-3 flex items-center gap-3" style={{ background: 'rgba(7,11,22,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(12px)' }}>
        <button onClick={() => router.push('/courses')} className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm">
          <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          All courses
        </button>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8">
        <div className="grid grid-cols-3 gap-8">

          {/* Left: course info */}
          <div className="col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              {/* Level + tags */}
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: `${levelColor}15`, color: levelColor, border: `1px solid ${levelColor}25` }}>
                  {course.level.charAt(0) + course.level.slice(1).toLowerCase()}
                </span>
                {course.tags?.map((t) => (
                  <span key={t} className="text-xs px-2 py-0.5 rounded-md text-white/40"
                    style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>{t}</span>
                ))}
              </div>

              <h1 className="text-3xl font-extrabold text-white leading-tight mb-3">{course.title}</h1>
              <p className="text-white/55 text-base leading-relaxed mb-4">{course.description}</p>

              {/* Instructor */}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center text-sm font-bold"
                  style={{ background: 'rgba(0,212,255,0.15)', color: '#00d4ff' }}>
                  {course.instructor.name[0]}
                </div>
                <div>
                  <p className="text-white/80 text-sm font-medium">{course.instructor.name}</p>
                  <p className="text-white/35 text-xs">Instructor</p>
                </div>
                <div className="ml-auto flex items-center gap-4 text-xs text-white/35">
                  <span>{course._count.enrollments.toLocaleString()} students</span>
                  <span>{totalLessons} lessons</span>
                </div>
              </div>
            </motion.div>

            {/* Curriculum */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="p-5 rounded-2xl" style={card}>
              <h2 className="text-white font-semibold mb-4">Curriculum</h2>
              <div className="space-y-2">
                {course.sections.map((section) => {
                  const expanded = expandedSections.has(section.id);
                  return (
                    <div key={section.id}>
                      <button onClick={() => toggleSection(section.id)}
                        className="w-full flex items-center justify-between p-3 rounded-xl transition-all"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                        onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                        onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.03)'; }}>
                        <div className="flex items-center gap-2">
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                            style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.15s', color: 'rgba(255,255,255,0.4)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                          </svg>
                          <span className="text-white/80 text-sm font-medium">{section.title}</span>
                        </div>
                        <span className="text-white/30 text-xs">{section.lessons.length} lessons</span>
                      </button>
                      {expanded && (
                        <div className="ml-6 mt-1 space-y-1">
                          {section.lessons.map((lesson) => (
                            <div key={lesson.id} className="flex items-center gap-3 px-3 py-2 rounded-lg"
                              style={{ background: 'rgba(255,255,255,0.02)' }}>
                              <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}
                                style={{ color: lesson.isPreview ? '#00d4ff' : 'rgba(255,255,255,0.25)', flexShrink: 0 }}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z" />
                              </svg>
                              <span className="text-white/60 text-xs flex-1">{lesson.title}</span>
                              {lesson.isPreview && (
                                <span className="text-xs px-1.5 py-0.5 rounded" style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff' }}>Preview</span>
                              )}
                              {lesson.duration && (
                                <span className="text-white/25 text-xs">{Math.round(lesson.duration / 60)}m</span>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>

          {/* Right: enroll card */}
          <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 }}
            className="col-span-1">
            <div className="sticky top-20 p-5 rounded-2xl space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              {/* Price */}
              <div>
                {isFree ? (
                  <p className="text-3xl font-extrabold" style={{ color: '#10b981' }}>Free</p>
                ) : (
                  <p className="text-3xl font-extrabold text-white">
                    {course.currency ?? 'KES'} {course.price?.toLocaleString()}
                    <span className="text-sm font-normal text-white/40">/course</span>
                  </p>
                )}
              </div>

              {/* CTA */}
              {course.isEnrolled ? (
                <button onClick={() => router.push('/student/courses')}
                  className="w-full h-11 rounded-xl font-semibold text-sm text-white"
                  style={{ background: 'linear-gradient(135deg,#10b981,#059669)' }}>
                  Continue learning →
                </button>
              ) : (
                <button onClick={handleEnroll} disabled={enrolling}
                  className="w-full h-11 rounded-xl font-semibold text-sm text-white disabled:opacity-60"
                  style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 0 24px rgba(249,115,22,0.25)' }}>
                  {enrolling ? 'Enrolling...' : isFree ? 'Enroll for free' : 'Enroll now'}
                </button>
              )}

              {enrollError && <p className="text-red-400 text-xs text-center">{enrollError}</p>}

              {/* What you get */}
              <div className="pt-3 space-y-2" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                {[
                  `${totalLessons} lessons across ${course.sections.length} sections`,
                  `${previewLessons.length} free preview lessons`,
                  'Certificate upon completion',
                  'AI Tutor access',
                  'Lifetime access',
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2">
                    <span className="text-xs mt-0.5" style={{ color: '#10b981' }}>✓</span>
                    <span className="text-white/50 text-xs">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
