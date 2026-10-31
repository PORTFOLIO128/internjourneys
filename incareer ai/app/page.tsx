import type { Metadata } from 'next';
import { HomeStructuredData } from '@/components/common/SiteStructuredData';
import { getRollingBatchDate } from '@/utils/batchDate';
import LandingPageClient from './LandingPageClient';

export const metadata: Metadata = {
  title: {
    absolute: 'Free Verified Virtual Internships 2026 in India | InternJourneys',
  },
  description:
    'Build future-ready skills with free, verified virtual internships at InternJourneys. Explore hands-on project tracks, receive an offer letter, and gain practical experience from anywhere in India.',
  keywords: [
    'Online Internships',
    'Free Internships',
    'Virtual Internships',
    'Online Internships for Students',
    'Free Virtual Internships',
    'Virtual Internship in India',
    'Online Internship Programs',
    'Project-Based Virtual Internships',
    'AI Virtual Internship',
    'Data Science Internship',
    'Web Development Internship',
    'Generative AI Internship',
    'Cybersecurity Internship',
    'Python Internship',
    'Cloud Computing Internship',
  ],
  alternates: {
    canonical: 'https://internjourneys.in/',
  },
  openGraph: {
    title: 'Free Verified Virtual Internships 2026 in India | InternJourneys',
    description:
      'Build future-ready skills with free, verified virtual internships at InternJourneys. Explore hands-on project tracks, receive an offer letter, and gain practical experience from anywhere in India.',
    url: 'https://internjourneys.in/',
    siteName: 'InternJourneys',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/assets/hero-student.jpg',
        width: 1200,
        height: 630,
        alt: 'Free Virtual Internships in India - InternJourneys',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Verified Virtual Internships 2026 in India | InternJourneys',
    description:
      'Build future-ready skills with free, verified virtual internships at InternJourneys. Explore hands-on project tracks, receive an offer letter, and gain practical experience from anywhere in India.',
    images: ['/assets/hero-student.jpg'],
  },
};

export default function HomePage() {
  return (
    <>
      <HomeStructuredData />
      <LandingPageClient initialBatchStartDate={getRollingBatchDate()} />
    </>
  );
}
