export interface Project {
  id: string;
  number: string;
  category: string;
  title: string;
  subtitle: string;
  year: string;
  description: string;
  longDescription: string;
  media: {
    type: 'image' | 'video';
    src: string;
    alt: string;
    aspectRatio?: string;
  };
  metrics?: {
    label: string;
    value: string;
  }[];
  technologies: string[];
  role: string;
  deliverables: string[];
  link?: string;
}

export const PROJECTS: Project[] = [
  {
    id: 'eclipse-ink',
    number: '01',
    category: 'DIGITAL EXPERIENCE / 3D WEB',
    title: 'Eclipse Ink',
    subtitle: 'Interactive 3D WebGL Fluid Exploration & Creative Direction',
    year: '2025',
    description:
      'High-performance WebGL digital artifact featuring liquid chrome physics, custom GLSL vertex shaders, and interactive camera dynamics.',
    longDescription:
      'Eclipse Ink is an experimental creative development showcase engineered to push browser GPU capabilities to a consistent 60 FPS. Built using Next.js 15, custom GLSL fragment and vertex shaders, and GSAP scroll timelines, it renders dynamic metallic viscosity that recalculates light reflection vectors relative to cursor velocity and scroll momentum.',
    media: {
      type: 'image',
      src: '/projects/eclipse-ink.jpg',
      alt: 'Eclipse Ink 3D WebGL Fluid Experience',
    },
    metrics: [
      { label: 'FRAME RATE', value: '60 FPS LOCKED' },
      { label: 'RENDER TIME', value: '3.2ms GPU' },
      { label: 'VERTICES', value: '325,481 DYN' },
    ],
    technologies: ['Next.js 15', 'TypeScript', 'Three.js / WebGL', 'GLSL Shaders', 'GSAP ScrollTrigger'],
    role: 'Lead Creative Developer & Shader Architect',
    deliverables: ['Custom GLSL Fluid Shaders', 'Physics Simulation Engine', 'Sound Design Integration', 'Responsive Viewport Pipeline'],
  },
  {
    id: 'jarvis-odkutka',
    number: '02',
    category: 'AI SYSTEM & MULTIMODAL AGENTS',
    title: 'Jarvis / Odkutka',
    subtitle: 'Autonomous Multimodal AI Engine & Real-Time Agent Dispatcher',
    year: '2025',
    description:
      'Real-time bi-directional audio reasoning pipeline with multi-turn context graph and automated background task orchestration.',
    longDescription:
      'A production-grade AI agent workstation providing sub-120ms speech-to-speech comprehension, dynamic tool execution, and stateful graph memory. Integrates Gemini Live WebSocket streaming with localized FastRTC fallback, featuring live telemetry dashboards and autonomous error remediation protocols.',
    media: {
      type: 'image',
      src: '/projects/jarvis.jpg',
      alt: 'Jarvis Odkutka AI Agent Workstation',
    },
    metrics: [
      { label: 'VOICE LATENCY', value: '<120ms' },
      { label: 'ACCURACY', value: '99.4% TASK' },
      { label: 'AGENTS', value: '3 AUTONOMOUS' },
    ],
    technologies: ['Python 3.12', 'React 19', 'FastAPI', 'Gemini Live API', 'WebSockets', 'Vector DB'],
    role: 'System Architect & Full-Stack AI Engineer',
    deliverables: ['Streaming Audio Pipeline', 'Multi-Agent Dispatcher', 'HUD Telemetry Interface', 'Safety Guardrail System'],
  },
  {
    id: 'wbrent',
    number: '03',
    category: 'WEB APPLICATION & PLATFORM',
    title: 'WBRent',
    subtitle: 'Ultra-Luxury Architectural Real Estate & Rental Ecosystem',
    year: '2024',
    description:
      'Editorial real estate booking platform featuring interactive SVG architectural blueprints, dynamic pricing indices, and sub-millisecond filtering.',
    longDescription:
      'Engineered for high-net-worth architectural rentals, WBRent balances brutalist editorial minimalism with instant client-side performance. Includes vector floor plans with room-by-room light exposure simulation, localized currency conversions, and automated lease smart contracts.',
    media: {
      type: 'image',
      src: '/projects/wbrent.jpg',
      alt: 'WBRent Luxury Architectural Platform',
    },
    metrics: [
      { label: 'PAGE LOAD', value: '0.42s LCP' },
      { label: 'CONVERSION', value: '+44% YOY' },
      { label: 'INVENTORY', value: '$180M+' },
    ],
    technologies: ['Next.js App Router', 'TypeScript', 'PostgreSQL', 'Prisma', 'Tailwind/CSS Modules', 'Cloudflare Workers'],
    role: 'Principal Engineer & Product Designer',
    deliverables: ['Interactive Floor Plan Engine', 'Multi-Currency Escrow', 'Headless CMS Integration', 'Edge Cache Routing'],
  },
  {
    id: 'wbtrade',
    number: '04',
    category: 'AUTOMATION & FINANCIAL TERMINAL',
    title: 'WBTrade',
    subtitle: 'Algorithmic Financial Terminal & High-Frequency Analytics',
    year: '2024',
    description:
      'Low-latency market surveillance workstation with WebGL canvas candlestick rendering, order book depth mapping, and automated execution webhooks.',
    longDescription:
      'WBTrade streams tick-level market feeds over multiplexed WebSockets, crunching quantitative indicators directly in the browser via WebAssembly. Features customizable modular HUD docking grids, automated stop-loss bots, and instant visual risk assessment.',
    media: {
      type: 'image',
      src: '/projects/wbtrade.jpg',
      alt: 'WBTrade Algorithmic Trading Terminal',
    },
    metrics: [
      { label: 'WS TICK RATE', value: '852 EVT/S' },
      { label: 'LATENCY', value: '4.8ms' },
      { label: 'CHART FPS', value: '60 FPS CANVAS' },
    ],
    technologies: ['TypeScript', 'Rust / WebAssembly', 'HTML5 Canvas', 'WebSockets', 'GSAP', 'TimescaleDB'],
    role: 'Frontend Architect & Performance Engineer',
    deliverables: ['Custom Canvas Charting Engine', 'Wasm Indicator Library', 'Multi-Monitor Docking System', 'Risk Calculation Suite'],
  },
  {
    id: 'happyplay',
    number: '05',
    category: 'CREATIVE PRODUCT & DIGITAL EXPERIENCE',
    title: 'Happy Play / WB Foundation',
    subtitle: 'Gamified Digital Ecosystem & Interactive Learning Platform',
    year: '2024',
    description:
      'Bespoke digital product merging playful 3D aesthetics with modular educational tracks, real-time community challenges, and tactile physics.',
    longDescription:
      'Commissioned by WB Foundation to revolutionize youth creative education, Happy Play delivers an immersive, tactile digital playground. Every button, badge, and progress ring features micro-interactions and audio feedback crafted to make learning feel like exploring a living digital universe.',
    media: {
      type: 'image',
      src: '/projects/happyplay.jpg',
      alt: 'Happy Play WB Foundation Platform',
    },
    metrics: [
      { label: 'ACTIVE USERS', value: '45,000+' },
      { label: 'AVG DURATION', value: '18.4 MIN' },
      { label: 'AWARDS', value: 'FWA OF THE DAY' },
    ],
    technologies: ['React', 'Next.js', 'Matter.js Physics', 'GSAP Flip', 'Web Audio API', 'Supabase'],
    role: 'Creative Developer & Interaction Designer',
    deliverables: ['Micro-Interaction Design System', 'Gamification Logic', 'Physics Particle Canvas', 'Mobile Touch Gestures'],
  },
];
