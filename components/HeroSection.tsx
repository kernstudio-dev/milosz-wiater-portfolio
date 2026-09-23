'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const leftWordsRef = useRef<HTMLDivElement>(null);
  const rightWordsRef = useRef<HTMLDivElement>(null);
  const centerBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const tlLoad = gsap.timeline({ delay: 0.1 });

      // 1. Center box entrance
      tlLoad.fromTo(
        centerBoxRef.current,
        { scale: 0.88, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.1, ease: 'expo.out' },
        0
      );

      // 2. Hero word reveals
      tlLoad.fromTo(
        '.reveal-hero-word',
        { y: '110%' },
        {
          y: '0%',
          duration: 1.0,
          stagger: 0.12,
          ease: 'power3.out',
        },
        0.2
      );

      // 3. Corner labels appear
      tlLoad.fromTo(
        '.corner-telemetry',
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.08, ease: 'power2.out' },
        0.5
      );

      // Pinned Hero Scroll Exit Choreography
      if (heroRef.current && leftWordsRef.current && rightWordsRef.current) {
        const tlScroll = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: '+=120%',
            pin: true,
            scrub: 0.5,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });

        // Left words separate outwards
        tlScroll.to(
          leftWordsRef.current,
          { x: '-25vw', opacity: 0.15, ease: 'none' },
          0
        );

        // Right words separate outwards
        tlScroll.to(
          rightWordsRef.current,
          { x: '25vw', opacity: 0.15, ease: 'none' },
          0
        );

        // Corner labels fade
        tlScroll.to(
          '.corner-telemetry',
          { opacity: 0.05, y: -40, stagger: 0.04, ease: 'none' },
          0
        );

        // Center box subtle recede
        tlScroll.to(
          centerBoxRef.current,
          { scale: 0.92, opacity: 0.6, ease: 'none' },
          0
        );
      }
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      id="hero-section"
      ref={heroRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        height: '100svh',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        paddingTop: 'calc(var(--header-height) + 16px)',
        paddingBottom: '24px',
        overflow: 'hidden',
        backgroundColor: 'transparent',
      }}
    >
      {/* TOP ROW: Corner Labels */}
      <div className="content-constraint" style={{ width: '100%', zIndex: 10 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            width: '100%',
          }}
        >
          <div className="corner-telemetry tech-label" style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
            <span style={{ color: 'var(--text-tertiary)' }}>INDEPENDENT</span>
          </div>

          <div className="corner-telemetry tech-label" style={{ display: 'flex', gap: '8px', fontSize: '11px', textAlign: 'right' }}>
            <span style={{ color: 'var(--text-tertiary)' }}>CREATIVE DEVELOPER</span>
          </div>
        </div>
      </div>

      {/* CENTER ROW: Words + Bubble — CSS Grid */}
      <div
        className="content-constraint"
        style={{
          width: '100%',
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr',
          alignItems: 'center',
          gap: '0',
          position: 'relative',
          zIndex: 6,
        }}
      >
        {/* LEFT WORDS */}
        <div
          ref={leftWordsRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            userSelect: 'none',
            zIndex: 6,
            willChange: 'transform',
          }}
        >
          <div className="overflow-mask">
            <h2
              className="reveal-hero-word font-display"
              style={{
                fontSize: 'clamp(48px, 6.5vw, 130px)',
                fontWeight: 100,
                letterSpacing: '-0.03em',
                lineHeight: 0.9,
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
              }}
            >
              SHAPING
            </h2>
          </div>

          <div className="overflow-mask">
            <h2
              className="reveal-hero-word font-display"
              style={{
                fontSize: 'clamp(48px, 6.5vw, 130px)',
                fontWeight: 100,
                letterSpacing: '-0.03em',
                lineHeight: 0.9,
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
              }}
            >
              CONCEPTS
            </h2>
          </div>
        </div>

        {/* CENTER: Bubble Docking Target */}
        <div
          ref={centerBoxRef}
          style={{
            position: 'relative',
            width: 'clamp(240px, 26vw, 360px)',
            height: 'clamp(240px, 26vw, 360px)',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 7,
          }}
        >
          {/* Subtle corner brackets */}
          <span className="corner-crosshair corner-crosshair-tl" style={{ borderColor: 'var(--border-light)' }} />
          <span className="corner-crosshair corner-crosshair-tr" style={{ borderColor: 'var(--border-light)' }} />
          <span className="corner-crosshair corner-crosshair-bl" style={{ borderColor: 'var(--border-light)' }} />
          <span className="corner-crosshair corner-crosshair-br" style={{ borderColor: 'var(--border-light)' }} />

          {/* Docking target for global mesh */}
          <div
            data-bubble-target="true"
            data-section="hero"
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              pointerEvents: 'none',
            }}
          />
        </div>

        {/* RIGHT WORDS */}
        <div
          ref={rightWordsRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            userSelect: 'none',
            textAlign: 'right',
            zIndex: 6,
            willChange: 'transform',
          }}
        >
          <div className="overflow-mask">
            <h2
              className="reveal-hero-word font-display"
              style={{
                fontSize: 'clamp(48px, 6.5vw, 130px)',
                fontWeight: 100,
                letterSpacing: '-0.03em',
                lineHeight: 0.9,
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
              }}
            >
              BUILDING
            </h2>
          </div>

          <div className="overflow-mask">
            <h2
              className="reveal-hero-word font-display"
              style={{
                fontSize: 'clamp(48px, 6.5vw, 130px)',
                fontWeight: 100,
                letterSpacing: '-0.03em',
                lineHeight: 0.9,
                textTransform: 'uppercase',
                color: 'var(--text-secondary)',
              }}
            >
              EXPERIENCES
            </h2>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW: Contact + Availability */}
      <div className="content-constraint" style={{ width: '100%', zIndex: 10 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            width: '100%',
          }}
        >
          <div className="corner-telemetry tech-label" style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
            <a href="mailto:contact@miloszwiater.dev" style={{ color: 'var(--text-secondary)' }} data-cursor="hover">
              contact@miloszwiater.dev
            </a>
          </div>

          <div className="corner-telemetry tech-label" style={{ fontSize: '11px', textAlign: 'right' }}>
            <a
              href="#contact"
              style={{ display: 'inline-flex', gap: '8px', color: 'var(--text-secondary)' }}
              data-cursor="hover"
            >
              <span style={{ color: 'var(--text-tertiary)' }}>WARSAW, PL</span>
              <span style={{ color: 'var(--text-secondary)' }}>— AVAILABLE FOR PROJECTS</span>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          #hero-section > div:nth-child(2) {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
            text-align: center !important;
          }
          #hero-section > div:nth-child(2) > div {
            align-items: center !important;
            text-align: center !important;
          }
        }
      `}</style>
    </div>
  );
}
