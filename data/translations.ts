export type Language = 'en' | 'pl';

type ProjectCopy = {
  category: string;
  subtitle: string;
  /** one or two sentences for the Selected Work band */
  summary: string;
  description: string;
  longDescription: string;
  role: string;
  deliverables: string[];
  mediaAlt: string;
  /** alt text for the case study images: detail, challenge, result */
  galleryAlt: [string, string, string];
};

type ServiceCopy = {
  /** title lines, 1–2 */
  title: string[];
  line: string;
  caps: string[];
};

/** Words inside the six service drawings (lib/serviceDrawings.ts). */
type ServiceDrawCopy = {
  /** per drawing: [figure title, scale note] */
  captions: [string, string][];
  web: { viewport: string; brand: string; nav: string; menu: string; headline: [string, string]; para: string; mods: [string, string, string][]; continues: string };
  shop: {
    set: string; crumb: string; name: string; desc: string; finish: string; finishes: [string, string, string]; size: string;
    /** one per variant: Bone M, Smoke L, Rosé M */
    prices: [string, string, string]; note: string; add: string; inBag: string; delivery: string;
  };
  app: {
    /** [label, subtitle] in order: request, availability, hold, payment, confirm, notify, staff, reports */
    nodes: [string, string][]; idle: string; running: string; done: string; strip: string[]; job: string;
  };
  mobile: {
    spring: string; settle: string; context: string; steps: [string, string, string]; samples: string; thumb: [string, string];
    date: string; today: string; back: string; rows: [string, string, string][]; details: [string, string][];
    confirmed: string; sheetTitle: string; sheetLine: string; reminder: string;
  };
  growth: { rate: string; axis: string; week: string; baseline: string; vs: string; tests: string[]; note: string; decimal: string };
  care: { releases: string; uptime: string; uptimeValue: string; features: string[]; months: string[]; today: string; production: string; deploy: string; fix: string };
};

