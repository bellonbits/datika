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

const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(1, 'Password is required'),
});
type LoginForm = z.infer<typeof loginSchema>;

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/api/v1';

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

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    setError(null);
    try {
      const res = await authApi.login(data);
      const { user, tokens } = res.data;
      setAuth(user as Parameters<typeof setAuth>[0], tokens.accessToken, tokens.refreshToken);
      const path = user.role === 'ADMIN' ? '/admin' : user.role === 'INSTRUCTOR' ? '/instructor' : '/student';
      router.replace(path);
    } catch (err: unknown) {
      setError(
        (err as { response?: { data?: { error?: { message?: string } } } })?.response?.data?.error?.message ??
        'Invalid email or password.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-3xl font-extrabold text-white mb-1">Welcome back</h1>
      <p className="text-white/40 text-sm mb-8">Sign in to continue your learning journey</p>

      {error && (
        <div className="flex items-center gap-2.5 text-sm rounded-xl px-4 py-3 mb-6"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#fca5a5' }}>
          <span>⚠</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-2 uppercase tracking-wider">Email</label>
          <Controller name="email" control={control} render={({ field }) => (
            <input {...field} type="email" placeholder="you@example.com"
              className={inputClass(!!errors.email)} style={inputStyle} />
          )} />
          {errors.email && <p className="text-xs text-red-400 mt-1.5">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Password</label>
            <Link href="/forgot-password" className="text-xs text-orange-400 hover:text-orange-300 transition-colors">
              Forgot password?
            </Link>
          </div>
          <Controller name="password" control={control} render={({ field }) => (
            <div className="relative">
              <input {...field} type={showPw ? 'text' : 'password'} placeholder="••••••••"
                className={inputClass(!!errors.password) + ' pr-14'} style={inputStyle} />
              <button type="button" onClick={() => setShowPw(!showPw)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 text-xs transition-colors px-1">
                {showPw ? 'Hide' : 'Show'}
              </button>
            </div>
          )} />
          {errors.password && <p className="text-xs text-red-400 mt-1.5">{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={loading}
          className="w-full h-12 font-semibold rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          style={{ background: 'linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)', color: 'white' }}
          onMouseEnter={(e) => { if (!loading) e.currentTarget.style.opacity = '0.9'; }}
          onMouseLeave={(e) => { e.currentTarget.style.opacity = '1'; }}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>

      <div className="flex items-center gap-3 my-6">
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
        <span className="text-xs text-white/25">or continue with</span>
        <div className="flex-1 h-px" style={{ background: 'rgba(255,255,255,0.08)' }} />
      </div>

      <a href={`${API_URL}/auth/google`}
        className="flex items-center justify-center gap-3 w-full h-12 rounded-xl text-sm font-medium text-white/70 hover:text-white transition-all"
        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
        <GoogleIcon />
        Continue with Google
      </a>

      <p className="text-center text-sm text-white/35 mt-8">
        Don&apos;t have an account?{' '}
        <Link href="/register" className="font-semibold hover:text-orange-300 transition-colors" style={{ color: '#f97316' }}>
          Sign up free
        </Link>
      </p>
    </motion.div>
  );
}
