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
      'Online and virtual internship platform for students across India, with project-based tasks. Registration, learning, and required tasks are free; certificate issuance costs ₹99.',
  },
  {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}/#website`,
    name: 'InternJourneys',
    url: SITE_URL,
    description:
      'Find an online internship or virtual internship for students in India. Registration, learning, and required tasks are free; certificate issuance costs ₹99.',
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
    name: 'Free Online & Virtual Internship for Students | InternJourneys',
    description:
      'Find an online internship or virtual internship for students in India. Registration, learning, and required tasks are free; certificate issuance costs ₹99.',
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