export type Dictionary = {
  route: { start: string; work: string; services: string; about: string; contact: string; end: string };
  navigation: {
    links: string[];
    backTop: string;
    menu: string;
    language: string;
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
    /** section micro-copy, e.g. "02, SELECTED WORK" and "03 CASE STUDIES / 2026" */
    label: string;
    count: string;
    viewCase: string;
    viewProject: string;
    concept: string;
    progress: string;
    plate: string;
    capture: string;
    production: string;
    localBuild: string;
  };
  services: {
    label: string;
    intro: string[];
    lead: string;
    scroll: string;
    navigation: string;
    goTo: string;
    next: string;
    items: ServiceCopy[];
    draw: ServiceDrawCopy;
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
    backTop: 'Back to top', menu: 'Open menu', language: 'Switch language',
    footer: 'KERN · CREATIVE DEVELOPMENT',
  },
  hero: {
    role: 'CREATIVE DEVELOPER', availability: 'AVAILABLE WORLDWIDE', shaping: 'SHAPING', concepts: 'CONCEPTS',
    building: 'BUILDING', experiences: 'EXPERIENCES', open: 'OPEN FOR PROJECTS',
  },
  work: {
    title: 'SELECTED WORK', intro: 'Selected digital products and interactive experiences, from system architecture to launch.',
    cta: 'Start a Project', selectProject: 'Select a project', show: 'Show', previous: 'Previous project', next: 'Next project',
    view: 'VIEW', opening: 'Opening case study',
    label: 'SELECTED WORK', count: 'CASE STUDIES / 2026', viewCase: 'VIEW CASE STUDY', viewProject: 'VIEW PROJECT',
    concept: 'CONCEPT', progress: 'IN PROGRESS', plate: 'PLATE', capture: 'CAPTURE', production: 'PRODUCTION', localBuild: 'LOCAL BUILD',
  },
  services: {
    label: 'SERVICES',
    intro: ['STRATEGY', 'DESIGN', 'TECHNOLOGY'],
    lead: 'Six disciplines. One continuous practice.',
    scroll: 'SCROLL',
    navigation: 'Services',
    goTo: 'Go to',
    next: 'NEXT: ABOUT',
    items: [
      { title: ['WEBSITES'], line: 'Landing pages, business sites and custom interactive websites, built to be remembered.', caps: ['Landing pages', 'Business websites', 'Interactive / custom sites'] },
      { title: ['E-COMMERCE'], line: 'Stores and product experiences that make buying feel effortless.', caps: ['Online stores', 'Product experiences', 'Custom storefronts', 'Payments & checkout'] },
      { title: ['WEB', 'APPLICATIONS'], line: 'Dashboards, booking systems and portals, the tools a business runs on.', caps: ['Dashboards', 'Booking systems', 'Client portals', 'Custom business tools'] },
      { title: ['MOBILE', 'APPLICATIONS'], line: 'Mobile products and cross-platform apps, designed for the hand.', caps: ['Mobile products', 'Cross-platform apps', 'Custom digital experiences'] },
      { title: ['GROWTH'], line: 'SEO, analytics and campaigns connected into one measurable system.', caps: ['Technical SEO', 'Analytics & conversion tracking', 'Google Ads · Meta Ads', 'Conversion landing pages'] },
      { title: ['CARE &', 'DEVELOPMENT'], line: 'Maintenance, updates and steady evolution, long after launch.', caps: ['Maintenance & updates', 'Further development', 'Deployment support', 'Long-term evolution'] },
    ],
    draw: {
      captions: [
        ['LAYOUT SYSTEM', '12 / 8 / 4 COL · 1440 → 834 → 390'],
        ['OBJECT, VARIANT, DECISION', 'VESSEL N°1 · 3 FINISHES · 3 SIZES'],
        ['PRODUCT ARCHITECTURE', 'BOOKING FLOW · 8 SERVICES · 1 JOB'],
        ['GESTURE & CONTEXT', 'SHEET SPRING k 170 · c 14 · THUMB ZONE'],
        ['ITERATIONS', 'CONVERSION RATE · 24 WEEKS · 5 TESTS'],
        ['PRODUCT OVER TIME', 'RELEASES · PATCHES · UPTIME'],
      ],
      web: {
        viewport: 'VIEWPORT · PX', brand: 'Nord Atelier', nav: 'Work    Studio    Journal    Contact', menu: 'Menu',
        headline: ['Built to be', 'remembered.'],
        para: 'We design and build quiet, durable websites for studios that care about the details of their work.',
        mods: [['01', 'Strategy', 'Positioning, structure and content that hold the site together.'], ['02', 'Design', 'A type-led system with room for photography and change.'], ['03', 'Build', 'Fast, accessible and simple to edit for years.']],
        continues: 'CONTINUES',
      },
      shop: {
        set: 'SET 01 · DAYLIGHT 5600 K · SCALE 1:4', crumb: 'N°01 · OBJECTS / VESSELS', name: 'Vessel N°1', desc: 'Hand-thrown stoneware, matte glaze.',
        finish: 'FINISH', finishes: ['Bone', 'Smoke', 'Rosé'], size: 'SIZE', prices: ['€ 240', '€ 310', '€ 260'],
        note: 'INCL. VAT · SHIPS IN 2–3 DAYS', add: 'Add to bag', inBag: 'In your bag: 1', delivery: 'FREE DELIVERY · WED 22 OCT',
      },
      app: {
        nodes: [['REQUEST', 'client portal'], ['AVAILABILITY', 'calendar'], ['HOLD SLOT', 'lock · 10 min'], ['PAYMENT', 'card · blik'], ['CONFIRM', 'booking record'], ['NOTIFY', 'sms · e-mail'], ['STAFF', 'schedule'], ['REPORTS', 'daily ledger']],
        idle: 'idle', running: 'running', done: 'done', strip: ['REQUESTED', 'HELD', 'PAID', 'CONFIRMED', 'NOTIFIED'], job: 'JOB',
      },
      mobile: {
        spring: 'SHEET · SPRING', settle: 'k 170 · c 14 · settle 560 ms', context: 'CONTEXT', steps: ['01 LIST', '02 DETAIL', '03 CONFIRMED'],
        samples: 'FINGER SAMPLES · 60 Hz · SPACING = VELOCITY', thumb: ['THUMB', 'ZONE'],
        date: 'TUE 14 OCT', today: 'Today', back: '← TODAY',
        rows: [['09:00', 'Consultation', 'Studio 1 · 30 min'], ['10:30', 'Haircut · Anna', 'Studio 2 · 45 min'], ['13:15', 'Colour', 'Studio 2 · 90 min'], ['16:00', 'Fitting', 'Studio 3 · 20 min']],
        details: [['STUDIO', '2 · first floor'], ['DURATION', '45 min'], ['WITH', 'Anna K.'], ['REMINDER', '1 h before']],
        confirmed: 'CONFIRMED', sheetTitle: 'Booking confirmed', sheetLine: 'Tue 14 Oct · 10:30 · Studio 2', reminder: 'Reminder set for 09:30.',
      },
      growth: {
        rate: 'CONVERSION RATE', axis: 'CR %', week: 'W', baseline: 'BASELINE', vs: 'VS. BASELINE',
        tests: ['Headline & offer clarity', 'Checkout 3 → 2 steps', 'LCP 2.4 → 1.1 s', 'Ad ↔ landing match', 'Reviews above the fold'],
        note: 'PP · SEQUENTIAL A/B, p < .05', decimal: '.',
      },
      care: {
        releases: 'RELEASES', uptime: 'UPTIME', uptimeValue: '99.98 % · 90 D',
        features: ['Gift cards', 'Waitlist', 'Multi-location', 'Reviews', 'Loyalty', 'Calendar sync', 'Invoices', 'Staff app'],
        months: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
        today: 'TODAY', production: 'PRODUCTION', deploy: 'DEPLOY', fix: 'fix',
      },
    },
  },
  about: {
    title: 'ABOUT', intro: 'Strategy, design and development, connected from concept to launch.', cta: 'Get in touch',
    copy: 'I design and build distinctive digital products for ambitious teams, combining strategy, interaction, development and visual identity as one connected system.',
    portraitAlt: 'KERN creative developer portrait',
  },
  contact: {
    contact: 'Contact', availability: 'Available worldwide', information: 'Information', independent: 'Independent creative development',
    commissions: 'Selected commissions & partnerships', connect: 'Connect', thanks: 'Thank you, your project note is ready.',
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
    switchLanguage: 'Switch language', scroll: 'SCROLL',
    approach: 'APPROACH', build: 'THE BUILD', deliverables: 'DELIVERABLES', year: 'YEAR', allWork: 'All projects', viewNext: 'Open next project',
    project: 'PROJECT', result: 'RESULT', stack: 'STACK', figure: 'FIG.', systemMap: 'System map: four build points',
  },
  projects: {
    'eclipse-ink': {
      category: 'ARTIST PLATFORM / 3D WEB / STORE',
      subtitle: 'Portfolio, commissions and licensed artwork for an independent tattoo artist',
      summary: 'A platform for an independent tattoo artist: a Three.js entry scene, an archive of 26 original designs, commission briefs and a licence store that is not open yet.',
      description: 'A platform for an independent tattoo artist: a Three.js entry scene built from the artist’s own stencils, an archive of 26 original designs, commission briefs and a Stripe licence store held in portfolio mode until sales open.',
      longDescription: 'Eclipse Ink presents original tattoo artwork, custom design commissions and identity work for businesses. Every design has its own plate page with placement, scale and deliverables. The licence store and the owner’s private office are built; the public site runs in portfolio mode, with indicative prices and no checkout.',
      role: 'Design and full-stack development',
      deliverables: ['Three.js entry scene', 'Design archive and plate pages', 'Commission and business briefs', 'Licence store on Stripe (not yet open)', 'Private admin with MFA'],
      mediaAlt: 'Eclipse Ink entry scene: an eclipse sigil over a dark hall with the line Enter the Eclipse',
      galleryAlt: ['Eclipse Ink About page with photographs of the artist’s drawings', 'Eclipse Ink gallery with style filters and design plates', 'Eclipse Ink For Business page for logo and identity work'],
    },
    sori: {
      category: 'E-COMMERCE / STOREFRONT CONCEPT',
      subtitle: 'A Korean skincare storefront, designed and built as a concept',
      summary: 'A Polish K-beauty storefront concept: catalogue filters, INCI ingredient lists, a skin quiz and a cart kept on the device. Prices and reviews are demo data.',
      description: 'A Polish-language K-beauty storefront concept: a filterable catalogue, product pages with full INCI lists, a skin quiz, and a cart, wishlist and comparison kept on the device. Prices, stock and reviews are demonstration data.',
      longDescription: 'SORI explores how a calm, editorial store can make choosing skincare easier. The catalogue filters by skin type and concern, product pages lead with ingredients, and a short quiz suggests a routine. It is a concept: nothing is sold, payments and accounts are not connected, and demonstration data is labelled on the page.',
      role: 'Art direction, design and front-end',
      deliverables: ['Art direction and design system', 'Catalogue with filters', 'Product pages with INCI lists', 'Skin quiz', 'Device-local cart, wishlist and comparison'],
      mediaAlt: 'SORI product page for a PDRN serum with price marked as an example and an add to cart button',
      galleryAlt: ['SORI home page section with a row of products', 'SORI catalogue with price, brand and category filters', 'SORI product page section listing key ingredients'],
    },
    tasma: {
      category: 'PWA / SHIFT SETTLEMENT TOOL',
      subtitle: 'A cash-up tool for small businesses without a full POS',
      summary: 'A phone-first takings calculator with integer money, card, cash and online totals and offline sync to Cloudflare D1, now being rebuilt around shifts.',
      description: 'A phone-first tool for counting a day’s takings: entries like “12,50 + 30”, amounts kept in whole grosze, card, cash and online totals, and an offline queue that syncs to Cloudflare D1. Now being rebuilt around shifts.',
      longDescription: 'Taśma started as a one-screen takings calculator that already runs on phones: it parses sums, keeps money as integers, works offline and syncs when the connection returns. The current work turns it into a shift settlement tool, with opening and closing cash, payouts and a receipt-style report. The shift model and its API are in progress.',
      role: 'Product design and development',
      deliverables: ['Amount parser with integer money', 'Card, cash and online totals', 'Offline mode and sync queue', 'D1 API with same-origin check', 'Shift model (in progress)'],
      mediaAlt: 'Three Taśma screens: the daily total with the entry form, the list of entries, and the summary by payment method',
      galleryAlt: ['Taśma on a phone: total takings and the amount entry form', 'Taśma on a desktop screen with entries, summary and copy panel', 'Taśma summary by payment method next to the list of entries'],
    },
  },
};

