'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, useReducedMotion } from 'framer-motion';
import { Logo } from '@/components/common/Logo';
import { useAuth } from '@/lib/authContext';
import { getActiveDomains } from '@/lib/supabase/queries';
import { ArrowRight, AlertCircle, User, Mail, Phone, GraduationCap, Layers, Lock, CheckCircle2, ShieldCheck, Zap } from 'lucide-react';
import { errorMessage } from '@/lib/errorMessage';

export default function RegisterPage() {
  return (
    <Suspense fallback={<RegisterFallback />}>
      <RegisterForm />
    </Suspense>
  );
}

const PERKS = [
  { icon: CheckCircle2, label: 'Instant Offer Letter on Registration' },
  { icon: ShieldCheck, label: '100% Free – No Credit Card Required' },
  { icon: Zap, label: 'Start Projects Immediately' },
];

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { register } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const [domains, setDomains] = useState<{ title: string; slug?: string }[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    graduationYear: '2026',
    domain: '',
    password: '',
    confirmPassword: '',
    agree: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const data = await getActiveDomains();
        if (Array.isArray(data) && data.length > 0) {
          const mapped = data.map((d) => ({ title: d.name, slug: d.slug }));
          const requestedDomain = searchParams.get('domain');
          const selected = mapped.find((d) => d.title === requestedDomain || d.slug === requestedDomain);
          setDomains(mapped);
          setFormData((prev) => ({ ...prev, domain: selected?.title || mapped[0]?.title || '' }));
        }
      } catch (err) {
        console.warn('Could not fetch domains from Supabase:', err);
      }
    };
    fetchDomains();
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = formData.email.trim().toLowerCase();
    if (!email.endsWith('@gmail.com')) {
      setError('Please enter a valid Gmail address (must end with @gmail.com).');
      return;
    }
    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (phoneDigits.length !== 10) {
      setError('Mobile number must be exactly 10 digits.');
      return;
    }
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password || 'careerai123',
        phone: formData.phone,
        college: formData.college,
        graduation_year: formData.graduationYear,
        domain: formData.domain,
      });
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(errorMessage(err, 'Registration failed. Please try again.'));
      setIsLoading(false);
    }
  };

  const fadeUp = (delay = 0) =>
    shouldReduceMotion
      ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
      : {
          initial: { opacity: 0, y: 18 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.5, delay, ease: 'easeOut' },
        };

  const inputCls =
    'w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-[#1D61FF] focus:ring-2 focus:ring-[#1D61FF]/15 text-xs font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 bg-slate-50 focus:bg-white';

  const fields = [
    { id: 'register-name', label: 'Full Name', type: 'text', icon: User, key: 'name', placeholder: 'Hari Narayan S' },
    { id: 'register-email', label: 'Email Address (Gmail)', type: 'email', icon: Mail, key: 'email', placeholder: 'hari@gmail.com' },
    { id: 'register-password', label: 'Password', type: 'password', icon: Lock, key: 'password', placeholder: '••••••••' },
    { id: 'register-confirm-password', label: 'Confirm Password', type: 'password', icon: Lock, key: 'confirmPassword', placeholder: '••••••••' },
    { id: 'register-phone', label: 'Mobile Number', type: 'tel', icon: Phone, key: 'phone', placeholder: '9876543210' },
    { id: 'register-college', label: 'College / University', type: 'text', icon: GraduationCap, key: 'college', placeholder: 'IIT / Anna University' },
  ];

  return (
    <main
      id="main-content"
      className="min-h-screen flex flex-col items-center justify-center antialiased relative overflow-hidden py-8 px-4"
      style={{
        background: 'linear-gradient(135deg, #0f0e38 0%, #17164b 40%, #1a2a6c 70%, #1d61ff22 100%)',
      }}
    >
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[500px] h-[500px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #1d61ff 0%, transparent 70%)', animation: 'blob-spin 18s ease-in-out infinite' }} />
        <div className="absolute bottom-0 -left-40 w-[600px] h-[600px] rounded-full opacity-15"
          style={{ background: 'radial-gradient(circle, #7c3aed 0%, transparent 70%)', animation: 'blob-spin 24s ease-in-out infinite reverse' }} />
      </div>

      <div className="relative z-10 w-full max-w-2xl">
        {/* Logo on mobile */}
        <motion.div {...fadeUp(0)} className="flex justify-center mb-5">
          <Logo href="/" className="text-white" />
        </motion.div>

        {/* Mobile trust strip */}
        <motion.div {...fadeUp(0.05)} className="flex flex-wrap justify-center gap-3 mb-5">
          {PERKS.map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-[10px] font-semibold text-indigo-200">
              <Icon className="w-3 h-3 text-emerald-400" />
              <span>{label}</span>
            </div>
          ))}
        </motion.div>

        <motion.div
          {...(shouldReduceMotion
            ? { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.3 } }
            : { initial: { opacity: 0, scale: 0.97 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.5, ease: 'easeOut', delay: 0.08 } }
          )}
          className="bg-white/95 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl p-7 sm:p-10 space-y-6"
        >
          {/* Header */}
          <motion.div {...fadeUp(0.12)} className="space-y-1 pb-4 border-b border-slate-100">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Create your account 🚀
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Join thousands of students completing free verified virtual internships.
            </p>
          </motion.div>

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-xs font-semibold text-rose-700 flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}

          <motion.form {...fadeUp(0.18)} onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {fields.map(({ id, label, type, icon: Icon, key, placeholder }) => (
                <div key={id} className="space-y-1">
                  <label htmlFor={id} className="block text-xs font-semibold text-slate-700">
                    {label}
                  </label>
                  <div className="relative group">
                    <Icon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 transition-colors group-focus-within:text-[#1D61FF]" />
                    <input
                      id={id}
                      type={type}
                      required
                      placeholder={placeholder}
                      value={formData[key as keyof typeof formData] as string}
                      onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
                      {...(id === 'register-email' ? { pattern: '[^@]*@gmail\\.com', title: 'Please enter a valid Gmail address ending with @gmail.com' } : {})}
                      {...(id === 'register-phone' ? { pattern: '[0-9]{10}', maxLength: 10, title: 'Mobile number must be exactly 10 digits' } : {})}
                      className={`${inputCls} pl-10`}
                    />
                  </div>
                </div>
              ))}

              {/* Graduation Year */}
              <div className="space-y-1">
                <label htmlFor="register-graduation-year" className="block text-xs font-semibold text-slate-700">
                  Graduation Year
                </label>
                <div className="relative group">
                  <GraduationCap className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 transition-colors group-focus-within:text-[#1D61FF]" />
                  <select
                    id="register-graduation-year"
                    value={formData.graduationYear}
                    onChange={(e) => setFormData({ ...formData, graduationYear: e.target.value })}
                    className={`${inputCls} pl-10 appearance-none`}
                  >
                    {['2025', '2026', '2027', '2028'].map((y) => <option key={y}>{y}</option>)}
                  </select>
                </div>
              </div>

              {/* Domain */}
              <div className="space-y-1">
                <label htmlFor="register-domain" className="block text-xs font-semibold text-slate-700">
                  Internship Domain
                </label>
                <div className="relative group">
                  <Layers className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 transition-colors group-focus-within:text-[#1D61FF]" />
                  <select
                    id="register-domain"
                    value={formData.domain}
                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                    className={`${inputCls} pl-10 appearance-none`}
                  >
                    {domains.map((d) => (
                      <option key={d.slug || d.title} value={d.title || d.slug}>
                        {d.title || d.slug}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2.5 pt-1 text-xs text-slate-600">
              <input
                type="checkbox"
                id="agree"
                checked={formData.agree}
                onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                className="mt-0.5 rounded text-[#1D61FF] focus:ring-[#1D61FF]/30 border-slate-300"
              />
              <label htmlFor="agree" className="leading-relaxed">
                I agree to the{' '}
                <Link href="/terms-and-conditions" className="font-semibold text-[#1D61FF] hover:underline">Terms & Conditions</Link>
                {' '}and{' '}
                <Link href="/privacy-policy" className="font-semibold text-[#1D61FF] hover:underline">Privacy Policy</Link>.
              </label>
            </div>

            {/* Submit */}
            <motion.button
              type="submit"
              disabled={isLoading}
              whileHover={shouldReduceMotion ? {} : { scale: 1.02 }}
              whileTap={shouldReduceMotion ? {} : { scale: 0.97 }}
              className="w-full py-3.5 px-4 rounded-xl bg-[#1D61FF] hover:bg-[#1650D4] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-500/25 transition-colors disabled:opacity-50 group overflow-hidden relative"
            >
              <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none" />
              <span className="relative z-10">
                {isLoading ? 'Creating Account & Generating Offer Letter…' : 'Create InternJourneys Account'}
              </span>
              {!isLoading
                ? <ArrowRight className="w-4 h-4 relative z-10 transition-transform group-hover:translate-x-1" />
                : <svg className="w-4 h-4 animate-spin relative z-10" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
              }
            </motion.button>
          </motion.form>

          <motion.p {...fadeUp(0.25)} className="text-center text-xs text-slate-500">
            Already have an account?{' '}
            <Link href="/login" className="font-bold text-[#1D61FF] hover:underline">Sign In</Link>
          </motion.p>
        </motion.div>
      </div>
    </main>
  );
}

function RegisterFallback() {
  return (
    <main
      id="main-content"
      className="min-h-screen flex flex-col items-center justify-center antialiased p-4"
      style={{ background: 'linear-gradient(135deg, #0f0e38 0%, #17164b 40%, #1a2a6c 70%, #1d61ff22 100%)' }}
    >
      <div className="w-full max-w-2xl bg-white/95 rounded-3xl shadow-2xl p-10 flex items-center gap-3 text-xs text-slate-500 font-medium">
        <svg className="w-4 h-4 animate-spin text-[#1D61FF]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
        </svg>
        Loading registration form…
      </div>
    </main>
  );
}
