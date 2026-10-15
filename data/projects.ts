/**
 * The three real projects in Selected Work. Every claim here is taken from the
 * project's own repository; screens are captures of the current versions
 * (Eclipse Ink: production; SORI and Taśma: local builds of the working code).
 */
export interface Project {
  id: string;
  number: string;
  title: string;
  year: string;
  /** honest state of the work: a concept, or still being built */
  status?: 'concept' | 'progress';
  /** accent used by the orb and the case study */
  accent: string;
  /** the 16:10 preview */
  media: {
    type: 'image' | 'video';
    src: string;
    alt?: string;
  };
  /** case study images, in order: detail, challenge, result */
  gallery: [string, string, string];
  /** image the case study's system map is drawn on */
  blueprint: string;
  technologies: string[];
  /** public address of the live product, when there is one */
  link?: string;
  /** where the preview was captured, shown as technical micro-copy */
  capture: { source: 'production' | 'local'; viewport: string };
}

export const PROJECTS: Project[] = [
  {
    id: 'eclipse-ink',
    number: '01',
    title: 'Eclipse Ink',
    year: '2026',
    accent: '#b89a64',
    media: { type: 'image', src: '/projects/eclipse-ink/cover.webp' },
    gallery: ['/projects/eclipse-ink/about.webp', '/projects/eclipse-ink/archive.webp', '/projects/eclipse-ink/business.webp'],
    blueprint: '/projects/eclipse-ink/design.webp',
    technologies: ['Next.js 16', 'React 19', 'TypeScript', 'Three.js', 'GSAP / Lenis', 'Postgres (Neon)', 'Stripe', 'Vercel'],
    link: 'https://eclipse-ink-website.vercel.app',
    capture: { source: 'production', viewport: '1440 × 900' },
  },
  {
    id: 'sori',
    number: '02',
    title: 'SORI',
    year: '2026',
    status: 'concept',
    accent: '#a3a86a',
    media: { type: 'image', src: '/projects/sori/cover.webp' },
    gallery: ['/projects/sori/edit.webp', '/projects/sori/shop.webp', '/projects/sori/ingredients.webp'],
    blueprint: '/projects/sori/cover.webp',
    capture: { source: 'local', viewport: '1440 × 900' },
    technologies: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'Framer Motion', 'vinext / Vite', 'Cloudflare Workers'],
  },
  {
    id: 'tasma',
    number: '03',
    title: 'Taśma',
    year: '2026',
    status: 'progress',
    accent: '#4fb393',
    media: { type: 'image', src: '/projects/tasma/cover.webp' },
    gallery: ['/projects/tasma/entry.webp', '/projects/tasma/desktop.webp', '/projects/tasma/summary.webp'],
    blueprint: '/projects/tasma/cover.webp',
    capture: { source: 'local', viewport: '390 × 844' },
    technologies: ['HTML / JavaScript', 'Service Worker (PWA)', 'vinext API routes', 'Cloudflare D1', 'Drizzle ORM', 'node:test'],
  },
];