const pl: Dictionary = {
  route: { start: 'START', work: 'WYBRANE PROJEKTY', services: 'USŁUGI', about: 'O MNIE', contact: 'KONTAKT', end: 'KONIEC' },
  navigation: {
    links: ['Projekty', 'Usługi', 'O mnie', 'Kontakt'],
    backTop: 'Wróć na początek', menu: 'Otwórz menu', language: 'Zmień język',
    footer: 'KERN · CREATIVE DEVELOPMENT',
  },
  hero: {
    role: 'KREATYWNY DEVELOPER', availability: 'DOSTĘPNY GLOBALNIE', shaping: 'KSZTAŁTUJĘ', concepts: 'KONCEPCJE',
    building: 'TWORZĘ', experiences: 'DOŚWIADCZENIA', open: 'OTWARTY NA PROJEKTY',
  },
  work: {
    title: 'WYBRANE PROJEKTY', intro: 'Wybrane produkty cyfrowe i interaktywne doświadczenia, od architektury systemu po wdrożenie.',
    cta: 'Rozpocznij projekt', selectProject: 'Wybierz projekt', show: 'Pokaż', previous: 'Poprzedni projekt', next: 'Następny projekt',
    view: 'ZOBACZ', opening: 'Otwieranie projektu',
    label: 'WYBRANE PROJEKTY', count: 'STUDIA PROJEKTÓW / 2026', viewCase: 'ZOBACZ STUDIUM', viewProject: 'ZOBACZ PROJEKT',
    concept: 'KONCEPCJA', progress: 'W TRAKCIE', plate: 'PLANSZA', capture: 'ZRZUT', production: 'PRODUKCJA', localBuild: 'WERSJA LOKALNA',
  },
  services: {
    label: 'USŁUGI',
    intro: ['STRATEGIA', 'DESIGN', 'TECHNOLOGIA'],
    lead: 'Sześć dyscyplin. Jedna ciągła praktyka.',
    scroll: 'PRZEWIŃ',
    navigation: 'Usługi',
    goTo: 'Przejdź do',
    next: 'DALEJ: O MNIE',
    items: [
      { title: ['STRONY', 'INTERNETOWE'], line: 'Landing page, strony firmowe i autorskie, interaktywne witryny, tworzone, by zostać w pamięci.', caps: ['Landing page', 'Strony firmowe', 'Interaktywne / autorskie'] },
      { title: ['E-COMMERCE'], line: 'Sklepy i doświadczenia produktowe, w których zakup przychodzi naturalnie.', caps: ['Sklepy internetowe', 'Prezentacja produktu', 'Autorskie storefronty', 'Płatności i checkout'] },
      { title: ['APLIKACJE', 'WEBOWE'], line: 'Panele, systemy rezerwacji i portale, narzędzia, na których działa firma.', caps: ['Panele i dashboardy', 'Systemy rezerwacji', 'Portale klienta', 'Narzędzia na miarę'] },
      { title: ['APLIKACJE', 'MOBILNE'], line: 'Produkty mobilne i aplikacje wieloplatformowe, projektowane pod dłoń.', caps: ['Produkty mobilne', 'Aplikacje cross-platform', 'Autorskie doświadczenia'] },
      { title: ['WZROST'], line: 'SEO, analityka i kampanie połączone w jeden mierzalny system.', caps: ['Techniczne SEO', 'Analityka i śledzenie konwersji', 'Google Ads · Meta Ads', 'Landing page pod konwersję'] },
      { title: ['OPIEKA', 'I ROZWÓJ'], line: 'Utrzymanie, aktualizacje i stały rozwój, długo po premierze.', caps: ['Utrzymanie i aktualizacje', 'Dalszy rozwój', 'Wsparcie wdrożeń', 'Długofalowa ewolucja'] },
    ],
    draw: {
      captions: [
        ['SYSTEM LAYOUTU', '12 / 8 / 4 KOL. · 1440 → 834 → 390'],
        ['OBIEKT, WARIANT, DECYZJA', 'NACZYNIE N°1 · 3 WYKOŃCZENIA · 3 ROZMIARY'],
        ['ARCHITEKTURA PRODUKTU', 'REZERWACJA · 8 USŁUG · 1 ZADANIE'],
        ['GEST I KONTEKST', 'SPRĘŻYNA k 170 · c 14 · STREFA KCIUKA'],
        ['ITERACJE', 'KONWERSJA · 24 TYGODNIE · 5 TESTÓW'],
        ['PRODUKT W CZASIE', 'WYDANIA · POPRAWKI · DOSTĘPNOŚĆ'],
      ],
      web: {
        viewport: 'SZEROKOŚĆ · PX', brand: 'Nord Atelier', nav: 'Prace    Studio    Dziennik    Kontakt', menu: 'Menu',
        headline: ['Zostaje', 'w pamięci.'],
        para: 'Projektujemy i budujemy spokojne, trwałe strony dla pracowni, którym zależy na szczegółach.',
        mods: [['01', 'Strategia', 'Pozycjonowanie, struktura i treść, które trzymają stronę w całości.'], ['02', 'Design', 'System oparty na typografii, z miejscem na zdjęcia i zmiany.'], ['03', 'Wdrożenie', 'Szybka, dostępna i łatwa w edycji przez lata.']],
        continues: 'DALEJ',
      },
      shop: {
        set: 'PLAN 01 · ŚWIATŁO DZIENNE 5600 K · SKALA 1:4', crumb: 'N°01 · OBIEKTY / NACZYNIA', name: 'Naczynie N°1', desc: 'Ręcznie toczona kamionka, matowe szkliwo.',
        finish: 'WYKOŃCZENIE', finishes: ['Kość', 'Dym', 'Róż'], size: 'ROZMIAR', prices: ['890 zł', '990 zł', '940 zł'],
        note: 'Z VAT · WYSYŁKA W 2–3 DNI', add: 'Dodaj do koszyka', inBag: 'W koszyku: 1', delivery: 'DARMOWA DOSTAWA · ŚR 22 PAŹ',
      },
      app: {
        nodes: [['ZAPYTANIE', 'portal klienta'], ['DOSTĘPNOŚĆ', 'kalendarz'], ['BLOKADA', 'termin · 10 min'], ['PŁATNOŚĆ', 'karta · blik'], ['POTWIERDZENIE', 'rekord rezerwacji'], ['POWIADOMIENIE', 'sms · e-mail'], ['ZESPÓŁ', 'grafik'], ['RAPORTY', 'dzienny rejestr']],
        idle: 'czeka', running: 'w toku', done: 'gotowe', strip: ['ZGŁOSZONA', 'ZABLOKOWANA', 'OPŁACONA', 'POTWIERDZONA', 'POWIADOMIONO'], job: 'ZADANIE',
      },
      mobile: {
        spring: 'ARKUSZ · SPRĘŻYNA', settle: 'k 170 · c 14 · stabilizacja 560 ms', context: 'KONTEKST', steps: ['01 LISTA', '02 SZCZEGÓŁ', '03 POTWIERDZENIE'],
        samples: 'PRÓBKI PALCA · 60 Hz · ODSTĘP = PRĘDKOŚĆ', thumb: ['STREFA', 'KCIUKA'],
        date: 'WT 14 PAŹ', today: 'Dziś', back: '← DZIŚ',
        rows: [['09:00', 'Konsultacja', 'Studio 1 · 30 min'], ['10:30', 'Strzyżenie · Anna', 'Studio 2 · 45 min'], ['13:15', 'Koloryzacja', 'Studio 2 · 90 min'], ['16:00', 'Przymiarka', 'Studio 3 · 20 min']],
        details: [['STUDIO', '2 · pierwsze piętro'], ['CZAS', '45 min'], ['Z', 'Anna K.'], ['PRZYPOMN.', '1 h wcześniej']],
        confirmed: 'POTWIERDZONO', sheetTitle: 'Potwierdzone', sheetLine: 'Wt 14 paź · 10:30 · Studio 2', reminder: 'Przypomnienie o 09:30.',
      },
      growth: {
        rate: 'WSPÓŁCZYNNIK KONWERSJI', axis: 'CR %', week: 'T', baseline: 'BAZA', vs: 'WZGLĘDEM BAZY',
        tests: ['Nagłówek i oferta', 'Checkout 3 → 2 kroki', 'LCP 2,4 → 1,1 s', 'Reklama ↔ strona', 'Opinie wyżej'],
        note: 'PP · SEKWENCYJNE A/B, p < 0,05', decimal: ',',
      },
      care: {
        releases: 'WYDANIA', uptime: 'DOSTĘPNOŚĆ', uptimeValue: '99,98 % · 90 D',
        features: ['Karty podarunkowe', 'Lista oczekujących', 'Wiele lokalizacji', 'Opinie', 'Program lojalnościowy', 'Synchronizacja kalendarza', 'Faktury', 'Aplikacja zespołu'],
        months: ['STY', 'LUT', 'MAR', 'KWI', 'MAJ', 'CZE', 'LIP', 'SIE', 'WRZ', 'PAŹ', 'LIS', 'GRU'],
        today: 'DZIŚ', production: 'PRODUKCJA', deploy: 'WDROŻENIE', fix: 'poprawka',
      },
    },
  },
  about: {
    title: 'O MNIE', intro: 'Strategia, design i development, połączone od koncepcji po wdrożenie.', cta: 'Skontaktuj się',
    copy: 'Projektuję i buduję charakterystyczne produkty cyfrowe dla ambitnych zespołów, łącząc strategię, interakcję, development i identyfikację wizualną w jeden spójny system.',
    portraitAlt: 'Portret creative developera KERN',
  },
  contact: {
    contact: 'Kontakt', availability: 'Dostępny globalnie', information: 'Informacje', independent: 'Niezależny creative development',
    commissions: 'Wybrane zlecenia i partnerstwa', connect: 'Napisz', thanks: 'Dziękuję, wiadomość o projekcie jest gotowa.',
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
    switchLanguage: 'Zmień język', scroll: 'PRZEWIŃ',
    approach: 'PODEJŚCIE', build: 'REALIZACJA', deliverables: 'ZAKRES', year: 'ROK', allWork: 'Wszystkie projekty', viewNext: 'Otwórz następny projekt',
    project: 'PROJEKT', result: 'REZULTAT', stack: 'STACK', figure: 'RYS.', systemMap: 'Mapa systemu: cztery elementy realizacji',
  },
  projects: {
    'eclipse-ink': {
      category: 'PLATFORMA ARTYSTY / 3D WEB / SKLEP',
      subtitle: 'Portfolio, zamówienia i licencjonowane projekty niezależnego artysty tatuażu',
      summary: 'Platforma niezależnego artysty tatuażu: scena wejściowa w Three.js, archiwum 26 oryginalnych projektów, formularze zamówień i sklep z licencjami, jeszcze zamknięty.',
      description: 'Platforma niezależnego artysty tatuażu: scena wejściowa w Three.js zbudowana z jego własnych szablonów, archiwum 26 oryginalnych projektów, formularze zamówień i sklep z licencjami na Stripe, wstrzymany w trybie portfolio do startu sprzedaży.',
      longDescription: 'Eclipse Ink prezentuje oryginalne projekty tatuaży, zamówienia projektów na miarę i identyfikację dla firm. Każdy projekt ma własną kartę z miejscem na ciele, skalą i zakresem plików. Sklep z licencjami i prywatny panel właściciela są zbudowane; publiczna strona działa w trybie portfolio, z orientacyjnymi cenami i bez możliwości zakupu.',
      role: 'Projekt i full-stack development',
      deliverables: ['Scena wejściowa w Three.js', 'Archiwum i karty projektów', 'Formularze zamówień i projektów dla firm', 'Sklep z licencjami na Stripe (jeszcze zamknięty)', 'Prywatny panel z MFA'],
      mediaAlt: 'Scena wejściowa Eclipse Ink: sygil zaćmienia nad ciemną salą i napis Enter the Eclipse',
      galleryAlt: ['Strona O mnie Eclipse Ink ze zdjęciami rysunków artysty', 'Galeria Eclipse Ink z filtrami stylów i kartami projektów', 'Strona For Business Eclipse Ink dla logo i identyfikacji'],
    },
    sori: {
      category: 'E-COMMERCE / KONCEPCJA SKLEPU',
      subtitle: 'Sklep z koreańską pielęgnacją, zaprojektowany i zbudowany jako koncepcja',
      summary: 'Koncepcja sklepu z koreańską pielęgnacją: filtry katalogu, składy INCI, quiz i koszyk zapisany na urządzeniu. Ceny i opinie to dane demonstracyjne.',
      description: 'Koncepcja polskiego sklepu z koreańską pielęgnacją: katalog z filtrami, karty produktów z pełnym składem INCI, quiz dobierający pielęgnację oraz koszyk, lista życzeń i porównywarka zapisane na urządzeniu. Ceny, stany i opinie to dane demonstracyjne.',
      longDescription: 'SORI sprawdza, jak spokojny, edytorialny sklep może ułatwić wybór pielęgnacji. Katalog filtruje według typu skóry i potrzeb, karty produktów zaczynają od składu, a krótki quiz podpowiada rutynę. To koncepcja: nic nie jest sprzedawane, płatności i konta nie są podłączone, a dane demonstracyjne są oznaczone na stronie.',
      role: 'Kierunek artystyczny, projekt i front-end',
      deliverables: ['Kierunek artystyczny i system projektowy', 'Katalog z filtrami', 'Karty produktów ze składem INCI', 'Quiz pielęgnacyjny', 'Koszyk, lista życzeń i porównywarka na urządzeniu'],
      mediaAlt: 'Karta produktu SORI dla serum z PDRN z ceną oznaczoną jako przykładowa i przyciskiem dodania do koszyka',
      galleryAlt: ['Sekcja strony głównej SORI z rzędem produktów', 'Katalog SORI z filtrami ceny, marki i kategorii', 'Sekcja karty produktu SORI z kluczowymi składnikami'],
    },
    tasma: {
      category: 'PWA / NARZĘDZIE DO ROZLICZEŃ',
      subtitle: 'Narzędzie do liczenia utargu dla małych firm bez systemu POS',
      summary: 'Kalkulator utargu na telefon: kwoty w groszach, sumy dla karty, gotówki i online oraz synchronizacja offline z D1. Teraz przebudowywany wokół zmian.',
      description: 'Narzędzie na telefon do liczenia dziennego utargu: wpisy typu „12,50 + 30”, kwoty trzymane w całych groszach, sumy dla karty, gotówki i płatności online oraz kolejka offline synchronizowana z Cloudflare D1. Obecnie przebudowywane wokół zmian.',
      longDescription: 'Taśma zaczęła się jako jednoekranowy kalkulator utargu, który już działa na telefonach: rozbiera sumy, trzyma pieniądze jako liczby całkowite, działa offline i synchronizuje się po odzyskaniu połączenia. Obecna praca zmienia go w narzędzie do rozliczania zmian, ze stanem kasy na otwarcie i zamknięcie, wypłatami i raportem w formie paragonu. Model zmian i jego API są w trakcie budowy.',
      role: 'Projekt produktu i development',
      deliverables: ['Parser kwot na liczbach całkowitych', 'Sumy dla karty, gotówki i online', 'Tryb offline i kolejka synchronizacji', 'API na D1 ze sprawdzaniem pochodzenia', 'Model zmian (w trakcie)'],
      mediaAlt: 'Trzy ekrany Taśmy: łączny utarg z formularzem, lista wpisów i podsumowanie według metod płatności',
      galleryAlt: ['Taśma na telefonie: łączny utarg i formularz kwoty', 'Taśma na ekranie komputera z wpisami, podsumowaniem i panelem do skopiowania', 'Podsumowanie Taśmy według metod płatności obok listy wpisów'],
    },
  },
};

export const TRANSLATIONS: Record<Language, Dictionary> = { en, pl };
