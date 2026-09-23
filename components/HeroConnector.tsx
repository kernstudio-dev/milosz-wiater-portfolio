'use client';

import { useScrollProgress } from '@/context/ScrollContext';
import { useWindowSize } from '@/hooks/useWindowSize';

/** Dashed hero→work connector. Visible only once work section progress begins (T = workP / (1/6)). */
export function HeroConnector() {
  const scrollCtx = useScrollProgress();
  const workP = typeof scrollCtx === 'number' ? 0 : scrollCtx.progress.work;
  const connectorT = Math.max(0, Math.min(1, workP / (1 / 6)));
  const { metrics } = useWindowSize();
  const bs = metrics.blockSize;

  const lineTop = bs * 10; // 900 at 90px blocks
  const lineHeight = bs * 4; // 360px span

  return (
    <div
      className="hero-connector font-mono"
      aria-hidden="true"
      style={{
        position: 'absolute',
        left: '50%',
        top: lineTop,
        width: 1,
        height: lineHeight,
        transform: 'translateX(-50%)',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    >
      <div
        className="hero-connector__line"
        style={{
          height: `${connectorT * 100}%`,
          opacity: connectorT > 0 ? 1 : 0,
        }}
      />
      <span
        className="hero-connector__label"
        style={{ opacity: connectorT > 0.12 ? 1 : 0 }}
      >
        PROJECTS
      </span>

      <style jsx>{`
        .hero-connector__line {
          width: 100%;
          border-left: 1px dashed var(--border-primary);
          transition: height 0.3s linear, opacity 0.2s ease;
        }
        .hero-connector__label {
          position: absolute;
          top: 0;
          left: 25px;
          font-size: 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-tertiary);
          white-space: nowrap;
          transition: opacity 0.3s ease;
        }
      `}</style>
    </div>
  );
}
