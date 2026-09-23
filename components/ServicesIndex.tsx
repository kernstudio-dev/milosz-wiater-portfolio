'use client';

import { useEffect } from 'react';
import { PinnedSection } from '@/components/PinnedSection';
import { useScrollProgress } from '@/context/ScrollContext';
import { scaleFontSize } from '@/lib/grid';

const COMBINATIONS = [
  { title: 'web development', desc: 'High-performance front-end architecture and creative development.' },
  { title: 'front end development', desc: 'React, Next.js, motion systems, and shader-driven experiences.' },
  { title: 'back end development', desc: 'APIs, databases, automation pipelines, and agent systems.' },
  { title: 'web design', desc: 'Editorial grid systems, typography, and tactile interaction design.' },
  { title: 'ux/ui design', desc: 'Component libraries, design tokens, and accessible interface systems.' },
  { title: 'motion design', desc: 'Scroll choreography, pinned timelines, and kinetic typography.' },
];

export function ServicesIndex() {
  const scrollCtx = useScrollProgress();
  const progress = typeof scrollCtx === 'number' ? 0 : scrollCtx.progress.services;
  const isPinned = typeof scrollCtx !== 'number' && scrollCtx.isPinned('services');

  useEffect(() => {
    window.dispatchEvent(new CustomEvent('services-progress', { detail: progress }));
  }, [progress]);

  const comboIndex = Math.min(
    COMBINATIONS.length - 1,
    Math.floor(Math.max(0, progress - 1 / 6) / ((2 / 3 - 1 / 6) / COMBINATIONS.length))
  );
  const combo = COMBINATIONS[comboIndex];

  const slideT = Math.max(0, Math.min(1, (progress - 0.62) / 0.08));
  const translateX = -630 * slideT;

  const counter1 = Math.round(Math.max(0, Math.min(1, (progress - 0.7) / 0.07)) * 23);
  const counter2 = Math.round(Math.max(0, Math.min(1, (progress - 0.77) / 0.07)) * 13);
  const counter3 = Math.round(Math.max(0, Math.min(1, (progress - 0.84) / 0.06)) * 99);

  const bs = 90;
  const headingSize = scaleFontSize(43.07, 3.46, bs);

  return (
    <PinnedSection id="services">
      <div className="services-wrapper" style={{ transform: `translateX(${translateX}px)` }}>
        <div className="section-grid-inner services-grid">
          <div className={`services-heading border-draw ${isPinned ? 'is-visible' : ''}`} style={{ gridColumn: '1 / 10', gridRow: '3 / 5' }}>
            <h2 style={{ fontSize: headingSize, fontWeight: 200, textTransform: 'uppercase', lineHeight: 1.05 }}>
              Reliable Creative Versatile
            </h2>
          </div>

          <div className="services-combo" style={{ gridColumn: '1 / 8', gridRow: '5 / 7' }}>
            <h3 className="services-combo-title">{combo.title}</h3>
            <p className="services-combo-desc">{combo.desc}</p>
          </div>

          <div className="services-stats" style={{ gridColumn: '1 / 6', gridRow: '7 / 9', opacity: slideT > 0.5 ? 1 : 0, transition: 'opacity 0.4s ease' }}>
            <div className="stat"><span className="stat-num">{counter1}+</span><span className="stat-label">projects delivered</span></div>
            <div className="stat"><span className="stat-num">{counter2}+</span><span className="stat-label">technologies</span></div>
            <div className="stat"><span className="stat-num">{counter3}%</span><span className="stat-label">client satisfaction</span></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .services-wrapper {
          will-change: transform;
        }
        .services-grid {
          padding-top: calc(var(--grid-block-size) * 2);
          padding-bottom: calc(var(--grid-block-size) * 2);
        }
        .services-combo-title {
          font-size: 28px;
          font-weight: 200;
          text-transform: lowercase;
          margin-bottom: 8px;
        }
        .services-combo-desc {
          font-size: 18.53px;
          color: var(--text-secondary);
          line-height: 1.5;
          max-width: 480px;
        }
        .services-stats {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .stat-num {
          font-family: var(--font-display);
          font-size: 36px;
          font-weight: 200;
          display: block;
        }
        .stat-label {
          font-family: var(--font-mono);
          font-size: 14px;
          color: var(--text-tertiary);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
      `}</style>
    </PinnedSection>
  );
}
