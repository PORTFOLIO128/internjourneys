'use client';

import React, { useState } from 'react';
import { Task } from '@/lib/types';
import { Modal } from '@/components/common/Modal';
import { StatusBadge } from '@/components/common/StatusBadge';
import { Calendar, CheckCircle2, AlertTriangle, Link as LinkIcon, Upload, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface TaskDetailModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onTaskSubmit?: (taskId: string, submissionUrl: string) => void;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onTaskSubmit,
}) => {
  const [submissionUrl, setSubmissionUrl] = useState(task.submissionUrl || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successToast, setSuccessToast] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionUrl.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessToast(true);
      if (onTaskSubmit) {
        onTaskSubmit(task.id, submissionUrl);
      }
      setTimeout(() => {
        setSuccessToast(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task.title} maxWidth="max-w-2xl">
      <div className="space-y-6">
        
        {/* Status Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500">Status:</span>
            <StatusBadge status={task.status} />
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Calendar className="w-4 h-4 text-slate-400" />
            <span>Due Date: <strong className="text-slate-900">{task.dueDate}</strong></span>
          </div>
        </div>

        {/* Task Description */}
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
          <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
            {task.description}
          </p>
        </div>

        {/* Key Features / Requirements */}
        {task.keyFeatures && task.keyFeatures.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Project Requirements</h4>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2">
              {task.keyFeatures.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Payment Required Warning Case */}
        {task.paymentRequired ? (
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-amber-900">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <span>{task.paymentWarning}</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              {task.paymentDescription}
            </p>
            <Link
              href="/dashboard/payments"
              onClick={onClose}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors"
            >
              <span>Go to Payments Tab</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : task.status === 'Completed' ? (
          /* Completed Submission View */
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2">
            <div className="flex items-center gap-2 text-sm font-bold text-emerald-800">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Task Submission Completed</span>
            </div>
            {task.submissionUrl && (
              <p className="text-xs text-emerald-700 font-medium break-all">
                Submitted URL: <a href={task.submissionUrl} target="_blank" rel="noreferrer" className="underline">{task.submissionUrl}</a>
              </p>
            )}
          </div>
        ) : (
          /* Submission Form */
          <form onSubmit={handleSubmit} className="space-y-4 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Submit Project Deliverable</h4>
            
            {/* Input URL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project / Repository URL
              </label>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="url"
                  required
                  placeholder="https://github.com/your-username/project-repo"
                  value={submissionUrl}
                  onChange={(e) => setSubmissionUrl(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 text-xs text-slate-900 font-medium outline-none transition-all"
                />
              </div>
            </div>

            {/* Drag & Drop Mock Area */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Project Screenshots / Documentation (Optional)
              </label>
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-indigo-400 bg-slate-50/50 transition-colors cursor-pointer">
                <Upload className="w-6 h-6 text-slate-400 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">Drag & drop your files here, or <span className="text-indigo-600">browse</span></p>
                <p className="text-[11px] text-slate-400 mt-1">ZIP, PDF, PNG up to 25MB</p>
              </div>
            </div>

            {/* Submit CTA */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md disabled:opacity-50 transition-all"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Work...</span>
                  </>
                ) : (
                  <>
                    <span>Submit Work</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Success Feedback Toast */}
        {successToast && (
          <div className="p-3 bg-emerald-600 text-white rounded-xl text-xs font-bold text-center animate-in fade-in duration-200">
            🎉 Task submitted successfully! Your submission status is now updated.
          </div>
        )}

      </div>
    </Modal>
  );
};
