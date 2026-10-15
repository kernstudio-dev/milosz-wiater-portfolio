import type { Metadata } from 'next';
import { Montserrat, Inter, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';
import { CustomCursor } from '@/components/CustomCursor';
import { AppProviders } from '@/components/AppProviders';

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
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${montserrat.variable} ${inter.variable} ${ibmPlexMono.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var l=localStorage.getItem('site-language');if(l==='pl'||l==='en')document.documentElement.lang=l;}catch(e){}try{var w=innerWidth,h=innerHeight,bs=Math.round(h/12),pr=bs*2,mw=Math.round(w*.9/pr)*pr;mw=Math.max(Math.min(mw,Math.floor(w*.94/pr)*pr),6*bs);var pin=h>=648&&w/h>=1.418&&Math.floor(mw/bs)>=16;document.documentElement.dataset.layout=pin?'pinned':(w/h<1?'portrait':(w>=960&&h>=600?'pinned':'landscape'));}catch(e){}})();`,
          }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
              window.scrollTo(0, 0);
              window.addEventListener('load', function () {
                requestAnimationFrame(function () { window.scrollTo(0, 0); });
              }, { once: true });
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        <AppProviders>
          <CustomCursor />
          {children}
        </AppProviders>
      </body>
    </html>
  );
}
