'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { authApi } from '@/lib/api/auth.api';
import { useAuthStore } from '@/lib/store/auth.store';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

const schema = z
  .object({
    name: z.string().min(2, 'At least 2 characters'),
    email: z.string().email('Enter a valid email'),
    password: z.string().min(8, 'At least 8 characters').regex(/(?=.*[A-Z])/, 'Needs uppercase').regex(/(?=.*[0-9])/, 'Needs a number'),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, { message: "Passwords don't match", path: ['confirmPassword'] });

type RegisterForm = z.infer<typeof schema>;

const inputClass = (hasError: boolean) =>
  `w-full h-12 px-4 rounded-xl text-sm text-white outline-none transition-all placeholder:text-white/25
   ${hasError
    ? 'border border-red-500/60 focus:border-red-400 focus:ring-1 focus:ring-red-400/30'
    : 'border border-white/10 focus:border-cyan-400/60 focus:ring-1 focus:ring-cyan-400/20'
   }`;

const inputStyle = { background: 'rgba(255,255,255,0.05)' };

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.874 2.684-6.615z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957C.347 6.175 0 7.548 0 9s.348 2.825.957 4.039l3.007-2.332z" fill="#FBBC05"/>
      <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
  );
}

function PasswordStrength({ pw }: { pw: string }) {
  if (!pw) return null;
  const checks = [pw.length >= 8, /[A-Z]/.test(pw), /[0-9]/.test(pw)];
  const score = checks.filter(Boolean).length;
  const colors = ['#ef4444', '#f97316', '#00d4ff'];
  const labels = ['Weak', 'Fair', 'Strong'];
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1.5">
        {[0,1,2].map((i) => (
          <div key={i} className="flex-1 h-1 rounded-full transition-all"
            style={{ background: i < score ? colors[score - 1] : 'rgba(255,255,255,0.1)' }} />
        ))}
      </div>
      <div className="flex justify-between">
        <div className="flex gap-3">
          {['8+ chars','Uppercase','Number'].map((l, i) => (
            <span key={l} className="text-xs" style={{ color: checks[i] ? '#00d4ff' : 'rgba(255,255,255,0.25)' }}>
              {checks[i] ? '✓' : '○'} {l}
            </span>
          ))}
        </div>
        {score > 0 && <span className="text-xs font-medium" style={{ color: colors[score - 1] }}>{labels[score - 1]}</span>}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const [pwValue, setPwValue] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterForm>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.register({ name: data.name, email: data.email, password: data.password });
      const { user, tokens } = res.data;
      setAuth(user as Parameters<typeof setAuth>[0], tokens.accessToken, tokens.refreshToken);
      router.replace('/student');
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message ??
        'Registration failed. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-3xl font-extrabold text-white mb-1">Create account</h1>
      <p className="text-white/40 text-sm mb-8">Start your data science journey today</p>

      {error && (
        <div className="flex items-center gap-2.5 text-sm rounded-xl px-4 py-3 mb-6"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
          <span>⚠</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Full name</label>
          <Controller name="name" control={control} render={({ field }) => (
            <input {...field} placeholder="Jane Wanjiku" className={inputClass(!!errors.name)} style={inputStyle} />
          )} />
          {errors.name && <p className="text-xs text-red-400 mt-1.5">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Email</label>
          <Controller name="email" control={control} render={({ field }) => (
            <input {...field} type="email" placeholder="you@example.com" className={inputClass(!!errors.email)} style={inputStyle} />
          )} />
          {errors.email && <p className="text-xs text-red-400 mt-1.5">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Password</label>
          <Controller name="password" control={control} render={({ field }) => (
            <div className="relative">
              <input {...field} type={showPw ? 'text' : 'password'} placeholder="Min 8 chars"
                className={inputClass(!!errors.password) + ' pr-14'} style={inputStyle}
                onChange={(e) => { field.onChange(e); setPwValue(e.target.value); }} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs transition-colors px-1">
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
          )} />
          <PasswordStrength pw={pwValue} />
          {errors.password && <p className="text-xs text-red-400 mt-1.5">{errors.password.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Confirm password</label>
          <Controller name="confirmPassword" control={control} render={({ field }) => (
            <input {...field} type="password" placeholder="••••••••" className={inputClass(!!errors.confirmPassword)} style={inputStyle} />
          )} />
          {errors.confirmPassword && <p className="text-xs text-red-400 mt-1.5">{errors.confirmPassword.message}</p>}
        </div>

        <button type="submit" disabled={loading}
          className="w-full h-12 font-semibold rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 text-white"
          style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)' }}>
          {loading ? 'Creating account…' : 'Create account'}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <span className="text-xs text-white/25">or</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
      </div>

      <a href={`${API_URL}/auth/google`}
        className="flex items-center justify-center gap-3 w-full h-12 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-all"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <GoogleIcon />
        Sign up with Google
      </a>

      <p className="text-center text-sm text-white/35 mt-6">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold hover:text-orange-300 transition-colors" style={{ color: '#f97316' }}>Sign in</Link>
      </p>
      <p className="text-center text-xs text-white/20 mt-3">
        By signing up you agree to our <a href="#" className="underline">Terms</a> and <a href="#" className="underline">Privacy Policy</a>.
      </p>
    </motion.div>
  );
}
