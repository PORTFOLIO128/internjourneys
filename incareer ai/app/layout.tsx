import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Cormorant_Garamond } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/authContext';

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
  title: 'InternJourneys — Virtual Internships That Build Real Skills',
  description: 'Explore structured virtual internships, project-based learning tasks, and certificates with online verification through InternJourneys.',
  icons: {
    icon: '/assets/internjourneys-monogram.png',
    shortcut: '/assets/internjourneys-monogram.png',
    apple: '/assets/internjourneys-monogram.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${jakarta.variable} ${cormorant.variable} ${jakarta.className} min-h-screen bg-background text-slate-900 antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
