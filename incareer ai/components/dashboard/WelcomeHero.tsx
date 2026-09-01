'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, CreditCard, Calendar, ShieldCheck,Download } from 'lucide-react';
import { UserProfile } from '@/lib/types';

interface WelcomeHeroProps {
  user: UserProfile;
}

export const WelcomeHero: React.FC<WelcomeHeroProps> = ({ user }) => {
  return (
    <div className="relative w-full rounded-3xl text-white p-6 sm:p-8 lg:p-10 shadow-hero overflow-hidden border border-indigo-900/50">

      {/* Background Decorative Forest Image */}
      <div className="absolute inset-0 opacity-75 pointer-events-none overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/forest.jpg"
          alt=""
          aria-hidden="true"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Grid Layout: Stacked on mobile, 2-column on desktop */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

        {/* Left Column: Student Welcome */}
        <div className="lg:col-span-7 space-y-6">

          {/* Welcome Label */}
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wide text-indigo-200 bg-white/10 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-white/10">
            <span>Welcome Intern</span>
            <span className="animate-bounce">👋</span>
          </div>

          {/* Student Name & Domain Pill */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {user.name}
            </h1>
            <div className="inline-block">
              <span className="px-4 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-white/10 text-indigo-100 border border-white/15 backdrop-blur-md shadow-xs">
                {user.domain}
              </span>
            </div>
          </div>

        </div>

        {/* Right Column: Meta + Actions */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end pt-4 lg:pt-0">
          <div className="relative bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl p-6 sm:p-7 w-full max-w-[380px] shadow-2xl space-y-5">

            {/* Metadata Row: Intern ID, Joined Date, Status */}
            <div className="grid grid-cols-3 gap-4 text-center">
              {/* Intern ID */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="p-2 rounded-xl bg-white/10 border border-white/10 text-indigo-200">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-indigo-200/80 font-medium uppercase tracking-wide">Intern ID</p>
                  <p className="font-bold text-white tracking-wide text-[11px] sm:text-xs">{user.internId}</p>
                </div>
              </div>

              {/* Joined Date */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="p-2 rounded-xl bg-white/10 border border-white/10 text-indigo-200">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] text-indigo-200/80 font-medium uppercase tracking-wide">Joined On</p>
                  <p className="font-bold text-white text-[11px] sm:text-xs">{user.joinedOn}</p>
                </div>
              </div>

              {/* Status */}
              <div className="flex flex-col items-center gap-1.5">
                <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 block animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] text-indigo-200/80 font-medium uppercase tracking-wide">Status</p>
                  <p className="font-bold text-emerald-400 text-[11px] sm:text-xs">{user.status}</p>
                </div>
              </div>
            </div>

            {/* Vertical Divider */}
            <div className="border-t border-white/10" />

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Download Offer Letter */}
              <button
                onClick={() => alert("Downloading official CareerAI Offer Letter PDF...")}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-white text-slate-900 hover:bg-slate-100 shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                <Download className="w-5 h-5 text-indigo-600" />
                <span>Download Offer Letter</span>  
              </button>

              {/* Pay & Request */}
              <Link
                href="/dashboard/payments"
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs bg-white text-slate-900 hover:bg-slate-100 shadow-md transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
              >
                <CreditCard className="w-4 h-4 text-indigo-600" />
                <span>Pay & Request</span>
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
