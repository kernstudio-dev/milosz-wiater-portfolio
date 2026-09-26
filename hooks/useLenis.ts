'use client';

import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { addFrameCallback, FRAME_ORDER } from '@/lib/frameLoop';

declare global {
  interface Window {
    kernLenis?: Lenis;
  }
}

export function useLenis(enabled = true) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      // one wheel notch covers the same share of a scene on taller screens
      wheelMultiplier: 0.9 * Math.min(1.6, Math.max(1, window.innerHeight / 1080)),
    });

    lenisRef.current = lenis;
    window.kernLenis = lenis;

    const stop = addFrameCallback((time) => lenis.raf(time), FRAME_ORDER.SCROLL_ENGINE);

    return () => {
      stop();
      lenis.destroy();
      lenisRef.current = null;
      delete window.kernLenis;
    };
  }, [enabled]);

  return lenisRef;
}
