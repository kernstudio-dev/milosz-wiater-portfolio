'use client';

import { useEffect, useState } from 'react';
import gsap from 'gsap';

interface PageLoaderProps {
  onComplete?: () => void;
}

export function PageLoader({ onComplete }: PageLoaderProps) {
  const [progress, setProgress] = useState<number>(0);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    // Animate progress percentage from 0 to 100
    const progressObj = { val: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoaded(true);
        if (onComplete) onComplete();
      },
    });

    tl.to(progressObj, {
      val: 100,
      duration: 1.3,
      ease: 'power2.inOut',
      onUpdate: () => {
        setProgress(Math.round(progressObj.val));
      },
    });

    // Stagger in letters of MIŁOSZ WIATER
    tl.fromTo(
      '.loader-letter',
      { y: 40, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        stagger: 0.035,
        ease: 'power3.out',
      },
      '-=1.2'
    );

    // Fade out and clip wipe reveal
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
      {/* Background CAD Grid */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.05,
          backgroundImage:
            'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          pointerEvents: 'none',
        }}
      />

      {/* Central Blueprint Crosshair */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '280px',
          height: '280px',
          transform: 'translate(-50%, -50%)',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '50%',
            width: '1px',
            background: 'rgba(255,255,255,0.08)',
          }}
        />
        <span
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            top: '50%',
            height: '1px',
            background: 'rgba(255,255,255,0.08)',
          }}
        />
      </div>

      {/* Center Monogram & Name Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          padding: '24px 36px',
        }}
      >
        {/* Corner brackets framing the loader box */}
        <span className="corner-crosshair corner-crosshair-tl" style={{ borderColor: 'var(--accent-cyan)' }} />
        <span className="corner-crosshair corner-crosshair-tr" style={{ borderColor: 'var(--accent-cyan)' }} />
        <span className="corner-crosshair corner-crosshair-bl" style={{ borderColor: 'var(--accent-cyan)' }} />
        <span className="corner-crosshair corner-crosshair-br" style={{ borderColor: 'var(--accent-cyan)' }} />

        {/* Small Monogram Badge */}
        <div
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            letterSpacing: '0.24em',
            color: 'var(--accent-cyan)',
            textTransform: 'uppercase',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <span
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-cyan)',
              display: 'inline-block',
              boxShadow: '0 0 10px var(--accent-cyan)',
            }}
          />
          MW // INITIALIZING SYSTEM
        </div>

        {/* Name with character stagger */}
        <h1
          style={{
            display: 'flex',
            fontSize: 'clamp(28px, 4vw, 44px)',
            fontWeight: 300,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'var(--text-primary)',
            lineHeight: 1,
            margin: '8px 0',
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

        {/* Telemetry bar and percentage */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            width: '100%',
            maxWidth: '240px',
            marginTop: '8px',
          }}
        >
          <div
            style={{
              flex: 1,
              height: '1px',
              backgroundColor: 'rgba(255,255,255,0.12)',
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
                backgroundColor: 'var(--accent-cyan)',
                transition: 'width 0.1s linear',
              }}
            />
          </div>
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: 'var(--text-secondary)',
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
