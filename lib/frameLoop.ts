/**
 * The page's single frame clock. Every per-frame system registers here instead
 * of running its own requestAnimationFrame, so within one frame they always run
 * in the same order and see the same scroll position:
 *
 *   SCROLL_ENGINE  Lenis advances the scroll position
 *   SCROLL_STATE   scroll state is read once and committed to React synchronously
 *   SCENE          DOM writers that depend on scroll (case-study variables, indicators)
 *   TIMERS         time-driven UI (Services autoplay timer)
 *   ORB            WebGL render from the same scroll state
 *   CURSOR         cursor follower + hit-test after all writes (one layout per frame)
 */
export const FRAME_ORDER = {
  SCROLL_ENGINE: 0,
  SCROLL_STATE: 10,
  SCENE: 20,
  TIMERS: 30,
  ORB: 40,
  CURSOR: 50,
} as const;

type FrameCallback = (time: number, deltaMs: number) => void;
type Entry = { fn: FrameCallback; order: number; active: boolean };

const entries: Entry[] = [];
let raf = 0;
let lastTime = 0;

function tick(time: number) {
  raf = requestAnimationFrame(tick);
  const delta = lastTime ? Math.min(100, time - lastTime) : 1000 / 60;
  lastTime = time;
  const snapshot = entries.slice();
  for (const entry of snapshot) {
    if (entry.active) entry.fn(time, delta);
  }
}

export function addFrameCallback(fn: FrameCallback, order: number) {
  const entry: Entry = { fn, order, active: true };
  let index = entries.findIndex((e) => e.order > order);
  if (index === -1) index = entries.length;
  entries.splice(index, 0, entry);
  if (!raf && typeof window !== 'undefined') {
    lastTime = 0;
    raf = requestAnimationFrame(tick);
  }
  return () => {
    entry.active = false;
    const i = entries.indexOf(entry);
    if (i !== -1) entries.splice(i, 1);
    if (!entries.length && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}
