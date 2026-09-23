'use client';

import { useRef, useEffect } from 'react';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const TECH_ITEMS = [
  'NEXT.JS',
  'REACT 19',
  'TYPESCRIPT',
  'NODE.JS',
  'GSAP',
  'THREE.JS',
  'GLSL',
  'PYTHON',
  'FASTAPI',
  'GEMINI API',
  'FIGMA',
];

export function TechPhilosophy() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.about-reveal',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 70%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        padding: 'clamp(64px, 8vw, 120px) 0 48px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-canvas)',
      }}
    >
      <div className="content-constraint" style={{ width: '100%' }}>
        {/* Section Header */}
        <div
          className="about-reveal"
          style={{
            marginBottom: 'clamp(32px, 4vw, 56px)',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '20px',
          }}
        >
          <div className="tech-label" style={{ color: 'var(--text-tertiary)', marginBottom: '8px' }}>
            ABOUT
          </div>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(32px, 5.5vw, 68px)',
              fontWeight: 200,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              lineHeight: 0.95,
            }}
          >
            MIŁOSZ WIATER
          </h2>
        </div>

        {/* 2-Part Layout: Text + Portrait */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(32px, 5vw, 64px)',
            marginBottom: '48px',
          }}
        >
          {/* Editorial Text */}
          <div className="about-reveal" style={{ display: 'flex', flexDirection: 'column', gap: '24px', justifyContent: 'center' }}>
            <p
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: 'clamp(22px, 2.4vw, 36px)',
                fontWeight: 200,
                color: 'var(--text-primary)',
                lineHeight: 1.35,
                letterSpacing: '-0.015em',
              }}
            >
              I design and build digital products where strategy, interaction, development and visual identity work as one system.
            </p>

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                maxWidth: '520px',
              }}
            >
              Working independently with founders, creative agencies, and product teams to engineer digital experiences that stand out without unnecessary noise.
            </p>

            {/* Docking target */}
            <div
              data-bubble-target="true"
              data-section="about"
              style={{
                width: 'clamp(180px, 18vw, 260px)',
                height: 'clamp(180px, 18vw, 260px)',
                pointerEvents: 'none',
                margin: '16px 0',
              }}
            />
          </div>

          {/* Portrait */}
          <div
            className="about-reveal"
            style={{
              position: 'relative',
              overflow: 'hidden',
              minHeight: '420px',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            <Image
              src="/images/milosz_portrait.jpg"
              alt="Miłosz Wiater"
              fill
              sizes="(max-width: 768px) 100vw, 500px"
              style={{ objectFit: 'cover' }}
            />

            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 35%)',
              }}
            />

            <div
              style={{
                position: 'absolute',
                bottom: '18px',
                left: '20px',
                right: '20px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'baseline',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: '#FAFAFA',
                letterSpacing: '0.06em',
                zIndex: 2,
              }}
            >
              <span>MIŁOSZ WIATER</span>
              <span style={{ opacity: 0.7 }}>WARSAW, PL</span>
            </div>
          </div>
        </div>

        {/* Technology Ticker */}
        <div
          className="about-reveal"
          style={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            borderTop: '1px solid var(--border-subtle)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '14px 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 'max-content',
              animation: 'marquee 30s linear infinite',
              gap: '40px',
            }}
          >
            {[...TECH_ITEMS, ...TECH_ITEMS].map((item, index) => (
              <span
                key={`${item}-${index}`}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--text-tertiary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '16px',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{item}</span>
                <span style={{ color: 'var(--text-quaternary)', fontSize: '8px' }}>—</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
