'use client';

import { useEffect, useState } from 'react';
import { computeGridMetrics, type GridMetrics } from '@/lib/grid';

interface WindowSize {
  width: number;
  height: number;
  isMobile: boolean;
  metrics: GridMetrics;
}

export function useWindowSize(onMetrics?: (m: GridMetrics) => void): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    const vw = typeof window !== 'undefined' ? window.innerWidth : 1920;
    const vh = typeof window !== 'undefined' ? window.innerHeight : 1080;
    const metrics = computeGridMetrics(vw, vh);
    return { width: vw, height: vh, isMobile: !metrics.isPinned, metrics };
  });

  useEffect(() => {
    function handleResize() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const metrics = computeGridMetrics(vw, vh);

      document.documentElement.style.setProperty('--grid-block-size', `${metrics.blockSize}px`);
      document.documentElement.style.setProperty('--grid-cols', String(metrics.sectionCols));
      document.documentElement.style.setProperty('--grid-max-width', `${metrics.maxWidth}px`);
      document.documentElement.style.setProperty('--grid-x-offset', `${metrics.xOffset}px`);
      document.documentElement.style.setProperty('--header-height', `${metrics.blockSize}px`);

      onMetrics?.(metrics);

      setWindowSize({
        width: vw,
        height: vh,
        isMobile: !metrics.isPinned,
        metrics,
      });
    }

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [onMetrics]);

  return windowSize;
}
