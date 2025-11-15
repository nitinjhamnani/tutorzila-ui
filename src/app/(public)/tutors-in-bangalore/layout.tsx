import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Best Tutors in Bangalore - Home & Online Tutors | Tutorzila',
  description: 'Find top-rated home and online tutors in Bangalore for all subjects and boards. Tutorzila offers verified, experienced educators across the city for personalized learning.',
  other: {
    'geo.placename': 'Bangalore',
    'geo.region': 'IN-KA',
    'geo.position': '12.9716;77.5946',
    'ICBM': '12.9716, 77.5946'
  },
};

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  'serviceType': 'Tutoring Service',
  'provider': {
    '@type': 'Organization',
    'name': 'Tutorzila'
  },
  'areaServed': {
    '@type': 'City',
    'name': 'Bangalore',
    'address': {
      '@type': 'PostalAddress',
      'addressLocality': 'Bangalore',
      'addressRegion': 'KA',
      'addressCountry': 'IN'
    }
  },
  'name': 'Home and Online Tutoring Services in Bangalore',
  'description': 'Find verified home and online tutors in Bangalore for all academic subjects. Tutorzila connects students with qualified tutors across all areas of Bangalore for personalized learning sessions.',
};

export default function TutorsInBangaloreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {children}
    </>
  );
}
