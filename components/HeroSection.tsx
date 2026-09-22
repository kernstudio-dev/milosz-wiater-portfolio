'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function HeroSection() {
  const heroRef = useRef<HTMLDivElement>(null);
  const leftWordsRef = useRef<HTMLDivElement>(null);
  const rightWordsRef = useRef<HTMLDivElement>(null);
  const centerBoxRef = useRef<HTMLDivElement>(null);
  const [clipProgress, setClipProgress] = useState<number>(0);

  // Dynamic corner CAD cut values calculated based on scroll progress (0 to 100)
  const pad = Math.round(54 * (1 - clipProgress / 100));
  const clipTL = `inset(0px ${pad}px ${pad}px 0px)`;
  const clipTR = `inset(0px 0px ${pad}px ${pad}px)`;
  const clipBR = `inset(${pad}px 0px 0px ${pad}px)`;
  const clipBL = `inset(${pad}px ${pad}px 0px 0px)`;

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Stagger entrance for corners
      gsap.fromTo(
        '.corner-telemetry',
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
      );

      // Hero Words entrance (translate from overflow mask)
      gsap.fromTo(
        '.reveal-hero-word',
        { y: '110%', opacity: 0 },
        {
          y: '0%',
          opacity: 1,
          duration: 1.1,
          stagger: 0.14,
          ease: 'power3.out',
          delay: 0.35,
        }
      );

      // Center box entrance
      gsap.fromTo(
        centerBoxRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 0.3 }
      );

      // Pinning & Scroll Choreography (vanlent.dev 1:1)
      if (heroRef.current && leftWordsRef.current && rightWordsRef.current) {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: '+=130%',
            pin: true,
            scrub: 0.6,
            onUpdate: (self) => {
              setClipProgress(Math.round(self.progress * 100));
            },
          },
        });

        // Left words separate outwards horizontally
        tl.to(
          leftWordsRef.current,
          {
            x: '-22vw',
            opacity: 0.2,
            ease: 'power1.inOut',
          },
          0
        );

        // Right words separate outwards horizontally
        tl.to(
          rightWordsRef.current,
          {
            x: '22vw',
            opacity: 0.2,
            ease: 'power1.inOut',
          },
          0
        );

        // 4-corner telemetry fades and translates up
        tl.to(
          '.corner-telemetry',
          {
            opacity: 0.15,
            y: -60,
            stagger: 0.05,
            ease: 'none',
          },
          0
        );

        // Center box subtle scale/opacity shift
        tl.to(
          centerBoxRef.current,
          {
            scale: 0.94,
            opacity: 0.75,
            ease: 'none',
          },
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
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 'calc(var(--header-height) + 16px)',
        paddingBottom: '24px',
        overflow: 'hidden',
        backgroundColor: 'transparent',
      }}
    >
      {/* Central Vertical Dashed Line Guide Ruler */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: '50%',
          width: '1px',
          background:
            'repeating-linear-gradient(to bottom, var(--border-light) 0, var(--border-light) 4px, transparent 4px, transparent 8px)',
          transform: 'translateX(-50%)',
          clipPath: `inset(0% 0% ${100 - clipProgress}% 0%)`,
          pointerEvents: 'none',
          zIndex: 1,
          transition: 'clip-path 0.05s linear',
        }}
      />

      {/* Central Axis Crosshair */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      >
        <span style={{ position: 'absolute', width: '1px', height: '100%', background: 'var(--border-medium)' }} />
        <span style={{ position: 'absolute', height: '1px', width: '100%', background: 'var(--border-medium)' }} />
      </div>

      {/* Live Vertical Ruler CAD Telemetry Annotation (vanlent.dev 1:1) */}
      <span
        style={{
          position: 'absolute',
          left: 'calc(50% + 8px)',
          top: '30%',
          transform: 'translateY(-50%)',
          fontFamily: 'var(--font-mono)',
          fontSize: '9px',
          color: 'var(--text-quaternary)',
          writingMode: 'vertical-rl',
          textOrientation: 'mixed',
          letterSpacing: '0.08em',
          pointerEvents: 'none',
          zIndex: 3,
        }}
      >
        clip-path: inset(0% 0% {100 - clipProgress}% 0%)
      </span>

      {/* TOP ROW TELEMETRY (01 Left & 02 Right) */}
      <div className="content-constraint" style={{ width: '100%', zIndex: 10 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            width: '100%',
          }}
        >
          {/* Top Left: 01. CREATIVE DEVELOPER */}
          <div className="corner-telemetry tech-label" style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>01.</span>
            <span style={{ color: 'var(--text-secondary)' }}>CREATIVE DEVELOPER</span>
          </div>

          {/* Top Right: 02. WARSAW BASED */}
          <div className="corner-telemetry tech-label" style={{ display: 'flex', gap: '8px', fontSize: '11px', textAlign: 'right' }}>
            <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>02.</span>
            <span style={{ color: 'var(--text-secondary)' }}>WARSAW BASED</span>
          </div>
        </div>
      </div>

      {/* CENTER ROW: SHAPING CONCEPTS / 3D SPHERE TARGET / BUILDING EXPERIENCES */}
      <div
        className="content-constraint"
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: 'auto 0',
          position: 'relative',
          zIndex: 6,
        }}
      >
        {/* LEFT WORDS: SHAPING CONCEPTS */}
        <div
          ref={leftWordsRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0px',
            userSelect: 'none',
            flex: 1,
            zIndex: 6,
            willChange: 'transform',
          }}
        >
          <div className="overflow-mask">
            <h2
              className="reveal-hero-word"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(36px, 5.5vw, 84px)',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
              }}
            >
              SHAPING
            </h2>
          </div>

          <div className="overflow-mask">
            <h2
              className="reveal-hero-word"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(36px, 5.5vw, 84px)',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
              }}
            >
              CONCEPTS
            </h2>
          </div>
        </div>

        {/* CENTER BOX: 3D PARTICLE BUBBLE DOCKING TARGET (vanlent.dev 1:1) */}
        <div
          ref={centerBoxRef}
          style={{
            position: 'relative',
            width: 'clamp(260px, 28vw, 380px)',
            height: 'clamp(260px, 28vw, 380px)',
            margin: '0 20px',
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 7,
          }}
        >
          {/* CAD Corner Crosshairs */}
          <div
            className="corner-box"
            style={{
              position: 'absolute',
              inset: 0,
              backgroundColor: 'transparent',
              borderColor: 'var(--border-subtle)',
              pointerEvents: 'none',
            }}
          >
            <span className="corner-crosshair corner-crosshair-tl" style={{ borderColor: 'var(--border-medium)' }} />
            <span className="corner-crosshair corner-crosshair-tr" style={{ borderColor: 'var(--border-medium)' }} />
            <span className="corner-crosshair corner-crosshair-bl" style={{ borderColor: 'var(--border-medium)' }} />
            <span className="corner-crosshair corner-crosshair-br" style={{ borderColor: 'var(--border-medium)' }} />
          </div>

          {/* Technical Dynamic Coordinate Annotations (vanlent.dev 1:1 AnimationPrint) */}
          <span
            style={{
              position: 'absolute',
              top: '-18px',
              left: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: 'var(--text-quaternary)',
              letterSpacing: '0.04em',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            clip-path: {clipTL}
          </span>

          <span
            style={{
              position: 'absolute',
              top: '-18px',
              right: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: 'var(--text-quaternary)',
              letterSpacing: '0.04em',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            clip-path: {clipTR}
          </span>

          <span
            style={{
              position: 'absolute',
              bottom: '-18px',
              right: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: 'var(--text-quaternary)',
              letterSpacing: '0.04em',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            clip-path: {clipBR}
          </span>

          <span
            style={{
              position: 'absolute',
              bottom: '-18px',
              left: 0,
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              color: 'var(--text-quaternary)',
              letterSpacing: '0.04em',
              pointerEvents: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            clip-path: {clipBL}
          </span>

          {/* DOCKING TARGET FOR GLOBAL THREE.JS PARTICLE SPHERE */}
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

        {/* RIGHT WORDS: BUILDING EXPERIENCES */}
        <div
          ref={rightWordsRef}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
            gap: '0px',
            userSelect: 'none',
            flex: 1,
            textAlign: 'right',
            zIndex: 6,
            willChange: 'transform',
          }}
        >
          <div className="overflow-mask">
            <h2
              className="reveal-hero-word"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(36px, 5.5vw, 84px)',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
              }}
            >
              BUILDING
            </h2>
          </div>

          <div className="overflow-mask">
            <h2
              className="reveal-hero-word"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(36px, 5.5vw, 84px)',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                lineHeight: 1.05,
                textTransform: 'uppercase',
                color: 'var(--text-tertiary)',
              }}
            >
              EXPERIENCES
            </h2>
          </div>
        </div>
      </div>

      {/* BOTTOM ROW TELEMETRY (03 Left & 04 Right) */}
      <div className="content-constraint" style={{ width: '100%', zIndex: 10 }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            width: '100%',
          }}
        >
          {/* Bottom Left: 03. T: +48 ... M: contact@miloszwiater.dev */}
          <div className="corner-telemetry tech-label" style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>03.</span>
              <a href="tel:+48500000000" style={{ color: 'var(--text-secondary)' }} data-cursor="hover">
                T: +48 500 000 000
              </a>
            </div>
            <div style={{ paddingLeft: '24px' }}>
              <a href="mailto:contact@miloszwiater.dev" style={{ color: 'var(--text-secondary)' }} data-cursor="hover">
                M: contact@miloszwiater.dev
              </a>
            </div>
          </div>

          {/* Bottom Right: 04. OPEN FOR PROJECTS */}
          <div className="corner-telemetry tech-label" style={{ fontSize: '11px', textAlign: 'right' }}>
            <a
              href="#contact"
              style={{ display: 'inline-flex', gap: '8px', color: 'var(--text-secondary)' }}
              data-cursor="hover"
            >
              <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>04.</span>
              <span>OPEN FOR PROJECTS</span>
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 900px) {
          #hero-section .content-constraint:nth-child(4) {
            flex-direction: column;
            gap: 24px;
            text-align: center;
          }
          #hero-section .content-constraint:nth-child(4) > div:first-child,
          #hero-section .content-constraint:nth-child(4) > div:last-child {
            align-items: center !important;
            text-align: center !important;
          }
        }
      `}</style>
    </div>
  );
}
