'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/auth.store';
import { enrollmentsApi } from '@/lib/api/courses.api';

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 };

interface Enrollment {
  id: string;
  status: string;
  progress: number;
  enrolledAt: string;
  course: { id: string; title: string; tags: string[] };
}

export default function StudentProfilePage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ['enrollments'],
    queryFn: () => enrollmentsApi.mine() as Promise<{ data: Enrollment[] }>,
  });

  const enrollments: Enrollment[] = (data as unknown as { data: Enrollment[] })?.data ?? [];
  const completedCount = enrollments.filter((e) => e.status === 'COMPLETED').length;
  const avgProgress = enrollments.length
    ? Math.round(enrollments.reduce((a, e) => a + e.progress, 0) / enrollments.length)
    : 0;

  return (
    <div className="p-6 h-full overflow-auto text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">Profile</h1>
        <p className="text-white/40 text-sm">Your public learner profile</p>
      </motion.div>

      <div className="max-w-2xl space-y-4">
        {/* Profile card */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="p-6 rounded-2xl flex items-start gap-5" style={card}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold flex-shrink-0"
            style={{ background: 'linear-gradient(135deg,rgba(0,212,255,0.3),rgba(13,110,253,0.3))', border: '1px solid rgba(0,212,255,0.3)', color: '#00d4ff' }}>
            {user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1">
            <h2 className="text-white text-xl font-bold mb-0.5">{user?.name}</h2>
            <p className="text-white/40 text-sm mb-3">{user?.email}</p>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: 'rgba(0,212,255,0.1)', color: '#00d4ff', border: '1px solid rgba(0,212,255,0.2)' }}>
              Student
            </span>
          </div>
          <button onClick={() => router.push('/student/settings')}
            className="h-9 px-4 rounded-xl text-xs font-semibold flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
            Edit profile
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="grid grid-cols-3 gap-4">
          {[
            { label: 'Courses Enrolled', value: enrollments.length, accent: '#00d4ff' },
            { label: 'Courses Completed', value: completedCount, accent: '#10b981' },
            { label: 'Average Progress', value: `${avgProgress}%`, accent: '#f97316' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
              className="p-4 rounded-2xl text-center" style={card}>
              <p className="text-2xl font-extrabold mb-0.5" style={{ color: s.accent }}>{s.value}</p>
              <p className="text-white/40 text-xs">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent courses */}
        {enrollments.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
            className="p-5 rounded-2xl" style={card}>
            <h2 className="text-white font-semibold mb-4">Enrolled Courses</h2>
            <div className="space-y-3">
              {enrollments.slice(0, 5).map((e, i) => (
                <div key={e.id} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: e.status === 'COMPLETED' ? '#10b981' : '#00d4ff' }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-white/75 text-sm font-medium truncate">{e.course.title}</p>
                  </div>
                  <span className="text-xs font-semibold flex-shrink-0" style={{ color: e.status === 'COMPLETED' ? '#10b981' : '#00d4ff' }}>
                    {e.progress}%
                  </span>
                </div>
              ))}
            </div>
            {enrollments.length > 5 && (
              <button onClick={() => router.push('/student/courses')}
                className="mt-4 text-xs font-medium" style={{ color: '#00d4ff' }}>
                View all {enrollments.length} courses →
              </button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
