'use client';

import React, { useState } from 'react';
import {
  FileCheck2,
  Check,
  X,
  Clock3,
  Search,
  Eye,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { adminApplications } from '@/data/adminMockData';
import { InternshipApplication, ApplicationStatus } from '@/lib/types';

const statusStyles: Record<ApplicationStatus, string> = {
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  'In Review': 'bg-sky-100 text-sky-700 border-sky-200',
  Approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Rejected: 'bg-rose-100 text-rose-700 border-rose-200',
};

export default function AdminApplicationsPage() {
  const [applications, setApplications] = useState<InternshipApplication[]>(adminApplications);
  const [filter, setFilter] = useState<'All' | ApplicationStatus>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const pendingCount = applications.filter((a) => a.status === 'Pending' || a.status === 'In Review').length;

  const filtered = applications.filter((a) => {
    const matchesFilter = filter === 'All' || a.status === filter;
    const matchesSearch =
      a.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.domain.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const updateStatus = (id: string, status: ApplicationStatus) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const filters: Array<'All' | ApplicationStatus> = ['All', 'Pending', 'In Review', 'Approved', 'Rejected'];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        icon={FileCheck2}
        badge="Application Review"
        title="Internship Applications"
        subtitle={`${pendingCount} application(s) awaiting review.`}
        action={
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by name or domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs text-slate-900 outline-none transition-all"
            />
          </div>
        }
      />

      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors border ${
              filter === f
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
            }`}
          >
            {f}
            {f !== 'All' && (
              <span className={`ml-1.5 ${filter === f ? 'text-indigo-200' : 'text-slate-400'}`}>
                {applications.filter((a) => a.status === f).length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                <th className="pb-3 pr-4">Applicant</th>
                <th className="pb-3 pr-4">Applied Domain</th>
                <th className="pb-3 pr-4">Applied On</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {a.studentInitials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{a.studentName}</p>
                        <p className="text-[11px] text-slate-500 font-medium truncate">{a.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-xs font-semibold text-slate-700">{a.domain}</td>
                  <td className="py-3.5 pr-4 text-xs text-slate-500 whitespace-nowrap">{a.appliedOn}</td>
                  <td className="py-3.5 pr-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${statusStyles[a.status]}`}>
                      {a.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {(a.status === 'Pending' || a.status === 'In Review') && (
                        <>
                          <button
                            onClick={() => updateStatus(a.id, 'Approved')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-colors"
                          >
                            <Check className="w-3.5 h-3.5" />
                            Approve
                          </button>
                          <button
                            onClick={() => updateStatus(a.id, 'Rejected')}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                            Reject
                          </button>
                        </>
                      )}
                      {a.status === 'Pending' && (
                        <button
                          onClick={() => updateStatus(a.id, 'In Review')}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white border border-sky-200 text-sky-600 hover:bg-sky-50 text-xs font-bold transition-colors"
                        >
                          <Clock3 className="w-3.5 h-3.5" />
                          Move to Review
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-10 text-center text-xs font-medium text-slate-400">
                    No applications match your filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Summary Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {(['Pending', 'In Review', 'Approved'] as ApplicationStatus[]).map((status) => {
          const count = applications.filter((a) => a.status === status).length;
          return (
            <div key={status} className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-card flex items-center gap-4">
              <div className={`p-2.5 rounded-2xl border ${
                status === 'Pending' ? 'bg-amber-50 border-amber-100 text-amber-600' :
                status === 'In Review' ? 'bg-sky-50 border-sky-100 text-sky-600' : 'bg-emerald-50 border-emerald-100 text-emerald-600'
              }`}>
                {status === 'Pending' ? <Clock3 className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </div>
              <div>
                <div className="text-2xl font-extrabold text-slate-900">{count}</div>
                <div className="text-xs font-semibold text-slate-500">{status}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
