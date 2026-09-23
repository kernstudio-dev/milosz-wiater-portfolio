'use client';

import { useEffect, useState } from 'react';
import { PinnedSection } from '@/components/PinnedSection';
import { HeroConnector } from '@/components/HeroConnector';
import { LetterReveal } from '@/components/LetterReveal';
import { useScrollProgress } from '@/context/ScrollContext';
import { scaleFontSize } from '@/lib/grid';
import { useWindowSize } from '@/hooks/useWindowSize';

const WORDS_LEFT: { word: string; tone: 'tertiary' | 'quaternary' }[] = [
  { word: 'SHAPING', tone: 'tertiary' },
  { word: 'CONCEPTS', tone: 'quaternary' },
];
const WORDS_RIGHT: { word: string; tone: 'tertiary' | 'quaternary' }[] = [
  { word: 'BUILDING', tone: 'tertiary' },
  { word: 'EXPERIENCES', tone: 'quaternary' },
];

function scrollExit(progress: number, start: number): { y: number; opacity: number } {
  if (progress <= start) return { y: 0, opacity: 1 };
  const t = Math.min(1, (progress - start) / (1 - start));
  // Spring-like ease-out approximation (stiffness 120, damping 20)
  const eased = 1 - Math.pow(1 - t, 3);
  return { y: -120 * eased, opacity: 1 - eased };
}

