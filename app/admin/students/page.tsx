'use client';

import React, { useState } from 'react';
import {
  Users,
  Search,
  Mail,
  Phone,
  GraduationCap,
  Building2,
  X,
  CheckCircle2,
  UserCog,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { adminStudents } from '@/data/adminMockData';
import { UserProfile } from '@/lib/types';

const statusStyles: Record<UserProfile['status'], string> = {
  Active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Completed: 'bg-sky-100 text-sky-700 border-sky-200',
  Inactive: 'bg-slate-100 text-slate-600 border-slate-200',
};

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<UserProfile[]>(adminStudents);
  const [searchQuery, setSearchQuery] = useState('');
  const [selected, setSelected] = useState<UserProfile | null>(null);

  const filtered = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.internId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.domain.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStatus = (internId: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.internId === internId
          ? { ...s, status: s.status === 'Active' ? 'Inactive' : 'Active' }
          : s
      )
    );
    setSelected((cur) => (cur && cur.internId === internId ? { ...cur, status: cur.status === 'Active' ? 'Inactive' : 'Active' } : cur));
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        icon={Users}
        badge="Student Management"
        title="Students"
        subtitle={`${students.length} students currently enrolled in the platform.`}
        action={
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search by name, ID or domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs text-slate-900 outline-none transition-all"
            />
          </div>
        }
      />

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                <th className="pb-3 pr-4">Student</th>
                <th className="pb-3 pr-4">Intern ID</th>
                <th className="pb-3 pr-4">Domain</th>
                <th className="pb-3 pr-4">College</th>
                <th className="pb-3 pr-4">Joined</th>
                <th className="pb-3 pr-4">Status</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.internId} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {s.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-slate-900 truncate">{s.name}</p>
                        <p className="text-[11px] text-slate-500 font-medium">{s.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-xs font-mono font-bold text-indigo-600">{s.internId}</td>
                  <td className="py-3.5 pr-4 text-xs font-semibold text-slate-700">{s.domain}</td>
                  <td className="py-3.5 pr-4 text-xs text-slate-500 max-w-[180px] truncate">{s.college}</td>
                  <td className="py-3.5 pr-4 text-xs text-slate-500 whitespace-nowrap">{s.joinedOn}</td>
                  <td className="py-3.5 pr-4">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${statusStyles[s.status]}`}>
                      {s.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => setSelected(s)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
                    >
                      <UserCog className="w-3.5 h-3.5" />
                      View
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-10 text-center text-xs font-medium text-slate-400">
                    No students match your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelected(null)}>
          <div
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-gradient-to-br from-[#0F0E38] to-[#1E1B4B] p-6 text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-white/10 border border-white/20 flex items-center justify-center font-bold text-lg">
                  {selected.initials}
                </div>
                <div>
                  <h3 className="text-lg font-extrabold">{selected.name}</h3>
                  <p className="text-xs text-indigo-200 font-semibold">{selected.domain}</p>
                  <p className="text-[11px] font-mono text-indigo-300 mt-0.5">{selected.internId}</p>
                </div>
              </div>
              <button onClick={() => setSelected(null)} className="p-2 rounded-xl hover:bg-white/10 text-indigo-200" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[11px] text-slate-400 font-semibold">Email</p>
                    <p className="text-xs font-semibold text-slate-900 truncate">{selected.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <p className="text-[11px] text-slate-400 font-semibold">Phone</p>
                    <p className="text-xs font-semibold text-slate-900">{selected.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <Building2 className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <p className="text-[11px] text-slate-400 font-semibold">College</p>
                    <p className="text-xs font-semibold text-slate-900">{selected.college}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <p className="text-[11px] text-slate-400 font-semibold">Graduation</p>
                    <p className="text-xs font-semibold text-slate-900">{selected.graduationYear}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold">Internships</p>
                  <p className="text-sm font-bold text-slate-900">{selected.completedInternships} / {selected.totalInternships} completed</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${statusStyles[selected.status]}`}>
                  {selected.status}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  onClick={() => setSelected(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => toggleStatus(selected.internId)}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {selected.status === 'Active' ? 'Deactivate Intern' : 'Activate Intern'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
