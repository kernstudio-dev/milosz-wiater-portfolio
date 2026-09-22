'use client';

import { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { sound } from '@/utils/sound';

interface Capability {
  id: string;
  number: string;
  title: string;
  description: string;
  details: string[];
}

const CAPABILITIES: Capability[] = [
  {
    id: 'frontend',
    number: '01',
    title: 'FRONT-END DEVELOPMENT',
    description:
      'Architecting responsive, high-performance web interfaces with strict type-safety, semantic accessibility, and fluid layouts.',
    details: ['React & Next.js 15', 'TypeScript Strict Mode', 'Component Architecture', 'Performance Optimization'],
  },
  {
    id: 'webapps',
    number: '02',
    title: 'WEB APPLICATIONS',
    description:
      'Full-stack platform development with resilient backend architectures, real-time data sync, and clean API designs.',
    details: ['Full-Stack Next.js', 'REST & WebSocket APIs', 'Database & ORM Integration', 'Authentication & Security'],
  },
  {
    id: 'uiux',
    number: '03',
    title: 'UI / UX DESIGN',
    description:
      'Translating complex business concepts into minimal, intuitive visual systems with architectural hierarchy and negative space.',
    details: ['Design Systems', 'Design Tokens', 'Interaction Prototypes', 'Editorial Typography'],
  },
  {
    id: 'motion',
    number: '04',
    title: 'MOTION & INTERACTION',
    description:
      'Crafting microinteractions, scroll-driven timelines, and WebGL particle shaders that make digital products feel alive.',
    details: ['GSAP & ScrollTrigger', 'Three.js & GLSL Shaders', 'Lenis Smooth Scroll', 'Physics & Easing Choreography'],
  },
  {
    id: 'ai',
    number: '05',
    title: 'AI INTEGRATION',
    description:
      'Implementing multimodal AI agent pipelines, real-time voice streaming, and dynamic tool calling in production environments.',
    details: ['Gemini Live WebSocket APIs', 'FastAPI Microservices', 'Autonomous Agent Dispatchers', 'Context Graph Memory'],
  },
  {
    id: 'automation',
    number: '06',
    title: 'AUTOMATION SYSTEMS',
    description:
      'Building robust workflow automations, financial webhook dispatchers, and data synchronization tools that eliminate friction.',
    details: ['Webhook Pipelines', 'Low-Latency Data Streams', 'Background Task Workers', 'CI/CD Automation'],
  },
];

export function ServicesIndex() {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleSelect = (idx: number) => {
    if (idx !== activeIndex) {
      sound.playClick(1200 + idx * 80);
      setActiveIndex(idx);
    }
  };

  const activeCapability = CAPABILITIES[activeIndex];

  return (
    <section
      id="services"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        padding: 'clamp(64px, 8vw, 120px) 0',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-canvas)',
      }}
    >
      {/* Docking Target for Global Persistent Mesh (Right side during Services, morphing to amber/orange) */}
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
        {/* Section Top Label */}
        <div
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
          <div className="tech-label" style={{ color: 'var(--text-secondary)' }}>
            02 // SERVICES & CAPABILITIES
          </div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-tertiary)',
              letterSpacing: '0.06em',
            }}
          >
            ACTIVE DISCIPLINE: {activeCapability.number} / 06
          </div>
        </div>

        {/* Master Editorial 2-Column Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 'clamp(40px, 6vw, 80px)',
            alignItems: 'start',
          }}
        >
          {/* LEFT COLUMN: Editorial Typography & Context */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '24px',
              maxWidth: '520px',
            }}
          >
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(38px, 5vw, 76px)',
                fontWeight: 400,
                letterSpacing: '-0.025em',
                lineHeight: 0.95,
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
              }}
            >
              ENGINEERING
              <br />
              <span style={{ color: 'var(--text-secondary)' }}>PRECISION</span>
              <br />
              EXPERIENCES
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(14px, 1.2vw, 17px)',
                fontWeight: 400,
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                letterSpacing: '-0.01em',
              }}
            >
              Strategic architecture, bespoke motion, and creative development working as a single coherent discipline.
              Every interface is calibrated for clarity, responsiveness, and performance.
            </p>

            {/* Active Capability Deep-Dive Detail Card (Reveals with clip-path) */}
            <div
              className="corner-box"
              style={{
                marginTop: '16px',
                padding: '24px',
                backgroundColor: 'var(--bg-surface)',
                borderColor: 'var(--border-medium)',
              }}
            >
              <span className="corner-crosshair corner-crosshair-tl" />
              <span className="corner-crosshair corner-crosshair-tr" />
              <span className="corner-crosshair corner-crosshair-bl" />
              <span className="corner-crosshair corner-crosshair-br" />

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  letterSpacing: '0.08em',
                  marginBottom: '10px',
                }}
              >
                CAPABILITY SPECIFICATION // {activeCapability.number}
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  lineHeight: 1.6,
                  marginBottom: '18px',
                }}
              >
                {activeCapability.description}
              </div>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '8px',
                }}
              >
                {activeCapability.details.map((detail) => (
                  <span
                    key={detail}
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      color: 'var(--text-tertiary)',
                      padding: '3px 8px',
                      border: '1px solid var(--border-subtle)',
                      background: 'var(--bg-canvas)',
                    }}
                  >
                    {detail}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <a
                href="#contact"
                className="magnetic-button"
                data-cursor="contact"
                data-cursor-text="CONTACT"
                style={{
                  marginTop: '8px',
                  textDecoration: 'none',
                }}
              >
                <span className="magnetic-button__bg" />
                <span style={{ position: 'relative', zIndex: 2, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>DISCUSS A PROJECT</span>
                  <ArrowUpRight size={14} />
                </span>
              </a>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive 01..06 Capabilities Index */}
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
                  onClick={() => handleSelect(idx)}
                  onMouseEnter={() => handleSelect(idx)}
                  data-cursor="hover"
                  style={{
                    padding: '28px 0',
                    borderBottom: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
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
                        }}
                      >
                        {cap.number}
                      </span>

                      <h3
                        style={{
                          fontFamily: 'var(--font-sans)',
                          fontSize: 'clamp(20px, 2.5vw, 34px)',
                          fontWeight: isActive ? 500 : 300,
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
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        backgroundColor: isActive ? 'var(--text-primary)' : 'transparent',
                        border: '1px solid var(--border-medium)',
                        transition: 'background-color 0.3s ease, border-color 0.3s ease',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
