'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

interface CountUpNumberProps {
  target: number;
  duration?: number; // ms
  suffix?: string;
  className?: string;
}

export const CountUpNumber: React.FC<CountUpNumberProps> = ({
  target,
  duration = 1800,
  suffix = '',
  className = '',
}) => {
  const [current, setCurrent] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef<HTMLSpanElement>(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) {
      setCurrent(target);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);

          const startTime = performance.now();
          const animate = (currentTime: number) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease-out cubic
            const easeOutProgress = 1 - Math.pow(1 - progress, 3);
            const val = Math.floor(easeOutProgress * target);

            setCurrent(val);

            if (progress < 1) {
              requestAnimationFrame(animate);
            } else {
              setCurrent(target);
            }
          };

          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [target, duration, hasAnimated, shouldReduceMotion]);

  // Format in Indian numbering system: 1,59,544
  const formatted = (shouldReduceMotion ? target : current).toLocaleString('en-IN');

  return (
    <span ref={elementRef} className={className}>
      {formatted}
      {suffix}
    </span>
  );
};
