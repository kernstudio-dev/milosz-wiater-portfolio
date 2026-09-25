export type SectionId = 'hero' | 'work' | 'services' | 'about' | 'footer';

export type LayoutMode = 'pinned' | 'portrait' | 'flow';

export interface GridMetrics {
  /** pinned: desktop scenes · portrait: phones/tablets upright · flow: other short/narrow screens */
  layout: LayoutMode;
  blockSize: number;
  maxWidth: number;
  sectionCols: number;
  xOffset: number;
  isPinned: boolean;
  rows: number;
}

export interface PlaceholderRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Pinned desktop layout: 12 rows, block = round(vh/12). */
export function computeIsPinnedLayout(vw: number, vh: number, blockSize: number): boolean {
  const aspect = vw / vh;
  const maxWidth = computeMaxWidth(vw, blockSize);
  const cols = Math.floor(maxWidth / blockSize);
  return vh >= 648 && aspect >= 1.418 && cols >= 16;
}

/** Round to an even block count: 2 * round(0.9*vw / (2*bs)) * bs, capped at 94%. */
export function computeMaxWidth(vw: number, blockSize: number): number {
  const pair = blockSize * 2;
  let w = Math.round((vw * 0.9) / pair) * pair;
  w = Math.min(w, Math.floor((vw * 0.94) / pair) * pair);
  w = Math.max(w, 6 * blockSize);
  return w;
}

/** Upright screens get their own composition (see html[data-layout="portrait"]). */
export function isPortraitScreen(vw: number, vh: number): boolean {
  return vw / vh < 1 && vw <= 1100;
}

/**
 * Portrait grid: whole columns of ~56px inside a margin of 5vw (16–40px), so
 * content frames and the background grid share the same lines on every phone.
 * Depends on width only — the mobile browser bar changing the height never
 * reflows the layout.
 */
function computePortraitMetrics(vw: number, vh: number): GridMetrics {
  const margin = Math.max(16, Math.min(40, vw * .05));
  const content = vw - margin * 2;
  const cols = Math.max(4, Math.round(content / 56));
  const blockSize = Math.floor(content / cols);
  const maxWidth = cols * blockSize;
  return {
    layout: 'portrait',
    blockSize,
    maxWidth,
    sectionCols: cols,
    xOffset: Math.round((vw - maxWidth) / 2),
    isPinned: false,
    rows: Math.ceil(vh / blockSize) + 1,
  };
}

export function computeGridMetrics(vw: number, vh: number): GridMetrics {
  const pinnedBlock = Math.round(vh / 12);
  const isPinned = computeIsPinnedLayout(vw, vh, pinnedBlock);
  if (!isPinned && isPortraitScreen(vw, vh)) return computePortraitMetrics(vw, vh);
  const blockSize = isPinned ? pinnedBlock : Math.max(54, Math.min(60, Math.round(vw / 14)));
  const maxWidth = computeMaxWidth(vw, blockSize);
  const sectionCols = isPinned
    ? Math.min(30, Math.floor(maxWidth / blockSize))
    : Math.min(14, Math.floor(maxWidth / blockSize));
  const xOffset = (vw - Math.min(maxWidth, sectionCols * blockSize)) / 2;

  return {
    layout: isPinned ? 'pinned' : 'flow',
    blockSize,
    maxWidth,
    sectionCols,
    xOffset,
    isPinned,
    rows: isPinned ? 12 : Math.max(8, Math.round(vh / blockSize)),
  };
}

/**
 * Placeholder rects in pinning-container space.
 * Content grid starts at y = 2 blocks. Hero/work/footer orbs are centred in that band.
 * Services rest position is 7 blocks right of centre (the slide starts at -7 blocks).
 */
export function getPlaceholderRect(section: SectionId, bs: number, cols = 20): PlaceholderRect {
  const y0 = 3 * bs;
  const centeredX = (Math.floor(cols / 2) - 3) * bs;

  switch (section) {
    case 'hero':
      return { x: centeredX, y: y0, width: 6 * bs, height: 6 * bs };
    case 'work':
      return { x: 0, y: y0, width: 6 * bs, height: 6 * bs };
    case 'services':
      return { x: Math.max(0, cols - 6) * bs, y: y0, width: 6 * bs, height: 5 * bs };
    case 'about':
      return { x: centeredX, y: y0, width: 6 * bs, height: 5 * bs };
    case 'footer':
      return { x: centeredX, y: y0, width: 6 * bs, height: 6 * bs };
  }
}

export function rectCenter(rect: PlaceholderRect) {
  return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
}

/** Section outer scroll heights as multiples of 100vh (pinned desktop). */
export const SECTION_HEIGHT_VH: Record<SectionId, number | 'auto'> = {
  hero: 200,
  work: 600,
  services: 600,
  about: 400,
  footer: 100,
};

export function scaleFontSize(base: number, step: number, blockSize: number): number {
  return base + ((blockSize - 71) * step) / 15;
}
