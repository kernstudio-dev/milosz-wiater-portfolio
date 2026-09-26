'use client';

import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import type { SectionId } from '@/lib/grid';
import { getPlaceholderRect, SECTION_HEIGHT_VH } from '@/lib/grid';
import { sampleOrbTravel } from '@/lib/orbMotion';
import { CROSSFADE, enterProgress, leaveProgress } from '@/lib/sceneTiming';
import { setPortraitSection, snapToCells, type Rect } from '@/lib/portraitGeometry';
import { useScrollProgress } from '@/context/ScrollContext';
import { SectionGrid } from '@/components/SectionGrid';
import { RouteMap } from '@/components/RouteMap';
import { useBubble } from '@/context/BubbleContext';

interface PinnedSectionProps {
  id: SectionId;
  children: ReactNode;
  className?: string;
  pinned?: boolean;
}

type PortraitGeometry = { hole: Rect | null; stationY: number | null; frame: number; rows: number };

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => {
  const p = clamp01(value);
  return p * p * (3 - 2 * p);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export function PinnedSection({ id, children, className = '', pinned = true }: PinnedSectionProps) {
  const scroll = useScrollProgress();
  const { gridMetrics } = useBubble();
  const containerRef = useRef<HTMLDivElement>(null);
  const [portrait, setPortrait] = useState<PortraitGeometry | null>(null);
  const heightVh = SECTION_HEIGHT_VH[id];
  const isPinnedLayout = Boolean(gridMetrics?.isPinned);
  // measured layouts: the orb window and route station are measured from the DOM
  const isPortrait = gridMetrics?.layout === 'portrait' || gridMetrics?.layout === 'landscape';
  const isLandscape = gridMetrics?.layout === 'landscape';
  const overlapsPrevious = isPinnedLayout && id !== 'hero';
  // Portrait: the closing scene is ordinary flow, as tall as its content.
  // Landscape phones: every scene is — no tall pinned scenes on a short screen.
  const flowsNaturally = isPortrait && (!pinned || isLandscape);

  // Overlap-window progress (see lib/sceneTiming.ts).
  const enter = enterProgress(id, scroll.progress);
  const leave = leaveProgress(id, scroll.progress);
  const entrance = id === 'hero' ? 1 : smooth((enter - CROSSFADE.start) / CROSSFADE.span);
  const exit = smooth((leave - CROSSFADE.start) / CROSSFADE.span);
  const sceneOpacity = !isPinnedLayout ? 1 : entrance * (1 - exit);
  const sceneVisible = sceneOpacity > .001;

  // Portrait geometry: measured on resize / reflow only, never per frame.
  const bs = gridMetrics?.blockSize ?? 0;
  const xOffset = gridMetrics?.xOffset ?? 0;
  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!isPortrait || !el || !bs) {
      setPortrait(null);
      setPortraitSection(id, null);
      return;
    }
    const section = el.closest('section') as HTMLElement | null;
    const leftEdge = xOffset % bs - bs;
    let last = '';
    const measure = () => {
      const base = el.getBoundingClientRect();
      const slot = el.querySelector<HTMLElement>('[data-orb-slot]');
      const station = el.querySelector<HTMLElement>('[data-route-station]');
      let hole: Rect | null = null;
      if (slot && slot.offsetParent) {
        const r = slot.getBoundingClientRect();
        hole = snapToCells({ x: r.left - base.left, y: r.top - base.top, w: r.width, h: r.height }, bs, leftEdge);
      }
      const stationY = station && station.offsetParent ? Math.round(station.getBoundingClientRect().top - base.top + 8) : null;
      const frame = el.offsetHeight;
      const next: PortraitGeometry = { hole, stationY, frame, rows: Math.ceil(frame / bs) + 1 };
      if (section) {
        setPortraitSection(id, { top: section.offsetTop, height: section.offsetHeight, frame, sticky: !flowsNaturally, hole });
      }
      const key = JSON.stringify(next);
      if (key !== last) {
        last = key;
        setPortrait(next);
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    el.querySelectorAll('.section-content > * > *').forEach((child) => observer.observe(child));
    document.querySelectorAll('main > section').forEach((node) => observer.observe(node));
    window.addEventListener('resize', measure);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', measure);
      setPortraitSection(id, null);
    };
  }, [id, isPortrait, bs, xOffset, flowsNaturally]);

  let hole = gridMetrics
    ? getPlaceholderRect(id, gridMetrics.blockSize, gridMetrics.sectionCols)
    : null;

  if (isPortrait) {
    hole = portrait?.hole
      ? { x: portrait.hole.x - xOffset, y: portrait.hole.y, width: portrait.hole.w, height: portrait.hole.h }
      : null;
  } else if (hole && isPinnedLayout && gridMetrics) {
    const travel = sampleOrbTravel(scroll.globalProgress);
    const block = gridMetrics.blockSize;
    const centerX = gridMetrics.sectionCols * block / 2;
    const leftX = 1.55 * block;
    const rightX = (gridMetrics.sectionCols - 3) * block;
    const orbX = travel.anchor < 0
      ? lerp(centerX, leftX, -travel.anchor)
      : lerp(centerX, rightX, travel.anchor);
    const aperture = block * (6.25 + travel.transition * .9);
    hole = {
      x: orbX - aperture / 2,
      y: gridMetrics.yOffset + travel.row * block - aperture / 2,
      width: aperture,
      height: aperture,
    };
  }

  return (
    <section
      id={id === 'hero' ? 'hero-section' : id}
      className={`site-section site-section--${id} ${className}`}
      style={{
        ...(heightVh === 'auto' || flowsNaturally ? {} : { height: `${heightVh}vh` }),
        ...(overlapsPrevious ? { marginTop: '-100svh' } : {}),
      }}
      data-section={id}
    >
      {/* The lead starts one viewport above an overlapping section, so its sticky
          frame is natively pinned at top 0 for the whole handoff window: the
          browser positions it in the same frame as the scroll, with no
          script-driven compensation. It is absolutely positioned, so the
          section's box (and all progress maths) is unchanged. */}
      <div className={overlapsPrevious ? 'pinning-lead' : 'pinning-lead pinning-lead--flow'}>
        <div
          ref={containerRef}
          className={(pinned || overlapsPrevious) && !flowsNaturally ? 'pinning-container' : 'pinning-container pinning-container--relative'}
          style={{
            display: sceneVisible ? undefined : 'none',
            opacity: sceneOpacity,
            pointerEvents: sceneOpacity > .5 ? 'auto' : 'none',
          }}
        >
          {gridMetrics && <SectionGrid metrics={gridMetrics} bubbleHole={sceneVisible ? hole : null} rows={portrait?.rows ?? gridMetrics.rows} />}
          {gridMetrics && sceneVisible && (
            <RouteMap
              id={id}
              metrics={gridMetrics}
              hole={hole}
              enter={enter}
              leave={leave}
              portrait={portrait ? { stationY: portrait.stationY, frame: portrait.frame } : null}
            />
          )}
          <div className="section-content">{children}</div>
        </div>
      </div>
    </section>
  );
}
