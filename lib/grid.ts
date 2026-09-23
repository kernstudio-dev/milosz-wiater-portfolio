export type SectionId = 'hero' | 'work' | 'services' | 'about' | 'footer';

export interface GridMetrics {
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

export function computeMaxWidth(vw: number, blockSize: number): number {
  let w = Math.round((vw * 0.9) / blockSize) * blockSize;
  w = Math.min(w, Math.floor((vw * 0.94) / blockSize) * blockSize);
  w = Math.max(w, 6 * blockSize);
  return w;
}

export function computeGridMetrics(vw: number, vh: number): GridMetrics {
  const pinnedBlock = Math.round(vh / 12);
  const isPinned = computeIsPinnedLayout(vw, vh, pinnedBlock);
  const blockSize = isPinned ? pinnedBlock : Math.max(54, Math.min(60, Math.round(vw / 14)));
  const maxWidth = computeMaxWidth(vw, blockSize);
  const sectionCols = isPinned
    ? Math.min(30, Math.floor(maxWidth / blockSize))
    : Math.min(14, Math.floor(maxWidth / blockSize));
  const xOffset = (vw - Math.min(maxWidth, sectionCols * blockSize)) / 2;

  return {
    blockSize,
    maxWidth,
    sectionCols,
    xOffset,
    isPinned,
    rows: isPinned ? 12 : Math.max(8, Math.round(vh / blockSize)),
  };
}

/** Placeholder rects inside pinning-container (grid origin y=180 for hero/work/etc). */
export function getPlaceholderRect(section: SectionId, bs: number): PlaceholderRect {
  const gridTop = 2 * bs;

  switch (section) {
    case 'hero':
      return { x: 7 * bs, y: gridTop + 1 * bs, width: 6 * bs, height: 6 * bs };
    case 'work':
      return { x: 0, y: gridTop + 1 * bs, width: 5 * bs, height: 6 * bs };
    case 'services':
      return { x: 7 * bs, y: gridTop + 3 * bs, width: 6 * bs, height: 5 * bs };
    case 'about':
      return { x: 7 * bs, y: gridTop + 3 * bs, width: 6 * bs, height: 5 * bs };
    case 'footer':
      return { x: 7 * bs, y: gridTop + 1 * bs, width: 6 * bs, height: 6 * bs };
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
