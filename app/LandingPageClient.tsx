'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Logo } from '@/components/common/Logo';
import { CompanyLogosMarquee } from '@/components/common/CompanyLogosMarquee';
import { HowVirtualInternshipWorksSection } from '@/components/common/HowVirtualInternshipWorksSection';
import { SimpleDomainsSection } from '@/components/common/SimpleDomainsSection';
import { VerifyCertificateSection } from '@/components/common/VerifyCertificateSection';
import { LiveRegistrationToast } from '@/components/common/LiveRegistrationToast';
import { CountUpNumber } from '@/components/common/CountUpNumber';
import { getRollingBatchDate } from '@/utils/batchDate';
import {
  ArrowRight,
  FileText,
  ShieldCheck,
  Users,
  BarChart2,
  Activity,
  ChevronDown,
  ChevronUp,
  Clock,
  Menu,
  X,
} from 'lucide-react';

export default function LandingPageClient({
  initialBatchStartDate,
}: {
  initialBatchStartDate: string;
}) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [batchStartDate, setBatchStartDate] = useState(initialBatchStartDate);
  const shouldReduceMotion = useReducedMotion();

  // Keep the displayed date fresh while the page remains open.
  useEffect(() => {
    const updateBatchDate = () => setBatchStartDate(getRollingBatchDate());
    const dateUpdateInterval = window.setInterval(updateBatchDate, 60_000);
    return () => window.clearInterval(dateUpdateInterval);
  }, []);

  // Lock body scroll when mobile navigation drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Close mobile navigation drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileMenuOpen) {
        setMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [mobileMenuOpen]);

  const landingFaqs = [
    {
      q: 'Will my internship or certificate be recognized by my college or employer?',
      a: 'Recognition policies vary by institution and employer. InternJourneys provides structured project-based learning and certificates with verification IDs, but cannot guarantee that a particular college, university, employer, or government body will recognize them.'
    },
    {
      q: 'Who can enroll in InternJourneys virtual internships?',
      a: 'Students, freshers, and graduates from any university or background who want to build real software engineering skills.'
    },
    {
      q: 'How do I verify my Completion Certificate?',
      a: 'You can verify your certificate anytime using the Verify Cert section on this portal by entering your unique Certificate ID.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans flex flex-col antialiased selection:bg-blue-600 selection:text-white">

      {/* 1. MAIN HEADER NAVIGATION NAVBAR */}
      <header className="sticky top-0 z-40 border-b border-white/60 bg-white/70 shadow-[0_8px_24px_rgba(15,23,42,0.06)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center gap-6">
            <Logo href="/" />
          </div>

          {/* Desktop Center Navigation Links (Kept strictly intact) */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-extrabold text-slate-700">
            <a href="#how-it-works" className="nav-link hover:text-[#1d61ff]">How It Works</a>
            <a href="#domains" className="nav-link hover:text-[#1d61ff]">Domains</a>
            <a href="#workflow" className="nav-link hover:text-[#1d61ff]">Workflow</a>
            <a href="#verify-cert" className="nav-link hover:text-[#1d61ff]">Verify Cert</a>
            <a href="#faq" className="nav-link hover:text-[#1d61ff]">FAQ</a>
          </nav>

          {/* Desktop Right Action Buttons (Kept strictly intact) */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/login"
              aria-label="Sign in"
              className="nav-cta-secondary inline-flex items-center justify-center px-5 py-2.5 rounded-full border border-slate-300 text-xs font-extrabold text-slate-800 shadow-2xs"
            >
              <span>Sign In</span>
            </Link>

            <Link
              href="/internships"
              aria-label="Explore internships"
              className="nav-cta-primary inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#1d61ff] text-white font-extrabold text-xs shadow-md shadow-blue-500/20"
            >
              <span>Explore Internships</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Right Controls: [Get Started Now] [☰ Hamburger] (Mobile Only) */}
          <div className="flex lg:hidden items-center gap-2 sm:gap-3">
            <Link
              href="/register"
              className="nav-cta-primary inline-flex items-center justify-center px-3 py-2 sm:px-4 sm:py-2 rounded-full bg-[#1D61FF] text-white font-extrabold text-[11px] sm:text-xs shadow-sm shadow-blue-500/25 whitespace-nowrap"
            >
              Get Started Now
            </Link>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors focus-visible:outline-2 focus-visible:outline-[#1D61FF]"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <aside
        aria-label={`New batch starts ${batchStartDate}. Registration is open.`}
        className="batch-announcement relative z-30 overflow-hidden bg-gradient-to-r from-red-700 via-red-800 to-red-700 text-white shadow-sm"
      >
        <div className="batch-announcement__track flex w-max items-center whitespace-nowrap py-2 text-[11px] font-extrabold sm:text-xs">
          {[0, 1].map((copy) => (
            <div
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 items-center gap-4 pr-4 sm:gap-7 sm:pr-7"
            >
              <span className="uppercase tracking-wide">New Batch Starting</span>
              <span className="text-amber-300">IN 1 DAY</span>
              <span className="text-white/70">|</span>
              <time className="text-amber-200" suppressHydrationWarning>
                {batchStartDate}
              </time>
              <span className="text-white/70">|</span>
              <span>Registration Open</span>
              <Link
                href="/register"
                tabIndex={copy === 1 ? -1 : undefined}
                className="rounded-full bg-amber-300 px-3 py-1 font-black text-blue-950 transition-colors hover:bg-amber-200"
              >
                Get Started Free
              </Link>
            </div>
          ))}
        </div>
      </aside>

      {/* Mobile Navigation Drawer & Backdrop */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs lg:hidden"
              aria-hidden="true"
            />

            {/* Slide-out Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-xs bg-white shadow-2xl flex flex-col lg:hidden border-l border-slate-200"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile Navigation"
            >
              {/* Drawer Header */}
              <div className="h-20 px-6 border-b border-slate-100 flex items-center justify-between">
                <Logo href="/" subtitle={false} />
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Navigation Links */}
              <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-1 text-sm font-bold text-slate-700">
                {[
                  { label: 'Home', href: '/' },
                  { label: 'How It Works', href: '#how-it-works' },
                  { label: 'Domains', href: '#domains' },
                  { label: 'Workflow', href: '#workflow' },
                  { label: 'Verify Certificate', href: '#verify-cert' },
                  { label: 'FAQ', href: '#faq' },
                  { label: 'Sign In', href: '/login' },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-between py-3 px-3 rounded-xl hover:bg-blue-50/80 hover:text-[#1D61FF] transition-colors"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-4 h-4 text-slate-400" />
                  </a>
                ))}
              </nav>

              {/* Drawer Footer CTA */}
              <div className="p-6 border-t border-slate-100 space-y-3">
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-4 rounded-full bg-[#1D61FF] hover:bg-[#1650D4] text-white font-extrabold text-sm shadow-md shadow-blue-500/25 transition-all active:scale-95"
                >
                  <span>Get Started Now</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <p className="text-center text-[11px] text-slate-400 font-medium">
                  100% Free Verified Virtual Internship
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main id="main-content">
      {/* 3. HERO SECTION */}
      <section className="relative pt-8 pb-12 md:pt-14 md:pb-20 overflow-hidden bg-hero-curved-swoosh">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

            {/* Left Column Content */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">

              {/* Badge */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0, ease: 'easeOut' }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-[#E8EEFF] text-[#1D61FF] border border-[#CBDCFD] shadow-2xs will-change-transform"
              >
                <span className="text-base">🎓</span>
                <span>JOIN STUDENTS BUILDING FUTURE-READY SKILLS</span>
              </motion.div>

              {/* Headline */}
              <motion.h1
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.55, delay: 0.1, ease: 'easeOut' }}
                className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#0F172A] tracking-tight leading-[1.12] will-change-transform"
              >
                100% Free <span className="text-[#1D61FF]">Verified Virtual Internship</span> 2026 <br className="hidden sm:inline" />
                <span className="text-slate-800">| Pan-India</span>
              </motion.h1>

              {/* Dynamic Batch Announcement Pill */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2, ease: 'easeOut' }}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-blue-50/90 via-indigo-50/90 to-blue-50/90 text-blue-900 border border-blue-200/80 shadow-xs hover:shadow-sm transition-all will-change-transform"
              >
                <Clock className="w-3.5 h-3.5 text-[#1D61FF] animate-pulse shrink-0" />
                <span className="tracking-tight" suppressHydrationWarning>
                  New Batch Starts: <span className="font-extrabold text-[#1D61FF]">{batchStartDate}</span> | Registration Open
                </span>
              </motion.div>

              {/* Subtitle / Description */}
              <motion.p
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3, ease: 'easeOut' }}
                className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 font-medium leading-relaxed will-change-transform"
              >
                Apply free, learn free, and complete your virtual internship. Choose from available domains, get an instant offer letter, and build real project experience online with InternJourneys.
              </motion.p>

              {/* Action Buttons */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4, ease: 'easeOut' }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2"
              >
                <Link
                  href="/register"
                  className="group relative inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#1D61FF] hover:bg-[#1650D4] active:bg-[#1343B8] text-white font-extrabold text-sm shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-300 hover:scale-105 active:scale-95 overflow-hidden select-none"
                >
                  <span className="relative z-10">Get Started Now (It&apos;s Free)</span>
                  <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-200 group-hover:translate-x-1" />
                  <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/25 to-transparent pointer-events-none" />
                </Link>

                <a
                  href="#domains"
                  className="group inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-800 hover:text-[#1D61FF] border border-slate-200/90 hover:border-blue-300 font-extrabold text-sm shadow-xs hover:shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95 select-none"
                >
                  <span>Explore Domains</span>
                  <span className="text-[#1D61FF] font-bold transition-transform duration-200 group-hover:translate-x-1">→</span>
                </a>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={shouldReduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.36, ease: 'easeOut' }}
                className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-slate-600 font-bold"
              >
                <div className="flex items-center gap-2 bg-white/70 px-3.5 py-1.5 rounded-full border border-slate-200/70 shadow-2xs transition-transform hover:scale-105">
                  <ShieldCheck className="w-4 h-4 text-[#1D61FF]" />
                  <span>Verified Program</span>
                </div>
                <div className="flex items-center gap-2 bg-white/70 px-3.5 py-1.5 rounded-full border border-slate-200/70 shadow-2xs transition-transform hover:scale-105">
                  <FileText className="w-4 h-4 text-[#1D61FF]" />
                  <span>Instant Offer Letter</span>
                </div>
                <div className="flex items-center gap-2 bg-white/70 px-3.5 py-1.5 rounded-full border border-slate-200/70 shadow-2xs transition-transform hover:scale-105">
                  <Users className="w-4 h-4 text-[#1D61FF]" />
                  <span>100% Virtual</span>
                </div>
              </motion.div>

            </div>

            {/* Right Column Visual: User Provided Image with Annotations & Floating Elements */}
            <motion.div
              initial={shouldReduceMotion ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.65, delay: 0.2, ease: 'easeOut' }}
              className="lg:col-span-6 relative flex items-center justify-center"
            >

              <div className="absolute inset-0 bg-gradient-to-tr from-blue-100/50 via-indigo-100/40 to-blue-50 rounded-full blur-2xl transform scale-95 pointer-events-none" />

              <div className="relative w-full max-w-lg">

                {/* Provided Image of Student */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white transition-all duration-500 hover:shadow-blue-500/15">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/assets/hero-student.jpg"
                    alt="Student completing free verified virtual internship project online with InternJourneys"
                    className="w-full h-auto object-cover max-h-[460px]"
                  />
                  <div className="absolute inset-0 ring-1 ring-black/5 rounded-3xl pointer-events-none" />
                </div>

                {/* Hand-drawn style Annotation: "Learn Build Grow" */}
                <div className="absolute -top-6 left-6 sm:left-12 z-20 animate-float-gentle">
                  <div className="relative flex flex-col items-center">
                    <span className="font-serif italic font-bold text-lg sm:text-xl text-[#3B62F6] rotate-[-6deg] bg-white/95 px-3 py-1 rounded-2xl shadow-sm border border-blue-100">
                      Learn <br />
                      <span className="ml-3">Build</span> <br />
                      <span className="ml-6">Grow</span>
                    </span>
                    <svg className="w-12 h-10 text-[#3B62F6] ml-8 -mt-1" viewBox="0 0 60 50" fill="none">
                      <path
                        d="M10 5 C 25 25, 40 30, 50 42 M 42 42 L 52 44 L 48 34"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>

                {/* Floating Badge Card */}
                <div className="absolute top-10 -right-2 sm:-right-6 z-20 animate-float-slow">
                  <div className="bg-white/95 backdrop-blur-md p-4 rounded-2xl shadow-xl border border-slate-100 flex items-center gap-3.5 max-w-[200px] transition-transform hover:scale-105">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1D61FF] flex items-center justify-center font-bold shadow-2xs">
                      <BarChart2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[11px] text-slate-500 font-semibold leading-tight">Skills today</p>
                      <p className="text-xs sm:text-sm font-extrabold text-slate-900 leading-tight">
                        Better tomorrow
                      </p>
                    </div>
                  </div>
                </div>

              </div>

            </motion.div>

          </div>
        </div>
      </section>

      {/* 4. MOVABLE COMPANY LOGOS MARQUEE */}
      <section id="learning-areas" className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">
        <CompanyLogosMarquee />
      </section>

      {/* 5. PLATFORM TRUST METRICS SECTION */}
      <section className="relative overflow-hidden bg-[#F8FAFC] py-16 md:py-24 border-y border-slate-200/70">
        <div className="absolute inset-x-0 top-0 h-16 bg-[#2447A7]" />
        <div className="absolute right-[12%] top-0 h-16 w-96 rounded-bl-full bg-[#2F55BD]/50" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-9">
            <div className="relative overflow-hidden rounded-[28px] bg-white p-8 sm:p-10 lg:p-12 min-h-[300px] border border-slate-200/80 shadow-xl shadow-slate-200/70 flex flex-col items-center justify-center text-center">
              <div className="absolute -left-16 -top-16 h-52 w-52 rounded-full bg-blue-100/45 blur-3xl" />
              <div className="absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />
              <div className="relative z-10 space-y-5">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EDF3FF] text-[#1D61FF] text-[11px] font-extrabold tracking-wider uppercase">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.8)]" />
                  Platform Live
                </span>
                <div>
                  <div className="flex items-center justify-center gap-3">
                    <Activity className="hidden sm:block h-9 w-9 text-[#1D61FF]" />
                    <p className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight bg-gradient-to-r from-[#1D61FF] to-[#7C3AED] bg-clip-text text-transparent">
                      16
                    </p>
                  </div>
                  <h2 className="mt-3 text-sm sm:text-base font-extrabold text-slate-600 tracking-[0.22em] uppercase">
                    Internship Domains
                  </h2>
                </div>
                <p className="max-w-sm mx-auto text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
                  Career-focused tracks seeded from the Supabase domain catalog.
                </p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[28px] bg-white p-8 sm:p-10 lg:p-12 min-h-[300px] border border-slate-200/80 shadow-xl shadow-slate-200/70 flex flex-col items-center justify-center text-center">
              <div className="absolute -left-12 -top-12 h-56 w-56 rounded-full bg-emerald-100/50 blur-3xl" />
              <div className="absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent" />
              <div className="relative z-10 space-y-5">
                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#EDF3FF] text-[#1D61FF] text-[11px] font-extrabold tracking-wider uppercase">
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_14px_rgba(52,211,153,0.8)]" />
                  Verified Community
                </span>
                <div>
                  <div className="flex items-center justify-center gap-3">
                    <Users className="hidden sm:block h-9 w-9 text-emerald-500" />
                    <p className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight text-emerald-600">
                      <CountUpNumber target={159544} suffix="+" />
                    </p>
                  </div>
                  <h2 className="mt-3 text-sm sm:text-base font-extrabold text-slate-600 tracking-[0.22em] uppercase">
                    Active Interns
                  </h2>
                </div>
                <p className="max-w-sm mx-auto text-sm sm:text-base text-slate-500 font-medium leading-relaxed">
                  Students, freshers, and graduates building future-ready practical project experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW VIRTUAL INTERNSHIP WORKS SECTION (Image 4) */}
      <HowVirtualInternshipWorksSection />

      {/* 7. CLEAN INTERNSHIP DOMAINS SECTION (Images 2 & 3) */}
      <SimpleDomainsSection />

      {/* 8. VERIFY INTERNSHIP CERTIFICATE SECTION (Image 5) */}
      <VerifyCertificateSection />

      {/* 9. FAQ SECTION */}
      <section id="faq" className="bg-white border-t border-slate-200/80 py-16">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-center">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {landingFaqs.map((faq, idx) => (
              <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  aria-expanded={openFaq === idx}
                  aria-controls={`landing-faq-${idx}`}
                  className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex justify-between items-center bg-slate-50/50 hover:bg-slate-50"
                >
                  <span>{faq.q}</span>
                  {openFaq === idx ? <ChevronUp className="w-4 h-4 text-[#1D61FF]" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                <div
                  id={`landing-faq-${idx}`}
                  hidden={openFaq !== idx}
                  className="px-4 pb-4 text-xs text-slate-600 bg-white border-t border-slate-100 pt-3 leading-relaxed font-medium"
                >
                  {faq.a}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      </main>

      {/* 10. LIVE REGISTRATION TOAST POPUP (Bottom-Left Floating Message) */}
      <LiveRegistrationToast />

      {/* 11. FOOTER */}
      <footer className="border-t border-slate-200/80 bg-white py-8 text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center gap-1 sm:items-start">
            <Logo subtitle={false} />
            <span className="text-[10px] text-slate-400">InternJourneys · Proprietor: VADIVEL BHUVANESH · Pudukkottai district, Tamil Nadu, India</span>
            <a href="mailto:internjourney26@gmail.com" className="text-[10px] font-semibold text-indigo-600 hover:underline">
              internjourney26@gmail.com
            </a>
          </div>
          <nav aria-label="Footer navigation" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-3 font-semibold">
            <a href="#workflow" className="hover:text-[#1d61ff]">Workflow</a>
            <a href="#domains" className="hover:text-[#1d61ff]">Domains</a>
            <a href="#verify-cert" className="hover:text-[#1d61ff]">Verify Cert</a>
            <Link href="/about" className="hover:text-[#1d61ff]">About Us</Link>
            <Link href="/terms-and-conditions" className="hover:text-[#1d61ff]">Terms & Conditions</Link>
            <Link href="/privacy-policy" className="hover:text-[#1d61ff]">Privacy Policy</Link>
            <Link href="/refund-policy" className="hover:text-[#1d61ff]">Refund & Cancellation Policy</Link>
            <Link href="/contact" className="hover:text-[#1d61ff]">Contact Us</Link>
          </nav>
          <p className="text-slate-400">© 2026 InternJourneys. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
}
