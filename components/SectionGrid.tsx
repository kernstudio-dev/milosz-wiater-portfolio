'use client';

import { useMemo } from 'react';
import type { GridMetrics } from '@/lib/grid';
import type { PlaceholderRect } from '@/lib/grid';

interface SectionGridProps {
  metrics: GridMetrics;
  bubbleHole?: PlaceholderRect | null;
}

function cellOverlapsHole(
  colLeft: number,
  rowTop: number,
  bs: number,
  hole: PlaceholderRect
): boolean {
  const cx = colLeft;
  const cy = rowTop;
  return (
    cx + bs > hole.x &&
    cx < hole.x + hole.width &&
    cy + bs > hole.y &&
    cy < hole.y + hole.height
  );
}

export function SectionGrid({ metrics, bubbleHole }: SectionGridProps) {
  const { blockSize: bs, sectionCols, xOffset } = metrics;
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1920;
  const totalCols = Math.ceil((vw + bs) / bs) + 1;
  const leftEdge = (vw / 2) % bs - bs;

  const cells = useMemo(() => {
    const rows = 12;
    const result: { key: string; left: number; top: number; hidden: boolean }[] = [];
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < totalCols; c++) {
        const left = leftEdge + c * bs;
        const top = r * bs;
        const inSection =
          left >= xOffset - bs &&
          left < xOffset + sectionCols * bs + bs;
        if (!inSection) continue;
        const hidden = bubbleHole ? cellOverlapsHole(left - xOffset, top, bs, bubbleHole) : false;
        result.push({ key: `${r}-${c}`, left, top, hidden });
      }
    }
    return result;
  }, [bs, totalCols, leftEdge, xOffset, sectionCols, bubbleHole]);

  return (
    <div className="section-grid" aria-hidden="true">
      {cells.map((cell) => (
        <div
          key={cell.key}
          className="section-grid__cell"
          style={{
            left: cell.left,
            top: cell.top,
            width: bs,
            height: bs,
            visibility: cell.hidden ? 'hidden' : 'visible',
          }}
        />
      ))}
    </div>
  );
}
