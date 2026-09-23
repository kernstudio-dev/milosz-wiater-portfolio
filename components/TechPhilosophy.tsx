'use client';

import { PinnedSection } from '@/components/PinnedSection';
import { useScrollProgress } from '@/context/ScrollContext';
import { ABOUT_TICKER } from '@/lib/motionMap';
import { scaleFontSize } from '@/lib/grid';

const TECH_ITEMS = [
  'NEXT.JS', 'REACT', 'TYPESCRIPT', 'THREE.JS', 'GLSL', 'GSAP', 'LENIS',
  'NODE.JS', 'PYTHON', 'FASTAPI', 'GEMINI', 'FIGMA', 'WEBGL', 'VERCEL',
  'POSTGRESQL', 'DOCKER', 'WEBSOCKETS',
];

export function TechPhilosophy() {
  const scrollCtx = useScrollProgress();
  const progress = typeof scrollCtx === 'number' ? 0 : scrollCtx.progress.about;
  const isPinned = typeof scrollCtx !== 'number' && scrollCtx.isPinned('about');

  const tickerT = Math.max(0, Math.min(1, (progress - ABOUT_TICKER.start) / (ABOUT_TICKER.end - ABOUT_TICKER.start)));
  const tickerX = ABOUT_TICKER.px * tickerT;

  const bs = 90;
  const headingSize = scaleFontSize(43.07, 3.46, bs);
  const bodySize = scaleFontSize(22.53, 3.46, bs);

  return (
    <PinnedSection id="about">
      <div className="section-grid-inner about-grid">
        <div className={`about-heading border-draw ${isPinned ? 'is-visible' : ''}`} style={{ gridColumn: '1 / 8', gridRow: '3 / 5' }}>
          <h2 style={{ fontSize: headingSize, fontWeight: 200, textTransform: 'uppercase' }}>KERN</h2>
          <p className="about-tagline font-mono">Creative Development</p>
        </div>

        <div className={`about-bio ${isPinned ? 'reveal-visible' : 'reveal-hidden'}`} style={{ gridColumn: '1 / 8', gridRow: '5 / 8' }}>
          <p style={{ fontSize: bodySize, fontWeight: 200, lineHeight: 1.35, maxWidth: 520 }}>
            I design and build digital products where strategy, interaction, development and visual identity work as one system.
          </p>
          <p className="about-secondary">
            Working independently with founders, creative agencies, and product teams to engineer digital experiences that stand out without unnecessary noise.
          </p>
        </div>

        <div
          className={`about-portrait ${isPinned ? 'about-portrait--visible' : ''}`}
          style={{ gridColumn: '15 / 21', gridRow: '3 / 8' }}
        >
          <div className="about-portrait-placeholder">
            <span className="font-mono">PORTRAIT</span>
          </div>
        </div>

        <div className="about-ticker-wrap" style={{ gridColumn: '1 / -1', gridRow: '9 / 10' }}>
          <div className="about-ticker font-mono" style={{ transform: `translateX(-${tickerX}px)` }}>
            {TECH_ITEMS.map((item) => (
              <span key={item} className="about-ticker-item">{item}</span>
            ))}
          </div>
          <span className="about-ticker-label font-mono">{`translateX: ${Math.round(tickerX)}px`}</span>
        </div>
      </div>

      <style jsx>{`
        .about-grid {
          padding-top: calc(var(--grid-block-size) * 2);
          padding-bottom: var(--grid-block-size);
        }
        .about-tagline {
          font-size: 16.53px;
          color: var(--text-tertiary);
          margin-top: 8px;
          letter-spacing: 0.08em;
        }
        .about-secondary {
          margin-top: 16px;
          font-size: 18.53px;
          color: var(--text-secondary);
          line-height: 1.6;
          max-width: 480px;
        }
        .about-portrait-placeholder {
          width: 100%;
          height: 100%;
          min-height: calc(var(--grid-block-size) * 5);
          background: var(--bg-elevated);
          border: 1px solid var(--border-primary);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-tertiary);
          font-size: 11px;
          clip-path: inset(100% 0 0 0);
          transition: clip-path 2s ease;
        }
        .about-portrait--visible .about-portrait-placeholder {
          clip-path: inset(0 0 0 0);
        }
        .about-ticker-wrap {
          position: relative;
          overflow: hidden;
          border-top: 1px solid var(--border-primary);
          padding: 12px 0;
        }
        .about-ticker {
          display: flex;
          gap: 40px;
          width: max-content;
          will-change: transform;
        }
        .about-ticker-item {
          font-size: 16.53px;
          letter-spacing: 0.12em;
          color: var(--text-tertiary);
          white-space: nowrap;
        }
        .about-ticker-label {
          position: absolute;
          right: 0;
          top: 4px;
          font-size: 11px;
          color: var(--text-quaternary);
        }
      `}</style>
    </PinnedSection>
  );
}
