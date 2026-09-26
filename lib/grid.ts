export type SectionId = 'hero' | 'work' | 'services' | 'about' | 'footer';

export type LayoutMode = 'pinned' | 'portrait' | 'landscape' | 'flow';

export interface GridMetrics {
  /**
   * pinned: desktop scenes (any landscape screen ≥ 960×600)
   * portrait: upright screens · landscape: short landscape (phones sideways)
   */
  layout: LayoutMode;
  blockSize: number;
  maxWidth: number;
  sectionCols: number;
  xOffset: number;
  /** pinned: the 12-row composition is centred vertically in whole blocks */
  yOffset: number;
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
  return vw / vh < 1;
}

/** Block and column limits: big screens keep the editorial density of 1920×1080. */
const MAX_BLOCK = 100;
const MAX_COLS = 22;

/**
 * Measured layouts (portrait / landscape): whole columns of ~56px inside a
 * side margin, so content frames and the background grid share the same
 * lines. Depends on width only — the mobile browser bar changing the height
 * never reflows the layout. Landscape phones keep clear of the notch.
 */
function computeMeasuredMetrics(vw: number, vh: number, layout: 'portrait' | 'landscape'): GridMetrics {
  const margin = layout === 'landscape'
    ? Math.max(44, Math.min(64, vw * .05))
    : Math.max(16, Math.min(40, vw * .05));
  const content = vw - margin * 2;
  const cols = Math.max(4, Math.round(content / 56));
  const blockSize = Math.floor(content / cols);
  const maxWidth = cols * blockSize;
  return {
    layout,
    blockSize,
    maxWidth,
    sectionCols: cols,
    xOffset: Math.round((vw - maxWidth) / 2),
    yOffset: 0,
    isPinned: false,
    rows: Math.ceil(vh / blockSize) + 1,
  };
}

function pinnedMetrics(vw: number, vh: number, blockSize: number, sectionCols: number): GridMetrics {
  const width = sectionCols * blockSize;
  return {
    layout: 'pinned',
    blockSize,
    maxWidth: width,
    sectionCols,
    xOffset: Math.round((vw - width) / 2),
    yOffset: Math.max(0, Math.round((vh - 12 * blockSize) / 2 / blockSize)) * blockSize,
    isPinned: true,
    rows: Math.max(12, Math.ceil(vh / blockSize)),
  };
}

export function computeGridMetrics(vw: number, vh: number): GridMetrics {
  const pinnedBlock = Math.round(vh / 12);
  if (computeIsPinnedLayout(vw, vh, pinnedBlock)) {
    // Standard desktop: the block is a twelfth of the height (unchanged), capped
    // on very large screens, where the composition is then centred vertically.
    const blockSize = Math.min(pinnedBlock, MAX_BLOCK);
    const cols = Math.min(MAX_COLS, Math.floor(computeMaxWidth(vw, blockSize) / blockSize));
    return pinnedMetrics(vw, vh, blockSize, cols);
  }
  if (isPortraitScreen(vw, vh)) return computeMeasuredMetrics(vw, vh, 'portrait');
  if (vw >= 960 && vh >= 600) {
    // Desktop-shaped but narrow for its height (4:3, 5:4, tablets sideways):
    // the width decides the block, the 12 rows are centred in the height.
    const blockSize = Math.min(pinnedBlock, Math.floor((vw * .92) / 16), MAX_BLOCK);
    const fit = Math.floor((vw * .92) / blockSize);
    const cols = Math.max(16, Math.min(MAX_COLS, fit - (fit % 2)));
    return pinnedMetrics(vw, vh, blockSize, cols);
  }
  return computeMeasuredMetrics(vw, vh, 'landscape');
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
