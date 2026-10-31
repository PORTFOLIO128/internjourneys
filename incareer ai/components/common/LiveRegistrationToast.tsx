'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';

export interface StudentActivityItem {
  id: number;
  name: string;
  initials: string;
  city: string;
  domain: string;
  timeAgo: string;
}

// Pool of 30 pan-India student application activities across diverse domains and cities
export const ACTIVITY_POOL: StudentActivityItem[] = [
  { id: 1, name: 'Megha R.', initials: 'MR', city: 'Delhi', domain: 'App Development', timeAgo: 'Just now' },
  { id: 2, name: 'Arun K.', initials: 'AK', city: 'Chennai', domain: 'Data Analytics', timeAgo: '1 min ago' },
  { id: 3, name: 'Priya S.', initials: 'PS', city: 'Bengaluru', domain: 'Generative AI', timeAgo: '2 mins ago' },
  { id: 4, name: 'Rohan M.', initials: 'RM', city: 'Pune', domain: 'Full Stack Development', timeAgo: 'Just now' },
  { id: 5, name: 'Sneha P.', initials: 'SP', city: 'Mumbai', domain: 'UI/UX Design', timeAgo: '3 mins ago' },
  { id: 6, name: 'Vikram N.', initials: 'VN', city: 'Hyderabad', domain: 'Cloud & DevOps', timeAgo: '1 min ago' },
  { id: 7, name: 'Ananya B.', initials: 'AB', city: 'Kolkata', domain: 'Python Development', timeAgo: '4 mins ago' },
  { id: 8, name: 'Karthik V.', initials: 'KV', city: 'Coimbatore', domain: 'Cyber Security', timeAgo: 'Just now' },
  { id: 9, name: 'Divya T.', initials: 'DT', city: 'Jaipur', domain: 'Data Science', timeAgo: '2 mins ago' },
  { id: 10, name: 'Aditya S.', initials: 'AS', city: 'Ahmedabad', domain: 'Web Development', timeAgo: '1 min ago' },
  { id: 11, name: 'Neha G.', initials: 'NG', city: 'Chandigarh', domain: 'AI & Machine Learning', timeAgo: '3 mins ago' },
  { id: 12, name: 'Manoj C.', initials: 'MC', city: 'Kochi', domain: 'Frontend Development', timeAgo: 'Just now' },
  { id: 13, name: 'Pooja L.', initials: 'PL', city: 'Lucknow', domain: 'Backend Development', timeAgo: '2 mins ago' },
  { id: 14, name: 'Siddharth D.', initials: 'SD', city: 'Indore', domain: 'Generative AI', timeAgo: '1 min ago' },
  { id: 15, name: 'Kavya M.', initials: 'KM', city: 'Mysuru', domain: 'Full Stack Development', timeAgo: 'Just now' },
  { id: 16, name: 'Harish R.', initials: 'HR', city: 'Madurai', domain: 'Python Automation', timeAgo: '3 mins ago' },
  { id: 17, name: 'Aishwarya J.', initials: 'AJ', city: 'Bhopal', domain: 'Data Analytics', timeAgo: '2 mins ago' },
  { id: 18, name: 'Naveen K.', initials: 'NK', city: 'Visakhapatnam', domain: 'Cloud Computing', timeAgo: '1 min ago' },
  { id: 19, name: 'Shreya V.', initials: 'SV', city: 'Nagpur', domain: 'UI/UX Design', timeAgo: '4 mins ago' },
  { id: 20, name: 'Abhishek J.', initials: 'AJ', city: 'Patna', domain: 'Cyber Security', timeAgo: 'Just now' },
  { id: 21, name: 'Deepika R.', initials: 'DR', city: 'Guwahati', domain: 'Data Science', timeAgo: '2 mins ago' },
  { id: 22, name: 'Suresh B.', initials: 'SB', city: 'Thiruvananthapuram', domain: 'App Development', timeAgo: '1 min ago' },
  { id: 23, name: 'Swathi N.', initials: 'SN', city: 'Mangaluru', domain: 'AI & Machine Learning', timeAgo: '3 mins ago' },
  { id: 24, name: 'Gaurav K.', initials: 'GK', city: 'Varanasi', domain: 'Web Development', timeAgo: 'Just now' },
  { id: 25, name: 'Bhavna T.', initials: 'BT', city: 'Surat', domain: 'Frontend Development', timeAgo: '2 mins ago' },
  { id: 26, name: 'Rahul V.', initials: 'RV', city: 'Ranchi', domain: 'Backend Development', timeAgo: '1 min ago' },
  { id: 27, name: 'Tanvi M.', initials: 'TM', city: 'Dehradun', domain: 'Generative AI', timeAgo: 'Just now' },
  { id: 28, name: 'Pranav H.', initials: 'PH', city: 'Nashik', domain: 'Python Development', timeAgo: '3 mins ago' },
  { id: 29, name: 'Ishita S.', initials: 'IS', city: 'Bhubaneswar', domain: 'Data Analytics', timeAgo: '2 mins ago' },
  { id: 30, name: 'Varun P.', initials: 'VP', city: 'Noida', domain: 'Full Stack Development', timeAgo: 'Just now' },
];

