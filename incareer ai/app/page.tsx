import type { Metadata } from 'next';
import { HomeStructuredData } from '@/components/common/SiteStructuredData';
import { getRollingBatchDate } from '@/utils/batchDate';
import LandingPageClient from './LandingPageClient';

export const metadata: Metadata = {
  title: {
    absolute: 'Free Online & Virtual Internship for Students | InternJourneys',
  },
  description:
    'Find an online internship or virtual internship for students in India. Registration, learning, and required tasks are free; certificate issuance costs ₹99.',
  keywords: [
    'virtual internship',
    'online internship',
    'virtual internship for students',
    'online internship for students',
    'free virtual internship',
    'online internship in India',
  ],
  alternates: {
    canonical: 'https://internjourneys.in/',
  },
  openGraph: {
    title: 'Free Online & Virtual Internship for Students | InternJourneys',
    description:
      'Find an online internship or virtual internship for students in India. Registration, learning, and required tasks are free; certificate issuance costs ₹99.',
    url: 'https://internjourneys.in/',
    siteName: 'InternJourneys',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/assets/hero-student.jpg',
        width: 1200,
        height: 630,
        alt: 'Online and virtual internship programs for students in India - InternJourneys',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online & Virtual Internship for Students | InternJourneys',
    description:
      'Find an online internship or virtual internship for students in India. Registration, learning, and required tasks are free; certificate issuance costs ₹99.',
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
