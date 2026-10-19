'use client';

import React from 'react';
import Link from 'next/link';

export const MovableNoticeBanner: React.FC = () => {
  return (
    <div className="w-full bg-gradient-to-r from-red-700 via-[#990000] to-red-800 text-white py-2.5 overflow-hidden relative border-b border-red-900 shadow-md select-none">
      {/* Infinite Scrolling Ticker Rail */}
      <div className="flex items-center gap-8 animate-marquee whitespace-nowrap text-xs font-bold">
        {[1, 2, 3].map((key) => (
          <div key={key} className="flex items-center gap-8 shrink-0">
            
            <div className="flex items-center gap-2">
              <span className="text-yellow-300 animate-pulse text-sm">⚡</span>
              <span className="text-white font-black uppercase tracking-wider">
                Batch Selection Ends Soon! Enroll Now to Secure Your Domain.
              </span>
              <Link
                href="/register"
                className="ml-2 px-3 py-1 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-extrabold text-[11px] shadow-sm transition-transform hover:scale-105"
              >
                Apply Before Selection Closes
              </Link>
            </div>

            <span className="text-red-300 font-bold">•</span>

            <div className="flex items-center gap-2">
              <span className="text-amber-400 font-black text-sm">⚠️</span>
              <span className="text-amber-200 font-black uppercase tracking-wider">
                URGENT: Batch Starting Soon! Only 3 Seats Left Across All Domains.
              </span>
              <Link
                href="/register"
                className="ml-2 px-3 py-1 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-extrabold text-[11px] shadow-sm transition-transform hover:scale-105"
              >
                Apply Before Selection Closes
              </Link>
            </div>

            <span className="text-red-300 font-bold">•</span>

            <div className="flex items-center gap-2">
              <span className="text-yellow-300">⚡</span>
              <span className="text-white font-bold">
                September Batch Starting Soon! Apply before <strong className="underline text-yellow-300">SEPTEMBER 30</strong> • Instant Offer Letter • Verified Certificate
              </span>
            </div>

            <span className="text-red-300 font-bold">•</span>

          </div>
        ))}
      </div>
    </div>
  );
};
