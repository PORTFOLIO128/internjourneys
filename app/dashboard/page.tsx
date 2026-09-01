'use client';

import React, { useState, useEffect } from 'react';
import { DashboardNavbar } from '@/components/layout/DashboardNavbar';
import { WelcomeHero } from '@/components/dashboard/WelcomeHero';
import { QuestLog } from '@/components/dashboard/QuestLog';
import { mockUser, mockTasks } from '@/data/mockData';
import { Task, UserProfile } from '@/lib/types';
import { getMockUser } from '@/lib/mockAuth';

export default function DashboardPage() {
  const [user, setUser] = useState<UserProfile>(mockUser);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);

  useEffect(() => {
    setUser(getMockUser());
  }, []);

  const handleTaskSubmit = (taskId: string, submissionUrl: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((t) =>
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
      {/* Top Navbar (No Sidebar) */}
      <DashboardNavbar />

      {/* Main Dashboard Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* 1. Welcome Hero */}
        <WelcomeHero user={user} />

        {/* 2. Quest Log Header & Task Grid (Immediately following Welcome Hero) */}
        <QuestLog tasks={tasks} onTaskSubmit={handleTaskSubmit} />
      </main>

      {/* Minimal Footer */}
      <footer className="border-t border-slate-200/80 bg-white py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-semibold">
            <span>© 2026 CareerAI. All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6 text-slate-500 font-medium">
            <a href="/help" className="hover:text-indigo-600">Help Center</a>
            <a href="#" className="hover:text-indigo-600">Privacy Policy</a>
            <a href="#" className="hover:text-indigo-600">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
