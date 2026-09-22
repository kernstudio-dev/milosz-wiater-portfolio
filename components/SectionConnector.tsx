'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface SectionConnectorProps {
  label: string;
  sublabel?: string;
  sectionNumber?: string;
  height?: number;
}

export function SectionConnector({
  label,
  sublabel,
  sectionNumber,
  height = 160,
}: SectionConnectorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!containerRef.current || !lineRef.current) return;

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top 85%',
      end: 'bottom 40%',
      scrub: 0.5,
      onUpdate: (self) => {
        const val = Math.round(self.progress * 100);
        setProgress(val);
        if (lineRef.current) {
          lineRef.current.style.clipPath = `inset(0% 0% ${100 - val}% 0%)`;
        }
      },
    });

    return () => {
      trigger.kill();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: `${height}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 5,
        overflow: 'visible',
      }}
      aria-hidden="true"
    >
      {/* Central Vertical Dashed Spine Ruler */}
      <div
        ref={lineRef}
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: '1px',
          background:
            'repeating-linear-gradient(to bottom, var(--border-medium) 0, var(--border-medium) 4px, transparent 4px, transparent 8px)',
          transform: 'translateX(-50%)',
          clipPath: 'inset(0% 0% 100% 0%)',
          transition: 'clip-path 0.05s linear',
        }}
      />

      {/* Center Indicator Node: 20x20px CAD square */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '20px',
          height: '20px',
          border: '1px solid var(--border-primary)',
          backgroundColor: 'var(--bg-canvas)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 6,
          boxShadow: '0 0 12px rgba(0,0,0,0.2)',
        }}
      >
        {/* Inner Solid Animated Square */}
        <div
          style={{
            width: '8px',
            height: '8px',
            backgroundColor: 'var(--accent-cyan)',
            clipPath: progress > 15 ? 'inset(0% 0% 0% 0%)' : 'inset(50% 50% 50% 50%)',
            transition: 'clip-path 0.3s ease',
          }}
        />
      </div>

      {/* Floating Section Title Pill to the Right */}
      <div
        style={{
          position: 'absolute',
          left: 'calc(50% + 20px)',
          top: '50%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          color: 'var(--text-secondary)',
          opacity: progress > 20 ? 1 : 0.2,
          transition: 'opacity 0.4s ease',
          whiteSpace: 'nowrap',
          zIndex: 6,
        }}
      >
        {sectionNumber && (
          <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>{sectionNumber}</span>
        )}
        <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>{label}</span>
        {sublabel && (
          <span style={{ color: 'var(--text-tertiary)', fontSize: '10px' }}>// {sublabel}</span>
        )}
      </div>

      {/* Live Technical CAD Annotation next to spine */}
      <span
        style={{
          position: 'absolute',
          right: 'calc(50% + 12px)',
          top: '50%',
          transform: 'translateY(-50%)',
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          color: 'var(--text-quaternary)',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          letterSpacing: '0.06em',
          opacity: progress > 10 ? 0.75 : 0,
          transition: 'opacity 0.3s ease',
          zIndex: 6,
        }}
      >
        clip-path: inset(0% 0% {100 - progress}% 0%)
      </span>
    </div>
  );
}
