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
  services: 1000,
  about: 400,
  footer: 100,
};

/**
 * Total scroll distance of the pinned desktop page in vh: sections stack with
 * a one-viewport overlap each, and the last viewport is the screen itself.
 * Orb keyframes are authored in vh of scroll and converted with `V()`, so a
 * section can change length without every later keyframe drifting.
 */
export const TOTAL_SCROLL_VH = (() => {
  const ids: SectionId[] = ['hero', 'work', 'services', 'about', 'footer'];
  return ids.reduce((sum, id, i) => sum + SECTION_SCROLL_VH[id] - (i === 0 ? 0 : 100), 0) - 100;
})();

/** vh of scroll → globalProgress */
export const V = (vh: number) => vh / TOTAL_SCROLL_VH;

/** Scroll position (vh) where each section's frame settles at the top (desktop). */
export const SECTION_START_VH: Record<SectionId, number> = (() => {
  const ids: SectionId[] = ['hero', 'work', 'services', 'about', 'footer'];
  const out = {} as Record<SectionId, number>;
  let top = 0;
  ids.forEach((id, i) => {
    if (i > 0) top -= 100;
    out[id] = top;
    top += SECTION_SCROLL_VH[id];
  });
  return out;
})();

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
