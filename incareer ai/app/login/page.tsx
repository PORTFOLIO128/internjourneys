'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Logo } from '@/components/common/Logo';
import { Mail, Lock, ArrowRight, Sparkles, CheckCircle2, ShieldCheck, User } from 'lucide-react';
import { setLoggedIn, setAdminLoggedIn, validateAdminCredentials } from '@/lib/mockAuth';

type Role = 'student' | 'admin';

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('student');
  const [email, setEmail] = useState('hari@example.com');
  const [password, setPassword] = useState('careerai123');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = role === 'admin';

  const handleRoleChange = (next: Role) => {
    setRole(next);
    setError('');
    if (next === 'admin') {
      setEmail('admin@careerai.in');
      setPassword('admin123');
    } else {
      setEmail('hari@example.com');
      setPassword('careerai123');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (isAdmin) {
        if (validateAdminCredentials(email, password)) {
          setAdminLoggedIn(true);
          router.push('/admin');
        } else {
          setError('Invalid admin credentials. Please use the provided demo admin account.');
          setIsLoading(false);
        }
      } else {
        setLoggedIn(true);
        router.push('/dashboard');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-background text-slate-900 font-sans flex flex-col justify-center antialiased p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl w-full mx-auto bg-white rounded-3xl border border-slate-200 shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* Left Side: Brand Visual Panel */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0F0E38] via-[#17164B] to-[#1E1B4B] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden">
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 space-y-6">
            <Logo href="/" className="text-white" />
            
            <div className="space-y-3 pt-6">
              <h2 className="text-3xl font-semibold text-white leading-snug">
                {isAdmin ? 'CareerAI Admin Console' : 'Build Real Skills. Gain Real Experience.'}
              </h2>
              <p className="text-xs text-indigo-200 leading-relaxed">
                {isAdmin
                  ? 'Manage the platform, review applications, and control internship operations.'
                  : 'Access project-based virtual internships, track tasks, and earn verified credentials.'}
              </p>
            </div>
          </div>

          <div className="relative z-10 pt-10 space-y-3 border-t border-white/10 text-xs text-indigo-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isAdmin ? 'Full platform administrative control' : 'Project-based virtual workflows'}</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{isAdmin ? 'Students, payments & credentials' : 'Verified LinkedIn credentials'}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Card */}
        <div className="lg:col-span-7 p-8 sm:p-10 flex flex-col justify-center space-y-6">
          <div>
            <h1 className="text-3xl font-semibold text-slate-900">
              {isAdmin ? 'Admin Sign In' : 'Sign in to CareerAI'}
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-1">
              {isAdmin
                ? 'Enter your admin credentials to access the console.'
                : 'Enter your credentials to access your internship dashboard.'}
            </p>
          </div>

          {/* Role Toggle */}
          <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1.5 rounded-2xl border border-slate-200/60">
            <button
              type="button"
              onClick={() => handleRoleChange('student')}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                !isAdmin ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <User className="w-4 h-4" />
              Student
            </button>
            <button
              type="button"
              onClick={() => handleRoleChange('admin')}
              className={`flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isAdmin ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Admin
            </button>
          </div>

          {/* Demo Credentials Box */}
          <div className="p-3.5 bg-indigo-50/80 border border-indigo-100 rounded-2xl text-xs space-y-1">
            <span className="font-bold text-indigo-900">
              {isAdmin ? 'Demo Admin Account:' : 'Demo Student Account:'}
            </span>
            <div className="text-indigo-700 font-mono text-[11px] flex flex-wrap gap-4">
              <span>Email: <strong>{isAdmin ? 'admin@careerai.in' : 'hari@example.com'}</strong></span>
              <span>Password: <strong>{isAdmin ? 'admin123' : 'careerai123'}</strong></span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs font-medium text-slate-900 outline-none"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-semibold text-slate-700">Password</label>
                <a href="#" className="text-xs font-bold text-indigo-600 hover:underline">Forgot password?</a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs font-medium text-slate-900 outline-none"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <span>{isLoading ? "Signing in..." : isAdmin ? "Sign In to Admin Console" : "Sign In to Dashboard"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {!isAdmin && (
            <p className="text-center text-xs text-slate-500">
              Don't have an account?{' '}
              <Link href="/register" className="font-bold text-indigo-600 hover:underline">
                Create an account
              </Link>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