export function HeroSection() {
  const scrollCtx = useScrollProgress();
  const progress = typeof scrollCtx === 'number' ? 0 : scrollCtx.progress.hero;
  const [intro, setIntro] = useState({
    words: [false, false, false, false],
    labelTL: false,
    labelTR: false,
    labelBL: false,
    labelBR: false,
  });
  const { metrics } = useWindowSize();
  const wordSize = scaleFontSize(35.07, 3.46, metrics.blockSize);
  const bs = metrics.blockSize;
  const armLen = bs + (bs * 2 * Math.min(1, Math.max(0, (progress - 0.25) / 0.75)));

  useEffect(() => {
    const wordTimes = [0, 80, 160, 240];
    const labelTimes = [290, 410, 530, 650];
    const timers: ReturnType<typeof setTimeout>[] = [];

    wordTimes.forEach((ms, i) => {
      timers.push(
        setTimeout(() => {
          setIntro((prev) => {
            const words = [...prev.words];
            words[i] = true;
            return { ...prev, words };
          });
        }, ms)
      );
    });

    timers.push(setTimeout(() => setIntro((p) => ({ ...p, labelTL: true })), labelTimes[0]));
    timers.push(setTimeout(() => setIntro((p) => ({ ...p, labelTR: true })), labelTimes[1]));
    timers.push(setTimeout(() => setIntro((p) => ({ ...p, labelBL: true })), labelTimes[2]));
    timers.push(setTimeout(() => setIntro((p) => ({ ...p, labelBR: true })), labelTimes[3]));

    return () => timers.forEach(clearTimeout);
  }, []);

  const topExit = scrollExit(progress, 0.8);
  const leftExit = scrollExit(progress, 0.85);
  const rightExit = scrollExit(progress, 0.855);
  const bottomExit = scrollExit(progress, 0.9);

  const insetPx = Math.round(bs * (1 - Math.min(1, Math.max(0, (progress - 0.25) / 0.75))));

  return (
    <PinnedSection id="hero">
      <HeroConnector />

      <div className="section-grid-inner hero-grid">
        <div
          className="hero-label hero-label--tl"
          style={{ gridColumn: '2 / 5', gridRow: '3 / 4', transform: `translateY(${topExit.y}px)`, opacity: topExit.opacity }}
        >
          <LetterReveal
            text="01."
            active={intro.labelTL}
            className="hero-label-muted"
          />
          <LetterReveal
            text=" CREATIVE DEVELOPER"
            active={intro.labelTL}
            className="hero-label-strong"
            delay={0.035}
          />
        </div>

        <div
          className="hero-label hero-label--tr"
          style={{ gridColumn: '17 / 20', gridRow: '3 / 4', transform: `translateY(${topExit.y}px)`, opacity: topExit.opacity }}
        >
          <LetterReveal text="02." active={intro.labelTR} className="hero-label-muted" />
          <LetterReveal text=" AVAILABLE REMOTELY" active={intro.labelTR} className="hero-label-strong" delay={0.035} />
        </div>

        <div
          className="hero-words hero-words--left"
          style={{ gridColumn: '3 / 7', gridRow: '5 / 7', transform: `translateY(${leftExit.y}px)`, opacity: leftExit.opacity }}
        >
          {WORDS_LEFT.map(({ word, tone }, i) => (
            <div key={word} className="overflow-mask">
              <span
                className={`hero-word hero-word--${tone} ${intro.words[i] ? 'hero-word--in' : ''}`}
                style={{ fontSize: wordSize, transitionDelay: `${i * 80}ms` }}
              >
                {word}
              </span>
            </div>
          ))}
        </div>

        <div
          className="hero-words hero-words--right"
          style={{ gridColumn: '15 / 19', gridRow: '5 / 7', transform: `translateY(${rightExit.y}px)`, opacity: rightExit.opacity }}
        >
          {WORDS_RIGHT.map(({ word, tone }, i) => (
            <div key={word} className="overflow-mask">
              <span
                className={`hero-word hero-word--${tone} ${intro.words[i + 2] ? 'hero-word--in' : ''}`}
                style={{ fontSize: wordSize, transitionDelay: `${160 + i * 80}ms` }}
              >
                {word}
              </span>
            </div>
          ))}
        </div>

        <div className="hero-frame" style={{ gridColumn: '8 / 14', gridRow: '3 / 9', pointerEvents: 'none' }}>
          <div className="hero-frame-brackets" style={{ '--arm': `${armLen}px` } as React.CSSProperties}>
            <span className="hero-bracket hero-bracket--tl" />
            <span className="hero-bracket hero-bracket--tr" />
            <span className="hero-bracket hero-bracket--bl" />
            <span className="hero-bracket hero-bracket--br" />
          </div>
          {progress >= 0.25 && (
            <>
              <span className="hero-print hero-print--tl font-mono">{`clip-path: inset(0px ${insetPx}px ${insetPx}px 0px)`}</span>
              <span className="hero-print hero-print--tr font-mono">{`clip-path: inset(0px 0px ${insetPx}px ${insetPx}px)`}</span>
              <span className="hero-print hero-print--bl font-mono">{`clip-path: inset(${insetPx}px 0px 0px ${insetPx}px)`}</span>
              <span className="hero-print hero-print--br font-mono">{`clip-path: inset(${insetPx}px ${insetPx}px 0px 0px)`}</span>
            </>
          )}
        </div>

        <div
          className="hero-label hero-label--bl"
          style={{ gridColumn: '2 / 5', gridRow: '8 / 9', transform: `translateY(${bottomExit.y}px)`, opacity: bottomExit.opacity }}
        >
          <LetterReveal text="03." active={intro.labelBL} className="hero-label-muted" />
          <div className="hero-contact-links">
            <a href="mailto:contact@kern.dev" className="hero-link">M: contact@kern.dev</a>
          </div>
        </div>

        <div
          className="hero-label hero-label--br"
          style={{ gridColumn: '17 / 20', gridRow: '8 / 9', transform: `translateY(${bottomExit.y}px)`, opacity: bottomExit.opacity }}
        >
          <span className="hero-label-muted"><LetterReveal text="04." active={intro.labelBR} /></span>
          <a href="#footer" className="hero-link">
            <LetterReveal text=" OPEN FOR PROJECTS" active={intro.labelBR} className="hero-label-strong" delay={0.035} />
          </a>
        </div>
      </div>

      <style jsx>{`
        .hero-grid {
          padding-top: calc(var(--grid-block-size) * 2);
          padding-bottom: calc(var(--grid-block-size) * 2);
        }
        .hero-label {
          font-family: var(--font-mono);
          font-size: 16.53px;
          letter-spacing: 0.08em;
          color: var(--text-secondary);
          display: flex;
          align-items: center;
          gap: 0;
        }
        .hero-label--tr,
        .hero-label--br {
          justify-content: flex-end;
          text-align: right;
        }
        .hero-label--bl {
          flex-direction: column;
          align-items: flex-start;
          justify-content: flex-end;
          gap: 2px;
        }
        .hero-label-muted :global(.letter-reveal) {
          color: color-mix(in oklab, var(--text-secondary) 50%, transparent);
          font-weight: 300;
        }
        .hero-label-strong :global(.letter-reveal) {
          color: color-mix(in oklab, var(--text-primary) 50%, transparent);
          font-weight: 500;
        }
        .hero-words {
          display: flex;
          flex-direction: column;
          justify-content: center;
        }
        .hero-words--right {
          align-items: flex-end;
          text-align: right;
        }
        .hero-word {
          display: block;
          font-family: var(--font-display);
          font-weight: 200;
          text-transform: uppercase;
          line-height: 1.5;
          transform: translateY(100%);
          transition: transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .hero-word--tertiary { color: var(--text-tertiary); }
        .hero-word--quaternary { color: var(--text-quaternary); }
        .hero-word--in { transform: translateY(0); }
        .hero-link {
          color: var(--text-secondary);
          text-decoration: none;
        }
        .hero-link:hover { color: var(--text-primary); }
        .hero-contact-links {
          display: flex;
          flex-direction: column;
          font-size: 16.53px;
        }
        .hero-frame {
          position: relative;
        }
        .hero-frame-brackets {
          position: absolute;
          inset: 0;
        }
        .hero-bracket {
          position: absolute;
          width: var(--arm, 90px);
          height: var(--arm, 90px);
          border-color: var(--border-primary);
          border-style: solid;
          transition: width 0.1s linear, height 0.1s linear;
        }
        .hero-bracket--tl { top: 0; left: 0; border-width: 1px 0 0 1px; }
        .hero-bracket--tr { top: 0; right: 0; border-width: 1px 1px 0 0; }
        .hero-bracket--bl { bottom: 0; left: 0; border-width: 0 0 1px 1px; }
        .hero-bracket--br { bottom: 0; right: 0; border-width: 0 1px 1px 0; }
        .hero-print {
          position: absolute;
          font-size: 11px;
          color: var(--text-tertiary);
          pointer-events: none;
        }
        .hero-print--tl { top: 4px; left: 4px; }
        .hero-print--tr { top: 4px; right: 4px; text-align: right; }
        .hero-print--bl { bottom: 4px; left: 4px; }
        .hero-print--br { bottom: 4px; right: 4px; text-align: right; }
      `}</style>
    </PinnedSection>
  );
}
