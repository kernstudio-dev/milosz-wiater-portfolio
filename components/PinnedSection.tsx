'use client';

import type { ReactNode } from 'react';
import type { SectionId } from '@/lib/grid';
import { getPlaceholderRect, SECTION_HEIGHT_VH } from '@/lib/grid';
import { sampleOrbTravel } from '@/lib/orbMotion';
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
  const progress = scroll.progress[id];
  const overlapsPrevious = Boolean(gridMetrics?.isPinned && id !== 'hero');
  const entrance = id === 'hero' ? 1 : smooth((progress - (id === 'footer' ? .72 : .08)) / .1);
  const exit = id === 'hero'
    ? smooth((scroll.progress.work - .08) / .14)
    : id === 'work'
      ? smooth((scroll.progress.services - .1) / .16)
      : id === 'services'
        ? smooth((scroll.progress.about - .08) / .18)
        : id === 'about'
          ? smooth((scroll.progress.footer - .72) / .2)
          : 0;
  const sceneOpacity = !gridMetrics?.isPinned ? 1 : entrance * (1 - exit);
  const sceneVisible = sceneOpacity > .001;

  let hole = gridMetrics
    ? getPlaceholderRect(id, gridMetrics.blockSize, gridMetrics.sectionCols)
    : null;

  if (hole && gridMetrics?.isPinned) {
    const travel = sampleOrbTravel(scroll.globalProgress);
    const bs = gridMetrics.blockSize;
    const centerX = gridMetrics.sectionCols * bs / 2;
    const leftX = 3 * bs;
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
        }}
      >
        {gridMetrics && <SectionGrid metrics={gridMetrics} bubbleHole={hole} />}
        <div className="section-content">{children}</div>
      </div>
    </section>
  );
}
