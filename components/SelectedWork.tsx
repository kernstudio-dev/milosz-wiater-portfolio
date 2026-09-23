'use client';

import { useEffect, useRef, useState } from 'react';
import { PinnedSection } from '@/components/PinnedSection';
import { useScrollProgress } from '@/context/ScrollContext';
import { useBubble } from '@/context/BubbleContext';
import { PROJECTS } from '@/data/projects';
import { WORK_SLIDE } from '@/lib/motionMap';
import { scaleFontSize } from '@/lib/grid';

const PROJECT_COLORS = ['#7a3d99', '#EA7317', '#005BF8', '#43cabc', '#86a29d'];

export function SelectedWork() {
  const scrollCtx = useScrollProgress();
  const progress = typeof scrollCtx === 'number' ? 0 : scrollCtx.progress.work;
  const isPinned = typeof scrollCtx !== 'number' && scrollCtx.isPinned('work');
  const { setWorkProjectColor } = useBubble();

  const [projectIndex, setProjectIndex] = useState(0);
  const [phase, setPhase] = useState<'idle' | 'hiding' | 'revealing'>('idle');
  const lastThresholdRef = useRef(-1);
  const switchingRef = useRef(false);

  const slideT = Math.max(0, Math.min(1, (progress - WORK_SLIDE.start) / (WORK_SLIDE.end - WORK_SLIDE.start)));
  const translateX = -WORK_SLIDE.px * slideT;

  useEffect(() => {
    if (!isPinned || switchingRef.current) return;
    const thresholds = [0.5, 0.75];
    let crossed = -1;
    for (let i = 0; i < thresholds.length; i++) {
      if (progress >= thresholds[i] && lastThresholdRef.current < i) {
        crossed = i;
      }
    }
    if (crossed < 0) return;

    switchingRef.current = true;
    lastThresholdRef.current = crossed;
    setPhase('hiding');

    setTimeout(() => {
      setProjectIndex((prev) => (prev + 1) % PROJECTS.length);
      setWorkProjectColor(PROJECT_COLORS[(projectIndex + 1) % PROJECT_COLORS.length]);
      setPhase('revealing');
      setTimeout(() => {
        setPhase('idle');
        switchingRef.current = false;
      }, 1000);
    }, 1000);
  }, [progress, isPinned, projectIndex, setWorkProjectColor]);

  useEffect(() => {
    setWorkProjectColor(PROJECT_COLORS[projectIndex]);
  }, [projectIndex, setWorkProjectColor]);

  const project = PROJECTS[projectIndex];
  const bs = 90;
  const titleSize = scaleFontSize(35.07, 3.46, bs);

  return (
    <PinnedSection id="work">
      <div
        className="work-scroll-content"
        style={{
          transform: `translateX(${translateX}px)`,
          opacity: phase === 'hiding' ? 0.3 : 1,
          transition: phase === 'hiding' ? 'opacity 0.15s ease' : 'opacity 0.6s ease',
        }}
      >
        <div className="section-grid-inner work-grid">
          <div className={`work-header border-draw ${isPinned ? 'is-visible' : ''}`} style={{ gridColumn: '1 / -1', gridRow: '3 / 4' }}>
            <span className="work-index font-mono">01 — SELECTED WORK</span>
          </div>

          <div
            className="work-mockup"
            style={{
              gridColumn: '6 / 14',
              gridRow: '3 / 7',
              opacity: phase === 'hiding' ? 0 : 1,
              transform: phase === 'hiding' ? 'translateY(-100%)' : 'translateY(0)',
              transition: 'transform 1s ease, opacity 0.15s ease',
            }}
          >
            <div className="work-mockup-frame">
              <div className="work-mockup-placeholder">
                <span className="font-mono">{project.title}</span>
              </div>
            </div>
          </div>

          <div
            className="work-meta"
            style={{
              gridColumn: '17 / 21',
              gridRow: '3 / 7',
              opacity: phase === 'hiding' ? 0 : 1,
              transition: 'opacity 0.15s ease',
            }}
          >
            <h3 style={{ fontSize: titleSize, fontWeight: 200, textTransform: 'uppercase' }}>{project.title}</h3>
            <p className="work-desc">{project.description}</p>
          </div>

          <div className="work-footer" style={{ gridColumn: '1 / -1', gridRow: '8 / 9' }}>
            <span className="font-mono work-project-name">{project.title}</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        .work-scroll-content {
          will-change: transform;
        }
        .work-grid {
          padding-top: calc(var(--grid-block-size) * 2);
          padding-bottom: var(--grid-block-size);
        }
        .work-index {
          font-size: 16.53px;
          color: var(--text-tertiary);
          letter-spacing: 0.1em;
        }
        .work-mockup-frame {
          width: 100%;
          height: 100%;
          border: 1px solid var(--border-primary);
          background: var(--bg-elevated);
          overflow: hidden;
        }
        .work-mockup-placeholder {
          width: 100%;
          height: 100%;
          min-height: calc(var(--grid-block-size) * 4);
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-secondary);
          font-size: 12px;
          letter-spacing: 0.12em;
        }
        .work-desc {
          margin-top: 12px;
          font-size: 18.53px;
          color: var(--text-secondary);
          line-height: 1.5;
          max-width: 360px;
        }
        .work-footer {
          display: flex;
          align-items: center;
          border-top: 1px solid var(--border-primary);
          padding-top: 8px;
        }
        .work-project-name {
          font-size: 16.53px;
          color: var(--text-secondary);
        }
      `}</style>
    </PinnedSection>
  );
}
