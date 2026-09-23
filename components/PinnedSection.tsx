'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import type { SectionId } from '@/lib/grid';
import { SECTION_HEIGHT_VH } from '@/lib/grid';
import { useScrollProgress } from '@/context/ScrollContext';
import { SectionGrid } from '@/components/SectionGrid';
import { useBubble, useBubblePlaceholder } from '@/context/BubbleContext';

interface PinnedSectionProps {
  id: SectionId;
  children: ReactNode;
  className?: string;
  pinned?: boolean;
}

function clamp01(v: number) {
  return Math.max(0, Math.min(1, v));
}

export function PinnedSection({ id, children, className = '', pinned = true }: PinnedSectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const scrollCtx = useScrollProgress();
  const { gridMetrics } = useBubble();
  const { ref: placeholderRef, rect } = useBubblePlaceholder(id);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || typeof scrollCtx === 'number') return;
    const { setProgress } = scrollCtx;

    const update = () => {
      const rectEl = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const scrollHeight = el.offsetHeight;

      if (id === 'hero') {
        setProgress('hero', clamp01(window.scrollY / vh));
        return;
      }

      if (id === 'footer') {
        const range = scrollHeight - vh || 1;
        setProgress('footer', clamp01((vh - rectEl.top) / range));
        return;
      }

      const range = scrollHeight - vh || 1;
      setProgress(id, clamp01((vh - rectEl.top) / range));
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [id, scrollCtx]);

  const heightVh = SECTION_HEIGHT_VH[id];
  const heightStyle = heightVh === 'auto' ? undefined : { height: `${heightVh}vh` as const };

  return (
    <section
      id={id === 'hero' ? 'hero-section' : id}
      ref={sectionRef}
      className={`site-section site-section--${id} ${className}`}
      style={heightStyle}
      data-section={id}
    >
      <div className={pinned ? 'pinning-container' : 'pinning-container pinning-container--relative'}>
        {gridMetrics && <SectionGrid metrics={gridMetrics} bubbleHole={rect} />}
        <div
          ref={placeholderRef}
          data-bubble-target="true"
          data-section={id}
          className="bubble-placeholder"
          style={
            rect && gridMetrics
              ? {
                  left: gridMetrics.xOffset + rect.x,
                  top: rect.y,
                  width: rect.width,
                  height: rect.height,
                }
              : undefined
          }
        />
        <div className="section-content">{children}</div>
      </div>
    </section>
  );
}
