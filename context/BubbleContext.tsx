'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import type { GridMetrics } from '@/lib/grid';

interface BubbleContextValue {
  isReady: boolean;
  setReady: (ready: boolean) => void;
  workProjectColor: string;
  setWorkProjectColor: (color: string) => void;
  activeServiceIndex: number;
  setActiveServiceIndex: (index: number) => void;
  gridMetrics: GridMetrics | null;
  setGridMetrics: (metrics: GridMetrics) => void;
}

const BubbleContext = createContext<BubbleContextValue | null>(null);

export function BubbleProvider({ children }: { children: React.ReactNode }) {
  const [isReady, setReady] = useState(false);
  const [workProjectColor, setWorkProjectColor] = useState('#b15ee8');
  const [activeServiceIndex, setActiveServiceIndex] = useState(0);
  const [gridMetricsState, setGridMetricsState] = useState<GridMetrics | null>(null);
  const setGridMetrics = useCallback((metrics: GridMetrics) => setGridMetricsState(metrics), []);

  return (
    <BubbleContext.Provider value={{
      isReady,
      setReady,
      workProjectColor,
      setWorkProjectColor,
      activeServiceIndex,
      setActiveServiceIndex,
      gridMetrics: gridMetricsState,
      setGridMetrics,
    }}>
      {children}
    </BubbleContext.Provider>
  );
}

export function useBubble() {
  const context = useContext(BubbleContext);
  if (!context) throw new Error('useBubble must be used within BubbleProvider');
  return context;
}
