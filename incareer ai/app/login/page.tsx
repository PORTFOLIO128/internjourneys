'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Logo } from '@/components/common/Logo';
import { Mail, Lock, ArrowRight, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { useAuth } from '@/lib/authContext';
import { errorMessage } from '@/lib/errorMessage';

const FEATURES = [
  { icon: ShieldCheck, text: 'Verified credentials & offer letters' },
  { icon: CheckCircle2, text: 'Project-based virtual workflows' },
  { icon: Zap, text: 'Instant dashboard access' },
];

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const shouldReduceMotion = useReducedMotion();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const { redirect } = await login({ email, password });
      router.push(redirect);
    } catch (err: unknown) {
      setError(errorMessage(err, 'Login failed. Please check your credentials.'));
      setIsLoading(false);
    }
  };

  const fadeUp = (delay = 0) =>
    shouldReduceMotion
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
      : {
          initial: { opacity: 0, y: 20 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: 'easeOut' },
        };

  return (
    <main
      id="main-content"
      className="min-h-screen flex flex-col items-center justify-center antialiased relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #0f0e38 0%, #17164b 40%, #1a2a6c 70%, #1d61ff22 100%)',
      }}
    >
      {/* Animated background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #1d61ff 0%, transparent 70%)', animation: 'blob-spin 18s ease-in-out infinite' }}
        />
        <div
          className="absolute -bottom-40 -right-40 w-[600px] h-[600px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', animation: 'blob-spin 24s ease-in-out infinite reverse' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-10"
          style={{ background: 'radial-gradient(circle, #06b6d4 0%, transparent 70%)', animation: 'blob-spin 30s linear infinite' }}
        />
      </div>

      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 py-8 sm:py-12">
        {/* Top logo on mobile */}
        <motion.div {...fadeUp(0)} className="flex justify-center mb-6 lg:hidden">
          <Logo href="/" className="text-white" />
        </motion.div>

        <motion.div
          {...(shouldReduceMotion
            ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
            : { initial: { opacity: 0, scale: 0.97 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.5, ease: 'easeOut' } }
          )}
          className="grid grid-cols-1 lg:grid-cols-12 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
          style={{ backdropFilter: 'blur(2px)' }}
        >
          {/* LEFT BRAND PANEL — hidden on mobile */}
          <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-br from-[#0F0E38]/90 via-[#17164B]/90 to-[#1E1B4B]/90 text-white p-10 flex-col justify-between relative overflow-hidden">
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-20 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-8">
              <Logo href="/" className="text-white" />

              <div className="space-y-3">
                <h2 className="text-2xl xl:text-3xl font-bold text-white leading-snug">
                  Build Real Skills.<br />Gain Real Experience.
                </h2>
                <p className="text-xs text-indigo-200/80 leading-relaxed">
                  Access project-based virtual internships, track tasks, manage credentials, and continue your learning journey.
                </p>
              </div>

              <div className="space-y-3 pt-4 border-t border-white/10">
                {FEATURES.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-xs text-indigo-100">
                    <div className="w-7 h-7 rounded-lg bg-indigo-500/30 flex items-center justify-center shrink-0">
                      <Icon className="w-3.5 h-3.5 text-emerald-400" />
                    </div>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 text-[10px] text-indigo-300/60">
              © 2026 InternJourneys · Pudukkottai, Tamil Nadu
            </div>
          </div>

          {/* RIGHT FORM PANEL */}
          <div className="lg:col-span-7 bg-white/95 backdrop-blur-md p-7 sm:p-10 flex flex-col justify-center space-y-6">
            <motion.div {...fadeUp(0.05)} className="space-y-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Welcome back 👋
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Sign in to access your internship dashboard.
              </p>
            </motion.div>

            <motion.form {...fadeUp(0.12)} onSubmit={handleSubmit} className="space-y-4">
              {/* Email */}
              <div className="space-y-1">
                <label htmlFor="login-email" className="block text-xs font-semibold text-slate-700">
                  Email Address
                </label>
                <div className="relative group">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 transition-colors group-focus-within:text-[#1D61FF]" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    placeholder="you@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1D61FF] focus:ring-2 focus:ring-[#1D61FF]/15 text-xs font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label htmlFor="login-password" className="block text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <a href="#" className="text-[11px] font-bold text-[#1D61FF] hover:underline">
                    Forgot password?
                  </a>
                </div>
                <div className="relative group">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 transition-colors group-focus-within:text-[#1D61FF]" />
                  <input
                    id="login-password"
                    type="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-[#1D61FF] focus:ring-2 focus:ring-[#1D61FF]/15 text-xs font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              {/* Error */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700"
                >
                  {error}
                </motion.div>
              )}

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
                whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
                className="w-full py-3 px-4 rounded-xl bg-[#1D61FF] hover:bg-[#1650D4] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-colors disabled:opacity-50"
              >
                <span>{isLoading ? 'Signing in…' : 'Sign In to Dashboard'}</span>
                {!isLoading && <ArrowRight className="w-4 h-4" />}
                {isLoading && (
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                )}
              </motion.button>
            </motion.form>

            <motion.p {...fadeUp(0.2)} className="text-center text-xs text-slate-500">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="font-bold text-[#1D61FF] hover:underline">
                Create an account
              </Link>
            </motion.p>

            {/* Mobile trust badges */}
            <motion.div {...fadeUp(0.25)} className="lg:hidden flex flex-wrap items-center justify-center gap-3 pt-2 border-t border-slate-100">
              {FEATURES.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5 text-[10px] text-slate-500 font-semibold">
                  <Icon className="w-3 h-3 text-emerald-500" />
                  <span>{text}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
