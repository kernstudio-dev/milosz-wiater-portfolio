'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PinnedSection } from '@/components/PinnedSection';
import { useScene } from '@/hooks/useScene';
import { useBubble } from '@/context/BubbleContext';
import { SERVICES } from '@/data/services';
import { useLanguage } from '@/context/LanguageContext';
import { addFrameCallback, FRAME_ORDER } from '@/lib/frameLoop';

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const p = clamp01(value); return p * p * (3 - 2 * p); };
const mod = (value: number, n: number) => ((value % n) + n) % n;

const COUNT = SERVICES.length;
/** Scroll range (section progress) that maps onto the six service slots. */
const SLOT_START = 1 / 6;
const SLOT_END = 0.8;
/** Autoplay: first advance and every following advance happen CYCLE ms after the latest user input. */
const CYCLE = 4600;
const TRANSITION_MS = 1150;

/**
 * Services is ONE motion scene.
 *
 *   displayed = (scrollSlot + autoOffset) mod 6
 *
 * - scrolling changes scrollSlot → the content always moves in the scroll direction
 * - autoplay (idle only) increments autoOffset → the document never scrolls
 * - any scroll input restarts the idle clock, so autoplay yields immediately
 * - leaving the scene resets autoOffset → re-entry is deterministic (01 from above, 06 from below)
 */
