'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Logo } from '@/components/common/Logo';
import { mockDomains } from '@/data/mockData';
import { Search, Sparkles, Clock, Signal, Award, FolderCheck, ArrowRight } from 'lucide-react';

export default function InternshipsPage() {
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Software Development', 'Data & AI', 'Security & Cloud', 'Design', 'Business'];

  const filtered = mockDomains.filter((domain) => {
    const matchesSearch = domain.title.toLowerCase().includes(search.toLowerCase()) ||
                          domain.description.toLowerCase().includes(search.toLowerCase());
    const matchesCat = selectedCategory === 'All' || domain.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="min-h-screen bg-background text-slate-900 font-sans flex flex-col antialiased">
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Logo href="/" />
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-xs font-bold text-slate-600 hover:text-indigo-600 px-3 py-2 rounded-xl"
            >
              Sign In
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              Go to Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Browse Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Banner */}
        <div className="bg-gradient-to-br from-[#0F0E38] via-[#17164B] to-[#1E1B4B] text-white p-8 sm:p-12 rounded-3xl shadow-xl space-y-4">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-200 bg-white/10 px-3 py-1 rounded-full border border-white/10">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Virtual Internship Catalog</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Find Your Virtual Internship
          </h1>
          <p className="text-xs sm:text-sm text-indigo-200 max-w-2xl">
            Choose from industry-structured virtual internships designed to build real projects, gain mentor insights, and earn verified LinkedIn credentials.
          </p>

          {/* Search Box */}
          <div className="relative max-w-xl pt-2">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-5" />
            <input
              type="text"
              placeholder="Search by role, skill, or domain (e.g., React, Python, UI/UX)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-xs font-semibold outline-none shadow-md"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Internship Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((domain) => (
            <div
              key={domain.id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
                    {domain.category}
                  </span>
                  {domain.popular && (
                    <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                      Popular ⭐
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-bold text-slate-900">{domain.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{domain.description}</p>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {domain.skills.map((s, i) => (
                    <span key={i} className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2.5 py-0.5 rounded-md">
                      {s}
                    </span>
                  ))}
                </div>

                {/* Details Meta */}
                <div className="grid grid-cols-3 gap-2 pt-4 border-t border-slate-100 text-center text-xs">
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <p className="text-[10px] text-slate-400 font-semibold">Duration</p>
                    <p className="font-bold text-slate-800">{domain.duration}</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <p className="text-[10px] text-slate-400 font-semibold">Mode</p>
                    <p className="font-bold text-slate-800">Virtual</p>
                  </div>
                  <div className="bg-slate-50 p-2 rounded-xl">
                    <p className="text-[10px] text-slate-400 font-semibold">Projects</p>
                    <p className="font-bold text-slate-800">{domain.projectCount}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Link
                  href="/dashboard"
                  className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
                >
                  <span>Enroll in Program</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  );
}
