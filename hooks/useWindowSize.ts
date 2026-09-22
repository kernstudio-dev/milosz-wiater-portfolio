'use client';

import { useState, useEffect } from 'react';

interface WindowSize {
  width: number;
  height: number;
  isMobile: boolean;
}

export function useWindowSize(): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: typeof window !== 'undefined' ? window.innerWidth : 1440,
    height: typeof window !== 'undefined' ? window.innerHeight : 900,
    isMobile: false,
  });

  useEffect(() => {
    function handleResize() {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw < 768;

      setWindowSize({
        width: vw,
        height: vh,
        isMobile,
      });

      // Mathematical grid block size computation (vanlent.dev inspiration)
      const targetColumns = isMobile ? 8 : 16;
      const blockSize = Math.max(36, Math.min(64, Math.floor(vw / targetColumns)));
      
      document.documentElement.style.setProperty('--grid-block-size', `${blockSize}px`);
      document.documentElement.style.setProperty('--grid-cols', String(targetColumns));
    }

    handleResize();
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return windowSize;
}
