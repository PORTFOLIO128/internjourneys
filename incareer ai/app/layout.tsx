import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Cormorant_Garamond } from 'next/font/google';
import './globals.css';

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-sans',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-serif',
});

export const metadata: Metadata = {
  title: 'CareerAI — Virtual Internships That Build Real Skills',
  description: 'Discover structured virtual internships, build real-world projects, and earn verified career credentials with CareerAI.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${jakarta.variable} ${cormorant.variable} ${jakarta.className} min-h-screen bg-background text-slate-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}
