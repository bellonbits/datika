'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/store/auth.store';
import { coursesApi } from '@/lib/api/courses.api';

const card = { background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20 };

interface CourseItem {
  id: string;
  title: string;
  status: string;
  _count: { enrollments: number };
}

export default function InstructorProfilePage() {
  const user = useAuthStore((s) => s.user);
  const router = useRouter();

  const { data } = useQuery({
    queryKey: ['instructor-courses', user?.id],
    queryFn: () => coursesApi.myCourses() as Promise<{ data: CourseItem[] }>,
    enabled: !!user,
  });

  const courses: CourseItem[] = (data as unknown as { data: CourseItem[] })?.data ?? [];
  const totalStudents = courses.reduce((a, c) => a + (c._count?.enrollments ?? 0), 0);
  const published = courses.filter((c) => c.status === 'PUBLISHED').length;

  return (
    <div className="p-6 h-full overflow-auto text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
        <h1 className="text-2xl font-extrabold text-white mb-1">Profile</h1>
        <p className="text-white/40 text-sm">Your instructor profile</p>
      </motion.div>

      <div className="max-w-2xl space-y-4">
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="p-6 rounded-2xl flex items-start gap-5" style={card}>
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-extrabold flex-shrink-0"
            style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)', color: '#f97316' }}>
            {user?.name?.[0]?.toUpperCase() ?? 'I'}
          </div>
          <div className="flex-1">
            <h2 className="text-white text-xl font-bold mb-0.5">{user?.name}</h2>
            <p className="text-white/40 text-sm mb-3">{user?.email}</p>
            <span className="text-xs px-2.5 py-1 rounded-full font-medium"
              style={{ background: 'rgba(249,115,22,0.1)', color: '#f97316', border: '1px solid rgba(249,115,22,0.2)' }}>
              Instructor
            </span>
          </div>
          <button onClick={() => router.push('/instructor/settings')}
            className="h-9 px-4 rounded-xl text-xs font-semibold flex-shrink-0"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>
            Edit profile
          </button>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}
          className="grid grid-cols-3 gap-4">
          {[
            { label: 'Courses Created', value: courses.length, accent: '#f97316' },
            { label: 'Published', value: published, accent: '#10b981' },
            { label: 'Total Students', value: totalStudents, accent: '#00d4ff' },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
              className="p-4 rounded-2xl text-center" style={card}>
              <p className="text-2xl font-extrabold mb-0.5" style={{ color: s.accent }}>{s.value}</p>
              <p className="text-white/40 text-xs">{s.label}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
