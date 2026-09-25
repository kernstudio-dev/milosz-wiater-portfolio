'use client';

import { PinnedSection } from '@/components/PinnedSection';
import { useScrollProgress } from '@/context/ScrollContext';
import { useLanguage } from '@/context/LanguageContext';

const TECH = ['NEXT.JS', 'REACT', 'TYPESCRIPT', 'THREE.JS', 'GLSL', 'GSAP', 'NODE.JS', 'PYTHON', 'FASTAPI', 'POSTGRESQL'];
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export function TechPhilosophy() {
  const progress = useScrollProgress('about');
  const { dictionary } = useLanguage();
  const enter = clamp01((progress - 0.06) / 0.14);
  const exit = clamp01((progress - 0.88) / 0.12);
  const visibility = enter * (1 - exit);
  const ticker = clamp01((progress - 0.3) / 0.65) * 480;

  return (
    <PinnedSection id="about">
      <div className="about-layout" style={{ opacity: visibility }}>
        <div className="about-heading">
          <h2>{dictionary.about.title}</h2>
          <p>{dictionary.about.intro}</p>
        </div>
        <a href="#footer" className="about-cta">{dictionary.about.cta}</a>
        <p className="about-copy">{dictionary.about.copy}</p>
        <div className="about-portrait">
          <img src="/images/milosz_portrait.jpg" alt={dictionary.about.portraitAlt} />
        </div>
        <div className="about-ticker">
          <div style={{ transform: `translate3d(-${ticker}px,0,0)` }}>
            {[...TECH, ...TECH].map((item, index) => <span key={`${item}-${index}`}>{item}</span>)}
          </div>
          <small>translateX: {Math.round(ticker)}px</small>
        </div>
      </div>

      <style jsx>{`
        .about-layout { position: relative; height: 100%; display: grid; grid-template-columns: repeat(var(--grid-cols),var(--grid-block-size)); grid-template-rows: repeat(12,var(--grid-block-size)); transition: opacity .08s linear; overflow: hidden; }
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
          .about-layout { display: block; padding: 110px 20px 30px; }
          .about-cta { position: absolute; top: 34px; right: 20px; padding: 12px; }
          .about-copy { margin-top: 28px; padding: 30px 20px; min-height: 220px; }
          .about-portrait { margin: 18px 0; height: 42vh; }
          .about-ticker { height: 90px; }
        }
      `}</style>
    </PinnedSection>
  );
}
