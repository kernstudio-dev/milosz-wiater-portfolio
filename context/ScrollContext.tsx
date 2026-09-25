'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { SectionId } from '@/lib/grid';

type ProgressMap = Record<SectionId, number>;

interface ScrollContextValue {
  progress: ProgressMap;
  globalProgress: number;
  scrollY: number;
  viewportHeight: number;
  isPinned: (section: SectionId) => boolean;
}

const INITIAL: ProgressMap = { hero: 0, work: 0, services: 0, about: 0, footer: 0 };
const ScrollContext = createContext<ScrollContextValue | null>(null);
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

function readProgress(): { progress: ProgressMap; globalProgress: number; scrollY: number; viewportHeight: number } {
  const y = window.scrollY;
  const vh = window.innerHeight;
  const read = (id: SectionId) => {
    const element = document.getElementById(id === 'hero' ? 'hero-section' : id);
    if (!element) return 0;
    const top = element.offsetTop;
    const height = element.offsetHeight || vh;
    if (id === 'hero') return clamp01((y - top) / Math.max(1, height - vh));
    return clamp01((y + vh - top) / height);
  };

  return {
    progress: {
      hero: read('hero'),
      work: read('work'),
      services: read('services'),
      about: read('about'),
      footer: read('footer'),
    },
    globalProgress: clamp01(y / Math.max(1, document.documentElement.scrollHeight - vh)),
    scrollY: y,
    viewportHeight: vh,
  };
}

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [snapshot, setSnapshot] = useState({ progress: INITIAL, globalProgress: 0, scrollY: 0, viewportHeight: 900 });
  const frame = useRef(0);

  useEffect(() => {
    const update = () => {
      frame.current = 0;
      const next = readProgress();
      setSnapshot((prev) => (
        Math.abs(prev.scrollY - next.scrollY) > 0.5 || prev.viewportHeight !== next.viewportHeight
          ? next
          : prev
      ));
    };
    const requestUpdate = () => {
      if (!frame.current) frame.current = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    return () => {
      if (frame.current) cancelAnimationFrame(frame.current);
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
    };
  }, []);

  const value = useMemo<ScrollContextValue>(() => ({
    ...snapshot,
    isPinned: (section) => {
      const p = snapshot.progress[section];
      if (section === 'hero') return p < 1;
      if (section === 'work' || section === 'services') return p >= 1 / 6 && p < 1;
      if (section === 'about') return p >= 1 / 4 && p < 1;
      return p > 0;
    },
  }), [snapshot]);

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}

export function useScrollProgress(): ScrollContextValue;
export function useScrollProgress(section: SectionId): number;
export function useScrollProgress(section?: SectionId): ScrollContextValue | number {
  const context = useContext(ScrollContext);
  if (!context) throw new Error('useScrollProgress must be used within ScrollProvider');
  return section ? context.progress[section] : context;
}
