'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { SectionId } from '@/lib/grid';
import { flushSync } from 'react-dom';
import { addFrameCallback, FRAME_ORDER } from '@/lib/frameLoop';

type ProgressMap = Record<SectionId, number>;

interface ScrollContextValue {
  progress: ProgressMap;
  globalProgress: number;
  scrollY: number;
  viewportHeight: number;
  isPinned: (section: SectionId) => boolean;
}

const INITIAL: ProgressMap = { hero: 0, work: 0, services: 0, about: 0, footer: 0 };

type ScrollSnapshot = { progress: ProgressMap; globalProgress: number; scrollY: number; viewportHeight: number };

/**
 * The scroll state of the current frame. Written once per frame by the frame
 * clock (after Lenis, before any scroll-driven writer), so non-React consumers
 * such as the WebGL orb read exactly the value React is committing this frame.
 */
const liveScroll: ScrollSnapshot = { progress: { ...INITIAL }, globalProgress: 0, scrollY: 0, viewportHeight: 900 };
export function getLiveScroll(): Readonly<ScrollSnapshot> {
  return liveScroll;
}
const ScrollContext = createContext<ScrollContextValue | null>(null);
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

function readProgress(): ScrollSnapshot {
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

  useEffect(() => {
    let lastY = Number.NaN;
    let lastVh = Number.NaN;
    let lastDocH = Number.NaN;
    const read = () => {
      const y = window.scrollY;
      const vh = window.innerHeight;
      const docH = document.documentElement.scrollHeight;
      if (Math.abs(y - lastY) <= 0.5 && vh === lastVh && docH === lastDocH) return null;
      lastY = y;
      lastVh = vh;
      lastDocH = docH;
      const next = readProgress();
      Object.assign(liveScroll, next);
      return next;
    };
    const initial = read();
    if (initial) setSnapshot(initial);
    // Commit synchronously inside the frame, so every scroll-driven style is
    // painted in the same frame as the scroll position it was computed from.
    return addFrameCallback(() => {
      const next = read();
      if (next) flushSync(() => setSnapshot(next));
    }, FRAME_ORDER.SCROLL_STATE);
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
