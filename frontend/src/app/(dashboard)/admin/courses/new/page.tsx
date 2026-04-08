'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Sparkles, 
  ChevronLeft, 
  Clock, 
  CreditCard, 
  Layout,
  Loader2,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Layers,
  Zap,
  Shield
} from 'lucide-react';
import { apiClient } from '@/lib/api/client';
import { aiApi } from '@/lib/api/ai.api';

const magicSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  duration: z.string().min(2, 'e.g. 10 Weeks or 40 Hours'),
  price: z.number().min(0, 'Price cannot be negative'),
});

type MagicFormValues = z.infer<typeof magicSchema>;

const glassStyle = {
  background: 'rgba(255,255,255,0.03)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 32,
};

export default function AdminMagicCreateCoursePage() {
  const router = useRouter();
  const [step, setStep] = useState<'input' | 'generating' | 'review'>('input');
  const [aiBlueprint, setAiBlueprint] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MagicFormValues>({
    resolver: zodResolver(magicSchema),
    defaultValues: {
      price: 0,
    },
  });

  const onSubmit = async (values: MagicFormValues) => {
    setStep('generating');
    setError(null);
    try {
      const { data } = await aiApi.generateCourseMetadata({ 
        prompt: values.title,
        duration: values.duration,
        amount: values.price
      }) as any;
      
      if (data) {
        setAiBlueprint({ ...data, price: values.price, duration: values.duration });
        setStep('review');
      }
    } catch (err: any) {
      setError('The Magic Genie encountered an error. Please try again.');
      setStep('input');
    }
  };

  const finalizeCreation = async () => {
    if (!aiBlueprint) return;
    setIsSubmitting(true);
    setError(null);
    try {
      // Admins create courses directly
      const response = await apiClient.post('/courses/ai-bulk', aiBlueprint) as any;
      const id = response?.data?.id ?? response?.id;
      router.push(`/admin/courses/${id}`);
    } catch (err: any) {
      setError('Failed to manifest the course. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-full p-6 flex flex-col items-center justify-center text-white font-[Inter,sans-serif]">
      <AnimatePresence mode="wait">
        {step === 'input' && (
          <motion.div 
            key="input"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="w-full max-w-xl p-10"
            style={glassStyle}
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-orange-500/20 flex items-center justify-center text-orange-400">
                <Shield size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">Platform Content Architect</h1>
                <p className="text-white/40 text-sm font-medium italic">Admin Authority Mode</p>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">Curated Course Name</label>
                <div className="relative group">
                  <Layout className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-400 transition-colors" size={20} />
                  <input
                    {...register('title')}
                    placeholder="e.g. Official Datika Mastery Path"
                    className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 outline-none transition-all focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 text-base font-semibold"
                  />
                  {errors.title && <p className="text-xs text-red-400 mt-1.5 px-1">{errors.title.message}</p>}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">Platform Duration</label>
                  <div className="relative group">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-400 transition-colors" size={20} />
                    <input
                      {...register('duration')}
                      placeholder="e.g. 12 Weeks"
                      className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 outline-none transition-all focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 text-sm font-semibold"
                    />
                    {errors.duration && <p className="text-xs text-red-400 mt-1.5 px-1">{errors.duration.message}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] px-1">Public Amount (KES)</label>
                  <div className="relative group">
                    <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20 group-focus-within:text-orange-400 transition-colors" size={20} />
                    <input
                      type="number"
                      {...register('price', { valueAsNumber: true })}
                      placeholder="9999"
                      className="w-full h-14 pl-12 pr-4 rounded-2xl bg-white/5 border border-white/10 outline-none transition-all focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/20 text-sm font-bold"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full h-14 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white font-black text-sm uppercase tracking-widest transition-all shadow-2xl shadow-orange-500/20 flex items-center justify-center gap-3 group"
                >
                  Architect Platform Draft
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>

              {error && (
                <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400">
                  <AlertCircle size={18} />
                  <span className="text-xs font-bold">{error}</span>
                </div>
              )}
            </form>
          </motion.div>
        )}

        {step === 'generating' && (
          <motion.div 
            key="generating"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="w-32 h-32 rounded-full border-4 border-orange-500/10 border-t-orange-500 shadow-[0_0_40px_rgba(249,115,22,0.2)]"
              />
              <div className="absolute inset-0 flex items-center justify-center text-orange-400">
                 <Shield size={40} className="animate-pulse" />
              </div>
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-black tracking-tight mb-2 text-orange-100">Manifesting Global Content...</h2>
              <p className="text-white/30 font-medium tracking-wide">Synthesizing platform syllabus and standards</p>
            </div>
          </motion.div>
        )}

        {step === 'review' && aiBlueprint && (
          <motion.div 
            key="review"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-4xl max-h-[85vh] flex flex-col"
          >
            <div className="flex items-center justify-between mb-6">
              <button 
                onClick={() => setStep('input')}
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-bold uppercase tracking-widest"
              >
                <ChevronLeft size={16} /> Re-Edit Core
              </button>
              <div className="px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-black uppercase tracking-widest">
                Platform Blueprint Manifested
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
              <div className="lg:col-span-1 space-y-6 overflow-y-auto pr-2 custom-scrollbar">
                <div className="p-8" style={glassStyle}>
                  <div className="text-orange-400 mb-4 px-1"><Sparkles size={20} /></div>
                  <h3 className="text-lg font-black leading-tight mb-4">{aiBlueprint.title}</h3>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-white/40 text-xs font-bold uppercase tracking-widest">
                       <Clock size={14} className="text-orange-500" />
                       {aiBlueprint.duration}
                    </div>
                    <div className="flex items-center gap-3 text-white/40 text-xs font-bold uppercase tracking-widest">
                       <Layers size={14} className="text-blue-500" />
                       {aiBlueprint.category}
                    </div>
                    <div className="flex items-center gap-3 text-white/40 text-xs font-bold uppercase tracking-widest">
                       <BookOpen size={14} className="text-emerald-500" />
                       {aiBlueprint.level}
                    </div>
                  </div>
                  <div className="h-px bg-white/5 my-6" />
                  <p className="text-xs text-white/40 leading-relaxed font-medium">
                    {aiBlueprint.description}
                  </p>
                </div>

                <button
                  onClick={finalizeCreation}
                  disabled={isSubmitting}
                  className="w-full h-14 rounded-2xl bg-orange-500 hover:bg-orange-400 text-[#070b16] font-black text-sm uppercase tracking-widest transition-all shadow-xl shadow-orange-500/20 flex items-center justify-center gap-3 disabled:opacity-50"
                >
                  {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <CheckCircle2 size={20} />}
                  Begin Global Manifestation
                </button>
              </div>

              <div className="lg:col-span-2 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                <div className="flex items-center gap-2 px-2 text-white/30 text-[10px] font-black uppercase tracking-[0.2em] mb-2">
                   <Shield size={14} /> Official Platform Structure
                </div>
                {aiBlueprint.sections?.map((section: any, sIdx: number) => (
                  <motion.div 
                    key={sIdx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: sIdx * 0.1 }}
                    className="p-6" style={glassStyle}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-[10px] font-black text-white/20">
                        {String(sIdx + 1).padStart(2, '0')}
                      </div>
                      <h4 className="text-sm font-black text-white/80">{section.title}</h4>
                    </div>
                    <div className="space-y-2 pl-12">
                      {section.lessons?.map((lesson: any, lIdx: number) => (
                        <div key={lIdx} className="p-3 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between group hover:border-orange-500/20 transition-colors">
                          <div className="flex items-center gap-3">
                             <div className={`p-1.5 rounded-lg ${lesson.type === 'VIDEO' ? 'bg-orange-500/10 text-orange-400' : 'bg-emerald-500/10 text-emerald-400'}`}>
                                {lesson.type === 'VIDEO' ? <Zap size={12} /> : <BookOpen size={12} />}
                             </div>
                             <span className="text-xs font-bold text-white/50 group-hover:text-white/80 transition-colors">{lesson.title}</span>
                          </div>
                          <div className="text-[9px] font-black text-white/20 uppercase tracking-widest">{lesson.type}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
      `}</style>
    </div>
  );
}
