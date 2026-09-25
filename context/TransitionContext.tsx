'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

/**
 * Route transitions that survive navigation (mounted in the root layout).
 *
 *  openProject – shared-media: the clicked image grows from its on-screen rect to
 *                full viewport, the route changes underneath, and the case-study
 *                hero (the same image, full-bleed) takes over when it calls
 *                `pageReady()`.
 *  wipe        – full-viewport mask for everything else (back to work, etc.).
 */

type Rect = { left: number; top: number; width: number; height: number };
type OpenOptions = { href: string; src: string; rect: DOMRect | Rect; label?: string };

type State =
  | { kind: 'idle' }
  | { kind: 'media'; phase: 'start' | 'grow' | 'hold' | 'reveal'; src: string; rect: Rect; label?: string }
  | { kind: 'wipe'; phase: 'start' | 'cover' | 'hold' | 'reveal'; label?: string };

type TransitionValue = {
  openProject: (options: OpenOptions) => void;
  wipeTo: (href: string, label?: string) => void;
  pageReady: () => void;
  prefetch: (href: string) => void;
  busy: boolean;
};

const TransitionContext = createContext<TransitionValue>({
  openProject: () => {},
  wipeTo: () => {},
  pageReady: () => {},
  prefetch: () => {},
  busy: false,
});

const GROW_MS = 820;
const WIPE_MS = 620;
const REVEAL_MS = 700;

export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;
  const [state, setState] = useState<State>({ kind: 'idle' });
  const stateRef = useRef<State>(state);
  stateRef.current = state;
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const later = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };
  const clearTimers = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => () => clearTimers(), []);

  const reduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const finish = useCallback(() => {
    clearTimers();
    setState({ kind: 'idle' });
  }, []);

  const pageReady = useCallback(() => {
    const current = stateRef.current;
    if (current.kind === 'idle' || current.phase === 'reveal') return;
    clearTimers();
    // Two frames so the new page has painted beneath the cover.
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setState((s) => (s.kind === 'idle' ? s : { ...s, phase: 'reveal' } as State));
      later(finish, REVEAL_MS + 40);
    }));
  }, [finish]);

  const go = useCallback((href: string) => {
    const target = href.split('#')[0] || '/';
    const startedAt = performance.now();
    router.push(href, { scroll: !href.includes('#') });
    // Safety net: if the destination mounted but never reported ready, reveal it.
    // While the old route is still on screen (slow network / compile) keep holding,
    // with a hard cap so the cover can never get stuck.
    const check = () => {
      const arrived = pathnameRef.current === target;
      const waited = performance.now() - startedAt;
      if ((arrived && waited > 1500) || waited > 12000) {
        setState((s) => (s.kind === 'idle' || s.phase === 'reveal' ? s : { ...s, phase: 'reveal' } as State));
        later(finish, REVEAL_MS + 40);
        return;
      }
      later(check, 250);
    };
    later(check, 250);
  }, [router, finish]);

  const openProject = useCallback(({ href, src, rect, label }: OpenOptions) => {
    if (stateRef.current.kind !== 'idle') return;
    if (reduced()) { router.push(href); return; }
    const box = { left: rect.left, top: rect.top, width: rect.width, height: rect.height };
    setState({ kind: 'media', phase: 'start', src, rect: box, label });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setState((s) => (s.kind === 'media' ? { ...s, phase: 'grow' } : s));
    }));
    later(() => {
      setState((s) => (s.kind === 'media' ? { ...s, phase: 'hold' } : s));
      go(href);
    }, GROW_MS);
  }, [go, router]);

  const wipeTo = useCallback((href: string, label?: string) => {
    if (stateRef.current.kind !== 'idle') return;
    if (reduced()) { router.push(href); return; }
    setState({ kind: 'wipe', phase: 'start', label });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      setState((s) => (s.kind === 'wipe' ? { ...s, phase: 'cover' } : s));
    }));
    later(() => {
      setState((s) => (s.kind === 'wipe' ? { ...s, phase: 'hold' } : s));
      go(href);
    }, WIPE_MS);
  }, [go, router]);

  const prefetch = useCallback((href: string) => { router.prefetch(href); }, [router]);
  const value = useMemo(() => ({ openProject, wipeTo, pageReady, prefetch, busy: state.kind !== 'idle' }), [openProject, wipeTo, pageReady, prefetch, state.kind]);

  return (
    <TransitionContext.Provider value={value}>
      {children}
      <TransitionOverlay state={state} />
    </TransitionContext.Provider>
  );
}

function TransitionOverlay({ state }: { state: State }) {
  if (state.kind === 'idle') return null;

  if (state.kind === 'media') {
    const full = state.phase !== 'start';
    const { rect } = state;
    return (
      <div className={`route-media route-media--${state.phase}`} aria-hidden="true">
        <div className="route-media__backdrop" />
        <div
          className="route-media__frame"
          style={full ? undefined : { left: rect.left, top: rect.top, width: rect.width, height: rect.height }}
        >
          <img src={state.src} alt="" />
        </div>
        {state.label && <span className="route-media__label"><span>{state.label}</span></span>}
      </div>
    );
  }

  return (
    <div className={`route-wipe route-wipe--${state.phase}`} aria-hidden="true">
      {state.label && <span className="route-wipe__label"><span>{state.label}</span></span>}
    </div>
  );
}

export function usePageTransition() {
  return useContext(TransitionContext);
}
