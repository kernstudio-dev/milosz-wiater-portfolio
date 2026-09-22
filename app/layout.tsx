import type { Metadata } from 'next';
import './globals.css';
import { CustomCursor } from '@/components/CustomCursor';

export const metadata: Metadata = {
  title: 'MIŁOSZ WIATER — Creative Developer & Digital Product Developer',
  description:
    'Independent creative developer specializing in high-end web applications, generative AI systems, 3D WebGL experiences, and motion choreography.',
  keywords: [
    'Creative Developer',
    'Frontend Engineer',
    'Full Stack Developer',
    'GSAP Animation',
    'Three.js',
    'AI Systems',
    'Miłosz Wiater',
    'Portfolio',
    'Warsaw Developer',
  ],
  authors: [{ name: 'Miłosz Wiater' }],
  creator: 'Miłosz Wiater',
  metadataBase: new URL('https://miloszwiater.dev'),
  openGraph: {
    title: 'MIŁOSZ WIATER — Creative Developer & Digital Product Developer',
    description:
      'Independent creative developer specializing in high-end web applications, generative AI systems, 3D WebGL experiences, and motion choreography.',
    url: 'https://miloszwiater.dev',
    siteName: 'Miłosz Wiater',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MIŁOSZ WIATER — Creative Developer & Digital Product Developer',
    description:
      'Independent creative developer specializing in high-end web applications, generative AI systems, 3D WebGL experiences, and motion choreography.',
    creator: '@miloszwiater',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': 'https://miloszwiater.dev/#website',
        url: 'https://miloszwiater.dev',
        name: 'Miłosz Wiater — Creative Developer',
        description:
          'Independent creative developer specializing in high-end web applications, generative AI systems, 3D WebGL experiences, and motion choreography.',
        publisher: {
          '@id': 'https://miloszwiater.dev/#person',
        },
      },
      {
        '@type': 'Person',
        '@id': 'https://miloszwiater.dev/#person',
        name: 'Miłosz Wiater',
        url: 'https://miloszwiater.dev',
        jobTitle: 'Creative Developer & Digital Product Developer',
        email: 'contact@miloszwiater.dev',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Warsaw',
          addressCountry: 'PL',
        },
        knowsAbout: [
          'Creative Development',
          'Frontend Architecture',
          'Generative AI Integration',
          'WebGL & Shaders',
          'GSAP Animation & Motion Choreography',
          'Full-Stack Web Applications',
        ],
      },
    ],
  };

  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        {/* Subtle Architectural Blueprint Grid */}
        <div className="blueprint-grid-overlay" aria-hidden="true" />
        
        {/* Dynamic Context Cursor */}
        <CustomCursor />

        {/* Page Content */}
        {children}
      </body>
    </html>
  );
}
