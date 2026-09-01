'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/common/Logo';
import { SmoothScrollProvider } from '@/components/common/SmoothScrollProvider';
import { mockDomains } from '@/data/mockData';
import {
  ArrowRight,
  Sparkles,
  CheckCircle2,
  BookOpen,
  Award,
  Layers,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Star,
  Users,
  Code2
} from 'lucide-react';

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const steps = [
    {
      step: '01',
      title: 'Choose an Internship',
      description: 'Select your target technical or creative domain from Full Stack to AI & Data Science.'
    },
    {
      step: '02',
      title: 'Get Your Internship Plan',
      description: 'Receive an instant offer letter and structured task roadmap with clear project guidelines.'
    },
    {
      step: '03',
      title: 'Build Real Projects',
      description: 'Develop portfolio-worthy web apps, REST APIs, and machine learning models.'
    },
    {
      step: '04',
      title: 'Earn Your Verified Credential',
      description: 'Submit your work, unlock verified certificate PDFs, and share badges on LinkedIn.'
    }
  ];

  const testimonials = [
    {
      name: 'Hari Narayan S',
      role: 'Full Stack Development Intern',
      content: 'The structured task roadmap helped me build 5 complete projects that got me noticed by recruiters on LinkedIn!',
      stars: 5
    },
    {
      name: 'Priya Sharma',
      role: 'Frontend Development Intern',
      content: 'CareerAI gave me clear guidelines for creating real apps instead of generic tutorials. Highly recommended for students!',
      stars: 5
    },
    {
      name: 'Anand Kumar',
      role: 'AI & Data Science Intern',
      content: 'The verified certificate verification ID added immediate credibility to my resume during campus placements.',
      stars: 5
    }
  ];

  const landingFaqs = [
    {
      q: 'Is CareerAI virtual internship recognized?',
      a: 'Yes! CareerAI provides structured, project-based virtual internships that issue verifiable credentials with unique certificate verification IDs.'
    },
    {
      q: 'Who can enroll in CareerAI virtual internships?',
      a: 'Students from any college, university, or background who want to build real software engineering and technology skills.'
    },
    {
      q: 'Are there any prerequisites for the tasks?',
      a: 'Each domain offers beginner to intermediate guidance with detailed requirements so you can learn as you build.'
    }
  ];

  return (
    <SmoothScrollProvider>
      <div className="min-h-screen bg-background text-slate-900 font-sans flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
        
        {/* Landing Navbar */}
        <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
            <Logo href="/" />

            {/* Nav links */}
            <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600">
              <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">How It Works</a>
              <a href="#domains" className="hover:text-indigo-600 transition-colors">Domains</a>
              <a href="#why-careerai" className="hover:text-indigo-600 transition-colors">Why CareerAI</a>
              <a href="#faq" className="hover:text-indigo-600 transition-colors">FAQ</a>
            </nav>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="text-xs font-bold text-slate-700 hover:text-indigo-600 px-3 py-2 rounded-xl transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/dashboard"
                className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-xl shadow-md transition-all hover:scale-102"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative pt-12 pb-20 md:pt-20 md:pb-28 overflow-hidden bg-gradient-to-b from-white via-indigo-50/30 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column Text */}
              <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-100 shadow-2xs">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>The Next-Gen Virtual Internship Platform</span>
                </div>

                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
                  Build Real Skills. <br />
                  <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 bg-clip-text text-transparent">
                    Get Real Internship Experience.
                  </span>
                </h1>

                <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  CareerAI helps students gain practical experience through structured virtual internships, real-world projects, mentor guidance, and verified credentials.
                </p>

                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                  <Link
                    href="/internships"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 transition-all hover:-translate-y-0.5"
                  >
                    <span>Explore Internships</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>

                  <a
                    href="#how-it-works"
                    className="inline-flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 font-bold text-xs sm:text-sm shadow-xs transition-colors"
                  >
                    <span>How It Works</span>
                  </a>
                </div>

                {/* Trust metrics */}
                <div className="pt-8 border-t border-slate-200/80 flex items-center justify-center lg:justify-start gap-8 text-xs text-slate-500 font-semibold">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Instant Offer Letter</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Verified LinkedIn Credentials</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual Product Card Mock */}
              <div className="lg:col-span-5 relative flex justify-center">
                <div className="relative w-full max-w-md bg-gradient-to-br from-[#0F0E38] to-[#1E1B4B] p-6 rounded-3xl shadow-2xl border border-indigo-900/50 text-white space-y-4">
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <Logo className="text-white" />
                    <span className="text-[10px] font-bold bg-emerald-500/20 text-emerald-400 px-2.5 py-0.5 rounded-full">Active Intern</span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] text-indigo-300">Welcome Intern 👋</p>
                    <h3 className="text-xl font-bold">Hari Narayan S</h3>
                    <span className="inline-block text-[10px] font-semibold bg-white/10 px-2.5 py-0.5 rounded-full">
                      Full Stack Development
                    </span>
                  </div>

                  {/* Task Mini Preview */}
                  <div className="p-3 bg-white/5 rounded-2xl border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold">Personal Portfolio Website</span>
                      <span className="text-[10px] text-emerald-400 font-bold">✓ Completed</span>
                    </div>
                    <p className="text-[11px] text-indigo-200/70">Build a full-stack personal portfolio to showcase your projects.</p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2">
                    <span className="text-indigo-200 font-medium">Internships Count</span>
                    <span className="font-extrabold text-white bg-indigo-600 px-3 py-1 rounded-xl">1 / 1 Completed</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="py-16 md:py-24 bg-white border-y border-slate-200/80">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">How CareerAI Works</h2>
              <p className="text-xs sm:text-sm text-slate-500 font-medium">
                Four simple steps to transform your academic knowledge into verifiable tech experience.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map((s, idx) => (
                <div key={idx} className="bg-slate-50 p-6 rounded-3xl border border-slate-200/90 space-y-3 relative hover:border-indigo-300 transition-colors">
                  <span className="text-3xl font-black text-indigo-600/30">{s.step}</span>
                  <h3 className="text-base font-bold text-slate-900">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{s.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Internship Domains Grid */}
        <section id="domains" className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Internship Domains</h2>
                <p className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  Explore available 4-week to 6-week virtual internship tracks.
                </p>
              </div>
              <Link href="/internships" className="text-xs font-bold text-indigo-600 hover:underline flex items-center gap-1">
                View All Catalog <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockDomains.slice(0, 6).map((d) => (
                <div key={d.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between">
                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                      {d.category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{d.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{d.description}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-100 mt-4 flex items-center justify-between text-xs font-semibold text-slate-600">
                    <span>{d.duration} • {d.projectCount} Projects</span>
                    <Link href="/dashboard" className="text-indigo-600 font-bold hover:underline">Enroll →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-16 md:py-24 bg-white border-t border-slate-200/80">
          <div className="max-w-4xl mx-auto px-4 space-y-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight text-center">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {landingFaqs.map((faq, idx) => (
                <div key={idx} className="border border-slate-200 rounded-2xl overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-4 text-left font-bold text-xs sm:text-sm text-slate-900 flex justify-between items-center"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? <ChevronUp className="w-4 h-4 text-indigo-600" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {openFaq === idx && (
                    <div className="px-4 pb-4 text-xs text-slate-600 bg-slate-50 border-t border-slate-100">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <Logo href="/" className="text-white" />
              <p className="text-xs text-slate-400">Build skills. Build projects. Build your career.</p>
              <div className="flex items-center gap-6 text-xs text-slate-400 font-medium">
                <Link href="/internships" className="hover:text-white">Internships</Link>
                <Link href="/help" className="hover:text-white">Help Center</Link>
                <Link href="/login" className="hover:text-white">Sign In</Link>
              </div>
            </div>
            <div className="border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
              © 2026 CareerAI. All rights reserved.
            </div>
          </div>
        </footer>

      </div>
    </SmoothScrollProvider>
  );
}
