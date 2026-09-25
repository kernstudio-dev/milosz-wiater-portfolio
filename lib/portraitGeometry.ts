import type { SectionId } from './grid';

/**
 * Portrait layout geometry, measured by each PinnedSection (on resize / reflow,
 * never per frame) and read by the orb every frame.
 *
 * Coordinates of `hole` are relative to the section's frame (its
 * pinning-container), snapped to whole grid cells.
 */
export type Rect = { x: number; y: number; w: number; h: number };

export type PortraitSection = {
  /** document offset + height of the <section> */
  top: number;
  height: number;
  /** frame (pinning-container) height */
  frame: number;
  sticky: boolean;
  hole: Rect | null;
};

export const SECTION_ORDER: SectionId[] = ['hero', 'work', 'services', 'about', 'footer'];

const sections: Partial<Record<SectionId, PortraitSection>> = {};

export function setPortraitSection(id: SectionId, value: PortraitSection | null) {
  if (value) sections[id] = value;
  else delete sections[id];
}

export function getPortraitSections() {
  return sections;
}

/** Grid cells whose centre lies inside `slot` — the same test SectionGrid uses. */
export function snapToCells(slot: Rect, bs: number, leftEdge: number): Rect | null {
  const c0 = Math.ceil((slot.x - leftEdge) / bs - .5);
  const c1 = Math.floor((slot.x + slot.w - leftEdge) / bs - .5 - 1e-6);
  const r0 = Math.ceil(slot.y / bs - .5);
  const r1 = Math.floor((slot.y + slot.h) / bs - .5 - 1e-6);
  if (c1 < c0 || r1 < r0) return null;
  return { x: leftEdge + c0 * bs, y: r0 * bs, w: (c1 - c0 + 1) * bs, h: (r1 - r0 + 1) * bs };
}

/** Screen-space top of a section's frame at scroll position `y`. */
export function frameTop(section: PortraitSection, y: number) {
  if (!section.sticky) return section.top - y;
  return Math.min(Math.max(section.top - y, 0), section.top + section.height - section.frame - y);
}
