'use client';

import { useState, useRef, useEffect } from 'react';
import { sound } from '@/utils/sound';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

interface Capability {
  id: string;
  number: string;
  title: string;
  description: string;
}

const CAPABILITIES: Capability[] = [
  {
    id: 'frontend',
    number: '01',
    title: 'FRONT-END DEVELOPMENT',
    description: 'React, Next.js 15, TypeScript, component architecture, performance optimization.',
  },
  {
    id: 'webapps',
    number: '02',
    title: 'WEB APPLICATIONS',
    description: 'Full-stack platforms, REST & WebSocket APIs, database integration, authentication.',
  },
  {
    id: 'uiux',
    number: '03',
    title: 'UI / UX DESIGN',
    description: 'Design systems, interaction prototypes, editorial typography, spatial hierarchy.',
  },
  {
    id: 'motion',
    number: '04',
    title: 'MOTION & INTERACTION',
    description: 'GSAP, ScrollTrigger, Three.js, GLSL shaders, physics choreography.',
  },
  {
    id: 'ai',
    number: '05',
    title: 'AI INTEGRATION',
    description: 'Gemini Live API, autonomous agents, FastAPI microservices, real-time streaming.',
  },
  {
    id: 'automation',
    number: '06',
    title: 'AUTOMATION SYSTEMS',
    description: 'Webhook pipelines, data synchronization, background workers, CI/CD.',
  },
];

export function ServicesIndex() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Scroll-driven entry reveal
      gsap.fromTo(
        '.services-reveal',
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            toggleActions: 'play none none none',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const handleSelect = (idx: number) => {
    if (idx !== activeIndex) {
      sound.playClick(1200 + idx * 80);
      setActiveIndex(idx);
    }
  };

  return (
    <section
      id="services"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        padding: 'clamp(64px, 8vw, 120px) 0',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-canvas)',
      }}
    >
      {/* Docking Target */}
      <div
        data-bubble-target="true"
        data-section="services"
        style={{
          position: 'absolute',
          top: '25%',
          right: '8%',
          width: 'clamp(240px, 26vw, 380px)',
          height: 'clamp(240px, 26vw, 380px)',
          pointerEvents: 'none',
          zIndex: 4,
        }}
      />

      <div className="content-constraint" style={{ width: '100%' }}>
        {/* Section Header */}
        <div
          className="services-reveal"
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: 'clamp(32px, 4vw, 56px)',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '20px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div className="tech-label" style={{ color: 'var(--text-tertiary)', marginBottom: '8px' }}>
              CAPABILITIES
            </div>
            <h2
              className="font-display"
              style={{
                fontSize: 'clamp(38px, 5vw, 76px)',
                fontWeight: 200,
                letterSpacing: '-0.025em',
                lineHeight: 0.95,
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
              }}
            >
              SERVICES
            </h2>
          </div>
        </div>

        {/* Capability Index */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            borderTop: '1px solid var(--border-subtle)',
          }}
        >
          {CAPABILITIES.map((cap, idx) => {
            const isActive = idx === activeIndex;

            return (
              <div
                key={cap.id}
                className="services-reveal"
                onClick={() => handleSelect(idx)}
                onMouseEnter={() => handleSelect(idx)}
                data-cursor="hover"
                style={{
                  padding: 'clamp(20px, 2.5vw, 32px) 0',
                  borderBottom: '1px solid var(--border-subtle)',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  transition: 'all 0.3s ease',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    gap: '20px',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      gap: '20px',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '13px',
                        color: isActive ? 'var(--text-primary)' : 'var(--text-tertiary)',
                        transition: 'color 0.3s ease',
                        minWidth: '24px',
                      }}
                    >
                      {cap.number}
                    </span>

                    <h3
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'clamp(20px, 2.5vw, 34px)',
                        fontWeight: isActive ? 400 : 300,
                        letterSpacing: '-0.02em',
                        textTransform: 'uppercase',
                        color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                        transition: 'color 0.3s ease, transform 0.3s ease',
                        transform: isActive ? 'translateX(8px)' : 'translateX(0)',
                      }}
                    >
                      {cap.title}
                    </h3>
                  </div>

                  <div
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: isActive ? 'var(--text-primary)' : 'transparent',
                      border: '1px solid var(--border-medium)',
                      transition: 'background-color 0.3s ease',
                      flexShrink: 0,
                    }}
                  />
                </div>

                {/* Description reveals when active */}
                <div
                  style={{
                    maxHeight: isActive ? '60px' : '0',
                    overflow: 'hidden',
                    transition: 'max-height 0.4s ease',
                    paddingLeft: '44px',
                  }}
                >
                  <p
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      color: 'var(--text-tertiary)',
                      lineHeight: 1.6,
                      letterSpacing: '0.02em',
                    }}
                  >
                    {cap.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
