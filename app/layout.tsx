import type { Metadata } from 'next';
import { Montserrat, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { CustomCursor } from '@/components/CustomCursor';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['100', '200', '300', '400', '500'],
  style: ['normal'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
  weight: ['300', '400', '500', '600', '700'],
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'KERN — Creative Development',
  description:
    'Independent creative developer specializing in high-end web applications, generative AI systems, 3D WebGL experiences, and motion choreography.',
  keywords: [
    'Creative Developer',
    'Frontend Engineer',
    'Full Stack Developer',
    'GSAP Animation',
    'Three.js',
    'AI Systems',
    'KERN',
    'Portfolio',
  ],
  authors: [{ name: 'KERN' }],
  creator: 'KERN',
  openGraph: {
    title: 'KERN — Creative Development',
    description:
      'Independent creative developer specializing in high-end web applications, generative AI systems, 3D WebGL experiences, and motion choreography.',
    siteName: 'KERN',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'KERN — Creative Development',
    description:
      'Independent creative developer specializing in high-end web applications, generative AI systems, 3D WebGL experiences, and motion choreography.',
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
        name: 'KERN — Creative Development',
        description:
          'Independent creative developer specializing in high-end web applications, generative AI systems, 3D WebGL experiences, and motion choreography.',
      },
      {
        '@type': 'Person',
        name: 'KERN',
        jobTitle: 'Creative Developer',
        email: 'contact@kern.dev',
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
    <html lang="en" className={`${montserrat.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
