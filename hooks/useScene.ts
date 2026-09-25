'use client';

import type { SectionId } from '@/lib/grid';
import { enterProgress, leaveProgress } from '@/lib/sceneTiming';
import { useScrollProgress } from '@/context/ScrollContext';

/** Section progress + overlap-window progress for entry (`enter`) and exit (`leave`). */
export function useScene(id: SectionId) {
  const scroll = useScrollProgress();
  return {
    scroll,
    progress: scroll.progress[id],
    enter: enterProgress(id, scroll.progress),
    leave: leaveProgress(id, scroll.progress),
  };
}
