'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';

interface PageLoaderProps {
  onComplete?: () => void;
}

export function PageLoader({ onComplete }: PageLoaderProps) {
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const progressObj = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        if (onComplete) onComplete();
      },
    });

    // Progress count
    tl.to(progressObj, {
      val: 100,
      duration: 1.4,
      ease: 'power2.inOut',
      onUpdate: () => {
        setProgress(Math.round(progressObj.val));
      },
    });

    // Stagger in letters
    tl.fromTo(
      '.loader-letter',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.03,
        ease: 'power3.out',
      },
      '-=1.2'
    );

    // Clip wipe reveal
    tl.to('.page-loader-overlay', {
      clipPath: 'inset(0 0 100% 0)',
      duration: 0.85,
      ease: 'power4.inOut',
    });

    tl.set('.page-loader-overlay', { display: 'none' });
  }, [onComplete]);

  const nameLetters = 'MIŁOSZ WIATER'.split('');

  return (
    <div
      className="page-loader-overlay"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-loader)',
        backgroundColor: '#09090b',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        clipPath: 'inset(0 0 0% 0)',
        willChange: 'clip-path',
        overflow: 'hidden',
      }}
    >
      {/* Subtle grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.03,
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '64px 64px',
          pointerEvents: 'none',
        }}
      />

      {/* Center Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        {/* Name with character stagger */}
        <h1
          style={{
            display: 'flex',
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(32px, 5vw, 56px)',
            fontWeight: 100,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color: '#FAFAFA',
            lineHeight: 1,
          }}
        >
          {nameLetters.map((char, index) => (
            <span
              key={index}
              className="loader-letter"
              style={{
                display: 'inline-block',
                whiteSpace: char === ' ' ? 'pre' : 'normal',
              }}
            >
              {char}
            </span>
          ))}
        </h1>

        {/* Minimal progress line */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            width: '200px',
          }}
        >
          <div
            style={{
              flex: 1,
              height: '1px',
              backgroundColor: 'rgba(255,255,255,0.1)',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${progress}%`,
                backgroundColor: 'rgba(255,255,255,0.5)',
                transition: 'width 0.1s linear',
              }}
            />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: 'rgba(255,255,255,0.4)',
              minWidth: '38px',
              textAlign: 'right',
            }}
          >
            {progress.toString().padStart(2, '0')}%
          </span>
        </div>
      </div>
    </div>
  );
}