const SESSION_STORAGE_KEY = 'internjourneys_activity_dismissed';

export const LiveRegistrationToast: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(true);
  const lastIndexRef = useRef<number>(-1);
  const shouldReduceMotion = useReducedMotion();

  // Check sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const dismissed = sessionStorage.getItem(SESSION_STORAGE_KEY);
      if (!dismissed) {
        setIsDismissed(false);
        // Initial delay before first popup appears
        const initialTimer = setTimeout(() => {
          setIsVisible(true);
        }, 1500);
        return () => clearTimeout(initialTimer);
      }
    }
  }, []);

  // Notification rotation loop: visible for ~4s, hidden for ~2.5s (cycle ~6.5s)
  useEffect(() => {
    if (isDismissed) return;

    let hideTimer: NodeJS.Timeout;
    let nextTimer: NodeJS.Timeout;

    if (isVisible) {
      // Keep visible for ~4 seconds
      hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 4200);
    } else {
      // Wait ~2.5 seconds before showing next notification
      nextTimer = setTimeout(() => {
        // Pick next index avoiding consecutive repeat
        setCurrentIndex((prev) => {
          let next = Math.floor(Math.random() * ACTIVITY_POOL.length);
          if (next === prev || next === lastIndexRef.current) {
            next = (prev + 1) % ACTIVITY_POOL.length;
          }
          lastIndexRef.current = next;
          return next;
        });
        setIsVisible(true);
      }, 2500);
    }

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(nextTimer);
    };
  }, [isVisible, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
    }
  };

  if (isDismissed) return null;

  const active = ACTIVITY_POOL[currentIndex];

  return (
    <aside
      aria-label="Recent student activity"
      className="fixed bottom-4 left-4 sm:bottom-6 sm:left-6 z-30 max-w-[calc(100vw-32px)] sm:max-w-[340px] pointer-events-none"
    >
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key={active.id}
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 18, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
            className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-2xl p-3.5 sm:p-4 shadow-xl shadow-slate-200/80 border border-slate-200/90 flex items-start gap-3 relative select-none"
          >
            {/* Student Avatar with Initials + Green Success Indicator */}
            <div className="relative shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-500 text-white font-extrabold text-xs flex items-center justify-center shadow-xs">
                {active.initials}
              </div>
              <span
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white shadow-2xs"
                title="Active application"
              />
            </div>

            {/* Content Details */}
            <div className="flex-1 min-w-0 pr-4 text-left">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="font-extrabold text-slate-900 text-xs sm:text-sm truncate">
                  {active.name}
                </span>
                <span className="text-[11px] font-semibold text-slate-500">
                  from {active.city}
                </span>
              </div>

              <p className="text-[11px] sm:text-xs text-slate-600 font-medium leading-tight mt-0.5">
                Just applied for{' '}
                <Link
                  href="/internships"
                  className="font-bold text-[#1D61FF] hover:underline"
                >
                  {active.domain}
                </Link>
              </p>

              <div className="flex items-center gap-1.5 mt-1 text-[10px] text-slate-400 font-medium">
                <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                <span>Verified Application · {active.timeAgo}</span>
              </div>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute top-2.5 right-2.5 text-slate-400 hover:text-slate-700 p-1 rounded-full hover:bg-slate-100 transition-colors"
              aria-label="Dismiss student activity notifications for this session"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </aside>
  );
};
