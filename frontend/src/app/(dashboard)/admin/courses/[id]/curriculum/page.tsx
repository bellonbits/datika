'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronLeft,
  Sparkles,
  Clock,
  AlertCircle,
  Layers,
  Zap,
  BookOpen,
  DollarSign,
  ShieldAlert
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { coursesApi } from '@/lib/api/courses.api';

const glassStyle = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 24,
};

export default function AdminCurriculumEditorPage() {
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
      const data = await apiClient.get(`/courses/${id}`);
      setCourse(data);
    } catch (err: any) {
      setError('Failed to load curriculum.');
    } finally {
      setIsLoading(false);
    }
  };

  const addSection = async () => {
    const title = prompt('Enter section title:');
    if (!title) return;
    try {
      await coursesApi.createSection(id as string, { 
        title, 
        order: (course.sections?.length || 0) + 1 
      });
      fetchCourse();
    } catch (err: any) {
      alert('Failed to add section.');
    }
  };

  const addLesson = async (sectionId: string) => {
    const title = prompt('Enter lesson title:');
    if (!title) return;
    try {
      const section = course.sections.find((s: any) => s.id === sectionId);
      await coursesApi.createLesson(sectionId, {
        title,
        type: 'VIDEO',
        order: (section.lessons?.length || 0) + 1
      });
      fetchCourse();
    } catch (err: any) {
      alert('Failed to add lesson.');
    }
  };

  const deleteSection = async (sectionId: string) => {
    if (!confirm('ADMIN OVERRIDE: Are you sure you want to delete this section and all associated lessons?')) return;
    try {
      await coursesApi.deleteSection(sectionId);
      fetchCourse();
    } catch (err: any) {
      alert('Failed to delete section.');
    }
  };

  if (isLoading) return (
     <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 rounded-full border-2 border-orange-500/20 border-t-orange-500 animate-spin" />
           <span className="text-white/20 text-xs font-black uppercase tracking-widest">Enforcing Syllabus...</span>
        </div>
     </div>
  );

  return (
    <div className="p-6 h-full overflow-auto text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-5">
           <button 
             onClick={() => router.push(`/admin/courses/${id}`)}
             className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all font-black"
           >
             <ChevronLeft size={20} />
           </button>
           <div>
              <h1 className="text-2xl font-black mb-1">Platform Curriculum Manager</h1>
              <div className="flex items-center gap-4">
                 <p className="text-white/30 text-xs font-semibold flex items-center gap-1.5">
                   <Clock size={12} className="text-orange-400" /> {course.duration || 'Flexible'}
                 </p>
                 <p className="text-white/30 text-xs font-semibold flex items-center gap-1.5">
                   <DollarSign size={12} className="text-emerald-400" /> KES {course.price || 0}
                 </p>
              </div>
           </div>
        </div>

        <div className="flex items-center gap-3">
           <button 
             onClick={addSection}
             className="h-11 px-6 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/5 text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2"
           >
              <Plus size={16} /> Add Section
           </button>
           <button 
             className="h-11 px-6 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-[#070b16] text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 flex items-center gap-2"
           >
             <Sparkles size={16} /> Platform AI Overhaul
           </button>
        </div>
      </motion.div>

      {/* Curriculum Canvas */}
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-2 text-orange-400/50 text-[10px] uppercase font-black tracking-[0.2em] mb-4">
           <ShieldAlert size={14} /> Admin Privileges Enabled
        </div>

        <AnimatePresence>
          {course.sections?.map((section: any, sIdx: number) => (
            <motion.div 
              key={section.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative"
            >
               {/* Section Card */}
               <div className="p-6 mb-4 group border border-orange-500/5" style={glassStyle}>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-xs font-black text-orange-400 border border-orange-500/20">
                          {String(sIdx + 1).padStart(2, '0')}
                       </div>
                       <h3 className="text-base font-black text-white/90">{section.title}</h3>
                    </div>
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2 rounded-lg hover:bg-white/5 text-white/20 hover:text-white transition-colors">
                          <Edit3 size={16} />
                       </button>
                       <button 
                         onClick={() => deleteSection(section.id)}
                         className="p-2 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-colors"
                       >
                          <Trash2 size={16} />
                       </button>
                    </div>
                  </div>

                  {/* Lessons List */}
                  <div className="space-y-3 pl-14">
                     {section.lessons?.map((lesson: any, lIdx: number) => (
                       <div key={lesson.id} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-white/[0.03] group/lesson hover:bg-white/[0.05] hover:border-white/10 transition-all">
                          <div className="flex items-center gap-4">
                             <div className={`p-2 rounded-xl ${lesson.type === 'VIDEO' ? 'bg-orange-500/10 text-orange-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                {lesson.type === 'VIDEO' ? <Zap size={14} /> : <BookOpen size={14} />}
                             </div>
                             <div>
                                <h4 className="text-sm font-bold text-white/60 group-hover/lesson:text-white transition-colors">{lesson.title}</h4>
                                <p className="text-[10px] text-white/20 font-black uppercase tracking-widest mt-0.5">{lesson.type}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-2 opacity-0 group-hover/lesson:opacity-100 transition-opacity">
                             <button className="p-2 rounded-lg hover:bg-white/5 text-white/20 hover:text-white transition-colors"><Edit3 size={14} /></button>
                             <button className="p-2 rounded-lg hover:bg-red-500/10 text-white/20 hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                          </div>
                       </div>
                     ))}
                     
                     <button 
                       onClick={() => addLesson(section.id)}
                       className="w-full h-12 rounded-2xl border-2 border-dashed border-white/5 hover:border-orange-500/20 hover:bg-orange-500/5 text-white/20 hover:text-orange-400 transition-all flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest mt-6"
                     >
                       <Plus size={16} /> Add Lesson to Section
                     </button>
                  </div>
               </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {course.sections?.length === 0 && (
          <div className="p-20 text-center" style={glassStyle}>
             <Layers size={40} className="text-white/5 mx-auto mb-6" />
             <h3 className="text-xl font-black text-white/20 mb-2 font-black">Empty Structure</h3>
             <p className="text-white/10 text-xs font-bold uppercase tracking-widest mb-8">Start architecting the platform curriculum</p>
             <button 
                onClick={addSection}
                className="h-12 px-10 rounded-2xl bg-orange-500 hover:bg-orange-400 text-[#070b16] text-xs font-black uppercase tracking-widest transition-all"
             >
                Initialize Architecture
             </button>
          </div>
        )}
      </div>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
