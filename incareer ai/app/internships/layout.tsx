import type { Metadata } from 'next';

const description = 'Explore online internships and virtual internship programs for students in India. Browse active project tracks and guided task roadmaps. Registration, learning, and required tasks are free; certificate issuance costs ₹99.';

export const metadata: Metadata = {
  title: 'Online & Virtual Internship Programs for Students',
  description,
  alternates: {
    canonical: '/internships',
  },
  openGraph: {
    title: 'Virtual Internship Catalog',
    description,
    url: '/internships',
  },
  twitter: {
    title: 'Virtual Internship Catalog',
    description,
  },
};

export default function InternshipsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
