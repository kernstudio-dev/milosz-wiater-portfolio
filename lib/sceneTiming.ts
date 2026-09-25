import type { SectionId } from './grid';

/**
 * Scene overlap model (pinned desktop).
 *
 * Every section after the hero starts one viewport before the previous one
 * ends (margin-top: -100svh). That shared viewport of scroll is the
 * OVERLAP WINDOW. Inside it:
 *
 *   w = 0 ─────────────── .35 ── .6 ─────────────── 1
 *   outgoing content exits (masks)
 *                          grids cross-fade (identical, invisible)
 *                                 incoming content enters (masks)
 *   orb travels ─────────────────────────────────────────────▶
 *
 * `enter` is the incoming window progress of a section, `leave` is the
 * window progress of the NEXT section (i.e. this section's exit).
 */
export const SECTION_SCROLL_VH: Record<SectionId, number> = {
  hero: 200,
  work: 600,
  services: 600,
  about: 400,
  footer: 100,
};

const NEXT: Record<SectionId, SectionId | null> = {
  hero: 'work',
  work: 'services',
  services: 'about',
  about: 'footer',
  footer: null,
};

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

/** Fraction of a section's own progress that the entry overlap occupies. */
export function overlapFraction(id: SectionId) {
  return 100 / SECTION_SCROLL_VH[id];
}

export function enterProgress(id: SectionId, progress: Record<SectionId, number>) {
  if (id === 'hero') return 1;
  return clamp01(progress[id] / overlapFraction(id));
}

export function leaveProgress(id: SectionId, progress: Record<SectionId, number>) {
  const next = NEXT[id];
  if (!next) return 0;
  return clamp01(progress[next] / overlapFraction(next));
}

/** Container cross-fade inside the window. */
export const CROSSFADE = { start: .36, span: .24 };
