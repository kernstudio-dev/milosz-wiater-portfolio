'use client';

import { memo, useMemo } from 'react';
import type { GridMetrics } from '@/lib/grid';
import type { PlaceholderRect } from '@/lib/grid';

interface SectionGridProps {
  metrics: GridMetrics;
  bubbleHole?: PlaceholderRect | null;
  /** row count override (portrait frames cover their full height) */
  rows?: number;
}

type Cell = { key: string; left: number; top: number };

function cellCenterInHole(colLeft: number, rowTop: number, bs: number, hole: PlaceholderRect): boolean {
  const cx = colLeft + bs / 2;
  const cy = rowTop + bs / 2;
  return cx >= hole.x && cx < hole.x + hole.width && cy >= hole.y && cy < hole.y + hole.height;
}

/**
 * The aperture moves continuously with scroll, but the set of hidden cells only
 * changes when a cell centre crosses its edge. The cheap part (which cells are
 * hidden) runs every render; the expensive part (reconciling ~260 cells) only
 * re-renders when that set actually changes.
 */
export function SectionGrid({ metrics, bubbleHole, rows: rowsOverride }: SectionGridProps) {
  const { blockSize: bs, sectionCols, xOffset } = metrics;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const totalCols = Math.ceil((vw + bs) / bs) + 1;
  // Lines pass through the content edges. (Desktop: xOffset ≡ vw/2 mod bs,
  // since its column count is always even, so this is the same as before.)
  const leftEdge = xOffset % bs - bs;
  const rows = rowsOverride ?? 12;

  const cells = useMemo(() => {
    const result: Cell[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < totalCols; c++) {
        const left = leftEdge + c * bs;
        const top = r * bs;
        const inSection =
          left >= xOffset - bs &&
          left < xOffset + sectionCols * bs + bs;
        if (!inSection) continue;
        result.push({ key: `${r}-${c}`, left, top });
      }
    }
    return result;
  }, [bs, totalCols, leftEdge, xOffset, sectionCols, rows]);

  let mask = '';
  for (const cell of cells) {
    mask += bubbleHole && cellCenterInHole(cell.left - xOffset, cell.top, bs, bubbleHole) ? '1' : '0';
  }

  return <GridCells cells={cells} bs={bs} mask={mask} />;
}

const GridCells = memo(function GridCells({ cells, bs, mask }: { cells: Cell[]; bs: number; mask: string }) {
  return (
    <div className="section-grid" aria-hidden="true">
      {cells.map((cell, i) => (
        <div
          key={cell.key}
          className="section-grid__cell"
          style={{
            left: cell.left,
            top: cell.top,
            width: bs,
            height: bs,
            visibility: mask[i] === '1' ? 'hidden' : 'visible',
          }}
        />
      ))}
    </div>
  );
});
