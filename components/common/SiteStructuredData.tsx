import { SITE_URL } from '@/lib/siteMetadata';

const structuredData = [
  {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: 'InternJourneys',
    url: SITE_URL,
    email: 'internjourney26@gmail.com',
    founder: {
      '@type': 'Person',
      name: 'VADIVEL BHUVANESH',
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Pudukkottai district',
      addressRegion: 'Tamil Nadu',
      addressCountry: 'IN',
    },
    logo: `${SITE_URL}/assets/internjourneys-monogram.png`,
    description:
      'Online virtual internship platform providing free verified virtual internships, hands-on project tasks, and instant offer letters for students across India.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'InternJourneys',
    url: SITE_URL,
    description:
      'Explore free virtual internships in India with InternJourneys. Choose online internship domains, learn through guided projects, receive an offer letter, and build practical skills.',
    publisher: {
      '@id': `${SITE_URL}/#organization`,
    },
  },
  {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: SITE_URL,
      },
    ],
  },
];

export function HomeStructuredData() {
  const webpage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': `${SITE_URL}/#webpage`,
    url: SITE_URL,
    name: 'Free Verified Virtual Internships 2026 in India | InternJourneys',
    description:
      'Build future-ready skills with free, verified virtual internships at InternJourneys. Explore hands-on project tracks, receive an offer letter, and gain practical experience from anywhere in India.',
    isPartOf: {
      '@id': `${SITE_URL}/#website`,
    },
    about: {
      '@id': `${SITE_URL}/#organization`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(webpage).replace(/</g, '\\u003c'),
      }}
    />
  );
}

export function SiteStructuredData() {
  return (
    <>
      {structuredData.map((entity) => (
        <script
          key={entity['@type']}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(entity).replace(/</g, '\\u003c'),
          }}
        />
      ))}
    </>
  );
}
