'use client';

import type { ReactNode } from 'react';
import type { SectionId } from '@/lib/grid';
import { getPlaceholderRect, SECTION_HEIGHT_VH } from '@/lib/grid';
import { sampleOrbTravel } from '@/lib/orbMotion';
import { CROSSFADE, enterProgress, leaveProgress } from '@/lib/sceneTiming';
import { useScrollProgress } from '@/context/ScrollContext';
import { SectionGrid } from '@/components/SectionGrid';
import { useBubble } from '@/context/BubbleContext';

interface PinnedSectionProps {
  id: SectionId;
  children: ReactNode;
  className?: string;
  pinned?: boolean;
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => {
  const p = clamp01(value);
  return p * p * (3 - 2 * p);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function PinnedSection({ id, children, className = '', pinned = true }: PinnedSectionProps) {
  const scroll = useScrollProgress();
  const { gridMetrics } = useBubble();
  const heightVh = SECTION_HEIGHT_VH[id];
  const isPinnedLayout = Boolean(gridMetrics?.isPinned);
  const overlapsPrevious = isPinnedLayout && id !== 'hero';

  // Overlap-window progress (see lib/sceneTiming.ts).
  const enter = enterProgress(id, scroll.progress);
  const leave = leaveProgress(id, scroll.progress);
  const entrance = id === 'hero' ? 1 : smooth((enter - CROSSFADE.start) / CROSSFADE.span);
  const exit = smooth((leave - CROSSFADE.start) / CROSSFADE.span);
  const sceneOpacity = !isPinnedLayout ? 1 : entrance * (1 - exit);
  const sceneVisible = sceneOpacity > .001;

  // While a scene enters it has not reached its sticky position yet. Offset it
  // so every scene occupies the viewport from the first frame of its window:
  // transitions become choreography inside one fixed frame instead of two
  // layouts sliding over each other.
  const entryOffset = overlapsPrevious ? (1 - enter) * scroll.viewportHeight : 0;

  let hole = gridMetrics
    ? getPlaceholderRect(id, gridMetrics.blockSize, gridMetrics.sectionCols)
    : null;

  if (hole && isPinnedLayout && gridMetrics) {
    const travel = sampleOrbTravel(scroll.globalProgress);
    const bs = gridMetrics.blockSize;
    const centerX = gridMetrics.sectionCols * bs / 2;
    const leftX = 1.55 * bs;
    const rightX = (gridMetrics.sectionCols - 3) * bs;
    const orbX = travel.anchor < 0
      ? lerp(centerX, leftX, -travel.anchor)
      : lerp(centerX, rightX, travel.anchor);
    const aperture = bs * (6.25 + travel.transition * .9);
    hole = {
      x: orbX - aperture / 2,
      y: travel.row * bs - aperture / 2,
      width: aperture,
      height: aperture,
    };
  }

  return (
    <section
      id={id === 'hero' ? 'hero-section' : id}
      className={`site-section site-section--${id} ${className}`}
      style={{
        ...(heightVh === 'auto' ? {} : { height: `${heightVh}vh` }),
        ...(overlapsPrevious ? { marginTop: '-100svh' } : {}),
      }}
      data-section={id}
    >
      <div
        className={pinned ? 'pinning-container' : 'pinning-container pinning-container--relative'}
        style={{
          display: sceneVisible ? undefined : 'none',
          opacity: sceneOpacity,
          pointerEvents: sceneOpacity > .5 ? undefined : 'none',
          transform: entryOffset > .5 ? `translate3d(0,${-entryOffset}px,0)` : undefined,
        }}
      >
        {gridMetrics && <SectionGrid metrics={gridMetrics} bubbleHole={hole} />}
        <div className="section-content">{children}</div>
      </div>
    </section>
  );
}
