'use client';

import React, { useState } from 'react';
import {
  Layers,
  ListTodo,
  Plus,
  Pencil,
  X,
  Check,
  Star,
  ExternalLink,
} from 'lucide-react';
import { AdminPageHeader } from '@/components/admin/AdminPageHeader';
import { mockDomains, mockTasks } from '@/data/mockData';
import { InternshipDomain, Task } from '@/lib/types';

const levelStyles: Record<InternshipDomain['level'], string> = {
  Beginner: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Intermediate: 'bg-amber-100 text-amber-700 border-amber-200',
  Advanced: 'bg-rose-100 text-rose-700 border-rose-200',
};

const taskStatusStyles: Record<Task['status'], string> = {
  Completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  Pending: 'bg-amber-100 text-amber-700 border-amber-200',
  Available: 'bg-sky-100 text-sky-700 border-sky-200',
};

export default function AdminDomainsTasksPage() {
  const [domains, setDomains] = useState<InternshipDomain[]>(mockDomains);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [activeDomain, setActiveDomain] = useState<string>(mockDomains[0].id);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tab, setTab] = useState<'domains' | 'tasks'>('domains');

  const togglePopular = (id: string) => {
    setDomains((prev) => prev.map((d) => (d.id === id ? { ...d, popular: !d.popular } : d)));
  };

  return (
    <div className="space-y-8">
      <AdminPageHeader
        icon={Layers}
        badge="Catalog Management"
        title="Domains & Tasks"
        subtitle="Manage internship domains and their associated task roadmaps."
        action={
          <div className="flex gap-2">
            <button
              onClick={() => setTab('domains')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-colors border ${
                tab === 'domains' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
              }`}
            >
              Domains ({domains.length})
            </button>
            <button
              onClick={() => setTab('tasks')}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-colors border ${
                tab === 'tasks' ? 'bg-indigo-600 text-white border-indigo-600 shadow-md' : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
              }`}
            >
              Tasks ({tasks.length})
            </button>
          </div>
        }
      />

      {/* DOMAINS TAB */}
      {tab === 'domains' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {domains.map((d) => (
              <div key={d.id} className="bg-white p-5 rounded-3xl border border-slate-200/90 shadow-card hover:shadow-card-hover transition-all">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900">{d.title}</h3>
                      {d.popular && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 border border-indigo-200">
                          <Star className="w-3 h-3 fill-indigo-600 text-indigo-600" /> Popular
                        </span>
                      )}
                    </div>
                    <span className={`inline-flex mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${levelStyles[d.level]}`}>
                      {d.level}
                    </span>
                  </div>
                  <button
                    onClick={() => togglePopular(d.id)}
                    className={`p-2 rounded-xl border transition-colors ${
                      d.popular ? 'bg-indigo-50 border-indigo-200 text-indigo-600' : 'bg-white border-slate-200 text-slate-400 hover:text-indigo-600 hover:border-indigo-300'
                    }`}
                    aria-label={d.popular ? 'Remove popular' : 'Mark popular'}
                  >
                    <Star className={`w-4 h-4 ${d.popular ? 'fill-indigo-600 text-indigo-600' : ''}`} />
                  </button>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed mt-3 line-clamp-2">{d.description}</p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
                  <span>{d.duration}</span>
                  <span className="flex items-center gap-1">
                    <ListTodo className="w-3.5 h-3.5 text-indigo-600" />
                    {d.projectCount} Projects
                  </span>
                </div>

                <div className="mt-3 flex flex-wrap gap-1.5">
                  {d.skills.slice(0, 3).map((s) => (
                    <span key={s} className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-50 text-slate-600 border border-slate-100">
                      {s}
                    </span>
                  ))}
                  {d.skills.length > 3 && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-slate-400">+{d.skills.length - 3}</span>
                  )}
                </div>

                <button
                  onClick={() => { setActiveDomain(d.id); setTab('tasks'); }}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-indigo-200 text-indigo-600 hover:bg-indigo-50 text-xs font-bold transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Manage Tasks
                </button>
              </div>
            ))}
          </div>

          <div className="bg-white p-6 rounded-3xl border border-dashed border-indigo-200 text-center">
            <button className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2.5 rounded-xl transition-colors">
              <Plus className="w-4 h-4" />
              Add New Domain
            </button>
          </div>
        </div>
      )}

      {/* TASKS TAB */}
      {tab === 'tasks' && (
        <div className="space-y-6">
          {/* Domain selector chips */}
          <div className="flex flex-wrap gap-2">
            {domains.map((d) => (
              <button
                key={d.id}
                onClick={() => setActiveDomain(d.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors border ${
                  activeDomain === d.id
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                }`}
              >
                {d.title}
              </button>
            ))}
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-card overflow-hidden">
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="text-lg font-bold text-slate-900">
                  {domains.find((d) => d.id === activeDomain)?.title} · Task Roadmap
                </h2>
                <p className="text-xs text-slate-500 font-medium mt-0.5">Define project tasks and requirements for this domain.</p>
              </div>
              <button className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors">
                <Plus className="w-4 h-4" />
                Add Task
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-slate-200 text-[11px] uppercase tracking-wider font-bold text-slate-400">
                    <th className="pb-3 pr-4">#</th>
                    <th className="pb-3 pr-4">Task Title</th>
                    <th className="pb-3 pr-4">Due</th>
                    <th className="pb-3 pr-4">Status</th>
                    <th className="pb-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((t) => (
                    <tr key={t.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/60 transition-colors">
                      <td className="py-3.5 pr-4">
                        <span className="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 text-xs font-extrabold">
                          {t.taskNumber}
                        </span>
                      </td>
                      <td className="py-3.5 pr-4">
                        <p className="text-sm font-bold text-slate-900">{t.title}</p>
                        <p className="text-[11px] text-slate-500 font-medium truncate max-w-[320px]">{t.description}</p>
                      </td>
                      <td className="py-3.5 pr-4 text-xs text-slate-500 whitespace-nowrap">{t.dueDate}</td>
                      <td className="py-3.5 pr-4">
                        <span className={`px-3 py-1 rounded-full text-[11px] font-bold border ${taskStatusStyles[t.status]}`}>
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right">
                        <button
                          onClick={() => setEditingTask(t)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:border-indigo-300 hover:text-indigo-700 transition-colors"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditingTask(null)}>
          <div
            className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Edit Task</h3>
              <button onClick={() => setEditingTask(null)} className="p-2 rounded-xl hover:bg-slate-50 text-slate-400" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Task Title</label>
                <input
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs font-medium text-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                <input
                  value={editingTask.dueDate}
                  onChange={(e) => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs font-medium text-slate-900 outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={editingTask.status}
                  onChange={(e) => setEditingTask({ ...editingTask, status: e.target.value as Task['status'] })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs font-medium text-slate-900 outline-none"
                >
                  <option>Completed</option>
                  <option>Pending</option>
                  <option>Available</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={editingTask.description}
                  onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs font-medium text-slate-900 outline-none resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    setTasks((prev) => prev.map((t) => (t.id === editingTask.id ? editingTask : t)));
                    setEditingTask(null);
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-colors"
                >
                  <Check className="w-4 h-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
