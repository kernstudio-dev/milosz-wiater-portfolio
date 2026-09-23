import type { SectionId } from './grid';

/**
 * PHASE 3 — Section → orb position → size → shape → page movement → trigger
 * All values for pinned desktop @ 1920×1080 (bs=90).
 */

export interface OrbSectionConfig {
  wobble: number;
  wobbleType: number;
  curl: number;
  curlFrequency: number;
  lockShell: number;
  rotationSpeed: number;
  scale: number;
  morphTrigger: 'onActive' | 'onSticky';
  colorMix?: number;
  rim?: number;
  tangential?: number;
}

export const WOBBLE_TYPES = {
  ORGANIC: 0,
  SPIKY: 1,
  SHATTER: 2,
  SPIKE_BURST: 3,
  CORONA: 4,
  CUBE_LATTICE: 8,
  NEBULA: 9,
} as const;

export const BUBBLE_CONFIG: Record<SectionId, OrbSectionConfig> = {
  hero: {
    wobble: 0.56,
    wobbleType: WOBBLE_TYPES.NEBULA,
    curl: 0,
    curlFrequency: 0.05,
    lockShell: 0,
    rotationSpeed: 0.3,
    scale: 1,
    morphTrigger: 'onActive',
  },
  work: {
    wobble: 0,
    wobbleType: WOBBLE_TYPES.ORGANIC,
    curl: 0.98,
    curlFrequency: 0.36,
    lockShell: 1,
    rotationSpeed: 0.4,
    scale: 1,
    morphTrigger: 'onSticky',
    tangential: 1,
  },
  services: {
    wobble: 1,
    wobbleType: WOBBLE_TYPES.SPIKE_BURST,
    curl: 0,
    curlFrequency: 0.05,
    lockShell: 1,
    rotationSpeed: 0.4,
    scale: 1,
    morphTrigger: 'onSticky',
    colorMix: 1,
    rim: 0.6,
  },
  about: {
    wobble: 1,
    wobbleType: WOBBLE_TYPES.CORONA,
    curl: 0,
    curlFrequency: 0.05,
    lockShell: 1,
    rotationSpeed: 0.4,
    scale: 1,
    morphTrigger: 'onSticky',
  },
  footer: {
    wobble: 0,
    wobbleType: WOBBLE_TYPES.ORGANIC,
    curl: 0,
    curlFrequency: 0.05,
    lockShell: 1,
    rotationSpeed: 0.4,
    scale: 1.15,
    morphTrigger: 'onSticky',
  },
};

/** Hero morph presets along scroll 0 → 0.5 */
export const HERO_MORPH_END = 0.5;

/** Work: content slides left 450px between p 0.25–0.40; orb stays at (285,540). */
export const WORK_SLIDE = { start: 0.25, end: 0.4, px: 450 };

/** Services: orb x slides 960→1590 between p 0.62–0.70. */
export const SERVICES_ORB_SLIDE = { start: 0.62, end: 0.7, fromX: 960, toX: 1590, y: 495 };

/** About: rotY driven by (p-0.2)/0.8; ticker translateX 0→498 from p 0.35. */
export const ABOUT_ROT = { start: 0.2, end: 1, degrees: 900 };
export const ABOUT_TICKER = { start: 0.35, end: 1, px: 498 };

/** Pin start progress for sections using offset ["start end","end end"]. */
export const PIN_START: Partial<Record<SectionId, number>> = {
  work: 1 / 6,
  services: 1 / 6,
  about: 1 / 4,
};

export const SECTION_ORDER: SectionId[] = ['hero', 'work', 'services', 'about', 'footer'];
