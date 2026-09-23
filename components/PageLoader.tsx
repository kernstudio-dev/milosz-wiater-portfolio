'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';

interface PageLoaderProps {
  onComplete?: () => void;
}

export function PageLoader({ onComplete }: PageLoaderProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setVisible(false);
        onComplete?.();
      },
    });

    tl.fromTo(
      '.loader-letter',
      { opacity: 0 },
      { opacity: 1, duration: 0.1, stagger: 0.1, ease: 'none' },
      0.2
    );

    tl.to('.loader-box', { className: 'loader-box loader-box--active' }, 0);

    tl.to('.page-loader-overlay', {
      clipPath: 'inset(50% 0 50% 0)',
      duration: 0.5,
      ease: 'power2.inOut',
    }, 1.8);
  }, [onComplete]);

  if (!visible) return null;

  const letters = 'KERN'.split('');

  return (
    <div
      className="page-loader-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        backgroundColor: 'var(--bg-canvas)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        clipPath: 'inset(0 0 0% 0)',
      }}
    >
      <div className="loader-box">
        <span className="loader-bracket loader-bracket--tl" />
        <span className="loader-bracket loader-bracket--tr" />
        <span className="loader-bracket loader-bracket--bl" />
        <span className="loader-bracket loader-bracket--br" />
        <h1
          style={{
            display: 'flex',
            gap: '0.05em',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 200,
            letterSpacing: '0.2em',
            color: 'var(--text-primary)',
          }}
        >
          {letters.map((char, i) => (
            <span key={i} className="loader-letter">{char}</span>
          ))}
        </h1>
      </div>

      <style jsx>{`
        .loader-box {
          position: relative;
          width: calc(var(--grid-block-size, 90px) * 6);
          height: calc(var(--grid-block-size, 90px) * 6);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .loader-bracket {
          position: absolute;
          width: 24px;
          height: 24px;
          border-color: var(--border-primary);
          border-style: solid;
        }
        .loader-bracket--tl { top: 0; left: 0; border-width: 1px 0 0 1px; }
        .loader-bracket--tr { top: 0; right: 0; border-width: 1px 1px 0 0; }
        .loader-bracket--bl { bottom: 0; left: 0; border-width: 0 0 1px 1px; }
        .loader-bracket--br { bottom: 0; right: 0; border-width: 0 1px 1px 0; }
        .loader-box--active .loader-bracket {
          animation: bracket-grow 0.8s ease forwards;
        }
        @keyframes bracket-grow {
          to { width: 48px; height: 48px; }
        }
      `}</style>
    </div>
  );
}