export function ServicesIndex() {
  const { scroll, progress, enter, leave } = useScene('services');
  const { setActiveServiceIndex, gridMetrics } = useBubble();
  const { dictionary } = useLanguage();
  const layoutRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<HTMLElement>(null);
  const [inViewport, setInViewport] = useState(false);
  const [autoOffset, setAutoOffset] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [previous, setPrevious] = useState<{ index: number; direction: 1 | -1; id: number } | null>(null);
  const lastInput = useRef(0);
  const lastChange = useRef(0);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const displayedRef = useRef(0);
  const changeId = useRef(0);

  const slotProgress = clamp01((progress - SLOT_START) / (SLOT_END - SLOT_START));
  // landscape phones: the scene is plain flow, so scroll does not pick the slot
  const scrollSlot = gridMetrics?.layout === 'landscape' ? 0 : Math.min(COUNT - 1, Math.floor(slotProgress * COUNT));
  const sceneActive = inViewport && enter > .95 && leave < .04;
  const displayed = mod(scrollSlot + autoOffset, COUNT);
  const service = dictionary.services.items[displayed];
  const previousService = previous ? dictionary.services.items[previous.index] : null;
  const direction = previous?.direction ?? 1;

  const headingReveal = smooth((enter - .42) / .3);
  const panelReveal = smooth((enter - .48) / .32);
  const listReveal = smooth((enter - .56) / .34);
  const exit = smooth(leave / .42);

  // One place reacts to the displayed index: transition layers + orb personality.
  useEffect(() => {
    const from = displayedRef.current;
    if (from === displayed) return;
    let delta = displayed - from;
    if (delta > COUNT / 2) delta -= COUNT;
    if (delta < -COUNT / 2) delta += COUNT;
    displayedRef.current = displayed;
    lastChange.current = performance.now();
    changeId.current += 1;
    setPrevious({ index: from, direction: delta >= 0 ? 1 : -1, id: changeId.current });
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    transitionTimer.current = setTimeout(() => setPrevious(null), TRANSITION_MS);
  }, [displayed]);

  useEffect(() => setActiveServiceIndex(displayed), [displayed, setActiveServiceIndex]);

  useEffect(() => {
    const element = layoutRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInViewport(entry.isIntersecting && entry.intersectionRatio > .25),
      { threshold: [0, .25, .6] },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Once the scene is fully off screen, hand control fully back to scroll so
  // re-entry is deterministic. Never reset while any part is still visible.
  const offscreen = !inViewport || enter <= .05 || leave >= .99;
  useEffect(() => {
    if (offscreen) setAutoOffset(0);
  }, [offscreen]);

  // Any scroll movement is user input: restart the idle clock.
  useEffect(() => {
    lastInput.current = performance.now();
  }, [scroll.scrollY]);

  // Autoplay clock + timer bar on the page's frame clock, only while the scene
  // is active. It runs after the scroll state of the frame, and treats any
  // scroll movement in this frame as input first, so autoplay can never
  // advance in the same frame as a scroll-driven change.
  useEffect(() => {
    if (!sceneActive) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let seenScrollY = window.scrollY;
    const tick = () => {
      const now = performance.now();
      if (Math.abs(window.scrollY - seenScrollY) > .5) {
        seenScrollY = window.scrollY;
        lastInput.current = now;
      }
      const since = now - Math.max(lastInput.current, lastChange.current);
      const fraction = hoverPaused ? 0 : clamp01(since / CYCLE);
      if (timerRef.current) timerRef.current.style.transform = `scaleX(${fraction.toFixed(4)})`;
      if (!hoverPaused && !reduced && since >= CYCLE) {
        lastChange.current = now;
        setAutoOffset((value) => value + 1);
      }
    };
    return addFrameCallback(tick, FRAME_ORDER.TIMERS);
  }, [sceneActive, hoverPaused]);

  useEffect(() => () => { if (transitionTimer.current) clearTimeout(transitionTimer.current); }, []);

  const goTo = useCallback((target: number) => {
    lastInput.current = performance.now();
    setAutoOffset((offset) => {
      const current = mod(scrollSlot + offset, COUNT);
      let delta = mod(target, COUNT) - current;
      if (delta > COUNT / 2) delta -= COUNT;
      if (delta < -COUNT / 2) delta += COUNT;
      return offset + delta;
    });
  }, [scrollSlot]);

  const pause = () => { setHoverPaused(true); };
  const resume = () => { lastInput.current = performance.now(); setHoverPaused(false); };

  const number = (index: number) => String(index + 1).padStart(2, '0');

  return (
    <PinnedSection id="services">
      <div
        ref={layoutRef}
        className={`services-layout dir-${direction > 0 ? 'fwd' : 'back'}`}
        data-active-service={displayed}
        data-scroll-slot={scrollSlot}
        style={{ clipPath: `inset(0 0 ${exit * 100}% 0)` }}
      >
        <div className="services-heading">
          <p style={{ opacity: headingReveal, transform: `translateY(${(1 - headingReveal) * 14}px)` }}>{dictionary.services.intro}</p>
          <h2 aria-label={dictionary.services.title.join(' ')}>
            {dictionary.services.title.map((word, i) => (
              <span className="mask" key={word}>
                <span style={{ transform: `translate3d(0,${(1 - smooth((headingReveal - i * .12) / .76)) * 105}%,0)` }}>{word}</span>
              </span>
            ))}
          </h2>
        </div>
        <a href="#footer" className="services-cta" style={{ clipPath: `inset(0 0 0 ${(1 - headingReveal) * 100}%)` }}>{dictionary.services.cta}</a>

        <section
          className="services-panel"
          style={{ clipPath: `inset(0 ${(1 - panelReveal) * 100}% 0 0)` }}
          aria-live="polite"
          onPointerEnter={pause}
          onPointerLeave={resume}
        >
          <div className="services-panel-top">
            <span className="services-number" aria-label={`${number(displayed)} / ${number(COUNT - 1)}`}>
              <span className="roll">
                {previous && <span key={`o${previous.id}`} className="roll-out">{number(previous.index)}</span>}
                <span key={`i${displayed}-${previous?.id ?? 0}`} className={previous ? 'roll-in' : ''}>{number(displayed)}</span>
              </span>
              <span className="total">/ {number(COUNT - 1)}</span>
            </span>
            <div className="services-nav">
              <button type="button" onClick={() => goTo(displayed - 1)} aria-label={dictionary.services.previous}>←</button>
              <button type="button" onClick={() => goTo(displayed + 1)} aria-label={dictionary.services.next}>→</button>
            </div>
          </div>

          <div className="services-copy-stage">
            {previous && previousService && (
              <div className="services-copy is-out" key={`out-${previous.id}`} aria-hidden="true">
                <h3>
                  <span className="mask"><span>{previousService.title[0]}</span></span>
                  <span className="mask mask--block"><strong>{previousService.title[1]}</strong></span>
                </h3>
                <p className="mask"><span>{previousService.description}</span></p>
              </div>
            )}
            <div className={`services-copy ${previous ? 'is-in' : ''}`} key={`in-${displayed}-${previous?.id ?? 0}`}>
              <h3>
                <span className="mask"><span>{service.title[0]}</span></span>
                <span className="mask mask--block"><strong>{service.title[1]}</strong></span>
              </h3>
              <p className="mask"><span>{service.description}</span></p>
            </div>
          </div>
          <div className="services-timer"><i ref={timerRef} /></div>
        </section>

        <div className="services-orb-stage" data-orb-slot aria-hidden="true" style={{ opacity: listReveal }}>
          <span className="stage-label">{dictionary.services.form} / {number(displayed)}</span>
        </div>

        <nav
          className="services-index"
          aria-label={dictionary.services.navigation}
          onPointerEnter={pause}
          onPointerLeave={resume}
        >
          {dictionary.services.items.map((item, itemIndex) => (
            <button
              key={itemIndex}
              type="button"
              className={itemIndex === displayed ? 'is-active' : ''}
              aria-current={itemIndex === displayed ? 'true' : undefined}
              onClick={() => goTo(itemIndex)}
              style={{
                clipPath: `inset(0 0 ${(1 - smooth((listReveal - itemIndex * .08) / .6)) * 100}% 0)`,
              }}
            >
              <span>{number(itemIndex)}</span>
              <span>{item.title[0]} {item.title[1]}</span>
              <i />
            </button>
          ))}
        </nav>

        <p className="route-station services-station" data-route-station><b>03</b> / {dictionary.route.services}</p>

        <div className="services-scope" style={{ clipPath: `inset(0 ${(1 - listReveal) * 100}% 0 0)` }}>
          <span className="services-scope-label">{dictionary.services.focus}</span>
          {service.scope.slice(0, 3).map((item, i) => (
            <p key={`${displayed}-${i}`} className="scope-item" style={{ animationDelay: `${.12 + i * .07}s` }}>{item}</p>
          ))}
        </div>
      </div>

      <style jsx>{`
        .services-layout { position: relative; height: 100%; display: grid; grid-template-columns: repeat(var(--grid-cols),var(--grid-block-size)); grid-template-rows: repeat(12,var(--grid-block-size)); overflow: hidden; }
        .mask { display: block; overflow: hidden; }
        .mask > * { display: inline-block; }
        .services-heading { grid-column: 1 / 12; grid-row: 2 / 4; align-self: end; padding-bottom: 8px; }
        .services-heading p { font-size: 13px; color: var(--text-tertiary); margin-bottom: 7px; }
        .services-heading h2 { display: flex; gap: .28em; font: 200 clamp(25px,2.45vw,38px)/1 var(--font-display); letter-spacing: -.035em; color: var(--text-primary); white-space: nowrap; }
        .services-heading h2 .mask > span { will-change: transform; }
        .services-cta { grid-column: -3 / -1; grid-row: 3 / 4; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-primary); font-size: 14px; color: var(--text-secondary); transition: background .3s ease, color .3s ease; }
        .services-cta:hover { background: var(--text-primary); color: var(--bg-canvas); }

        .services-panel { grid-column: 1 / 7; grid-row: 4 / 10; padding: 24px; border: 1px solid var(--border-primary); overflow: hidden; display: flex; flex-direction: column; background: var(--bg-canvas); }
        .services-panel-top { display: flex; align-items: flex-start; justify-content: space-between; }
        .services-number { display: flex; align-items: baseline; gap: 10px; font: 200 clamp(38px,3.4vw,58px)/1 var(--font-display); letter-spacing: -.04em; color: var(--text-primary); }
        .services-number .total { font: 500 11px/1 var(--font-mono); letter-spacing: .08em; color: var(--text-tertiary); }
        .roll { position: relative; display: inline-block; overflow: hidden; height: 1em; min-width: 1.25em; }
        .roll > span { display: block; }
        .roll-out { position: absolute; inset: 0 auto auto 0; animation: rollOut .62s var(--ease-in-out-cubic) both; }
        .roll-in { animation: rollIn .82s .08s var(--ease-out-expo) both; }
        .dir-back .roll-out { animation-name: rollOutBack; }
        .dir-back .roll-in { animation-name: rollInBack; }
        .services-nav { display: flex; gap: 5px; }
        .services-nav button { width: 38px; height: 34px; border: 1px solid var(--border-primary); color: var(--text-secondary); transition: color .25s ease, background .25s ease; }
        .services-nav button:hover { color: var(--bg-canvas); background: var(--text-primary); }

        .services-copy-stage { position: relative; flex: 1; min-height: 0; }
        .services-copy { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; }
        .services-panel h3 { display: flex; flex-direction: column; align-items: flex-start; font: 200 clamp(34px,3.6vw,58px)/1.04 var(--font-display); letter-spacing: -.05em; color: var(--text-primary); }
        .services-panel h3 strong { font-weight: 200; color: var(--bg-canvas); background: var(--text-primary); padding: 0 10px 5px; }
        .mask--block { margin-top: 2px; }
        .services-panel p { max-width: 520px; margin-top: 22px; font: 300 14px/1.55 var(--font-sans); color: var(--text-secondary); }
        .services-panel p > span { display: block; }

        /* incoming: lines rise through their masks, staggered */
        .is-in h3 .mask:first-child > * { animation: lineIn .9s .1s var(--ease-out-expo) both; }
        .is-in h3 .mask--block > * { animation: blockIn .95s .18s var(--ease-out-expo) both; }
        .is-in p > span { animation: lineIn .9s .3s var(--ease-out-expo) both; }
        /* outgoing: lines leave upward first, description slightly later */
        .is-out h3 .mask:first-child > * { animation: lineOut .55s var(--ease-in-out-cubic) both; }
        .is-out h3 .mask--block > * { animation: blockOut .55s .05s var(--ease-in-out-cubic) both; }
        .is-out p > span { animation: lineOut .5s .08s var(--ease-in-out-cubic) both; }
        .dir-back .is-in h3 .mask:first-child > *, .dir-back .is-in p > span { animation-name: lineInBack; }
        .dir-back .is-out h3 .mask:first-child > *, .dir-back .is-out p > span { animation-name: lineOutBack; }

        .services-timer { height: 1px; margin-top: 22px; background: var(--border-primary); overflow: hidden; }
        .services-timer i { display: block; width: 100%; height: 1px; background: var(--text-primary); transform-origin: left; transform: scaleX(0); }

        .services-orb-stage { grid-column: 7 / -7; grid-row: 4 / 10; position: relative; border-block: 1px solid var(--border-primary); pointer-events: none; }
        .stage-label { position: absolute; left: 12px; bottom: 11px; font: 10px/1 var(--font-mono); letter-spacing: .08em; color: var(--text-tertiary); }

        .services-index { grid-column: -7 / -1; grid-row: 4 / 10; display: grid; grid-template-rows: repeat(6,1fr); border: 1px solid var(--border-primary); border-bottom: 0; background: var(--bg-canvas); }
        .services-index button { position: relative; min-width: 0; display: grid; grid-template-columns: 48px 1fr; align-items: center; text-align: left; border-bottom: 1px solid var(--border-primary); color: var(--text-tertiary); overflow: hidden; isolation: isolate; transition: color .35s ease; }
        .services-index button > span:first-child { padding-left: 16px; font: 500 10px/1 var(--font-mono); }
        .services-index button > span:nth-child(2) { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: 400 clamp(11px,.82vw,13px)/1 var(--font-sans); letter-spacing: .02em; transition: transform .6s var(--ease-out-expo); }
        .services-index button > i { position: absolute; inset: 0; z-index: -1; background: color-mix(in srgb, var(--text-primary) 5%, transparent); transform: scaleX(0); transform-origin: left; transition: transform .7s var(--ease-out-expo); }
        .services-index button:hover, .services-index button.is-active { color: var(--text-primary); }
        .services-index button.is-active > span:nth-child(2), .services-index button:hover > span:nth-child(2) { transform: translateX(8px); }
        .services-index button.is-active > i { transform: scaleX(1); }
        .dir-back .services-index button > i { transform-origin: right; }

        .services-scope { grid-column: 1 / -1; grid-row: 10 / 11; display: grid; grid-template-columns: 2fr repeat(3,3fr); border: 1px solid var(--border-primary); background: var(--bg-canvas); }
        .services-scope > * { display: flex; align-items: center; padding: 0 18px; border-right: 1px solid var(--border-primary); }
        .services-scope-label { font: 500 10px/1 var(--font-mono); letter-spacing: .08em; color: var(--text-tertiary); }
        .scope-item { font: 300 clamp(10px,.76vw,12px)/1.35 var(--font-sans); color: var(--text-secondary); animation: scopeIn .8s var(--ease-out-expo) both; }

        @keyframes lineIn { from { transform: translate3d(0,105%,0); } to { transform: none; } }
        @keyframes lineOut { to { transform: translate3d(0,-105%,0); } }
        @keyframes lineInBack { from { transform: translate3d(0,-105%,0); } to { transform: none; } }
        @keyframes lineOutBack { to { transform: translate3d(0,105%,0); } }
        @keyframes blockIn { from { clip-path: inset(0 100% 0 0); transform: translate3d(-18px,0,0); } to { clip-path: inset(0); transform: none; } }
        @keyframes blockOut { to { clip-path: inset(0 0 0 100%); transform: translate3d(18px,0,0); } }
        @keyframes rollIn { from { transform: translate3d(0,100%,0); } to { transform: none; } }
        @keyframes rollOut { to { transform: translate3d(0,-100%,0); } }
        @keyframes rollInBack { from { transform: translate3d(0,-100%,0); } to { transform: none; } }
        @keyframes rollOutBack { to { transform: translate3d(0,100%,0); } }
        @keyframes scopeIn { from { clip-path: inset(0 0 100% 0); transform: translate3d(0,8px,0); } to { clip-path: inset(0); transform: none; } }

        @media (min-width: 768px) and (max-height: 800px) {
          .services-panel { padding: 18px 22px; }
          .services-panel p { margin-top: 14px; font-size: 13px; }
        }
        @media (max-width: 767px) {
          :global(html[data-layout='flow']) .services-layout { display: block; padding: 100px 20px 40px; overflow: auto; transform: none !important; }
          :global(html[data-layout='flow']) .services-heading h2 { flex-direction: column; gap: 0; white-space: normal; font-size: 34px; }
          :global(html[data-layout='flow']) .services-cta { position: absolute; right: 20px; top: 34px; padding: 12px; }
          :global(html[data-layout='flow']) .services-panel { margin-top: 30px; min-height: 360px; padding: 22px 18px; }
          :global(html[data-layout='flow']) .services-panel h3 { font-size: 40px; }
          :global(html[data-layout='flow']) .services-orb-stage { height: 280px; }
          :global(html[data-layout='flow']) .services-index { height: 300px; }
          :global(html[data-layout='flow']) .services-scope { display: none; }
        }
        .services-station { display: none; }

        /* ---------------------------------------------------------- portrait
           label / RELIABLE CREATIVE VERSATILE / orb window / 01 / 06 ← →
           title / description / timer / 03 station. Same state machine. */
        :global(html[data-layout='portrait']) .services-layout {
          display: grid; grid-template-columns: minmax(0, 1fr);
          grid-template-rows: auto minmax(0, 1fr) auto auto;
          row-gap: clamp(10px, 1.8svh, 18px);
          padding: calc(var(--grid-block-size) + clamp(12px, 2.4svh, 26px)) 0 calc(clamp(12px, 2svh, 20px) + env(safe-area-inset-bottom));
        }
        :global(html[data-layout='portrait']) .services-heading { grid-column: 1; grid-row: 1; padding: 0; }
        :global(html[data-layout='portrait']) .services-heading p { font-size: 11px; margin-bottom: 6px; }
        :global(html[data-layout='portrait']) .services-heading h2 { flex-wrap: wrap; column-gap: .28em; row-gap: 0; white-space: normal; font-size: clamp(24px, 7.4vw, 44px); line-height: 1.04; }
        :global(html[data-layout='portrait']) .services-cta,
        :global(html[data-layout='portrait']) .services-index,
        :global(html[data-layout='portrait']) .services-scope { display: none; }
        :global(html[data-layout='portrait']) .services-orb-stage { grid-column: 1; grid-row: 2; min-height: 0; border: 0; }
        :global(html[data-layout='portrait']) .stage-label { display: none; }
        :global(html[data-layout='portrait']) .services-panel { grid-column: 1; grid-row: 3; padding: clamp(14px, 4vw, 22px); }
        :global(html[data-layout='portrait']) .services-number { font-size: clamp(30px, 9vw, 54px); }
        :global(html[data-layout='portrait']) .services-nav { gap: 6px; }
        :global(html[data-layout='portrait']) .services-nav button { width: 44px; height: 44px; font-size: 16px; }
        :global(html[data-layout='portrait']) .services-copy-stage { display: grid; flex: none; margin-top: clamp(10px, 2svh, 22px); }
        :global(html[data-layout='portrait']) .services-copy { position: relative; inset: auto; grid-area: 1 / 1; justify-content: flex-start; }
        :global(html[data-layout='portrait']) .services-panel h3 { font-size: clamp(26px, 9vw, 52px); }
        :global(html[data-layout='portrait']) .services-panel h3 > .mask { white-space: nowrap; }
        :global(html[data-layout='portrait']) .services-panel h3 strong { padding: 0 8px 4px; }
        /* fixed three-line box: every service has the same panel height, so the
           orb window above never resizes between services */
        :global(html[data-layout='portrait']) .services-panel p { margin-top: 12px; font-size: 14px; line-height: 1.5; height: 4.5em; overflow: hidden; }
        :global(html[data-layout='portrait']) .services-timer { margin-top: 14px; }
        :global(html[data-layout='portrait']) .services-station { display: flex; grid-column: 1; grid-row: 4; }
        @media (max-height: 620px) {
          :global(html[data-layout='portrait']) .services-panel p { height: 3em; }
        }

        @media (prefers-reduced-motion: reduce) {
          .services-copy *, .roll *, .scope-item { animation: none !important; }
        }

        /* ---------------------------------------------------------- landscape phone
           heading / orb window | number · title · description · timer */
        :global(html[data-layout='landscape']) .services-layout {
          display: grid; height: auto; min-height: 100svh;
          grid-template-columns: minmax(0, 4fr) minmax(0, 6fr); grid-template-rows: auto minmax(0, 1fr) auto;
          column-gap: 20px; row-gap: 10px; padding: calc(var(--grid-block-size) + 12px) 0 calc(14px + env(safe-area-inset-bottom));
        }
        :global(html[data-layout='landscape']) .services-heading { grid-column: 1 / -1; grid-row: 1; padding: 0; }
        :global(html[data-layout='landscape']) .services-heading p { display: none; }
        :global(html[data-layout='landscape']) .services-heading h2 { font-size: clamp(20px, 3.4vw, 34px); flex-wrap: wrap; column-gap: .28em; white-space: normal; }
        :global(html[data-layout='landscape']) .services-cta, :global(html[data-layout='landscape']) .services-index, :global(html[data-layout='landscape']) .services-scope, :global(html[data-layout='landscape']) .stage-label { display: none; }
        :global(html[data-layout='landscape']) .services-orb-stage { grid-column: 1; grid-row: 2; min-height: 0; border: 0; }
        :global(html[data-layout='landscape']) .services-panel { grid-column: 2; grid-row: 2; align-self: center; padding: 14px 18px; }
        :global(html[data-layout='landscape']) .services-number { font-size: clamp(26px, 4.2vw, 40px); }
        :global(html[data-layout='landscape']) .services-nav button { width: 44px; height: 44px; font-size: 16px; }
        :global(html[data-layout='landscape']) .services-copy-stage { display: grid; flex: none; margin-top: 10px; }
        :global(html[data-layout='landscape']) .services-copy { position: relative; inset: auto; grid-area: 1 / 1; justify-content: flex-start; }
        :global(html[data-layout='landscape']) .services-panel h3 { font-size: clamp(22px, 4vw, 40px); }
        :global(html[data-layout='landscape']) .services-panel h3 > .mask { white-space: nowrap; }
        :global(html[data-layout='landscape']) .services-panel h3 strong { padding: 0 8px 3px; }
        :global(html[data-layout='landscape']) .services-panel p { margin-top: 10px; font-size: 13px; line-height: 1.5; height: 4.5em; overflow: hidden; }
        :global(html[data-layout='landscape']) .services-timer { margin-top: 10px; }
        :global(html[data-layout='landscape']) .services-station { display: flex; grid-column: 1 / -1; grid-row: 3; }
      `}</style>
    </PinnedSection>
  );
}
