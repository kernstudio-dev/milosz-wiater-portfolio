'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { GridMetrics, PlaceholderRect, SectionId } from '@/lib/grid';
import { getPlaceholderRect, rectCenter } from '@/lib/grid';
import { SERVICES_ORB_SLIDE } from '@/lib/motionMap';

export interface BubbleScreenPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface PlaceholderRegistration {
  section: SectionId;
  element: HTMLElement;
  pinningContainer: HTMLElement;
}

interface BubbleContextValue {
  screenPos: BubbleScreenPosition;
  currentSection: SectionId;
  shouldMorph: SectionId | null;
  isTransitioning: boolean;
  isReady: boolean;
  setReady: (v: boolean) => void;
  setTransitioning: (v: boolean) => void;
  registerPlaceholder: (section: SectionId, el: HTMLElement | null) => void;
  workProjectColor: string;
  setWorkProjectColor: (hex: string) => void;
  gridMetrics: GridMetrics | null;
  setGridMetrics: (m: GridMetrics) => void;
}

const BubbleContext = createContext<BubbleContextValue | null>(null);

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function clamp(v: number, min: number, max: number) {
  return Math.max(min, Math.min(max, v));
}

export function BubbleProvider({ children }: { children: React.ReactNode }) {
  const [screenPos, setScreenPos] = useState<BubbleScreenPosition>({
    x: 960,
    y: 540,
    width: 540,
    height: 540,
  });
  const [currentSection, setCurrentSection] = useState<SectionId>('hero');
  const [shouldMorph, setShouldMorph] = useState<SectionId | null>('hero');
  const [isTransitioning, setTransitioning] = useState(false);
  const [isReady, setReady] = useState(false);
  const [workProjectColor, setWorkProjectColor] = useState('#7a3d99');
  const [gridMetrics, setGridMetrics] = useState<GridMetrics | null>(null);

  const placeholdersRef = useRef<Map<SectionId, PlaceholderRegistration>>(new Map());
  const servicesProgressRef = useRef(0);

  const registerPlaceholder = useCallback((section: SectionId, el: HTMLElement | null) => {
    if (!el) {
      placeholdersRef.current.delete(section);
      return;
    }
    const pinningContainer = el.closest('.pinning-container') as HTMLElement | null;
    if (!pinningContainer) return;
    placeholdersRef.current.set(section, { section, element: el, pinningContainer });
  }, []);

  const updateFromScroll = useCallback(() => {
    const entries = Array.from(placeholdersRef.current.values());
    if (entries.length === 0) return;

    const metrics = gridMetrics;
    const vh = window.innerHeight;

    let nearest: PlaceholderRegistration | null = null;
    let nearestDist = Infinity;
    let candidateY = vh / 2;

    for (const entry of entries) {
      const rect = entry.element.getBoundingClientRect();
      const cy = rect.top + rect.height / 2;
      const dist = Math.abs(cy - vh / 2);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = entry;
        candidateY = cy;
      }
    }

    if (!nearest || !metrics) return;

    const section = nearest.section;
    const pinRect = nearest.pinningContainer.getBoundingClientRect();
    const placeholder = getPlaceholderRect(section, metrics.blockSize);
    let centerX = metrics.xOffset + placeholder.x + placeholder.width / 2;
    // services slide overrides x in viewport space
    let centerY = pinRect.top + placeholder.y + placeholder.height / 2;

    if (section === 'services') {
      const p = servicesProgressRef.current;
      const { start, end, fromX, toX, y } = SERVICES_ORB_SLIDE;
      const t = clamp((p - start) / (end - start), 0, 1);
      centerX = lerp(fromX, toX, t);
      centerY = pinRect.top + y;
    }

    if (!metrics.isPinned) {
      centerY = vh / 2;
    }

    setScreenPos({
      x: centerX,
      y: centerY,
      width: placeholder.width,
      height: placeholder.height,
    });
    setCurrentSection(section);

    const pinTop = pinRect.top;
    const onSticky = Math.abs(pinTop) < 2;
    setShouldMorph(onSticky ? section : null);
  }, [gridMetrics]);

  useEffect(() => {
    const onLenisScroll = () => updateFromScroll();
    window.addEventListener('scroll', onLenisScroll, { passive: true });
    window.addEventListener('resize', onLenisScroll, { passive: true });
    updateFromScroll();
    return () => {
      window.removeEventListener('scroll', onLenisScroll);
      window.removeEventListener('resize', onLenisScroll);
    };
  }, [updateFromScroll]);

  return (
    <BubbleContext.Provider
      value={{
        screenPos,
        currentSection,
        shouldMorph,
        isTransitioning,
        isReady,
        setReady,
        setTransitioning,
        registerPlaceholder,
        workProjectColor,
        setWorkProjectColor,
        gridMetrics,
        setGridMetrics,
      }}
    >
      <ServicesProgressBridge onProgress={(p) => { servicesProgressRef.current = p; updateFromScroll(); }} />
      {children}
    </BubbleContext.Provider>
  );
}

function ServicesProgressBridge({ onProgress }: { onProgress: (p: number) => void }) {
  // wired from ServicesIndex via window event to avoid circular imports
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<number>).detail;
      onProgress(detail);
    };
    window.addEventListener('services-progress', handler);
    return () => window.removeEventListener('services-progress', handler);
  }, [onProgress]);
  return null;
}

export function useBubble() {
  const ctx = useContext(BubbleContext);
  if (!ctx) throw new Error('useBubble must be used within BubbleProvider');
  return ctx;
}

export function useBubblePlaceholder(section: SectionId) {
  const { registerPlaceholder, gridMetrics } = useBubble();
  const ref = useCallback(
    (el: HTMLDivElement | null) => registerPlaceholder(section, el),
    [registerPlaceholder, section]
  );
  const rect: PlaceholderRect | null = gridMetrics
    ? getPlaceholderRect(section, gridMetrics.blockSize)
    : null;
  const center = rect ? rectCenter(rect) : null;
  return { ref, rect, center };
}
