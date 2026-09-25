export type Language = 'en' | 'pl';

type ProjectCopy = {
  category: string;
  subtitle: string;
  description: string;
  longDescription: string;
  role: string;
  deliverables: string[];
  mediaAlt: string;
};

type ServiceCopy = {
  title: readonly [string, string];
  description: string;
  scope: string[];
};

export type Dictionary = {
  route: { start: string; work: string; services: string; about: string; contact: string; end: string };
  navigation: {
    links: string[];
    backTop: string;
    menu: string;
    language: string;
    theme: string;
    light: string;
    dark: string;
    footer: string;
  };
  hero: {
    role: string;
    availability: string;
    shaping: string;
    concepts: string;
    building: string;
    experiences: string;
    open: string;
  };
  work: {
    title: string;
    intro: string;
    cta: string;
    selectProject: string;
    show: string;
    previous: string;
    next: string;
    view: string;
    opening: string;
  };
  services: {
    intro: string;
    title: string[];
    cta: string;
    navigation: string;
    previous: string;
    next: string;
    form: string;
    focus: string;
    items: ServiceCopy[];
  };
  about: {
    title: string;
    intro: string;
    cta: string;
    copy: string;
    portraitAlt: string;
  };
  contact: {
    contact: string;
    availability: string;
    information: string;
    independent: string;
    commissions: string;
    connect: string;
    thanks: string;
    name: string;
    email: string;
    company: string;
    message: string;
    submit: string;
    discipline: string;
  };
  caseStudy: {
    caseStudy: string;
    back: string;
    overview: string;
    selectedDetail: string;
    challenge: string;
    challengeTitle: string;
    idea: string;
    ideaCopy: string;
    experience: string;
    experienceCopy: string;
    detail: string;
    detailTitle: string;
    detailCopy: string;
    role: string;
    technology: string;
    process: string;
    finalExperience: string;
    nextProject: string;
    opening: string;
    switchTheme: string;
    switchLanguage: string;
    scroll: string;
    approach: string;
    build: string;
    deliverables: string;
    year: string;
    allWork: string;
    viewNext: string;
    project: string;
    result: string;
    stack: string;
    figure: string;
    systemMap: string;
  };
  projects: Record<string, ProjectCopy>;
};

