'use client';

import React from 'react';
import Link from 'next/link';
import { Calendar, CheckCircle2, AlertTriangle, ArrowRight, Linkedin, Award, FileCheck, CreditCard } from 'lucide-react';
import { Task } from '@/lib/types';
import { StatusBadge } from '@/components/common/StatusBadge';

interface TaskCardProps {
  task: Task;
  onOpenDetails?: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onOpenDetails }) => {
  const isCompleted = task.status === 'Completed';

  return (
    <div
      onClick={() => onOpenDetails && onOpenDetails(task)}
      className="relative flex flex-col justify-between bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-card cursor-pointer"
    >
      <div>
        {/* Top Header: Badge & Status */}
        <div className="flex items-center justify-between gap-2 mb-4">
          {/* Number / Icon Avatar */}
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100">
            {task.iconType === 'linkedin' ? (
              <Linkedin className="w-5 h-5 fill-indigo-600 text-indigo-600" />
            ) : task.iconType === 'cert' ? (
              <Award className="w-5 h-5 text-indigo-600" />
            ) : (
              <span>{task.taskNumber}</span>
            )}
          </div>

          {/* Status Badge */}
          <StatusBadge status={task.status} />
        </div>

        {/* Due Date & Submission Metadata */}
        <div className="space-y-1 mb-3 text-xs">
          <div className="flex items-center gap-1.5 font-semibold text-slate-600">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Due Date: <span className="text-slate-900 font-bold">{task.dueDate}</span></span>
          </div>

          {task.submittedOnTrack && (
            <div className="flex items-center gap-1.5 font-medium text-emerald-600">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Submitted on track</span>
            </div>
          )}
        </div>

        {/* Task Title */}
        <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-2 leading-snug">
          {task.title}
        </h3>

        {/* Task Description */}
        <p className="text-xs text-slate-600 leading-relaxed mb-4 line-clamp-3">
          {task.description}
        </p>

        {/* Key Features List (if available) */}
        {task.keyFeatures && task.keyFeatures.length > 0 && (
          <div className="mb-4 pt-3 border-t border-slate-100 space-y-1.5">
            <p className="text-[11px] font-bold tracking-wide uppercase text-slate-400">Key Features</p>
            <ul className="space-y-1">
              {task.keyFeatures.slice(0, 3).map((feat, idx) => (
                <li key={idx} className="text-xs text-slate-600 flex items-start gap-1.5">
                  <span className="text-indigo-500 font-bold">•</span>
                  <span className="truncate">{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Bottom Status / Action Box */}
      <div className="mt-4">
        {/* Completed State */}
        {isCompleted && (
          <div className="w-full py-2.5 px-3 rounded-xl bg-emerald-50 border border-emerald-200/80 text-emerald-700 font-bold text-xs flex items-center justify-center gap-2 shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Completed Successfully!</span>
          </div>
        )}

        {/* Payment Required State (Certificate Task) */}
        {task.paymentRequired && (
          <div className="space-y-3 p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-amber-900">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{task.paymentWarning}</span>
            </div>
            <p className="text-[11px] text-amber-700 leading-normal">
              {task.paymentDescription}
            </p>
            <Link
              href="/dashboard/payments"
              onClick={(e) => e.stopPropagation()}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs"
            >
              <CreditCard className="w-4 h-4" />
              <span>{task.bottomCtaText || "Go to Payment Tab"}</span>
            </Link>
          </div>
        )}

        {/* Normal Pending / Available Action State */}
        {!isCompleted && !task.paymentRequired && (
          <button className="w-full py-2.5 px-3 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs">
            <span>Submit Task</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
