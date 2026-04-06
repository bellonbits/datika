'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  BookOpen, 
  ChevronLeft, 
  Sparkles, 
  Layout, 
  Layers, 
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';

const courseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  level: z.enum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']),
  price: z.number().min(0, 'Price cannot be negative'),
  category: z.string().min(2, 'Category is required'),
});

type CourseFormValues = z.infer<typeof courseSchema>;

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 24,
};

export default function CreateCoursePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CourseFormValues>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      level: 'BEGINNER',
      price: 0,
    },
  });

  const selectedLevel = watch('level');

  const onSubmit = async (values: CourseFormValues) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await apiClient.post('/courses', values) as { id: string };
      // Redirect to course management page or curriculum editor
      router.push(`/instructor/courses`);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create course. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 h-full overflow-auto text-white" style={{ fontFamily: 'Inter, system-ui, sans-serif' }}>
      {/* Header */}
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} className="mb-8 flex items-center gap-4">
        <button 
          onClick={() => router.back()}
          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors text-white/40 hover:text-white border border-white/5">
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl font-extrabold text-white">Create New Course</h1>
          <p className="text-white/35 text-sm">Design and publish high-quality educational content</p>
        </div>
      </motion.div>

      <div className="max-w-4xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Main Info */}
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="p-8" style={cardStyle}>
            <div className="flex items-center gap-2 mb-6 text-cyan-400">
               <Sparkles size={18} />
               <span className="text-xs font-bold uppercase tracking-widest">Base Information</span>
            </div>

            <div className="space-y-5">
              {/* Title */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Course Title</label>
                <div className="relative">
                  <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input
                    {...register('title')}
                    placeholder="e.g. Advanced Digital Marketing 2024"
                    className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-sm font-medium"
                  />
                </div>
                {errors.title && <p className="text-xs text-red-400/80 mt-1 flex items-center gap-1.5 px-1"><AlertCircle size={12}/>{errors.title.message}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Description</label>
                <textarea
                  {...register('description')}
                  rows={4}
                  placeholder="What will learners achieve in this course?"
                  className="w-full p-4 rounded-2xl bg-white/5 border border-white/10 outline-none transition-all focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 text-sm font-medium resize-none"
                />
                {errors.description && <p className="text-xs text-red-400/80 mt-1 flex items-center gap-1.5 px-1"><AlertCircle size={12}/>{errors.description.message}</p>}
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Classification */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="p-8" style={cardStyle}>
               <div className="flex items-center gap-2 mb-6 text-purple-400">
                  <Layers size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Classification</span>
               </div>
               
               <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Category</label>
                    <input
                      {...register('category')}
                      placeholder="e.g. Computer Science"
                      className="w-full h-12 px-4 rounded-2xl bg-white/5 border border-white/10 outline-none transition-all focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 text-sm font-medium"
                    />
                    {errors.category && <p className="text-xs text-red-400/80 mt-1 px-1">{errors.category.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Skill Level</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['BEGINNER', 'INTERMEDIATE', 'ADVANCED'].map((l) => (
                        <button
                          key={l}
                          type="button"
                          onClick={() => setValue('level', l as any)}
                          className={`h-10 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                            selectedLevel === l 
                              ? 'bg-purple-500/15 text-purple-400 border-purple-500/40 shadow-lg shadow-purple-500/10' 
                              : 'bg-white/5 text-white/25 border-white/5 hover:border-white/10'
                          }`}
                        >
                          {l}
                        </button>
                      ))}
                    </div>
                  </div>
               </div>
            </motion.div>

            {/* Pricing */}
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="p-8" style={cardStyle}>
               <div className="flex items-center gap-2 mb-6 text-orange-400">
                  <CreditCard size={18} />
                  <span className="text-xs font-bold uppercase tracking-widest">Pricing (KES)</span>
               </div>

               <div className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-white/40 uppercase tracking-widest px-1">Course Price</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 text-sm font-bold">KES</span>
                      <input
                        type="number"
                        {...register('price', { valueAsNumber: true })}
                        className="w-full h-12 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 outline-none transition-all focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 text-sm font-bold"
                      />
                    </div>
                    <p className="text-[10px] text-white/20 mt-1.5 px-1 uppercase tracking-tighter">Enter 0 for a free course</p>
                    {errors.price && <p className="text-xs text-red-400/80 mt-1 px-1">{errors.price.message}</p>}
                  </div>
               </div>
            </motion.div>
          </div>

          {/* Submission Area */}
          <div className="pt-4 flex items-center justify-between">
            <div className="flex-1 pr-10">
              {error && (
                <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-2 text-red-400">
                  <AlertCircle size={14} />
                  <span className="text-xs font-medium">{error}</span>
                </motion.div>
              )}
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="h-12 px-8 rounded-2xl text-white/40 hover:text-white font-bold transition-all text-sm"
              >
                Discard
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="h-12 px-10 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-[#070b16] font-bold transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-xl shadow-cyan-500/20"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={18} />
                    Create Draft
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
