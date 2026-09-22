'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { sound } from '@/utils/sound';

const TESTIMONIALS = [
  {
    quote:
      "Very happy with Miłosz's support. Professional, fast, and he also makes you think about aspects you hadn't considered yet. The final result is ten times better than a template-based website.",
    author: 'Simon van Koppen',
    role: 'Co-founder - Arithma',
  },
  {
    quote:
      "I'm very happy with my new website: it looks fresh, modern, and professional. Miłosz handled this very well (and efficiently), and working with him was a real pleasure. I especially appreciated the direct, personal collaboration and communication as a self-employed professional. I can highly recommend him.",
    author: 'Manolya',
    role: 'Psychotherapy Manolya Aydagul',
  },
  {
    quote:
      'The level of craft in motion design and performance optimization exceeded our expectations. Our platform converted 40% higher from day one.',
    author: 'Elena Rostova',
    role: 'Product Lead - WbRent',
  },
];

export function ServicesIndex() {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const nextTestimonial = () => {
    sound.playClick(1300);
    setActiveTestimonial((prev) => (prev + 1) % TESTIMONIALS.length);
  };

  const prevTestimonial = () => {
    sound.playClick(1100);
    setActiveTestimonial((prev) => (prev - 1 + TESTIMONIALS.length) % TESTIMONIALS.length);
  };

  const current = TESTIMONIALS[activeTestimonial];

  return (
    <section
      id="services"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100svh',
        paddingTop: '64px',
        paddingBottom: '64px',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'transparent',
      }}
    >
      <div className="content-constraint" style={{ width: '100%' }}>
        {/* Top Header Row (vanlent.dev 1:1) */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '36px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div>
            <div
              className="tech-label"
              style={{
                fontSize: '12px',
                color: 'var(--text-tertiary)',
                marginBottom: '10px',
                letterSpacing: '0.04em',
              }}
            >
              Strategy, design, and technology working together. Without compromise.
            </div>

            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(28px, 4.2vw, 54px)',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                lineHeight: 1.1,
              }}
            >
              RELIABLE <span style={{ color: 'var(--text-secondary)' }}>CREATIVE</span> VERSATILE
            </h2>
          </div>

          <a
            href="#contact"
            className="corner-box"
            data-cursor="hover"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '12px 24px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-medium)',
              textDecoration: 'none',
              transition: 'all 0.2s ease',
            }}
          >
            Get in touch
          </a>
        </div>

        {/* Master Matrix Grid (vanlent.dev 1:1 matching Screenshot 5) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(260px, 1.1fr) minmax(360px, 1.8fr) minmax(300px, 1.3fr)',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-canvas)',
          }}
        >
          {/* COLUMN 1: MOTION DESIGN FEATURE CARD */}
          <div
            style={{
              padding: 'clamp(24px, 3vw, 40px)',
              borderRight: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '440px',
            }}
          >
            <div>
              {/* Indicator blocks: ■■■■■□ */}
              <div style={{ display: 'flex', gap: '5px', marginBottom: '48px' }}>
                <span style={{ width: '12px', height: '8px', backgroundColor: 'var(--text-secondary)' }} />
                <span style={{ width: '12px', height: '8px', backgroundColor: 'var(--text-secondary)' }} />
                <span style={{ width: '12px', height: '8px', backgroundColor: 'var(--text-secondary)' }} />
                <span style={{ width: '12px', height: '8px', backgroundColor: 'var(--text-secondary)' }} />
                <span style={{ width: '12px', height: '8px', backgroundColor: 'var(--text-secondary)' }} />
                <span style={{ width: '12px', height: '8px', border: '1px solid var(--text-tertiary)' }} />
              </div>

              <div
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(28px, 3vw, 42px)',
                  fontWeight: 300,
                  color: 'var(--text-primary)',
                  lineHeight: 1.15,
                  marginBottom: '8px',
                }}
              >
                motion
              </div>

              <div
                style={{
                  display: 'inline-block',
                  border: '1px solid var(--border-medium)',
                  padding: '2px 12px',
                  fontFamily: 'var(--font-sans)',
                  fontSize: 'clamp(28px, 3vw, 42px)',
                  fontWeight: 300,
                  color: 'var(--text-primary)',
                  lineHeight: 1.15,
                  marginBottom: '24px',
                }}
              >
                design
              </div>
            </div>

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: '280px',
              }}
            >
              Motion with purpose: transitions and micro-interactions that create rhythm, guide attention and give the experience character.
            </p>
          </div>

          {/* COLUMN 2: ARCHITECTURAL METRICS & TESTIMONIALS */}
          <div
            style={{
              borderRight: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Top Row: building and designing | 23+ Projects Delivered */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div
                style={{
                  padding: '24px',
                  borderRight: '1px solid var(--border-subtle)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '20px',
                  fontWeight: 300,
                  color: 'var(--text-primary)',
                  lineHeight: 1.2,
                }}
              >
                building <br />
                <span style={{ color: 'var(--text-secondary)' }}>and designing</span>
              </div>

              <div style={{ padding: '24px' }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '24px', fontWeight: 300, color: 'var(--text-primary)' }}>
                  23+
                </div>
                <div className="tech-label" style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  Projects Delivered
                </div>
              </div>
            </div>

            {/* Middle Row: 99% Satisfaction | Crosshatch CAD pattern | 13+ Years Experience */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 64px 1fr',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <div style={{ padding: '24px', borderRight: '1px solid var(--border-subtle)' }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '24px', fontWeight: 300, color: 'var(--text-primary)' }}>
                  99%
                </div>
                <div className="tech-label" style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  Client Satisfaction
                </div>
              </div>

              {/* Crosshatch Pattern Cell */}
              <div
                style={{
                  borderRight: '1px solid var(--border-subtle)',
                  backgroundImage:
                    'repeating-linear-gradient(45deg, var(--border-subtle) 0, var(--border-subtle) 1px, transparent 0, transparent 8px), repeating-linear-gradient(-45deg, var(--border-subtle) 0, var(--border-subtle) 1px, transparent 0, transparent 8px)',
                }}
              />

              <div style={{ padding: '24px' }}>
                <div style={{ fontFamily: 'var(--font-sans)', fontSize: '24px', fontWeight: 300, color: 'var(--text-primary)' }}>
                  13+
                </div>
                <div className="tech-label" style={{ fontSize: '11px', color: 'var(--text-tertiary)', marginTop: '4px' }}>
                  Years Experience
                </div>
              </div>
            </div>

            {/* Bottom Row: Testimonials Review Carousel */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '48px 1fr',
                flex: 1,
              }}
            >
              {/* Carousel Controls */}
              <div
                style={{
                  borderRight: '1px solid var(--border-subtle)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <button
                  type="button"
                  onClick={prevTestimonial}
                  aria-label="Previous review"
                  data-cursor="hover"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderBottom: '1px solid var(--border-subtle)',
                    color: 'var(--text-secondary)',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <ChevronLeft size={16} />
                </button>

                <button
                  type="button"
                  onClick={nextTestimonial}
                  aria-label="Next review"
                  data-cursor="hover"
                  style={{
                    flex: 1,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--text-secondary)',
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>

              {/* Review Content */}
              <div
                style={{
                  padding: '24px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <p
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: '13px',
                    fontStyle: 'italic',
                    color: 'var(--text-secondary)',
                    lineHeight: 1.6,
                  }}
                >
                  &ldquo;{current.quote}&rdquo;
                </p>

                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-primary)',
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{current.author}</span>{' '}
                  <span style={{ color: 'var(--text-tertiary)' }}>· {current.role}</span>
                </div>
              </div>
            </div>
          </div>

          {/* COLUMN 3: GOLDEN PARTICLE SPHERE DOCKING CELL (vanlent.dev Screenshot 1 & 5!) */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              minHeight: '440px',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* The 3D Bubble Docking Target */}
            <div
              data-bubble-target="true"
              data-section="services"
              style={{
                width: 'clamp(240px, 24vw, 340px)',
                height: 'clamp(240px, 24vw, 340px)',
                position: 'relative',
                pointerEvents: 'none',
              }}
            />

            {/* Corner Crosshairs */}
            <span className="corner-crosshair corner-crosshair-tl" style={{ borderColor: 'var(--border-medium)' }} />
            <span className="corner-crosshair corner-crosshair-tr" style={{ borderColor: 'var(--border-medium)' }} />
            <span className="corner-crosshair corner-crosshair-bl" style={{ borderColor: 'var(--border-medium)' }} />
            <span className="corner-crosshair corner-crosshair-br" style={{ borderColor: 'var(--border-medium)' }} />
          </div>
        </div>

        {/* Bottom Timeline Ticks Ruler Bar (Screenshot 5 vanlent.dev 1:1) */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '32px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 12px',
            overflow: 'hidden',
          }}
        >
          {/* Subtle tick markers */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              backgroundImage:
                'repeating-linear-gradient(to right, var(--border-subtle) 0, var(--border-subtle) 1px, transparent 1px, transparent 16px)',
              opacity: 0.7,
            }}
          />

          <span
            style={{
              position: 'relative',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-quaternary)',
              letterSpacing: '0.08em',
              zIndex: 2,
            }}
          >
            translateX: -5014px
          </span>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          #services > div > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
          #services > div > div:nth-child(2) > div {
            border-right: none !important;
            border-bottom: 1px solid var(--border-subtle);
          }
        }
      `}</style>
    </section>
  );
}
