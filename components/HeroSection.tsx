'use client';

import { useEffect, useState } from 'react';
import { PinnedSection } from '@/components/PinnedSection';
import { useScene } from '@/hooks/useScene';
import { useLanguage } from '@/context/LanguageContext';

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const p = clamp01(value); return p * p * (3 - 2 * p); };

export function HeroSection() {
  const { progress, leave } = useScene('hero');
  const { dictionary } = useLanguage();
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setEntered(true), 80);
    return () => window.clearTimeout(timer);
  }, []);

  // Exit inside the Hero -> Work overlap window: words leave through their masks,
  // labels wipe, the frame opens outward while the orb starts travelling.
  const wordsOut = (i: number) => smooth((leave - .04 - i * .05) / .3);
  const labelsOut = smooth((leave - .02) / .26);
  const frameOut = smooth((leave - .08) / .3);
  const frameInset = Math.round((1 - clamp01(progress / 0.75)) * 28);

  return (
    <PinnedSection id="hero">
      <div className={`hero-layout ${entered ? 'hero-layout--entered' : ''}`}>
        <p className="hero-label hero-label--top-left" style={{ clipPath: `inset(0 ${labelsOut * 100}% 0 0)` }}><span>01.</span> {dictionary.hero.role}</p>
        <p className="hero-label hero-label--top-right" style={{ clipPath: `inset(0 0 0 ${labelsOut * 100}%)` }}><span>02.</span> {dictionary.hero.availability}</p>

        <div className="hero-words hero-words--left">
          <span className="word-mask"><span style={{ transform: `translate3d(0,${-wordsOut(0) * 105}%,0)` }}>{dictionary.hero.shaping}</span></span>
          <span className="word-mask"><span style={{ transform: `translate3d(0,${-wordsOut(1) * 105}%,0)` }}>{dictionary.hero.concepts}</span></span>
        </div>
        <div className="hero-words hero-words--right">
          <span className="word-mask"><span style={{ transform: `translate3d(0,${-wordsOut(1) * 105}%,0)` }}>{dictionary.hero.building}</span></span>
          <span className="word-mask"><span style={{ transform: `translate3d(0,${-wordsOut(2) * 105}%,0)` }}>{dictionary.hero.experiences}</span></span>
        </div>

        <div className="hero-orb-frame" aria-hidden="true" style={{ transform: `translateX(-50%) scale(${1 + frameOut * .18})`, opacity: 1 - frameOut }}>
          <span className="hero-frame-note hero-frame-note--top">clip-path: inset(0px {frameInset}px {frameInset}px 0px)</span>
          <span className="hero-frame-note hero-frame-note--left">clip-path: inset({frameInset}px {frameInset}px 0px 0px)</span>
          <span className="hero-frame-note hero-frame-note--right">clip-path: inset(0px 0px {frameInset}px {frameInset}px)</span>
          <span className="hero-frame-note hero-frame-note--bottom">clip-path: inset({frameInset}px 0px 0px {frameInset}px)</span>
          <i className="frame-corner frame-corner--tl" />
          <i className="frame-corner frame-corner--tr" />
          <i className="frame-corner frame-corner--bl" />
          <i className="frame-corner frame-corner--br" />
        </div>

        <div className="hero-label hero-label--bottom-left" style={{ clipPath: `inset(0 ${labelsOut * 100}% 0 0)` }}>
          <span>03.</span>
          <a href="mailto:contact@kern.dev">M: CONTACT@KERN.DEV</a>
        </div>
        <a href="#footer" className="hero-label hero-label--bottom-right" style={{ clipPath: `inset(0 0 0 ${labelsOut * 100}%)` }}><span>04.</span> {dictionary.hero.open}</a>

        {/* portrait only: the orb's window and the route's first station */}
        <div className="hero-orb-slot" data-orb-slot aria-hidden="true" />
        <p className="route-station hero-station" data-route-station><b>01</b> / {dictionary.route.start}</p>
      </div>

      <style jsx>{`
        .hero-layout {
          position: relative;
          height: 100%;
          display: grid;
          grid-template-columns: repeat(var(--grid-cols), var(--grid-block-size));
          grid-template-rows: repeat(12, var(--grid-block-size));
        }
        .hero-label {
          align-self: start;
          font: 500 12px/1 var(--font-sans);
          color: var(--text-secondary);
          letter-spacing: -0.01em;
          white-space: nowrap;
          overflow: hidden;
        }
        .hero-label span { color: var(--text-tertiary); font-weight: 400; }
        .hero-label--top-left { grid-column: 2 / 6; grid-row: 4; }
        .hero-label--top-right { grid-column: -4 / -1; grid-row: 4; }
        .hero-label--bottom-left { grid-column: 2 / 6; grid-row: 9; display: flex; flex-direction: column; gap: 6px; }
        .hero-label--bottom-right { grid-column: -4 / -1; grid-row: 9; }
        .hero-words {
          align-self: center;
          display: flex;
          flex-direction: column;
          font: 200 clamp(28px, 2.75vw, 42px)/1.4 var(--font-display);
          color: var(--text-tertiary);
          letter-spacing: -0.035em;
          white-space: nowrap;
        }
        .hero-words--left { grid-column: 3 / 7; grid-row: 6 / 8; }
        .hero-words--right { grid-column: -7 / -1; grid-row: 6 / 8; align-items: flex-end; }
        .word-mask { display: block; overflow: hidden; }
        .word-mask > span { display: block; will-change: transform; }
        .word-mask {
          transform: translateY(115%);
          opacity: 0;
          transition: transform 0.9s cubic-bezier(.16,1,.3,1), opacity 0.5s ease;
        }
        .word-mask:nth-child(2) { transition-delay: 0.08s; color: var(--text-quaternary); }
        .hero-layout--entered .word-mask { transform: translateY(0); opacity: 1; }
        .hero-orb-frame {
          position: absolute;
          left: 50%;
          top: calc(var(--grid-block-size) * 3);
          width: calc(var(--grid-block-size) * 6);
          height: calc(var(--grid-block-size) * 6);
          transform: translateX(-50%);
          pointer-events: none;
        }
        .frame-corner { position: absolute; width: 76px; height: 76px; }
        .frame-corner--tl { left: 0; top: 0; border-left: 1px solid var(--border-primary); border-top: 1px solid var(--border-primary); }
        .frame-corner--tr { right: 0; top: 0; border-right: 1px solid var(--border-primary); border-top: 1px solid var(--border-primary); }
        .frame-corner--bl { left: 0; bottom: 0; border-left: 1px solid var(--border-primary); border-bottom: 1px solid var(--border-primary); }
        .frame-corner--br { right: 0; bottom: 0; border-right: 1px solid var(--border-primary); border-bottom: 1px solid var(--border-primary); }
        .hero-frame-note { position: absolute; color: var(--text-quaternary); font: 10px/1 var(--font-mono); }
        .hero-frame-note--top { top: 6px; left: 8px; }
        .hero-frame-note--left { left: 8px; top: 50%; transform: rotate(90deg) translateX(-50%); transform-origin: left top; }
        .hero-frame-note--right { right: 8px; top: 50%; transform: rotate(90deg) translateX(-50%); transform-origin: right top; }
        .hero-frame-note--bottom { bottom: 6px; right: 8px; }
        .hero-orb-slot, .hero-station { display: none; }
        @media (max-width: 767px) {
          :global(html[data-layout='flow']) .hero-layout { display: block; padding: 120px 24px 48px; }
          :global(html[data-layout='flow']) .hero-label--top-left, :global(html[data-layout='flow']) .hero-label--top-right { position: absolute; top: 100px; }
          :global(html[data-layout='flow']) .hero-label--top-left { left: 24px; }
          :global(html[data-layout='flow']) .hero-label--top-right { right: 24px; text-align: right; }
          :global(html[data-layout='flow']) .hero-words { position: absolute; font-size: clamp(34px, 10vw, 56px); }
          :global(html[data-layout='flow']) .hero-words--left { left: 24px; top: 26%; }
          :global(html[data-layout='flow']) .hero-words--right { right: 24px; bottom: 24%; }
          :global(html[data-layout='flow']) .hero-orb-frame { position: absolute; width: min(78vw, 420px); aspect-ratio: 1; left: 50%; top: 50%; transform: translate(-50%,-50%); }
          :global(html[data-layout='flow']) .hero-label--bottom-left { position: absolute; left: 24px; bottom: 40px; }
          :global(html[data-layout='flow']) .hero-label--bottom-right { position: absolute; right: 24px; bottom: 40px; }
        }

        /* ---------------------------------------------------------- portrait
           labels / SHAPING CONCEPTS / orb window / BUILDING EXPERIENCES /
           labels / 01 START — one column, the orb never under the words. */
        :global(html[data-layout='portrait']) .hero-layout {
          display: grid; grid-template-columns: 1fr 1fr;
          grid-template-rows: auto auto minmax(0, 1fr) auto auto auto;
          column-gap: 16px; row-gap: clamp(10px, 2.2svh, 22px);
          padding: calc(var(--grid-block-size) + clamp(14px, 2.6svh, 28px)) 0 calc(clamp(12px, 2svh, 22px) + env(safe-area-inset-bottom));
        }
        :global(html[data-layout='portrait']) .hero-label { white-space: normal; font-size: 11px; line-height: 1.35; letter-spacing: .01em; }
        :global(html[data-layout='portrait']) .hero-label--top-left { grid-column: 1; grid-row: 1; }
        :global(html[data-layout='portrait']) .hero-label--top-right { grid-column: 2; grid-row: 1; text-align: right; }
        :global(html[data-layout='portrait']) .hero-words { font-size: clamp(30px, 10.2vw, 72px); line-height: 1.02; align-self: auto; }
        :global(html[data-layout='portrait']) .hero-words--left { grid-column: 1 / -1; grid-row: 2; }
        :global(html[data-layout='portrait']) .hero-orb-slot { display: block; grid-column: 1 / -1; grid-row: 3; min-height: 0; }
        :global(html[data-layout='portrait']) .hero-words--right { grid-column: 1 / -1; grid-row: 4; align-items: flex-end; }
        :global(html[data-layout='portrait']) .hero-label--bottom-left { grid-column: 1; grid-row: 5; gap: 4px; }
        :global(html[data-layout='portrait']) .hero-label--bottom-right { grid-column: 2; grid-row: 5; text-align: right; align-self: end; }
        :global(html[data-layout='portrait']) .hero-station { display: flex; grid-column: 1 / -1; grid-row: 6; }
        :global(html[data-layout='portrait']) .hero-orb-frame { display: none; }
        /* touch: the label links keep their look but get a 44px hit area */
        :global(html[data-layout='portrait']) .hero-label a, :global(html[data-layout='portrait']) a.hero-label { position: relative; }
        :global(html[data-layout='portrait']) .hero-label a::after, :global(html[data-layout='portrait']) a.hero-label::after { content: ''; position: absolute; inset: -15px -6px; }

        /* ---------------------------------------------------------- landscape phone
           orb window | labels / SHAPING CONCEPTS / BUILDING EXPERIENCES / labels */
        :global(html[data-layout='landscape']) .hero-layout {
          display: grid; min-height: 100svh; height: auto;
          grid-template-columns: minmax(0, 5fr) minmax(0, 6fr); grid-template-rows: auto minmax(0, 1fr) minmax(0, 1fr) auto auto;
          column-gap: 24px; row-gap: 8px; padding: calc(var(--grid-block-size) + 12px) 0 calc(14px + env(safe-area-inset-bottom));
        }
        :global(html[data-layout='landscape']) .hero-label { white-space: normal; font-size: 11px; line-height: 1.35; }
        :global(html[data-layout='landscape']) .hero-label--top-left { grid-column: 1; grid-row: 1; }
        :global(html[data-layout='landscape']) .hero-label--top-right { grid-column: 2; grid-row: 1; justify-self: end; text-align: right; }
        :global(html[data-layout='landscape']) .hero-words { font-size: clamp(26px, 5.4vw, 52px); line-height: 1.02; }
        :global(html[data-layout='landscape']) .hero-words--left { grid-column: 2; grid-row: 2; align-self: end; }
        :global(html[data-layout='landscape']) .hero-words--right { grid-column: 2; grid-row: 3; align-self: start; align-items: flex-end; }
        :global(html[data-layout='landscape']) .hero-orb-slot { display: block; grid-column: 1; grid-row: 2 / 4; min-height: 0; }
        :global(html[data-layout='landscape']) .hero-label--bottom-left { grid-column: 1; grid-row: 4; gap: 4px; }
        :global(html[data-layout='landscape']) .hero-label--bottom-right { grid-column: 2; grid-row: 4; justify-self: end; align-self: end; text-align: right; }
        :global(html[data-layout='landscape']) .hero-station { display: flex; grid-column: 1 / -1; grid-row: 5; }
        :global(html[data-layout='landscape']) .hero-orb-frame { display: none; }
        :global(html[data-layout='landscape']) .hero-label a, :global(html[data-layout='landscape']) a.hero-label { position: relative; }
        :global(html[data-layout='landscape']) .hero-label a::after, :global(html[data-layout='landscape']) a.hero-label::after { content: ''; position: absolute; inset: -15px -6px; }
      `}</style>
    </PinnedSection>
  );
}
