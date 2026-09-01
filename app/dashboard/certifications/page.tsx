'use client';

import React, { useState } from 'react';
import { DashboardNavbar } from '@/components/layout/DashboardNavbar';
import { mockUser, mockCertificate } from '@/data/mockData';
import { Award, ShieldCheck, Linkedin, Download, AlertTriangle, ExternalLink, CheckCircle2, Lock } from 'lucide-react';
import Link from 'next/link';

export default function CertificationsPage() {
  const [isPaid, setIsPaid] = useState(false); // Can be unlocked via payments page

  return (
    <div className="min-h-screen bg-background text-slate-900 font-sans flex flex-col antialiased">
      <DashboardNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-card">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              <Award className="w-3.5 h-3.5" />
              <span>Verified Credentials</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Certifications & Credential Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              View your verified internship certificate, share credentials on LinkedIn, and verify authenticity.
            </p>
          </div>
        </div>

        {/* Payment Warning Notice if not paid */}
        {!isPaid && (
          <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200/90 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
            <div className="flex items-start gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 shrink-0">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-amber-900">Task Review & Certificate Fee Pending</h3>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Your internship tasks are 100% completed! To issue your verified certificate PDF and unlock LinkedIn sharing, please process the nominal review fee of ₹100.
                </p>
              </div>
            </div>
            <Link
              href="/dashboard/payments"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-bold text-xs shadow-md whitespace-nowrap transition-all"
            >
              <span>Pay & Unlock Certificate</span>
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Certificate Card Mock Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Certificate Frame Display */}
          <div className="lg:col-span-8 bg-white p-8 sm:p-12 rounded-3xl border-2 border-indigo-100 shadow-2xl relative overflow-hidden">
            
            {/* Watermark / Background Ornament */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-indigo-50 rounded-full blur-3xl opacity-60 pointer-events-none" />

            <div className="relative border-4 border-indigo-900/10 p-8 rounded-2xl space-y-8 text-center bg-gradient-to-b from-white to-slate-50/50">
              
              {/* Header */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-6">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                    CA
                  </div>
                  <span className="text-lg font-bold tracking-tight text-slate-900">
                    career<span className="text-indigo-600">ai</span>
                  </span>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>VERIFIED CERTIFICATE</span>
                </div>
              </div>

              {/* Body */}
              <div className="space-y-4 py-4">
                <p className="text-xs uppercase tracking-widest font-extrabold text-slate-400">
                  Certificate of Internship Completion
                </p>
                <p className="text-xs text-slate-500">This is proudly presented to</p>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight underline decoration-indigo-500 underline-offset-8">
                  {mockUser.name}
                </h2>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed pt-2">
                  for successfully completing the intensive 4-week virtual internship in <strong>{mockUser.domain}</strong> and delivering all required industry-grade software projects.
                </p>
              </div>

              {/* Certificate Metadata Footer */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-200 pt-6 text-xs text-slate-500">
                <div className="text-left space-y-1">
                  <p className="font-semibold text-slate-700">Certificate ID: <span className="font-mono text-indigo-600 font-bold">{mockCertificate.certId}</span></p>
                  <p>Issue Date: <strong>{mockCertificate.issueDate}</strong></p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl bg-slate-900 text-white p-2 flex flex-col items-center justify-center text-[9px] font-mono text-center leading-tight">
                    <span>QR</span>
                    <span>VERIFY</span>
                  </div>
                </div>
              </div>

              {/* Overlay Lock blur if not paid */}
              {!isPaid && (
                <div className="absolute inset-0 bg-white/75 backdrop-blur-xs flex flex-col items-center justify-center p-6 text-center z-10">
                  <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3 shadow-md">
                    <Lock className="w-7 h-7" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Certificate Locked</h3>
                  <p className="text-xs text-slate-600 max-w-xs mt-1 mb-4">
                    Complete the task review payment to download high-resolution PDF & share directly on LinkedIn.
                  </p>
                  <Link
                    href="/dashboard/payments"
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
                  >
                    Go to Payments (₹100)
                  </Link>
                </div>
              )}
            </div>

          </div>

          {/* Certificate Actions Sidebar */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Certificate Actions
            </h3>

            {/* Verification Link */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                Verification Link
              </label>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-indigo-600 break-all">
                {mockCertificate.verificationUrl}
              </div>
            </div>

            {/* Buttons */}
            <div className="space-y-3 pt-2">
              <button
                disabled={!isPaid}
                onClick={() => alert("Downloading verified PDF certificate...")}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Res PDF</span>
              </button>

              <button
                disabled={!isPaid}
                onClick={() => window.open("https://linkedin.com", "_blank")}
                className="w-full py-3 px-4 rounded-xl bg-[#0A66C2] hover:bg-[#084e96] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <Linkedin className="w-4 h-4 fill-white" />
                <span>Share Certificate on LinkedIn</span>
              </button>
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}
