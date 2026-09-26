'use client';

import type { SectionId } from '@/lib/grid';
import { enterProgress, leaveProgress } from '@/lib/sceneTiming';
import { useScrollProgress } from '@/context/ScrollContext';
import { useBubble } from '@/context/BubbleContext';

/** Section progress + overlap-window progress for entry (`enter`) and exit (`leave`). */
export function useScene(id: SectionId) {
  const scroll = useScrollProgress();
  const { gridMetrics } = useBubble();
  // Landscape phones: scenes are plain flow, so there are no handoff windows —
  // content is simply there (entry/exit choreography belongs to pinned scenes).
  if (gridMetrics?.layout === 'landscape') return { scroll, progress: scroll.progress[id], enter: 1, leave: 0 };
  return {
    scroll,
    progress: scroll.progress[id],
    enter: enterProgress(id, scroll.progress),
    leave: leaveProgress(id, scroll.progress),
  };
}
