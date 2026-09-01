'use client';

import React, { useState } from 'react';
import { DashboardNavbar } from '@/components/layout/DashboardNavbar';
import { mockPayment } from '@/data/mockData';
import { CreditCard, AlertTriangle, CheckCircle2, ShieldCheck, ArrowRight, Receipt, Loader2 } from 'lucide-react';

export default function PaymentsPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handlePay = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background text-slate-900 font-sans flex flex-col antialiased">
      <DashboardNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-card">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Payments & Invoices</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Payment Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Manage internship processing fees, task review invoices, and certification payments.
            </p>
          </div>
        </div>

        {/* Current Pending Invoice Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-8 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Receipt className="w-5 h-5 text-indigo-600" />
                <span>Pending Payment Overview</span>
              </h2>
              {isCompleted ? (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Paid
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" /> Pending
                </span>
              )}
            </div>

            {/* Warning Banner matching Certificate card */}
            {!isCompleted && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/90 text-amber-900 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>Payment Required to Submit Certificate Task</span>
                </div>
                <p className="text-xs text-amber-800 leading-relaxed">
                  You must complete the payment of ₹100 before you can submit the Certificate task and download your verified credentials.
                </p>
              </div>
            )}

            {/* Line items table */}
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold text-slate-900">{mockPayment.title}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Includes manual project code review, verified badge, and digital ID certificate.</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-extrabold text-slate-900">₹{mockPayment.amount}</p>
                  <p className="text-[11px] text-slate-400 font-semibold">One-time processing fee</p>
                </div>
              </div>
            </div>

            {/* Security Guarantee */}
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-500 font-medium">
              <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Encrypted SSL 256-bit secure mock checkout via UPI, Cards, Netbanking.</span>
            </div>
          </div>

          {/* Checkout Action Box */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200 shadow-card space-y-6">
            <h3 className="text-lg font-bold text-slate-900 border-b border-slate-100 pb-3">
              Order Summary
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Task Review Fee</span>
                <span className="font-semibold text-slate-900">₹100</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>GST / Taxes</span>
                <span className="font-semibold text-slate-900">₹0</span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between text-sm font-bold text-slate-900">
                <span>Total Amount Due</span>
                <span className="text-indigo-600 font-extrabold text-lg">₹100</span>
              </div>
            </div>

            {isCompleted ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <p className="text-sm font-bold text-emerald-900">Payment Successful!</p>
                <p className="text-xs text-emerald-700">Certificate task is now unlocked for submission.</p>
              </div>
            ) : (
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-50 transition-all"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing UPI Payment...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Pay ₹100 Now</span>
                  </>
                )}
              </button>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
