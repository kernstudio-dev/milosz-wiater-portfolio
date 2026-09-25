import type { Language } from './translations';

/**
 * Case-study storytelling copy. Drafted from the project descriptions in
 * data/projects.ts — review and replace with first-hand detail where needed.
 *
 * `crops` are object-position focal points into the single project image, used
 * to build detail moments (x% y% zoom).
 */
export type CaseStudyCopy = {
  statement: string;
  challengeTitle: string;
  challenge: string;
  approachTitle: string;
  approach: string;
  build: { title: string; text: string }[];
  closing: string;
};

export type CaseStudyVisuals = {
  crops: { x: number; y: number; zoom: number }[];
  accent: string;
};

export const CASE_VISUALS: Record<string, CaseStudyVisuals> = {
  'eclipse-ink': { accent: '#b15ee8', crops: [{ x: 48, y: 42, zoom: 1.9 }, { x: 88, y: 30, zoom: 2.4 }, { x: 30, y: 78, zoom: 2.1 }, { x: 70, y: 70, zoom: 1.7 }] },
  'jarvis-odkutka': { accent: '#e96c24', crops: [{ x: 18, y: 28, zoom: 2.2 }, { x: 50, y: 30, zoom: 2 }, { x: 88, y: 45, zoom: 2.1 }, { x: 45, y: 80, zoom: 2.3 }] },
  wbrent: { accent: '#2f6cff', crops: [{ x: 30, y: 40, zoom: 1.9 }, { x: 78, y: 45, zoom: 2.2 }, { x: 40, y: 78, zoom: 2.4 }, { x: 85, y: 80, zoom: 2 }] },
  wbtrade: { accent: '#43cabc', crops: [{ x: 35, y: 40, zoom: 2 }, { x: 80, y: 30, zoom: 2.3 }, { x: 25, y: 80, zoom: 2.2 }, { x: 75, y: 75, zoom: 2 }] },
  happyplay: { accent: '#8aa19b', crops: [{ x: 30, y: 45, zoom: 2.2 }, { x: 62, y: 45, zoom: 2 }, { x: 45, y: 70, zoom: 2.4 }, { x: 55, y: 30, zoom: 2.1 }] },
};

const en: Record<string, CaseStudyCopy> = {
  'eclipse-ink': {
    statement: 'A study in liquid form — where shader code behaves like a physical material and scrolling becomes a camera move.',
    challengeTitle: 'Make an abstract material feel tangible in a browser.',
    challenge: 'Liquid chrome only reads as real when light, motion and response stay coherent at every frame. The experience had to stay cinematic without dropping below a fluid frame rate on ordinary hardware.',
    approachTitle: 'Treat the page as a single lit scene.',
    approach: 'Custom GLSL vertex and fragment shaders drive the surface, while scroll choreography moves the camera instead of the layout. Typography and interface stay quiet so the material carries the story.',
    build: [
      { title: 'Shader surface', text: 'Vertex displacement and reflective fragment shading tuned for a heavy, liquid read.' },
      { title: 'Camera choreography', text: 'Scroll position mapped to camera paths, framing each moment like an edit.' },
      { title: 'Interaction response', text: 'Pointer input bends the material locally, with damping so it never feels jittery.' },
      { title: 'Performance pipeline', text: 'Responsive viewport pipeline that scales quality to the device, not the other way round.' },
    ],
    closing: 'An experimental artifact that doubles as a technical proof: real-time material, directed like film.',
  },
  'jarvis-odkutka': {
    statement: 'A voice-first AI workstation that listens, reasons and acts — with every step visible to the person in charge.',
    challengeTitle: 'Make a multi-agent system feel immediate and trustworthy.',
    challenge: 'Real-time speech, tool execution and memory create a lot of moving parts. The system needed to respond at conversational speed while keeping its reasoning, state and failures legible.',
    approachTitle: 'Stream everything, surface what matters.',
    approach: 'A bi-directional audio pipeline feeds a dispatcher that routes work to specialised agents. A live diagnostic interface shows context, tool calls and system health so a human can follow and intervene.',
    build: [
      { title: 'Streaming audio', text: 'Speech-to-speech loop over WebSockets with a resilient local fallback.' },
      { title: 'Agent dispatcher', text: 'Multi-turn context graph routing tasks to tools and background workers.' },
      { title: 'Live diagnostics', text: 'Telemetry interface exposing latency, memory and agent activity in real time.' },
      { title: 'Guardrails', text: 'Safety layer that validates actions and recovers from errors automatically.' },
    ],
    closing: 'An assistant that behaves like a colleague: fast to answer, clear about what it is doing.',
  },
  wbrent: {
    statement: 'An editorial booking platform for exceptional architecture — calm on the surface, fast and exact underneath.',
    challengeTitle: 'Sell space, not listings.',
    challenge: 'High-value rentals are chosen on atmosphere and precision at the same time. The platform had to feel like a design publication while filtering, pricing and booking instantly.',
    approachTitle: 'Editorial layout, instant interaction.',
    approach: 'Generous typography and photography lead, while interactive floor plans, pricing indices and currency logic run client-side. Content flows from a headless CMS and is cached at the edge.',
    build: [
      { title: 'Interactive floor plans', text: 'SVG plans with room-level detail, linked to the gallery and availability.' },
      { title: 'Pricing index', text: 'Dynamic price trends and localized currencies calculated in the browser.' },
      { title: 'Booking flow', text: 'Multi-currency booking with automated confirmation steps.' },
      { title: 'Edge delivery', text: 'Headless CMS content routed and cached at the edge for instant pages.' },
    ],
    closing: 'A platform where the interface steps back and the architecture takes the lead.',
  },
  wbtrade: {
    statement: 'A market terminal that turns tick-level noise into decisions you can read at a glance.',
    challengeTitle: 'Render live markets without losing the human.',
    challenge: 'Streaming order books, indicators and positions can overwhelm both the browser and the trader. The terminal needed native-level rendering speed and a hierarchy that stays legible under pressure.',
    approachTitle: 'Compute close to the pixels.',
    approach: 'Multiplexed WebSocket feeds are processed by WebAssembly indicators and drawn by a custom canvas charting engine. Modular docking workspaces let each trader shape the view around their strategy.',
    build: [
      { title: 'Canvas charting engine', text: 'Custom renderer for candles, depth and overlays at streaming frame rates.' },
      { title: 'WebAssembly indicators', text: 'Quantitative indicators computed in Rust, running inside the browser.' },
      { title: 'Docking workspaces', text: 'Multi-monitor layouts that persist per strategy.' },
      { title: 'Risk suite', text: 'Automated safeguards and instant visual risk assessment.' },
    ],
    closing: 'Serious performance engineering, presented as a calm, focused instrument.',
  },
  happyplay: {
    statement: 'A digital playground for WB Foundation where learning is explored, not consumed.',
    challengeTitle: 'Make education feel like play without losing structure.',
    challenge: 'Young learners leave anything that feels like homework. The product needed real learning paths, progress and community challenges wrapped in an experience that rewards curiosity.',
    approachTitle: 'Every interaction answers back.',
    approach: 'A micro-interaction system gives each button, badge and progress ring physical motion and audio feedback. Gamification logic ties it together while a physics canvas keeps the world tactile.',
    build: [
      { title: 'Micro-interaction system', text: 'Shared motion and sound language across every component.' },
      { title: 'Learning paths', text: 'Modular tracks, progress rings and rewards driven by gamification logic.' },
      { title: 'Physics canvas', text: 'Tactile particle world built with Matter.js.' },
      { title: 'Touch-first', text: 'Gestures and layouts designed for small hands on mobile devices.' },
    ],
    closing: 'A product that proves playful and purposeful can be the same thing.',
  },
};

