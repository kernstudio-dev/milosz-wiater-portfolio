export interface Service {
  number: string;
  name: string;
  category: string;
  description: string;
  scope: string[];
  deliverables: string[];
  techStack: string[];
}

export const SERVICES: Service[] = [
  {
    number: '01',
    name: 'FRONT-END ARCHITECTURE & CREATIVE DEV',
    category: 'CRAFT & ENGINEERING',
    description:
      'Translating ambitious creative concepts into clean, resilient, high-speed code. Specializing in bespoke digital artifacts, interactive experiences, and fluid web animations that run at a locked 60 frames per second.',
    scope: [
      'Mathematical grid systems and custom CSS architecture',
      'WebGL / Three.js and shader programming',
      'High-performance typography and responsive layout choreography',
      'Cross-browser optimization and zero layout thrashing',
    ],
    deliverables: ['Custom Design Systems', 'Interactive Canvas Prototypes', 'Production Codebases', 'Performance Audits'],
    techStack: ['Next.js 15', 'React 19', 'TypeScript', 'Three.js / WebGL', 'GSAP', 'Lenis'],
  },
  {
    number: '02',
    name: 'WEB APPLICATIONS & SAAS PLATFORMS',
    category: 'FULL-STACK DEVELOPMENT',
    description:
      'End-to-end engineering of modern web applications built for scale and reliability. From complex state management and API orchestrations to multi-tenant databases and edge deployments.',
    scope: [
      'Server-side rendering (SSR), incremental static regeneration (ISR), and edge computing',
      'Secure authentication, session management, and RBAC security',
      'Real-time data synchronization over WebSockets and WebRTC',
      'Type-safe end-to-end data pipelines and database schema migrations',
    ],
    deliverables: ['Full-Stack Web Apps', 'REST & GraphQL APIs', 'Database Schemas', 'Deployment Pipelines'],
    techStack: ['Next.js App Router', 'Node.js', 'PostgreSQL', 'Prisma', 'Redis', 'Docker'],
  },
  {
    number: '03',
    name: 'UI / UX & TACTILE DESIGN SYSTEMS',
    category: 'DESIGN & PRODUCT SENSE',
    description:
      'Crafting cohesive visual languages where typography, spacing, and micro-interactions function as one unified system. No generic kits, no bloated frameworks — only bespoke, intentional interfaces.',
    scope: [
      'Brutalist and editorial grid layouts with CAD-level precision',
      'Component library authoring and multi-brand token systems',
      'Micro-interactions, magnetic behaviors, and tactile button physics',
      'Accessibility (WCAG AA), keyboard navigation, and reduced motion',
    ],
    deliverables: ['Figma Design Systems', 'Coded UI Tokens', 'Interactive Component Libraries', 'Documentation'],
    techStack: ['Figma', 'CSS Custom Properties', 'Storybook', 'Vanilla CSS', 'Headless UI'],
  },
  {
    number: '04',
    name: 'MOTION CHOREOGRAPHY & GSAP EXPERIENCES',
    category: 'KINETIC DESIGN',
    description:
      'Motion is not decorative — it directs attention, communicates hierarchy, and makes digital interfaces feel physical and memorable. Custom scroll scrubbing, page morphs, and masked reveals.',
    scope: [
      'Scroll-driven animations with GSAP ScrollTrigger and native View Timelines',
      'Text line masks, character staggers, and overflow clipping',
      'Non-linear custom easing curves and physical inertia smoothing',
      'FLIP page transitions and shared layout element morphing',
    ],
    deliverables: ['Motion Prototypes', 'Scroll Choreography Systems', 'Custom Page Transitions', 'Micro-interactions'],
    techStack: ['GSAP 3', 'ScrollTrigger', 'Flip', 'Lenis Smooth Scroll', 'Web Animations API'],
  },
  {
    number: '05',
    name: 'ARTIFICIAL INTELLIGENCE & LLM AGENTS',
    category: 'INTELLIGENT SYSTEMS',
    description:
      'Integrating modern generative AI models, multimodal agent dispatchers, and automated reasoning into production applications. Building human-in-the-loop interfaces that feel intelligent and fast.',
    scope: [
      'Real-time audio and vision streaming with Gemini Live and WebSockets',
      'Autonomous multi-agent orchestration and function calling loops',
      'Retrieval-augmented generation (RAG) with vector databases',
      'Structured schema generation, latency reduction, and fallback safety',
    ],
    deliverables: ['Autonomous Agent Pipelines', 'Custom AI Chat Interfaces', 'Vector Search Indexes', 'Prompt Engineering Systems'],
    techStack: ['Python', 'Gemini Live API', 'LangChain / LangGraph', 'ChromaDB / Pinecone', 'FastAPI'],
  },
  {
    number: '06',
    name: 'AUTOMATION & WORKFLOW SYSTEMS',
    category: 'EFFICIENCY & INFRASTRUCTURE',
    description:
      'Eliminating manual bottlenecks by connecting disparate business systems, data streams, and internal tools through custom asynchronous automation pipelines and background queues.',
    scope: [
      'Custom webhook integrations and background job orchestrators',
      'Headless browser scraping, automated report generation, and data enrichment',
      'Cloud functions, serverless workers, and event-driven architectures',
      'Error monitoring, self-healing retries, and transactional alerts',
    ],
    deliverables: ['Webhook Handlers', 'Background Task Workers', 'Automated ETL Pipelines', 'Monitoring Dashboards'],
    techStack: ['Node.js / Bun', 'Python', 'BullMQ', 'Cloudflare Workers', 'Temporal / Celery'],
  },
];
