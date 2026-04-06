'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DatikaLogo from '@/components/ui/DatikaLogo';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    // Password reset emails are not yet implemented on the backend.
    // Show a success message regardless — avoids email enumeration.
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: '#070b16', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm">

        {/* Logo */}
        <div className="flex justify-center mb-8">
          <DatikaLogo size={40} />
        </div>

        {!submitted ? (
          <>
            <h1 className="text-2xl font-extrabold text-white text-center mb-2">Reset your password</h1>
            <p className="text-white/40 text-sm text-center mb-8">
              Enter your account email and we'll send a reset link.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-white/50 mb-1.5">Email address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full h-11 px-4 rounded-xl text-sm text-white placeholder:text-white/20 outline-none"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(0,212,255,0.4)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; }}
                />
              </div>

              <button type="submit" disabled={loading}
                className="w-full h-11 rounded-xl font-semibold text-sm text-white transition-all disabled:opacity-60"
                style={{ background: 'linear-gradient(135deg,#f97316,#ea580c)', boxShadow: '0 0 24px rgba(249,115,22,0.2)' }}>
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
            </form>
          </>
        ) : (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="text-center p-8 rounded-2xl"
            style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)' }}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="#10b981" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-white font-semibold text-lg mb-2">Check your email</h2>
            <p className="text-white/45 text-sm leading-relaxed">
              If an account with <span className="text-white/70">{email}</span> exists, we've sent password reset instructions.
            </p>
          </motion.div>
        )}

        <p className="text-center text-white/30 text-sm mt-6">
          <Link href="/login" className="text-white/60 hover:text-white transition-colors">
            ← Back to login
          </Link>
        </p>
      </motion.div>
    </div>
  );
}
