'use client';

import { memo, useEffect, useRef, useState, type CSSProperties } from 'react';
import { PinnedSection } from '@/components/PinnedSection';
import { useBubble } from '@/context/BubbleContext';
import { useLanguage } from '@/context/LanguageContext';
import { getLiveScroll } from '@/context/ScrollContext';
import { addFrameCallback, FRAME_ORDER } from '@/lib/frameLoop';
import { frameTop, getPortraitSections } from '@/lib/portraitGeometry';
import {
  chapterBeat, chapterState, holdCentre, progressForBeat, servicesOrb, smooth,
  SERVICE_COUNT, type ChapterState,
} from '@/lib/servicesStage';
import {
  ACCENTS, DRAW_H, DRAW_W, REST_T,
  drawFrame, drawScene, refreshPalette, sceneAt, type DrawCopy,
} from '@/lib/serviceDrawings';
import type { Dictionary } from '@/data/translations';
import styles from '@/components/services/services.module.css';

type Vars = CSSProperties & Record<`--${string}`, string | number>;
type Copy = Dictionary['services'];

const clamp = (v: number, a: number, b: number) => Math.max(a, Math.min(b, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** each title line is set unbroken, so the longest line decides the size */
const longestWord = (lines: string[]) => Math.max(...lines.map((line) => line.length));
const accentVars = (i: number): Vars => ({ '--acc': ACCENTS[i] });

/** Reads the drawing palette (ink, ground, type) now and again once the fonts are ready. */
function usePaletteWatch(onChange: () => void) {
  const cb = useRef(onChange);
  cb.current = onChange;
  useEffect(() => {
    const run = () => { refreshPalette(); cb.current(); };
    run();
    let alive = true;
    document.fonts?.ready.then(() => { if (alive) run(); });
    return () => { alive = false; };
  }, []);
}

/* ------------------------------------------------------------------ copy */
const SceneCopy = memo(function SceneCopy({ items }: { items: Copy['items'] }) {
  return (
    <>
      {items.map((item, i) => (
        <article
          key={i}
          className={`${styles.copy} ${styles[`s${i}`]}`}
          data-scene={i}
          style={{ '--i': i, '--chars': longestWord(item.title), ...accentVars(i) } as Vars}
        >
          
          <h3 className={styles.title}>
            {item.title.map((line, n) => (
              <span key={line} className={styles.mask}><span style={{ '--n': n } as Vars}>{line}</span></span>
            ))}
          </h3>
          <p className={styles.line}>{item.line}</p>
          <ul className={styles.caps}>
            {item.caps.map((cap, n) => <li key={cap} style={{ '--n': n } as Vars}>{cap}</li>)}
          </ul>
        </article>
      ))}
    </>
  );
});

/** One drawing at rest (landscape phones: stacked scenes, no pinned stage). */
function ServiceStill({ index, draw }: { index: number; draw: DrawCopy }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const paint = () => {
    const cv = ref.current;
    if (!cv || !cv.clientWidth) return;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(cv.clientWidth * dpr);
    cv.height = Math.round(cv.clientWidth * (DRAW_H / DRAW_W) * dpr);
    const g = cv.getContext('2d');
    if (!g) return;
    const k = cv.width / DRAW_W;
    g.setTransform(k, 0, 0, k, 0, 0);
    g.clearRect(0, 0, DRAW_W, DRAW_H);
    drawFrame(g, draw, [[index, 1]]);
    drawScene(g, index, draw, { a: 1, t: REST_T[index], mx: 0, my: 0 });
  };
  const paintRef = useRef(paint);
  paintRef.current = paint;
  usePaletteWatch(() => paintRef.current());
  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ro = new ResizeObserver(() => paintRef.current());
    ro.observe(cv);
    return () => ro.disconnect();
  }, []);
  useEffect(() => { paintRef.current(); }, [draw]);
  return <canvas ref={ref} className={styles.still} aria-hidden="true" />;
}