const pl: Record<string, CaseStudyCopy> = {
  'eclipse-ink': {
    statement: 'Studium płynnej formy — kod shaderów zachowuje się jak fizyczny materiał, a scroll staje się ruchem kamery.',
    challengeTitle: 'Nadać abstrakcyjnemu materiałowi namacalność w przeglądarce.',
    challenge: 'Płynny chrom wygląda prawdziwie tylko wtedy, gdy światło, ruch i reakcja są spójne w każdej klatce. Doświadczenie musiało pozostać filmowe bez spadku płynności na zwykłym sprzęcie.',
    approachTitle: 'Strona jako jedna oświetlona scena.',
    approach: 'Autorskie shadery GLSL sterują powierzchnią, a choreografia scrolla porusza kamerą zamiast układem. Typografia i interfejs pozostają ciche, aby to materiał prowadził narrację.',
    build: [
      { title: 'Powierzchnia shaderowa', text: 'Deformacja wierzchołków i odbicia dostrojone do ciężkiego, płynnego charakteru.' },
      { title: 'Choreografia kamery', text: 'Pozycja scrolla zmapowana na ścieżki kamery, kadrujące każdy moment jak montaż.' },
      { title: 'Reakcja na interakcję', text: 'Kursor lokalnie ugina materiał, z tłumieniem, by nic nie drgało.' },
      { title: 'Pipeline wydajności', text: 'Jakość skalowana do urządzenia, a nie odwrotnie.' },
    ],
    closing: 'Eksperymentalny artefakt i techniczny dowód: materiał w czasie rzeczywistym, reżyserowany jak film.',
  },
  'jarvis-odkutka': {
    statement: 'Stanowisko AI sterowane głosem, które słucha, rozumuje i działa — a każdy krok jest widoczny dla człowieka.',
    challengeTitle: 'Sprawić, by system wielu agentów był natychmiastowy i godny zaufania.',
    challenge: 'Mowa w czasie rzeczywistym, wykonywanie narzędzi i pamięć to wiele ruchomych części. System musiał odpowiadać w tempie rozmowy, zachowując czytelność rozumowania, stanu i błędów.',
    approachTitle: 'Strumieniować wszystko, pokazywać to, co ważne.',
    approach: 'Dwukierunkowy pipeline audio zasila dyspozytora kierującego zadania do wyspecjalizowanych agentów. Interfejs diagnostyczny na żywo pokazuje kontekst, wywołania narzędzi i stan systemu.',
    build: [
      { title: 'Strumieniowe audio', text: 'Pętla mowa–mowa przez WebSockets z odpornym trybem lokalnym.' },
      { title: 'Dyspozytor agentów', text: 'Graf kontekstu wieloturowego kierujący zadania do narzędzi i procesów w tle.' },
      { title: 'Diagnostyka na żywo', text: 'Telemetria opóźnień, pamięci i aktywności agentów w czasie rzeczywistym.' },
      { title: 'Zabezpieczenia', text: 'Warstwa walidująca akcje i automatycznie naprawiająca błędy.' },
    ],
    closing: 'Asystent, który zachowuje się jak współpracownik: szybko odpowiada i jasno mówi, co robi.',
  },
  wbrent: {
    statement: 'Edytorialna platforma rezerwacji wyjątkowej architektury — spokojna na powierzchni, szybka i precyzyjna pod spodem.',
    challengeTitle: 'Sprzedawać przestrzeń, a nie ogłoszenia.',
    challenge: 'Luksusowe wynajmy wybiera się jednocześnie emocją i precyzją. Platforma musiała wyglądać jak publikacja o designie, a przy tym natychmiast filtrować, wyceniać i rezerwować.',
    approachTitle: 'Edytorialny układ, natychmiastowa interakcja.',
    approach: 'Typografia i fotografia prowadzą, a interaktywne plany, indeksy cen i logika walut działają po stronie klienta. Treści płyną z headless CMS i są cache’owane na edge.',
    build: [
      { title: 'Interaktywne plany', text: 'Plany SVG z detalem pomieszczeń, powiązane z galerią i dostępnością.' },
      { title: 'Indeks cen', text: 'Dynamiczne trendy cenowe i lokalne waluty liczone w przeglądarce.' },
      { title: 'Proces rezerwacji', text: 'Wielowalutowa rezerwacja z automatycznymi potwierdzeniami.' },
      { title: 'Dostarczanie na edge', text: 'Treści z headless CMS routowane i cache’owane dla natychmiastowych stron.' },
    ],
    closing: 'Platforma, w której interfejs ustępuje miejsca architekturze.',
  },
  wbtrade: {
    statement: 'Terminal rynkowy, który zamienia szum ticków w decyzje czytelne w jednym spojrzeniu.',
    challengeTitle: 'Renderować żywy rynek, nie gubiąc człowieka.',
    challenge: 'Strumieniowe arkusze zleceń, wskaźniki i pozycje mogą przytłoczyć zarówno przeglądarkę, jak i tradera. Terminal potrzebował szybkości natywnej aplikacji i hierarchii czytelnej pod presją.',
    approachTitle: 'Liczyć blisko pikseli.',
    approach: 'Multipleksowane strumienie WebSocket przetwarzają wskaźniki WebAssembly, a autorski silnik canvas rysuje wykresy. Modułowe obszary robocze pozwalają dopasować widok do strategii.',
    build: [
      { title: 'Silnik wykresów canvas', text: 'Autorski renderer świec, głębokości i nakładek w tempie strumienia.' },
      { title: 'Wskaźniki WebAssembly', text: 'Wskaźniki ilościowe w Rust, działające w przeglądarce.' },
      { title: 'Dokowane obszary', text: 'Układy na wiele monitorów zapisywane dla każdej strategii.' },
      { title: 'Pakiet ryzyka', text: 'Automatyczne zabezpieczenia i natychmiastowa wizualna ocena ryzyka.' },
    ],
    closing: 'Poważna inżynieria wydajności podana jako spokojne, skupione narzędzie.',
  },
  happyplay: {
    statement: 'Cyfrowy plac zabaw dla WB Foundation, w którym naukę się odkrywa, a nie konsumuje.',
    challengeTitle: 'Sprawić, by edukacja była zabawą, nie tracąc struktury.',
    challenge: 'Młodzi użytkownicy porzucają wszystko, co przypomina pracę domową. Produkt potrzebował prawdziwych ścieżek nauki, postępów i wyzwań w doświadczeniu nagradzającym ciekawość.',
    approachTitle: 'Każda interakcja odpowiada.',
    approach: 'System mikrointerakcji nadaje każdemu przyciskowi, odznace i pierścieniowi postępu fizyczny ruch i dźwięk. Logika grywalizacji spina całość, a canvas z fizyką utrzymuje dotykowy charakter.',
    build: [
      { title: 'System mikrointerakcji', text: 'Wspólny język ruchu i dźwięku we wszystkich komponentach.' },
      { title: 'Ścieżki nauki', text: 'Modułowe ścieżki, pierścienie postępu i nagrody sterowane grywalizacją.' },
      { title: 'Canvas z fizyką', text: 'Dotykowy świat cząsteczek zbudowany w Matter.js.' },
      { title: 'Przede wszystkim dotyk', text: 'Gesty i układy projektowane dla małych dłoni na urządzeniach mobilnych.' },
    ],
    closing: 'Produkt, który udowadnia, że zabawa i cel mogą być tym samym.',
  },
};

export const CASE_STUDIES: Record<Language, Record<string, CaseStudyCopy>> = { en, pl };
