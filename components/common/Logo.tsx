import React from 'react';
import Link from 'next/link';

interface LogoProps {
  className?: string;
  href?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = '', href = '/' }) => {
  const content = (
    <div className={`inline-flex items-center gap-2 group cursor-pointer ${className}`}>
      {/* Original geometric AI sparkle icon */}
      <div className="relative flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600 shadow-sm transition-transform duration-300 group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5 text-white"
        >
          <path
            d="M12 2L13.8 8.2L20 10L13.8 11.8L12 18L10.2 11.8L4 10L10.2 8.2L12 2Z"
            fill="currentColor"
          />
          <path
            d="M19 16L19.9 19.1L23 20L19.9 20.9L19 24L18.1 20.9L15 20L18.1 19.1L19 16Z"
            fill="currentColor"
            opacity="0.75"
          />
        </svg>
      </div>

      {/* Lowercase wordmark: careerai */}
      <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center">
        career<span className="text-indigo-600">ai</span>
      </span>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
};