const en: Dictionary = {
  route: { start: 'START', work: 'SELECTED WORK', services: 'SERVICES', about: 'ABOUT', contact: 'CONTACT', end: 'END' },
  navigation: {
    links: ['Projects', 'Services', 'About', 'Contact'],
    backTop: 'Back to top', menu: 'Open menu', language: 'Switch language', theme: 'Switch color theme', light: 'LIGHT', dark: 'DARK',
    footer: 'KERN — CREATIVE DEVELOPMENT',
  },
  hero: {
    role: 'CREATIVE DEVELOPER', availability: 'AVAILABLE WORLDWIDE', shaping: 'SHAPING', concepts: 'CONCEPTS',
    building: 'BUILDING', experiences: 'EXPERIENCES', open: 'OPEN FOR PROJECTS',
  },
  work: {
    title: 'SELECTED WORK', intro: 'Selected digital products and interactive experiences, from system architecture to launch.',
    cta: 'Start a Project', selectProject: 'Select a project', show: 'Show', previous: 'Previous project', next: 'Next project',
    view: 'VIEW', opening: 'Opening case study',
  },
  services: {
    intro: 'Strategy, design and technology — working as one.', title: ['RELIABLE', 'CREATIVE', 'VERSATILE'], cta: 'Get in touch',
    navigation: 'Capabilities', previous: 'Previous service', next: 'Next service', form: 'FORM', focus: 'SELECTED FOCUS',
    items: [
      { title: ['WEB', 'DEVELOPMENT'], description: 'Translating ambitious creative concepts into clean, resilient code. Thoughtful interfaces, expressive interaction and fluid motion shaped as one coherent experience.', scope: ['Mathematical grid systems and custom CSS architecture', 'WebGL / Three.js and shader programming', 'High-performance typography and responsive layout choreography'] },
      { title: ['WEB', 'APPLICATIONS'], description: 'End-to-end engineering of modern web applications built for scale and reliability. From complex state management and API orchestration to multi-tenant databases and edge deployments.', scope: ['Server-side rendering, static regeneration and edge computing', 'Secure authentication, session management and RBAC', 'Real-time data synchronization over WebSockets and WebRTC'] },
      { title: ['PRODUCT', 'DESIGN'], description: 'Crafting cohesive visual languages where typography, spacing and micro-interactions function as one unified system. Bespoke, intentional interfaces without generic kits.', scope: ['Editorial grid layouts with precise visual rhythm', 'Component libraries and multi-brand token systems', 'Accessible micro-interactions and tactile interface behavior'] },
      { title: ['MOTION', 'INTERACTION'], description: 'Motion directs attention, communicates hierarchy and makes digital interfaces feel physical and memorable. Custom scroll choreography, page morphs and masked reveals.', scope: ['Scroll-driven animation and native view timelines', 'Text masks, character staggers and overflow clipping', 'Custom easing, inertia and shared-layout transitions'] },
      { title: ['AI', 'SYSTEMS'], description: 'Integrating generative AI models, multimodal agent dispatchers and automated reasoning into production applications. Human-in-the-loop interfaces that feel intelligent and fast.', scope: ['Real-time audio and vision streaming', 'Autonomous multi-agent orchestration and function calling', 'Retrieval-augmented generation with vector databases'] },
      { title: ['AUTOMATION', 'WORKFLOWS'], description: 'Eliminating manual bottlenecks by connecting business systems, data streams and internal tools through asynchronous automation pipelines and background queues.', scope: ['Webhook integrations and background job orchestration', 'Automated reporting and data enrichment', 'Event-driven infrastructure with monitored retries'] },
    ],
  },
  about: {
    title: 'ABOUT', intro: 'Strategy, design and development — connected from concept to launch.', cta: 'Get in touch',
    copy: 'I design and build distinctive digital products for ambitious teams, combining strategy, interaction, development and visual identity as one connected system.',
    portraitAlt: 'KERN creative developer portrait',
  },
  contact: {
    contact: 'Contact', availability: 'Available worldwide', information: 'Information', independent: 'Independent creative development',
    commissions: 'Selected commissions & partnerships', connect: 'Connect', thanks: 'Thank you — your project note is ready.',
    name: 'Your name', email: 'Email', company: 'Company (optional)', message: 'Tell me about your project...', submit: 'Discuss a project',
    discipline: 'Creative Development',
  },
  caseStudy: {
    caseStudy: 'CASE STUDY', back: 'Selected Work', overview: 'THE PROJECT', selectedDetail: 'Selected interface / detail study',
    challenge: 'CHALLENGE', challengeTitle: 'Make complexity feel immediate.', idea: 'IDEA',
    ideaCopy: 'Build the experience around a clear visual rhythm: reveal only what matters, preserve a strong focal point, and let interaction explain the system.',
    experience: 'EXPERIENCE', experienceCopy: 'Editorial pacing, purposeful movement and a responsive visual system carry the work from first impression to final interaction.',
    detail: 'DETAIL MOMENT', detailTitle: 'A system revealed through interaction.', detailCopy: 'Focused crops expose the interface logic, material decisions and small responses that give the product its character.',
    role: 'ROLE', technology: 'TECHNOLOGY', process: 'PROCESS', finalExperience: 'Final experience', nextProject: 'NEXT PROJECT', opening: 'Opening project',
    switchTheme: 'Switch color theme', switchLanguage: 'Switch language', scroll: 'SCROLL',
    approach: 'APPROACH', build: 'THE BUILD', deliverables: 'DELIVERABLES', year: 'YEAR', allWork: 'All projects', viewNext: 'Open next project',
    project: 'PROJECT', result: 'RESULT', stack: 'STACK', figure: 'FIG.', systemMap: 'System map — four build points',
  },
  projects: {
    'eclipse-ink': { category: 'DIGITAL EXPERIENCE / 3D WEB', subtitle: 'Interactive 3D WebGL Fluid Exploration & Creative Direction', description: 'High-performance WebGL digital artifact featuring liquid chrome physics, custom GLSL vertex shaders, and interactive camera dynamics.', longDescription: 'Eclipse Ink is an experimental creative-development study built around responsive liquid form, light and movement. Custom shaders and scroll choreography turn an abstract material into a tactile, cinematic web experience.', role: 'Lead Creative Developer & Shader Architect', deliverables: ['Custom GLSL Fluid Shaders', 'Physics Simulation Engine', 'Sound Design Integration', 'Responsive Viewport Pipeline'], mediaAlt: 'Eclipse Ink 3D WebGL fluid experience' },
    'jarvis-odkutka': { category: 'AI SYSTEM & MULTIMODAL AGENTS', subtitle: 'Autonomous Multimodal AI Engine & Real-Time Agent Dispatcher', description: 'Real-time bi-directional audio reasoning pipeline with multi-turn context graph and automated background task orchestration.', longDescription: 'A production-grade AI agent workstation providing fast speech-to-speech comprehension, dynamic tool execution and stateful graph memory, with live diagnostics and resilient fallback behavior.', role: 'System Architect & Full-Stack AI Engineer', deliverables: ['Streaming Audio Pipeline', 'Multi-Agent Dispatcher', 'Live Diagnostic Interface', 'Safety Guardrail System'], mediaAlt: 'Jarvis Odkutka AI agent workstation' },
    'wbrent': { category: 'WEB APPLICATION & PLATFORM', subtitle: 'Ultra-Luxury Architectural Real Estate & Rental Ecosystem', description: 'Editorial real estate booking platform featuring interactive SVG architectural blueprints, dynamic pricing indices, and sub-millisecond filtering.', longDescription: 'Engineered for high-value architectural rentals, WBRent balances editorial minimalism with instant client-side performance, detailed floor plans, localized currencies and automated booking flows.', role: 'Principal Engineer & Product Designer', deliverables: ['Interactive Floor Plan Engine', 'Multi-Currency Booking Flow', 'Headless CMS Integration', 'Edge Cache Routing'], mediaAlt: 'WBRent architectural rental platform' },
    'wbtrade': { category: 'AUTOMATION & FINANCIAL TERMINAL', subtitle: 'Algorithmic Financial Terminal & High-Frequency Analytics', description: 'Low-latency market surveillance workstation with canvas candlestick rendering, order-book depth mapping and automated execution webhooks.', longDescription: 'WBTrade streams tick-level market feeds over multiplexed WebSockets and calculates quantitative indicators in the browser through WebAssembly. Modular workspaces, automated safeguards and instant visual risk assessment keep complex data legible.', role: 'Frontend Architect & Performance Engineer', deliverables: ['Custom Canvas Charting Engine', 'WebAssembly Indicator Library', 'Multi-Monitor Docking System', 'Risk Calculation Suite'], mediaAlt: 'WBTrade algorithmic trading terminal' },
    'happyplay': { category: 'CREATIVE PRODUCT & DIGITAL EXPERIENCE', subtitle: 'Gamified Digital Ecosystem & Interactive Learning Platform', description: 'Bespoke digital product merging playful 3D aesthetics with modular educational tracks, real-time community challenges and tactile physics.', longDescription: 'Created for WB Foundation, Happy Play is an immersive digital playground. Every button, badge and progress ring uses purposeful motion and audio feedback to make learning feel exploratory and alive.', role: 'Creative Developer & Interaction Designer', deliverables: ['Micro-Interaction Design System', 'Gamification Logic', 'Physics Particle Canvas', 'Mobile Touch Gestures'], mediaAlt: 'Happy Play learning platform' },
  },
};

