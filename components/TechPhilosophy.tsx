'use client';

import { PinnedSection } from '@/components/PinnedSection';
import { useScene } from '@/hooks/useScene';
import { useLanguage } from '@/context/LanguageContext';

const TECH = ['NEXT.JS', 'REACT', 'TYPESCRIPT', 'THREE.JS', 'GLSL', 'GSAP', 'NODE.JS', 'PYTHON', 'FASTAPI', 'POSTGRESQL'];
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const p = clamp01(value); return p * p * (3 - 2 * p); };

export function TechPhilosophy() {
  const { progress, enter: enterWindow, leave } = useScene('about');
  const { dictionary } = useLanguage();
  const heading = smooth((enterWindow - .42) / .3);
  const copy = smooth((enterWindow - .5) / .34);
  const enter = smooth((enterWindow - .56) / .4);
  const exit = smooth(leave / .42);
  const ticker = clamp01((progress - 0.25) / 0.7) * 480;

  return (
    <PinnedSection id="about">
      <div className="about-layout" style={{ clipPath: `inset(0 0 ${exit * 100}% 0)` }}>
        <div className="about-heading">
          <h2 className="mask"><span style={{ transform: `translate3d(0,${(1 - heading) * 105}%,0)` }}>{dictionary.about.title}</span></h2>
          <p style={{ opacity: heading }}>{dictionary.about.intro}</p>
        </div>
        <a href="#footer" className="about-cta" style={{ clipPath: `inset(0 0 0 ${(1 - heading) * 100}%)` }}>{dictionary.about.cta}</a>
        <p className="about-copy" style={{ clipPath: `inset(0 ${(1 - copy) * 100}% 0 0)` }}>{dictionary.about.copy}</p>
        <div className="about-orb-slot" data-orb-slot aria-hidden="true" />
        <div className="about-portrait" style={{ clipPath: `inset(${(1 - enter) * 100}% 0 0 0)` }}>
          <img src="/images/milosz_portrait.jpg" alt={dictionary.about.portraitAlt} />
        </div>
        <div className="about-ticker" style={{ clipPath: `inset(0 ${(1 - enter) * 100}% 0 0)` }}>
          <div style={{ transform: `translate3d(-${ticker}px,0,0)` }}>
            {[...TECH, ...TECH].map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
          </div>
          <small>translateX: {Math.round(ticker)}px</small>
        </div>
        <p className="route-station about-station" data-route-station><b>04</b> / {dictionary.route.about}</p>
      </div>

      <style jsx>{`
        .about-layout { position: relative; height: 100%; display: grid; grid-template-columns: repeat(var(--grid-cols),var(--grid-block-size)); grid-template-rows: repeat(12,var(--grid-block-size)); overflow: hidden; }
        .mask { display: block; overflow: hidden; }
        .mask > span { display: block; }
        .about-heading { grid-column: 1 / 9; grid-row: 3 / 4; align-self: end; }
        .about-heading h2 { font: 200 clamp(30px,2.8vw,42px)/.95 var(--font-display); letter-spacing: -.035em; color: var(--text-secondary); }
        .about-heading p { margin-top: 4px; font-size: 14px; color: var(--text-tertiary); }
        .about-cta { grid-column: -3 / -1; grid-row: 3 / 4; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-primary); font-size: 15px; color: var(--text-secondary); }
        .about-copy { grid-column: 1 / 7; grid-row: 4 / 9; padding: 110px 60px; font: 300 clamp(18px,1.55vw,23px)/1.35 var(--font-display); color: var(--text-secondary); border: 1px solid var(--border-primary); overflow: hidden; }
        .about-portrait { grid-column: -7 / -1; grid-row: 4 / 10; margin: 18px; overflow: hidden; background: var(--bg-elevated); }
        .about-portrait img { width: 100%; height: 100%; object-fit: cover; object-position: center 28%; filter: grayscale(1) contrast(1.05); transform: scale(${1.08 - enter * .08}); }
        .about-ticker { grid-column: 1 / -7; grid-row: 9 / 11; position: relative; display: flex; align-items: center; border: 1px solid var(--border-primary); overflow: hidden; }
        .about-ticker > div { display: flex; align-items: center; gap: 70px; min-width: max-content; padding: 0 20px; will-change: transform; }
        .about-ticker span { font: 600 13px/1 var(--font-sans); color: var(--text-quaternary); white-space: nowrap; }
        .about-ticker small { position: absolute; left: 10px; bottom: 9px; font: 10px/1 var(--font-mono); color: var(--text-quaternary); }
        @media (min-width: 768px) and (max-height: 800px) {
          .about-copy { grid-column: 1 / 8; }
          .about-portrait { grid-column: -8 / -1; }
        }
        @media (max-width: 767px) {
          :global(html[data-layout='flow']) .about-layout { display: block; padding: 110px 20px 30px; }
          :global(html[data-layout='flow']) .about-cta { position: absolute; top: 34px; right: 20px; padding: 12px; }
          :global(html[data-layout='flow']) .about-copy { margin-top: 28px; padding: 30px 20px; min-height: 220px; }
          :global(html[data-layout='flow']) .about-portrait { margin: 18px 0; height: 42vh; }
          :global(html[data-layout='flow']) .about-ticker { height: 90px; }
        }
        .about-orb-slot, .about-station { display: none; }

        /* ---------------------------------------------------------- portrait
           ABOUT / statement / orb window | portrait / stack / 04 station */
        :global(html[data-layout='portrait']) .about-layout {
          display: grid; grid-template-columns: 1fr 1fr; grid-template-rows: auto auto minmax(0, 1fr) auto auto;
          row-gap: clamp(10px, 1.8svh, 18px);
          padding: calc(var(--grid-block-size) + clamp(12px, 2.4svh, 26px)) 0 calc(clamp(12px, 2svh, 20px) + env(safe-area-inset-bottom));
        }
        :global(html[data-layout='portrait']) .about-heading { grid-column: 1 / -1; grid-row: 1; }
        :global(html[data-layout='portrait']) .about-heading h2 { font-size: clamp(28px, 8.2vw, 46px); }
        :global(html[data-layout='portrait']) .about-heading p { font-size: 12px; margin-top: 6px; }
        :global(html[data-layout='portrait']) .about-cta { display: none; }
        :global(html[data-layout='portrait']) .about-copy { grid-column: 1 / -1; grid-row: 2; padding: clamp(14px, 4vw, 24px); font-size: clamp(16px, 4.7vw, 24px); line-height: 1.32; }
        :global(html[data-layout='portrait']) .about-orb-slot { display: block; grid-column: 1; grid-row: 3; min-height: 0; }
        :global(html[data-layout='portrait']) .about-portrait { grid-column: 2; grid-row: 3; margin: 0; min-height: 0; }
        :global(html[data-layout='portrait']) .about-ticker { grid-column: 1 / -1; grid-row: 4; height: max(44px, calc(var(--grid-block-size) * .8)); }
        :global(html[data-layout='portrait']) .about-ticker > div { gap: 36px; }
        :global(html[data-layout='portrait']) .about-ticker span { font-size: 12px; }
        :global(html[data-layout='portrait']) .about-ticker small { display: none; }
        :global(html[data-layout='portrait']) .about-station { display: flex; grid-column: 1 / -1; grid-row: 5; }
        @media (max-height: 620px) {
          :global(html[data-layout='portrait']) .about-copy { font-size: 15px; padding: 12px 14px; }
        }
      `}</style>
    </PinnedSection>
  );
}
