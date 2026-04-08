'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  BarChart3, 
  Users, 
  BookOpen, 
  Settings, 
  ChevronLeft, 
  ExternalLink,
  Eye,
  MoreVertical,
  PlayCircle,
  Clock,
  Briefcase,
  AlertCircle,
  CheckCircle2,
  Share2,
  TrendingUp,
  FileText
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';

const glassStyle = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 24,
};

export default function CourseManagementPage() {
  const router = useRouter();
  const { id } = useParams();
  const [course, setCourse] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const _res = await apiClient.get(`/courses/${id}`) as any;
      const data = _res?.data ?? _res;
      setCourse(data);
    } catch (err: any) {
      setError('Failed to load course details.');
    } finally {
      setIsLoading(false);
    }
  };

  const publishCourse = async () => {
    try {
      await apiClient.patch(`/courses/${id}`, { status: 'PUBLISHED' });
      fetchCourse();
    } catch (err: any) {
      alert('Failed to publish course.');
    }
  };

  if (isLoading) return (
     <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
           <span className="text-white/20 text-xs font-black uppercase tracking-widest">Warping to Dashboard...</span>
        </div>
     </div>
  );

  if (error || !course) return (
    <div className="h-full flex items-center justify-center text-red-400 gap-2">
      <AlertCircle size={20} />
      <span>{error || 'Course not found'}</span>
    </div>
  );

  return (
    <div className="p-6 h-full overflow-auto text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-wrap items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-5">
           <button 
             onClick={() => router.push('/instructor/courses')}
             className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all"
           >
             <ChevronLeft size={20} />
           </button>
           <div>
              <div className="flex items-center gap-3 mb-1">
                 <h1 className="text-2xl font-black">{course.title}</h1>
                 <div className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                    course.status === 'PUBLISHED' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                 }`}>
                    {course.status}
                 </div>
              </div>
              <p className="text-white/30 text-xs font-semibold flex items-center gap-2">
                <Briefcase size={12} /> {course.category} • <Clock size={12} /> {course.duration}
              </p>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <button className="h-10 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-bold transition-all flex items-center gap-2">
              <Share2 size={14} /> Share
           </button>
           <button 
             onClick={() => window.open(`/courses/${course.id}`, '_blank')}
             className="h-10 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-bold transition-all flex items-center gap-2"
           >
              <Eye size={14} /> Preview
           </button>
           {course.status !== 'PUBLISHED' ? (
              <button 
                onClick={publishCourse}
                className="h-10 px-6 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#070b16] text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-cyan-500/20 flex items-center gap-2"
              >
                Go Live
              </button>
           ) : (
             <button className="h-10 px-6 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2">
                <CheckCircle2 size={16} /> Online
             </button>
           )}
        </div>
      </motion.div>

      {/* Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Stats */}
        <div className="lg:col-span-3 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Total Learners', value: course._count?.enrollments || 0, icon: Users, color: 'text-blue-400', bg: 'bg-blue-400/10' },
                { label: 'Active Progress', value: '42%', icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
                { label: 'Total Revenue', value: `KES ${course.price * (course._count?.enrollments || 0)}`, icon: BarChart3, color: 'text-orange-400', bg: 'bg-orange-400/10' },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  className="p-6" style={glassStyle}
                >
                   <div className="flex items-center justify-between mb-4">
                      <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color} flex items-center justify-center`}>
                        <stat.icon size={20} />
                      </div>
                      <div className="text-[10px] text-white/20 font-black uppercase tracking-tighter">Lifetime</div>
                   </div>
                   <h3 className="text-2xl font-black mb-1">{stat.value}</h3>
                   <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest">{stat.label}</p>
                </motion.div>
              ))}
           </div>

           {/* Quick Actions / Modules */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
                onClick={() => router.push(`/instructor/courses/${id}/curriculum`)}
                className="p-8 cursor-pointer hover:border-cyan-500/30 transition-all active:scale-[0.98] group"
                style={glassStyle}
              >
                  <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-6 group-hover:bg-cyan-500 group-hover:text-[#070b16] transition-all">
                    <BookOpen size={24} />
                  </div>
                  <h3 className="text-xl font-black mb-2">Curriculum Manager</h3>
                  <p className="text-white/30 text-xs font-medium leading-relaxed mb-6">Manifest your syllabus into reality. Manage sections, lessons, and content types with our visual editor.</p>
                  <div className="flex items-center gap-2 text-cyan-400 text-[10px] font-black uppercase tracking-widest">
                     Edit Curriculum <ExternalLink size={12} />
                  </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
                onClick={() => router.push(`/instructor/courses/${id}/settings`)}
                className="p-8 cursor-pointer hover:border-purple-500/30 transition-all active:scale-[0.98] group"
                style={glassStyle}
              >
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mb-6 group-hover:bg-purple-500 group-hover:text-[#070b16] transition-all">
                    <Settings size={24} />
                  </div>
                  <h3 className="text-xl font-black mb-2">Course Settings</h3>
                  <p className="text-white/30 text-xs font-medium leading-relaxed mb-6">Refine the course metadata. Adjust pricing, branding, level, and categorization to reach the right audience.</p>
                  <div className="flex items-center gap-2 text-purple-400 text-[10px] font-black uppercase tracking-widest">
                     Manage Settings <ExternalLink size={12} />
                  </div>
              </motion.div>
           </div>
        </div>

        {/* Sidebar: Recent Activity / Information */}
        <div className="lg:col-span-1 space-y-6">
           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="p-6" style={glassStyle}>
              <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-6">At a Glance</h4>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 font-medium">Sections</span>
                    <span className="text-xs font-bold">{course.sections?.length || 0}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 font-medium">Total Lessons</span>
                    <span className="text-xs font-bold">
                       {course.sections?.reduce((acc: number, s: any) => acc + (s.lessons?.length || 0), 0) || 0}
                    </span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 font-medium">Pricing</span>
                    <span className="text-xs font-bold text-orange-400">KES {course.price}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs text-white/40 font-medium">Level</span>
                    <span className="text-xs font-bold text-purple-400">{course.level}</span>
                 </div>
              </div>
           </motion.div>

           <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="p-6" style={glassStyle}>
              <h4 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-6 flex items-center justify-between">
                Recent Submissions <FileText size={12} />
              </h4>
              <div className="space-y-4">
                 <div className="text-center py-8">
                    <PlayCircle size={32} className="text-white/5 mx-auto mb-3" />
                    <p className="text-[10px] text-white/20 font-black uppercase tracking-widest">No recent student activity</p>
                 </div>
              </div>
           </motion.div>
        </div>
      </div>
    </div>
  );
}