/* ------------------------------------------------------------------ chapter */
export function ServicesIndex() {
  const { dictionary } = useLanguage();
  const { gridMetrics, setActiveServiceIndex } = useBubble();
  const copy = dictionary.services;
  const layout = gridMetrics?.layout;
  const live = layout === 'pinned' || layout === 'portrait';
  const rootRef = useRef<HTMLDivElement>(null);
  const drawRef = useRef(copy.draw);
  drawRef.current = copy.draw;
  const [active, setActive] = useState(0);
  const tc = gridMetrics ? Math.round(gridMetrics.sectionCols * .36) : 7;
  usePaletteWatch(() => {});

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !live) {
      servicesOrb.weight = 0;
      return;
    }
    const container = root.closest('.pinning-container') as HTMLElement | null;
    const area = root.querySelector<HTMLElement>('[data-area]');
    const canvas = root.querySelector<HTMLCanvasElement>('[data-canvas]');
    const g = canvas?.getContext('2d') ?? null;
    const world = root.querySelector<HTMLElement>('[data-world]');
    const track = root.querySelector<HTMLElement>('[data-track]');
    const rail = root.querySelector<HTMLElement>('[data-rail]');
    const copies = root.querySelector<HTMLElement>('[data-copies]');
    const axis = root.querySelector<HTMLElement>('[data-axis]');
    const hint = root.querySelector<HTMLElement>('[data-hint]');
    const copyEls = Array.from({ length: SERVICE_COUNT }, (_, i) => root.querySelector<HTMLElement>(`article[data-scene="${i}"]`));
    if (!container || !area || !track || !canvas || !g) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    root.toggleAttribute('data-reduced', reduced);

    // geometry, measured on resize only (relative to the pinned frame)
    let A = { x: 0, y: 0, w: 1, h: 1 };
    let sw = window.innerWidth;
    let gridBs = 90;
    let dpr = 1;
    const measure = () => {
      const c = container.getBoundingClientRect();
      const a = area.getBoundingClientRect();
      A = { x: a.left - c.left, y: a.top - c.top, w: Math.max(1, a.width), h: Math.max(1, a.height) };
      gridBs = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--grid-block-size')) || 90;
      sw = window.innerWidth;
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.round(A.w * dpr);
      canvas.height = Math.round(A.h * dpr);
      root.style.setProperty('--sw', `${sw}px`);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(root);
    ro.observe(area);
    window.addEventListener('resize', measure);

    const pointer = { x: 0, y: 0 };
    const onPointer = (e: PointerEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    if (finePointer && !reduced) window.addEventListener('pointermove', onPointer, { passive: true });

    const st = {} as ChapterState;
    // Custom properties inherit, so writing one re-evaluates the styles of the
    // whole subtree below that element. Each value is written on the smallest
    // element that uses it, and only when it changes.
    const cache = new WeakMap<HTMLElement, Map<string, string>>();
    const set = (el: HTMLElement | null, key: string, value: string) => {
      if (!el) return;
      let m = cache.get(el);
      if (!m) { m = new Map(); cache.set(el, m); }
      if (m.get(key) === value) return;
      m.set(key, value);
      if (key.startsWith('--')) el.style.setProperty(key, value);
      else (el.style as unknown as Record<string, string>)[key] = value;
    };
    let lastPos = Number.NaN;
    let vel = 0;
    let px = 0;
    let py = 0;
    let clock = 0;
    let lastActive = -1;
    const liveFlags = new Array(SERVICE_COUNT).fill(false);
    const frameList: [number, number][] = [];

    const tick = (_t: number, deltaMs: number) => {
      const dt = Math.min(.1, Math.max(.001, deltaMs / 1000));
      const mode = document.documentElement.dataset.layout;
      const scroll = getLiveScroll();
      const p = scroll.progress.services;
      const pinned = mode === 'pinned';
      // not on screen: the orb belongs to the site path again
      if (p <= 0 || (pinned && p >= 1)) {
        servicesOrb.weight = 0;
        return;
      }
      const u = chapterBeat(p, pinned ? 'pinned' : 'portrait');
      chapterState(u, st);
      const pos = st.pos;
      const cpos = clamp(pos, 0, SERVICE_COUNT - 1);
      if (!reduced) clock += dt;

      // velocity → skew (damped, so it breathes out after a stop)
      const v = Number.isNaN(lastPos) ? 0 : (pos - lastPos) / dt;
      lastPos = pos;
      vel = lerp(vel, clamp(v, -4, 4), 1 - Math.exp(-dt * 7));
      px = lerp(px, pointer.x, 1 - Math.exp(-dt * 3));
      py = lerp(py, pointer.y, 1 - Math.exp(-dt * 3));
      const skew = reduced ? 0 : clamp(-vel * 2.4, -7, 7);

      // --- entry, intro, outro -------------------------------------------------
      const enter = clamp(p / .1, 0, 1);
      set(root, '--win', smooth((enter - .4) / .45).toFixed(4));
      set(root, '--cond', st.condense.toFixed(4));
      set(root, '--wexit', smooth((u - 1) / .55).toFixed(4));
      set(root, '--band', st.band.toFixed(4));
      set(axis, '--axis', st.axis.toFixed(4));
      set(track, '--axis', st.axis.toFixed(4));
      set(root, '--dev', st.device.toFixed(4));
      set(root, '--conv', st.converge.toFixed(4));
      set(rail, '--prog', clamp(pos / (SERVICE_COUNT - 1), 0, 1).toFixed(4));
      set(hint, '--hint', (1 - smooth((u - 1.2) / .6)).toFixed(3));

      // --- the world travels -----------------------------------------------------
      set(track, 'transform', reduced ? 'none' : `translate3d(${(-pos * sw).toFixed(2)}px,0,0)`);
      set(copies, '--skew', `${skew.toFixed(2)}deg`);
      if (world) {
        // wrap within one cell: the pattern is periodic, so the layer never runs out
        const bs = gridBs;
        const wx = (((-pos * sw * .38 + px * 6) % bs) + bs) % bs - bs;
        set(world, 'transform', `translate3d(${wx.toFixed(1)}px,0,0)`);
      }
      set(axis, '--rx', `${(-pos * sw).toFixed(1)}px`);

      // typography per scene: signed distance, distance, assembly
      for (let i = 0; i < SERVICE_COUNT; i += 1) {
        // beyond 1.3 every scene element is fully off stage, so the value stops changing
        const d = clamp(pos - i, -1.3, 1.3);
        const ad = Math.abs(d);
        set(copyEls[i], '--d', d.toFixed(4));
        set(copyEls[i], '--ad', ad.toFixed(4));
        set(copyEls[i], '--a', smooth(1 - ad * 1.15).toFixed(4));
        const isLive = ad < 1.3;
        if (isLive !== liveFlags[i]) {
          liveFlags[i] = isLive;
          copyEls[i]?.classList.toggle(styles.live, isLive);
        }
      }

      // --- the drawings: one frame, six scenes ------------------------------------
      // drawing space is scaled uniformly into the stage and centred in it
      const k = Math.min(A.w / DRAW_W, A.h / DRAW_H);
      const ox = (A.w - DRAW_W * k) / 2;
      const oy = (A.h - DRAW_H * k) / 2;
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.clearRect(0, 0, A.w, A.h);
      g.setTransform(k * dpr, 0, 0, k * dpr, ox * dpr, oy * dpr);
      // the last drawing returns to its lines before the orb grows back
      const fade = 1 - smooth((u - 12.7) / .5);
      const copyDraw = drawRef.current;
      frameList.length = 0;
      const scenes: [number, number, number][] = [];
      for (let i = 0; i < SERVICE_COUNT; i += 1) {
        const s = sceneAt(pos, i);
        const a = s.a * fade * st.device;
        if (a <= .001) continue;
        frameList.push([i, a]);
        scenes.push([i, a, reduced ? 0 : s.dx]);
      }
      const frameW = st.device * fade;
      if (frameW > .01) {
        g.globalAlpha = frameW;
        drawFrame(g, copyDraw, frameList.length ? frameList : []);
        g.globalAlpha = 1;
      }
      const mx = reduced ? 0 : px;
      const my = reduced ? 0 : py;
      for (const [i, a, dx] of scenes) {
        drawScene(g, i, copyDraw, { a, t: reduced ? REST_T[i] : clock, mx, my }, dx);
      }

      // --- the orb: entrance and exit only -------------------------------------------
      // it withdraws into the stage while the first drawing builds, and grows back
      // out of it for the hand-over to the site path at the end of the chapter
      const top = pinned ? 0 : (() => {
        const s = getPortraitSections().services;
        return s ? frameTop(s, scroll.scrollY) : container.getBoundingClientRect().top;
      })();
      servicesOrb.x = A.x + A.w / 2;
      servicesOrb.y = top + A.y + A.h / 2;
      servicesOrb.radius = Math.max(.5, Math.min(A.w, A.h) * .26 * (1 - st.vanish));
      servicesOrb.pos = cpos;
      servicesOrb.weight = st.orb;

      const now = Math.round(cpos);
      if (now !== lastActive) {
        lastActive = now;
        setActive(now);
        setActiveServiceIndex(now);
      }
    };
    const stop = addFrameCallback(tick, FRAME_ORDER.SCENE);
    return () => {
      stop();
      ro.disconnect();
      window.removeEventListener('resize', measure);
      window.removeEventListener('pointermove', onPointer);
      servicesOrb.weight = 0;
    };
  }, [live, layout, setActiveServiceIndex]);

  const goTo = (i: number) => {
    const root = rootRef.current;
    const section = root?.closest('section');
    if (!section) return;
    const p = progressForBeat(holdCentre(i), layout === 'pinned' ? 'pinned' : 'portrait');
    const y = section.offsetTop + p * section.offsetHeight - window.innerHeight;
    if (window.kernLenis) window.kernLenis.scrollTo(y, { duration: 1.4 });
    else window.scrollTo({ top: y, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  /* landscape phones: no pinned stage — the chapter becomes stacked scenes */
  if (layout === 'landscape') {
    return (
      <PinnedSection id="services">
        <div className={styles.stacked} ref={rootRef}>
          <header className={styles.stackHead}>
            <h2 className={styles.label}>{copy.label}</h2>
            <p className={styles.stackIntro}>{copy.intro.join(' · ')}</p>
            <p className={styles.stackLead}>{copy.lead}</p>
            <div className={styles.stackOrb} data-orb-slot aria-hidden="true" />
          </header>
          {copy.items.map((item, i) => (
            <section key={i} className={styles.stackScene} style={{ ...accentVars(i), '--chars': longestWord(item.title) } as Vars}>
              <div className={styles.stackCopy}>
                
                <h3 className={styles.title}>{item.title.map((line) => <span key={line} className={styles.mask}><span>{line}</span></span>)}</h3>
                <p className={styles.line}>{item.line}</p>
                <ul className={styles.caps}>{item.caps.map((cap) => <li key={cap}>{cap}</li>)}</ul>
              </div>
              <ServiceStill index={i} draw={copy.draw} />
            </section>
          ))}
          <p className="route-station" data-route-station>{dictionary.route.services}</p>
        </div>
      </PinnedSection>
    );
  }

  return (
    <PinnedSection id="services">
      <div
        ref={rootRef}
        className={styles.root}
        data-active={active}
        style={{ '--tc': tc, ...accentVars(active) } as Vars}
      >
        {/* the moving world: its own grid, a ruler axis, scene marks */}
        <div className={styles.world} aria-hidden="true"><div className={styles.worldInner} data-world /></div>
        <div className={styles.axis} data-axis aria-hidden="true"><i /></div>

        <header className={styles.head}>
          <h2 className={styles.label}>{copy.label}</h2>
          <p className={styles.condensed} aria-hidden="true">{copy.intro.join(' · ')}</p>
          <nav className={styles.rail} data-rail aria-label={copy.navigation}>
            {copy.items.map((item, i) => (
              <button
                key={i}
                type="button"
                className={i === active ? styles.on : ''}
                aria-current={i === active ? 'step' : undefined}
                aria-label={`${copy.goTo} ${item.title.join(' ')}`}
                onClick={() => goTo(i)}
              >
                <span />
              </button>
            ))}
            <i className={styles.railFill} aria-hidden="true" />
          </nav>
        </header>

        {/* intro: three disciplines that condense into the axis */}
        <div className={styles.intro} aria-hidden="true">
          {copy.intro.map((word, i) => (
            <span key={word} className={styles.word} style={{ '--i': i } as Vars}><span>{word}</span></span>
          ))}
        </div>
        <p className={styles.lead}>{copy.lead}</p>
        <p className={styles.hint} data-hint aria-hidden="true">{copy.scroll}<i /></p>

        {/* typography travels inside its own column; the world travels full width */}
        <div className={styles.copies} data-copies>
          <SceneCopy items={copy.items} />
        </div>
        <div className={styles.track} data-track>
          <div className={styles.marks} aria-hidden="true">
            {copy.items.map((item, i) => <span key={i} style={{ '--i': i } as Vars}>{item.title.join(' ')}</span>)}
          </div>
        </div>

        <div className={styles.area} data-area {...(layout === 'portrait' ? { 'data-orb-slot': '' } : {})}>
          <canvas className={styles.drawing} data-canvas aria-hidden="true" />
        </div>

        <p className={styles.counter} aria-live="polite">
          {copy.items[active].title.join(' ')}
        </p>
        <p className={styles.next} aria-hidden="true">{copy.next}</p>
        <p className={`route-station ${styles.station}`} data-route-station>{dictionary.route.services}</p>
      </div>
    </PinnedSection>
  );
}