const pl: Dictionary = {
  route: { start: 'START', work: 'WYBRANE PROJEKTY', services: 'USŁUGI', about: 'O MNIE', contact: 'KONTAKT', end: 'KONIEC' },
  navigation: {
    links: ['Projekty', 'Usługi', 'O mnie', 'Kontakt'],
    backTop: 'Wróć na początek', menu: 'Otwórz menu', language: 'Zmień język', theme: 'Zmień motyw kolorystyczny', light: 'JASNY', dark: 'CIEMNY',
    footer: 'KERN — CREATIVE DEVELOPMENT',
  },
  hero: {
    role: 'KREATYWNY DEVELOPER', availability: 'DOSTĘPNY GLOBALNIE', shaping: 'KSZTAŁTUJĘ', concepts: 'KONCEPCJE',
    building: 'TWORZĘ', experiences: 'DOŚWIADCZENIA', open: 'OTWARTY NA PROJEKTY',
  },
  work: {
    title: 'WYBRANE PROJEKTY', intro: 'Wybrane produkty cyfrowe i interaktywne doświadczenia — od architektury systemu po wdrożenie.',
    cta: 'Rozpocznij projekt', selectProject: 'Wybierz projekt', show: 'Pokaż', previous: 'Poprzedni projekt', next: 'Następny projekt',
    view: 'ZOBACZ', opening: 'Otwieranie projektu',
  },
  services: {
    intro: 'Strategia, design i technologia — działające jako całość.', title: ['SOLIDNIE', 'KREATYWNIE', 'WSZECHSTRONNIE'], cta: 'Skontaktuj się',
    navigation: 'Obszary usług', previous: 'Poprzednia usługa', next: 'Następna usługa', form: 'FORMA', focus: 'WYBRANY OBSZAR',
    items: [
      { title: ['WEB', 'DEVELOPMENT'], description: 'Przekładam ambitne koncepcje kreatywne na czysty i odporny kod. Interfejs, interakcja i płynny ruch tworzą jedno spójne doświadczenie.', scope: ['Matematyczne siatki i autorska architektura CSS', 'WebGL / Three.js i programowanie shaderów', 'Responsywna typografia i choreografia układu'] },
      { title: ['APLIKACJE', 'WEBOWE'], description: 'Tworzę kompletne aplikacje internetowe przygotowane na skalowanie i niezawodność — od złożonego stanu i API po bazy danych oraz wdrożenia edge.', scope: ['SSR, generowanie statyczne i edge computing', 'Bezpieczne logowanie, sesje i role użytkowników', 'Synchronizacja danych przez WebSockets i WebRTC'] },
      { title: ['PRODUCT', 'DESIGN'], description: 'Projektuję spójne języki wizualne, w których typografia, rytm i mikrointerakcje pracują jako jeden system. Bez generycznych zestawów — tylko świadome interfejsy.', scope: ['Edytorialne siatki o precyzyjnym rytmie', 'Biblioteki komponentów i systemy tokenów', 'Dostępne mikrointerakcje i haptyczne zachowanie UI'] },
      { title: ['RUCH', 'INTERAKCJA'], description: 'Ruch prowadzi uwagę, komunikuje hierarchię i nadaje interfejsom fizyczny charakter. Tworzę choreografię scrolla, morfingi stron i maskowane przejścia.', scope: ['Animacja sterowana scrollem i View Timelines', 'Maski tekstu, sekwencje znaków i clipping', 'Autorskie easing curves, bezwładność i przejścia współdzielone'] },
      { title: ['SYSTEMY', 'AI'], description: 'Wdrażam generatywną AI, multimodalnych agentów i automatyczne wnioskowanie do produktów. Projektuję szybkie interfejsy z człowiekiem w pętli decyzyjnej.', scope: ['Strumieniowanie audio i obrazu w czasie rzeczywistym', 'Orkiestracja agentów i wywoływanie funkcji', 'RAG i wyszukiwanie w bazach wektorowych'] },
      { title: ['AUTOMATYZACJA', 'WORKFLOW'], description: 'Usuwam ręczne wąskie gardła, łącząc systemy biznesowe, dane i narzędzia przez asynchroniczne procesy automatyzacji oraz kolejki zadań.', scope: ['Webhooki i orkiestracja zadań w tle', 'Automatyczne raporty i wzbogacanie danych', 'Architektura zdarzeniowa z monitorowanymi ponowieniami'] },
    ],
  },
  about: {
    title: 'O MNIE', intro: 'Strategia, design i development — połączone od koncepcji po wdrożenie.', cta: 'Skontaktuj się',
    copy: 'Projektuję i buduję charakterystyczne produkty cyfrowe dla ambitnych zespołów, łącząc strategię, interakcję, development i identyfikację wizualną w jeden spójny system.',
    portraitAlt: 'Portret creative developera KERN',
  },
  contact: {
    contact: 'Kontakt', availability: 'Dostępny globalnie', information: 'Informacje', independent: 'Niezależny creative development',
    commissions: 'Wybrane zlecenia i partnerstwa', connect: 'Napisz', thanks: 'Dziękuję — wiadomość o projekcie jest gotowa.',
    name: 'Imię i nazwisko', email: 'E-mail', company: 'Firma (opcjonalnie)', message: 'Opowiedz o swoim projekcie...', submit: 'Porozmawiajmy o projekcie',
    discipline: 'Creative Development',
  },
  caseStudy: {
    caseStudy: 'STUDIUM PROJEKTU', back: 'Wybrane projekty', overview: 'O PROJEKCIE', selectedDetail: 'Wybrany interfejs / studium detalu',
    challenge: 'WYZWANIE', challengeTitle: 'Nadać złożoności natychmiastową czytelność.', idea: 'IDEA',
    ideaCopy: 'Doświadczenie opiera się na klarownym rytmie: pokazuje tylko to, co ważne, utrzymuje mocny punkt skupienia i pozwala interakcji objaśniać system.',
    experience: 'DOŚWIADCZENIE', experienceCopy: 'Edytorialne tempo, celowy ruch i responsywny system wizualny prowadzą projekt od pierwszego wrażenia do końcowej interakcji.',
    detail: 'MOMENT DETALU', detailTitle: 'System odsłaniany przez interakcję.', detailCopy: 'Precyzyjne kadry pokazują logikę interfejsu, decyzje materiałowe i drobne reakcje, które nadają produktowi charakter.',
    role: 'ROLA', technology: 'TECHNOLOGIA', process: 'PROCES', finalExperience: 'Finalne doświadczenie', nextProject: 'NASTĘPNY PROJEKT', opening: 'Otwieranie projektu',
    switchTheme: 'Zmień motyw kolorystyczny', switchLanguage: 'Zmień język', scroll: 'PRZEWIŃ',
    approach: 'PODEJŚCIE', build: 'REALIZACJA', deliverables: 'ZAKRES', year: 'ROK', allWork: 'Wszystkie projekty', viewNext: 'Otwórz następny projekt',
    project: 'PROJEKT', result: 'REZULTAT', stack: 'STACK', figure: 'RYS.', systemMap: 'Mapa systemu — cztery elementy realizacji',
  },
  projects: {
    'eclipse-ink': { category: 'DOŚWIADCZENIE CYFROWE / 3D WEB', subtitle: 'Interaktywna eksploracja płynnego WebGL 3D i kierunek kreatywny', description: 'Wydajny artefakt WebGL łączący fizykę płynnego chromu, autorskie shadery GLSL i interaktywną kamerę.', longDescription: 'Eclipse Ink to eksperymentalne studium creative developmentu zbudowane wokół responsywnej formy, światła i ruchu. Autorskie shadery oraz choreografia scrolla zmieniają abstrakcyjny materiał w dotykowe, filmowe doświadczenie.', role: 'Lead Creative Developer i architekt shaderów', deliverables: ['Autorskie shadery płynów GLSL', 'Silnik symulacji fizyki', 'Integracja warstwy dźwiękowej', 'Responsywny pipeline viewportu'], mediaAlt: 'Płynne doświadczenie WebGL 3D Eclipse Ink' },
    'jarvis-odkutka': { category: 'SYSTEM AI I AGENCI MULTIMODALNI', subtitle: 'Autonomiczny silnik multimodalnej AI i dyspozytor agentów czasu rzeczywistego', description: 'Dwukierunkowy pipeline głosowy z kontekstem wieloturowym i automatyczną orkiestracją zadań w tle.', longDescription: 'Produkcyjne stanowisko agentowe zapewnia szybkie rozumienie mowy, dynamiczne użycie narzędzi i pamięć grafową, uzupełnione diagnostyką na żywo oraz odpornym mechanizmem awaryjnym.', role: 'Architekt systemu i Full-Stack AI Engineer', deliverables: ['Strumieniowy pipeline audio', 'Dyspozytor wielu agentów', 'Interfejs diagnostyczny na żywo', 'System zabezpieczeń'], mediaAlt: 'Stanowisko agenta AI Jarvis Odkutka' },
    'wbrent': { category: 'APLIKACJA WEBOWA I PLATFORMA', subtitle: 'Ekosystem najmu luksusowej architektury', description: 'Edytorialna platforma rezerwacyjna z interaktywnymi planami SVG, dynamicznymi indeksami cen i natychmiastowym filtrowaniem.', longDescription: 'WBRent łączy edytorialny minimalizm z błyskawiczną obsługą po stronie klienta, szczegółowymi planami wnętrz, lokalnymi walutami i zautomatyzowanymi ścieżkami rezerwacji.', role: 'Principal Engineer i Product Designer', deliverables: ['Silnik interaktywnych planów', 'Wielowalutowy proces rezerwacji', 'Integracja headless CMS', 'Routing i cache na edge'], mediaAlt: 'Platforma najmu architektury WBRent' },
    'wbtrade': { category: 'AUTOMATYZACJA I TERMINAL FINANSOWY', subtitle: 'Algorytmiczny terminal finansowy i analityka wysokiej częstotliwości', description: 'Niskolatencyjne stanowisko monitoringu rynku z wykresami canvas, mapą głębokości zleceń i webhookami automatycznej egzekucji.', longDescription: 'WBTrade przesyła tickowe dane rynkowe przez multipleksowane WebSockety i oblicza wskaźniki ilościowe w przeglądarce przez WebAssembly. Modułowe obszary robocze, automatyczne zabezpieczenia i natychmiastowa ocena ryzyka utrzymują czytelność złożonych danych.', role: 'Frontend Architect i Performance Engineer', deliverables: ['Autorski silnik wykresów Canvas', 'Biblioteka wskaźników WebAssembly', 'System dokowania na wiele monitorów', 'Pakiet kalkulacji ryzyka'], mediaAlt: 'Algorytmiczny terminal transakcyjny WBTrade' },
    'happyplay': { category: 'PRODUKT KREATYWNY I DOŚWIADCZENIE CYFROWE', subtitle: 'Grywalizowany ekosystem cyfrowy i interaktywna platforma edukacyjna', description: 'Autorski produkt łączący zabawną estetykę 3D, modułowe ścieżki edukacyjne, wyzwania społeczności i dotykową fizykę.', longDescription: 'Happy Play, stworzone dla WB Foundation, jest immersyjnym cyfrowym placem zabaw. Każdy przycisk, odznaka i pierścień postępu wykorzystuje celowy ruch oraz dźwięk, by nauka przypominała żywą eksplorację.', role: 'Creative Developer i Interaction Designer', deliverables: ['System mikrointerakcji', 'Logika grywalizacji', 'Fizyczny canvas cząsteczkowy', 'Gesty dotykowe na urządzeniach mobilnych'], mediaAlt: 'Platforma edukacyjna Happy Play' },
  },
};

export const TRANSLATIONS: Record<Language, Dictionary> = { en, pl };
