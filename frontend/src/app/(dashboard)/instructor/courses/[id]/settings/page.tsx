'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Settings, 
  ChevronLeft, 
  Save, 
  Trash2, 
  AlertCircle, 
  CheckCircle2,
  Loader2,
  Layers,
  CreditCard,
  Clock,
  Layout,
  BookOpen
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { coursesApi } from '@/lib/api/courses.api';

const settingsSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(2, 'Category is required'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  duration: z.string().min(2, 'Duration is required'),
  price: z.number().min(0, 'Price cannot be negative'),
});

type SettingsFormValues = z.infer<typeof settingsSchema>;

const glassStyle = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(12px)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 24,
};

export default function CourseSettingsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset
  } = useForm<SettingsFormValues>({
    resolver: zodResolver(settingsSchema),
  });

  const selectedLevel = watch('level');

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await apiClient.get(`/courses/${id}`) as any;
      const data = res?.data ?? res;
      reset({
        title: data.title,
        description: data.description,
        category: data.category || '',
        level: data.level,
        duration: data.duration || '',
        price: Number(data.price),
      });
    } catch (err: any) {
      setError('Failed to load settings.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (values: SettingsFormValues) => {
    setIsSaving(true);
    setError(null);
    setSuccess(false);
    try {
      await coursesApi.update(id as string, values);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError('Failed to update course settings.');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteCourse = async () => {
    if (!confirm('EXTREME WARNING: Are you sure you want to permanently delete this course? This action cannot be undone.')) return;
    try {
      await coursesApi.delete(id as string);
      router.push('/instructor/courses');
    } catch (err: any) {
      alert('Failed to delete course.');
    }
  };

  if (isLoading) return (
     <div className="h-full flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
           <span className="text-white/20 text-xs font-black uppercase tracking-widest">Optimizing Settings...</span>
        </div>
     </div>
  );

  return (
    <div className="p-6 h-full overflow-auto text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between gap-6 mb-10">
        <div className="flex items-center gap-5">
           <button 
             onClick={() => router.push(`/instructor/courses/${id}`)}
             className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all font-black"
           >
             <ChevronLeft size={20} />
           </button>
           <div>
              <h1 className="text-2xl font-black mb-1 text-purple-400">Course Settings</h1>
              <p className="text-white/30 text-xs font-semibold">Refine and localize your course metadata</p>
           </div>
        </div>

        <button 
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving}
          className="h-11 px-8 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-[#070b16] text-xs font-black uppercase tracking-widest transition-all shadow-xl shadow-cyan-500/20 flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
          Save Changes
        </button>
      </motion.div>

      <div className="max-w-4xl mx-auto space-y-6">
        {success && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black flex items-center gap-2 mb-4">
             <CheckCircle2 size={16} /> Changes manifested successfully!
          </motion.div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 pb-20">
             {/* General Info */}
             <div className="p-8" style={glassStyle}>
                <h3 className="text-xs font-black text-white/30 uppercase tracking-[0.2em] mb-8">General Information</h3>
                <div className="space-y-6">
                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/20 uppercase tracking-widest px-1">Course Title</label>
                     <div className="relative">
                        <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10" size={18} />
                        <input
                          {...register('title')}
                          className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 outline-none transition-all focus:border-cyan-500/50 text-sm font-semibold text-white"
                        />
                     </div>
                     {errors.title && <p className="text-xs text-red-400/80 mt-1">{errors.title.message}</p>}
                   </div>

                   <div className="space-y-2">
                     <label className="text-[10px] font-black text-white/20 uppercase tracking-widest px-1">Description</label>
                     <textarea
                       {...register('description')}
                       rows={6}
                       className="w-full p-4 rounded-xl bg-white/5 border border-white/10 outline-none transition-all focus:border-cyan-500/50 text-sm font-medium leading-relaxed resize-none text-white"
                     />
                     {errors.description && <p className="text-xs text-red-400/80 mt-1">{errors.description.message}</p>}
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Categorization */}
                <div className="p-8" style={glassStyle}>
                   <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-8">Classification</h3>
                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest px-1">Category</label>
                        <input
                          {...register('category')}
                          className="w-full h-12 px-4 rounded-xl bg-white/5 border border-white/10 outline-none transition-all focus:border-cyan-500/50 text-sm font-semibold text-white"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest px-1">Skill Level</label>
                        <div className="grid grid-cols-3 gap-2">
                          {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((l) => (
                            <button
                              key={l}
                              type="button"
                              onClick={() => setValue('level', l as any)}
                              className={`h-10 rounded-xl text-[10px] font-black uppercase transition-all border ${
                                selectedLevel === l 
                                  ? 'bg-purple-500/10 text-purple-400 border-purple-500/40' 
                                  : 'bg-white/5 text-white/20 border-white/5 hover:border-white/10'
                              }`}
                            >
                              {l}
                            </button>
                          ))}
                        </div>
                      </div>
                   </div>
                </div>

                {/* Logistics */}
                <div className="p-8" style={glassStyle}>
                   <h3 className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-8">Logistics & Pricing</h3>
                   <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest px-1">Duration</label>
                        <div className="relative">
                           <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10" size={18} />
                           <input
                             {...register('duration')}
                             className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 outline-none transition-all focus:border-cyan-500/50 text-sm font-semibold text-white"
                           />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-white/20 uppercase tracking-widest px-1">Price (KES)</label>
                        <div className="relative">
                           <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-white/10" size={18} />
                           <input
                             type="number"
                             {...register('price', { valueAsNumber: true })}
                             className="w-full h-12 pl-12 pr-4 rounded-xl bg-white/5 border border-white/10 outline-none transition-all focus:border-orange-500/50 text-sm font-black text-white"
                           />
                        </div>
                      </div>
                   </div>
                </div>
             </div>

             {/* Danger Zone */}
             <div className="p-8 border border-red-500/10 rounded-[32px] bg-red-500/[0.02]">
                <div className="flex items-center gap-3 text-red-400 mb-6 font-black uppercase tracking-[0.3em] text-[10px]">
                   <AlertCircle size={16} /> Danger Zone
                </div>
                <div className="flex items-center justify-between">
                   <div>
                      <h4 className="text-sm font-black text-white/80 mb-1">Permanently Delete Course</h4>
                      <p className="text-white/20 text-xs font-medium">This is permanent. All enrollments and content will be lost forever.</p>
                   </div>
                   <button 
                     type="button"
                     onClick={deleteCourse}
                     className="h-12 px-8 rounded-2xl bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white text-xs font-black transition-all border border-red-500/20"
                   >
                     MANIFEST EXTINCTION
                   </button>
                </div>
             </div>
        </form>
      </div>
    </div>
  );
}
