'use client';

import React, { useState } from 'react';
import { DashboardNavbar } from '@/components/layout/DashboardNavbar';
import { QuestLog } from '@/components/dashboard/QuestLog';
import { mockTasks } from '@/data/mockData';
import { Task } from '@/lib/types';
import { Search, CalendarDays } from 'lucide-react';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleTaskSubmit = (taskId: string, submissionUrl: string) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === taskId
          ? {
              ...t,
              status: 'Completed',
              submittedOnTrack: true,
              submissionUrl,
              bottomStatusText: 'Completed Successfully!',
            }
          : t
      )
    );
  };

  return (
    <div className="min-h-screen bg-background text-slate-900 font-sans flex flex-col antialiased">
      <DashboardNavbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Title & Search Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-card">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              <CalendarDays className="w-3.5 h-3.5" />
              <span>Internship Tasks</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Task Management Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Review task requirements, submit project URLs, and track submission progress.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs text-slate-900 outline-none transition-all"
            />
          </div>
        </div>

        {/* Quest Log Component */}
        <QuestLog tasks={filteredTasks} onTaskSubmit={handleTaskSubmit} />
      </main>
    </div>
  );
}
