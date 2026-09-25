'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { PinnedSection } from '@/components/PinnedSection';
import { useScrollProgress } from '@/context/ScrollContext';
import { useBubble } from '@/context/BubbleContext';
import { SERVICES } from '@/data/services';
import { useLanguage } from '@/context/LanguageContext';

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const p = clamp01(value); return p * p * (3 - 2 * p); };

export function ServicesIndex() {
  const progress = useScrollProgress('services');
  const { setActiveServiceIndex } = useBubble();
  const { dictionary } = useLanguage();
  const layoutRef = useRef<HTMLDivElement>(null);
  const activeIndexRef = useRef(0);
  const transitionTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resumeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasEntered = useRef(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [transitioning, setTransitioning] = useState(false);
  const [inViewport, setInViewport] = useState(false);
  const [interactionPaused, setInteractionPaused] = useState(false);
  const start = 1 / 6;
  const end = 0.78;
  const serviceProgress = clamp01((progress - start) / (end - start));
  const scrollIndex = Math.min(SERVICES.length - 1, Math.floor(serviceProgress * SERVICES.length));
  const service = dictionary.services.items[activeIndex];
  const previousService = previousIndex === null ? null : dictionary.services.items[previousIndex];
  const exit = smooth((progress - 0.88) / 0.12);
  const headingReveal = smooth((progress - 0.055) / 0.085);
  const contentReveal = smooth((progress - 0.08) / 0.13);
  const sceneActive = inViewport && progress > .08 && progress < .94;

  const changeService = useCallback((targetIndex: number, manual = false) => {
    const normalized = (targetIndex + SERVICES.length) % SERVICES.length;
    const current = activeIndexRef.current;
    if (normalized === current) return;
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    setPreviousIndex(current);
    setDirection(normalized > current || (current === SERVICES.length - 1 && normalized === 0) ? 1 : -1);
    activeIndexRef.current = normalized;
    setActiveIndex(normalized);
    setTransitioning(true);
    transitionTimer.current = setTimeout(() => {
      setTransitioning(false);
      setPreviousIndex(null);
    }, 820);
    if (manual) {
      setInteractionPaused(true);
      if (resumeTimer.current) clearTimeout(resumeTimer.current);
      resumeTimer.current = setTimeout(() => setInteractionPaused(false), 1500);
    }
  }, []);

  useEffect(() => {
    const element = layoutRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => setInViewport(entry.isIntersecting && entry.intersectionRatio > .28), { threshold: [.05, .28, .6] });
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (sceneActive && !hasEntered.current) {
      hasEntered.current = true;
      activeIndexRef.current = scrollIndex;
      setActiveIndex(scrollIndex);
    }
    if (!sceneActive) hasEntered.current = false;
  }, [sceneActive, scrollIndex]);

  useEffect(() => setActiveServiceIndex(activeIndex), [activeIndex, setActiveServiceIndex]);

  useEffect(() => {
    if (!sceneActive || interactionPaused) return;
    const timer = window.setTimeout(() => changeService(activeIndex + 1), 4800);
    return () => window.clearTimeout(timer);
  }, [activeIndex, changeService, interactionPaused, sceneActive]);

  useEffect(() => () => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
  }, []);

  const pauseInteraction = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    setInteractionPaused(true);
  };
  const resumeInteraction = () => {
    if (resumeTimer.current) clearTimeout(resumeTimer.current);
    resumeTimer.current = setTimeout(() => setInteractionPaused(false), 1100);
  };

  return (
    <PinnedSection id="services">
      <div
        ref={layoutRef}
        className="services-layout"
        data-active-service={activeIndex}
        style={{ opacity: 1 - exit, transform: `translateY(${-exit * 72}px)` }}
        onFocusCapture={pauseInteraction}
        onBlurCapture={resumeInteraction}
      >
        <div className="services-heading">
          <p style={{ opacity: headingReveal }}>{dictionary.services.intro}</p>
          <h2 aria-label={dictionary.services.title.join(' ')} style={{ clipPath: `inset(0 ${(1 - headingReveal) * 100}% 0 0)` }}>
            {dictionary.services.title.map((word) => <span key={word}>{word}</span>)}
          </h2>
        </div>
        <a href="#footer" className="services-cta">{dictionary.services.cta}</a>

        <section className="services-panel" style={{ opacity: contentReveal }} aria-live="polite" onPointerEnter={pauseInteraction} onPointerLeave={resumeInteraction}>
          <div className="services-panel-top">
            <span className="services-number">0{activeIndex + 1} / 0{SERVICES.length}</span>
            <div className="services-nav" aria-label={dictionary.services.navigation}>
              <button type="button" onClick={() => changeService(activeIndex - 1, true)} aria-label={dictionary.services.previous}>←</button>
              <button type="button" onClick={() => changeService(activeIndex + 1, true)} aria-label={dictionary.services.next}>→</button>
            </div>
          </div>
          <div className={`services-copy-stage direction-${direction}`}>
            {transitioning && previousService && (
              <div className="services-copy services-copy--outgoing" key={`out-${previousIndex}`} aria-hidden="true">
                <h3><span>{previousService.title[0]}</span><strong>{previousService.title[1]}</strong></h3>
                <p>{previousService.description}</p>
              </div>
            )}
            <div className="services-copy services-copy--incoming" key={`in-${activeIndex}`}>
              <h3><span>{service.title[0]}</span><strong>{service.title[1]}</strong></h3>
              <p>{service.description}</p>
            </div>
          </div>
          <div className="services-line"><i key={`line-${activeIndex}`} style={{ animationPlayState: interactionPaused ? 'paused' : 'running' }} /></div>
        </section>

        <nav className="services-index" aria-label={dictionary.services.navigation} style={{ opacity: contentReveal }} onPointerEnter={pauseInteraction} onPointerLeave={resumeInteraction}>
          {dictionary.services.items.map((item, itemIndex) => (
            <button
              key={item.title.join('-')}
              type="button"
              className={itemIndex === activeIndex ? 'is-active' : ''}
              aria-current={itemIndex === activeIndex ? 'true' : undefined}
              onClick={() => changeService(itemIndex, true)}
            >
              <span>0{itemIndex + 1}</span>
              <span>{item.title[0]} {item.title[1]}</span>
            </button>
          ))}
        </nav>

        <div className="services-orb-stage" aria-hidden="true" style={{ opacity: contentReveal }}>
          <span>{dictionary.services.form} / 0{activeIndex + 1}</span>
        </div>

        <div className="services-scope" key={`scope-${activeIndex}`} style={{ opacity: contentReveal }}>
          <span className="services-scope-label">{dictionary.services.focus}</span>
          {service.scope.slice(0, 3).map((item) => <p key={item}>{item}</p>)}
        </div>
      </div>

      <style jsx>{`
        .services-layout { position: relative; height: 100%; display: grid; grid-template-columns: repeat(var(--grid-cols),var(--grid-block-size)); grid-template-rows: repeat(12,var(--grid-block-size)); overflow: hidden; }
        .services-heading { grid-column: 1 / 11; grid-row: 2 / 4; align-self: end; padding-bottom: 8px; }
        .services-heading p { font-size: 13px; color: var(--text-tertiary); margin-bottom: 7px; transition: opacity .18s linear; }
        .services-heading h2 { display: flex; gap: .28em; font: 200 clamp(25px,2.45vw,38px)/.95 var(--font-display); letter-spacing: -.035em; color: var(--text-primary); white-space: nowrap; will-change: clip-path; }
        .services-cta { grid-column: -3 / -1; grid-row: 3 / 4; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-primary); font-size: 14px; color: var(--text-secondary); }
        .services-panel { grid-column: 1 / 7; grid-row: 4 / 10; padding: 24px; border: 1px solid var(--border-primary); overflow: hidden; display: flex; flex-direction: column; transition: opacity .16s linear; }
        .services-panel-top { display: flex; align-items: center; justify-content: space-between; position: relative; z-index: 3; }
        .services-number { font: 500 11px/1 var(--font-mono); letter-spacing: .08em; color: var(--text-tertiary); }
        .services-nav { display: flex; gap: 5px; }
        .services-nav button { width: 34px; height: 30px; border: 1px solid var(--border-primary); color: var(--text-secondary); transition: color .2s ease, background .2s ease; }
        .services-nav button:hover { color: var(--bg-canvas); background: var(--text-primary); }
        .services-copy-stage { position: relative; flex: 1; min-height: 0; overflow: hidden; }
        .services-copy { position: absolute; inset: 0; display: flex; flex-direction: column; justify-content: flex-end; }
        .services-panel h3 { display: flex; flex-direction: column; align-items: flex-start; font: 200 clamp(34px,3.65vw,56px)/1.02 var(--font-display); letter-spacing: -.05em; color: var(--text-primary); }
        .services-panel h3 strong { font-weight: 200; color: var(--bg-canvas); background: var(--text-primary); padding: 0 9px 4px; }
        .services-panel p { max-width: 520px; min-height: 76px; margin-top: 24px; font: 300 14px/1.5 var(--font-sans); color: var(--text-secondary); animation: serviceCopy .42s .05s var(--ease-out-expo) both; }
        .services-copy--incoming { animation: serviceIn .82s var(--ease-out-expo) both; }
        .services-copy--outgoing { animation: serviceOut .52s var(--ease-in-out-cubic) both; }
        .direction-1 .services-copy--incoming { --service-from: 42px; }
        .direction-1 .services-copy--outgoing { --service-to: -28px; }
        .direction--1 .services-copy--incoming { --service-from: -42px; }
        .direction--1 .services-copy--outgoing { --service-to: 28px; }
        .services-line { height: 1px; margin-top: 20px; background: var(--border-primary); transform-origin: left; }
        .services-line i { display: block; width: 100%; height: 1px; background: var(--text-primary); transform-origin: left; animation: serviceTimer 4.8s linear both; }
        .services-index { grid-column: 7 / -7; grid-row: 4 / 10; display: grid; grid-template-rows: repeat(6,1fr); border-block: 1px solid var(--border-primary); transition: opacity .16s linear; }
        .services-index button { min-width: 0; display: grid; grid-template-columns: 42px 1fr; align-items: center; text-align: left; border-bottom: 1px solid var(--border-primary); color: var(--text-tertiary); transition: color .25s ease, padding .35s var(--ease-out-expo), background .25s ease; }
        .services-index button > span:first-child { padding-left: 10px; font: 500 10px/1 var(--font-mono); }
        .services-index button > span:last-child { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font: 400 clamp(10px,.78vw,12px)/1 var(--font-sans); letter-spacing: .015em; }
        .services-index button:hover, .services-index button.is-active { color: var(--text-primary); padding-left: 7px; background: color-mix(in srgb, var(--text-primary) 3%, transparent); }
        .services-orb-stage { grid-column: -7 / -1; grid-row: 4 / 10; position: relative; border: 1px solid var(--border-primary); overflow: hidden; transition: opacity .16s linear; }
        .services-orb-stage span { position: absolute; right: 11px; bottom: 10px; font: 10px/1 var(--font-mono); letter-spacing: .08em; color: var(--text-tertiary); }
        .services-scope { grid-column: 1 / -1; grid-row: 10 / 11; display: grid; grid-template-columns: 2fr repeat(3,3fr); border: 1px solid var(--border-primary); transition: opacity .16s linear; animation: scopeIn .72s .12s var(--ease-out-expo) both; }
        .services-scope > * { display: flex; align-items: center; padding: 0 18px; border-right: 1px solid var(--border-primary); }
        .services-scope-label { font: 500 10px/1 var(--font-mono); letter-spacing: .08em; color: var(--text-tertiary); }
        .services-scope p { font: 300 clamp(10px,.76vw,12px)/1.35 var(--font-sans); color: var(--text-secondary); }
        @keyframes serviceIn { from { clip-path: inset(0 0 100% 0); transform: translateX(var(--service-from,42px)) scale(.985); } to { clip-path: inset(0); transform: none; } }
        @keyframes serviceOut { to { clip-path: inset(100% 0 0 0); transform: translateX(var(--service-to,-28px)) scale(.985); opacity: 0; } }
        @keyframes serviceCopy { from { clip-path: inset(0 0 100% 0); transform: translateY(10px); } to { clip-path: inset(0); transform: none; } }
        @keyframes serviceTimer { from { transform: scaleX(0); } to { transform: scaleX(1); } }
        @keyframes scopeIn { from { clip-path: inset(0 0 0 100%); } to { clip-path: inset(0); } }
        @media (min-width: 768px) and (max-height: 800px) {
          .services-heading { grid-column: 1 / 12; }
          .services-panel { grid-column: 1 / 7; padding: 18px 24px; }
          .services-panel p { margin-top: 15px; min-height: 60px; }
        }
        @media (max-width: 767px) {
          .services-layout { display: block; padding: 100px 20px 40px; overflow: auto; }
          .services-heading h2 { flex-direction: column; gap: 0; white-space: normal; font-size: 34px; }
          .services-cta { position: absolute; right: 20px; top: 34px; padding: 12px; }
          .services-panel { margin-top: 30px; min-height: 340px; padding: 22px 18px; }
          .services-panel h3 { font-size: 43px; }
          .services-index { height: 300px; margin-top: 14px; border-inline: 1px solid var(--border-primary); }
          .services-orb-stage { height: 260px; margin-top: 14px; }
          .services-scope { display: none; }
        }
        @media (prefers-reduced-motion: reduce) {
          .services-copy, .services-panel p, .services-line i, .services-scope { animation: none; }
        }
      `}</style>
    </PinnedSection>
  );
}
