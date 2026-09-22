'use client';

import { useState } from 'react';

export function ProcessSection() {
  const [activeStep, setActiveStep] = useState<number>(0);

  const steps = [
    {
      number: '01',
      phase: 'DISCOVER',
      tagline: 'Deconstructing constraints, data structures, and the core user problem.',
      details: 'Deep technical research, target audience velocity analysis, architectural requirements gathering, and system scoping.',
    },
    {
      number: '02',
      phase: 'ARCHITECT',
      tagline: 'Crafting the mathematical grid, component tokens, and motion choreography.',
      details: 'Translating concepts into CAD precision wireframes, WebGL shaders, state machines, and micro-interaction prototypes.',
    },
    {
      number: '03',
      phase: 'BUILD',
      tagline: 'Clean, type-safe implementation from database models to GPU composited UI.',
      details: 'Building with Next.js 15, TypeScript, GSAP, and resilient backend pipelines. Strictly locked to 60 FPS performance budgets.',
    },
    {
      number: '04',
      phase: 'REFINE',
      tagline: 'Sub-millisecond latency audits, easing curves polish, and cross-browser hardening.',
      details: 'Zero layout thrashing verification, reduced motion compliance, accessibility audits, and edge caching optimization.',
    },
    {
      number: '05',
      phase: 'LAUNCH',
      tagline: 'Zero-downtime deployment, continuous monitoring, and knowledge handoff.',
      details: 'Production release on modern edge infrastructure, telemetry alerting, and clean modular code documentation.',
    },
  ];

  return (
    <section
      id="process"
      style={{
        position: 'relative',
        paddingTop: '96px',
        paddingBottom: '96px',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div className="content-constraint">
        {/* Telemetry Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            marginBottom: '48px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '20px',
          }}
        >
          <div>
            <div className="tech-label" style={{ marginBottom: '8px' }}>
              04 // EXECUTION PIPELINE
            </div>
            <h2
              style={{
                fontSize: 'clamp(32px, 5vw, 64px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              PROCESS
            </h2>
          </div>

          <span className="tech-label" style={{ color: 'var(--accent-cyan)' }}>
            [5 LINEAR PHASES]
          </span>
        </div>

        {/* Phase Timeline with Large Typography */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {steps.map((step, idx) => {
            const isSelected = activeStep === idx;
            return (
              <div
                key={step.number}
                onMouseEnter={() => setActiveStep(idx)}
                onClick={() => setActiveStep(idx)}
                className="corner-box"
                data-cursor="hover"
                style={{
                  padding: 'clamp(20px, 3vw, 36px)',
                  backgroundColor: isSelected ? 'var(--bg-elevated)' : 'transparent',
                  borderColor: isSelected ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                <span className="corner-crosshair corner-crosshair-tl" />
                <span className="corner-crosshair corner-crosshair-tr" />
                <span className="corner-crosshair corner-crosshair-bl" />
                <span className="corner-crosshair corner-crosshair-br" />

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '24px' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: 'clamp(14px, 2vw, 20px)',
                        color: isSelected ? 'var(--accent-cyan)' : 'var(--text-tertiary)',
                        letterSpacing: '0.08em',
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {step.number}
                    </span>

                    <h3
                      style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: 'clamp(28px, 5.5vw, 68px)',
                        fontWeight: 800,
                        letterSpacing: '-0.03em',
                        textTransform: 'uppercase',
                        color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                        lineHeight: 1,
                        transition: 'color 0.2s ease',
                      }}
                    >
                      {step.phase}
                    </h3>
                  </div>

                  <span
                    className="tech-label"
                    style={{
                      color: isSelected ? 'var(--accent-cyan)' : 'var(--text-tertiary)',
                    }}
                  >
                    PHASE {step.number}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: 'clamp(14px, 1.4vw, 17px)',
                    color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                    maxWidth: '800px',
                    lineHeight: 1.6,
                    marginTop: '4px',
                    transition: 'color 0.2s ease',
                  }}
                >
                  {step.tagline}
                </p>

                {isSelected && (
                  <p
                    style={{
                      fontSize: '13px',
                      color: 'var(--text-tertiary)',
                      fontFamily: 'var(--font-mono)',
                      lineHeight: 1.6,
                      borderTop: '1px solid var(--border-subtle)',
                      paddingTop: '12px',
                      marginTop: '8px',
                    }}
                  >
                    SPEC: {step.details}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
