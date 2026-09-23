'use client';

import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import type { SectionId } from '@/lib/grid';

type ProgressMap = Record<SectionId, number>;

interface ScrollContextValue {
  progress: ProgressMap;
  setProgress: (section: SectionId, value: number) => void;
  isPinned: (section: SectionId) => boolean;
  isTransitioning: boolean;
  setTransitioning: (v: boolean) => void;
}

const defaultProgress: ProgressMap = {
  hero: 0,
  work: 0,
  services: 0,
  about: 0,
  footer: 0,
};

const ScrollContext = createContext<ScrollContextValue>({
  progress: defaultProgress,
  setProgress: () => {},
  isPinned: () => false,
  isTransitioning: false,
  setTransitioning: () => {},
});

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgressState] = useState<ProgressMap>(defaultProgress);
  const [isTransitioning, setTransitioning] = useState(false);
  const progressRef = useRef(progress);
  progressRef.current = progress;

  const setProgress = useCallback((section: SectionId, value: number) => {
    const clamped = Math.max(0, Math.min(1, value));
    if (Math.abs(progressRef.current[section] - clamped) < 0.0001) return;
    setProgressState((prev) => ({ ...prev, [section]: clamped }));
  }, []);

  const isPinned = useCallback(
    (section: SectionId) => {
      const p = progress[section];
      switch (section) {
        case 'hero':
          return p >= 0 && p <= 1;
        case 'work':
        case 'services':
          return p >= 1 / 6 && p < 1;
        case 'about':
          return p >= 0.25 && p < 1;
        default:
          return false;
      }
    },
    [progress]
  );

  return (
    <ScrollContext.Provider value={{ progress, setProgress, isPinned, isTransitioning, setTransitioning }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollProgress(section?: SectionId) {
  const ctx = useContext(ScrollContext);
  if (section) return ctx.progress[section];
  return ctx;
}
