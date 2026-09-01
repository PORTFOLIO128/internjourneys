'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Users,
  UserCheck,
  GraduationCap,
  FileCheck2,
  IndianRupee,
  Clock3,
  BadgeCheck,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { StatCard } from '@/components/admin/StatCard';
import { adminStats, adminApplications } from '@/data/adminMockData';
import { adminNavItems } from '@/components/layout/AdminSidebar';

export default function AdminDashboardPage() {
  const recentApplications = adminApplications.slice(0, 5);

  return (
    <div className="space-y-8">
      <AdminPageHeader
        icon={LayoutDashboard}
        badge="Platform Overview"
        title="Admin Dashboard"
      />

      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Students" value={adminStats.totalStudents} accent="indigo" />
        <StatCard icon={UserCheck} label="Active Interns" value={adminStats.activeInterns} accent="sky" />
        <StatCard icon={GraduationCap} label="Completed Interns" value={adminStats.completedInterns} accent="emerald" />
        <StatCard icon={FileCheck2} label="Pending Applications" value={adminStats.pendingApplications} accent="amber" />
      </div>

      {/* Revenue + More stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        <StatCard icon={IndianRupee} label="Total Revenue" value={`₹${adminStats.totalRevenue.toLocaleString('en-IN')}`} accent="indigo" sub={`₹${adminStats.pendingRevenue.toLocaleString('en-IN')} pending`} />
        <StatCard icon={Clock3} label="Pending Payments" value={adminStats.pendingPayments} accent="amber" />
        <StatCard icon={BadgeCheck} label="Certificates Issued" value={adminStats.issuedCertificates} accent="emerald" />
        <StatCard icon={TrendingUp} label="Total Applications" value={adminStats.totalApplications} accent="sky" />
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-card">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {adminNavItems.slice(1).map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="group flex items-center gap-3 p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all"
              >
                <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 transition-colors">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 leading-tight">{item.label}</p>
                  <p className="text-[11px] text-slate-500 font-medium mt-0.5">Manage & review</p>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
              </Link>
            );
          })}
        </div>
      </div>

    </div>
  );
}
