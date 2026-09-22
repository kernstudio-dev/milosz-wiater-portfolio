'use client';

import Image from 'next/image';

const TECH_ITEMS = [
  'NEXT.JS',
  'REACT 19',
  'TYPESCRIPT',
  'NODE.JS',
  'GSAP & SCROLLTRIGGER',
  'THREE.JS / WEBGL',
  'GLSL SHADERS',
  'PYTHON 3.12',
  'FASTAPI',
  'GEMINI LIVE API',
  'AUTOMATION PIPELINES',
  'FIGMA',
];

export function TechPhilosophy() {
  return (
    <section
      id="about"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        padding: 'clamp(64px, 8vw, 120px) 0 48px',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-canvas)',
      }}
    >
      <div className="content-constraint" style={{ width: '100%' }}>
        {/* Section Top Header */}
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
          <div>
            <div className="tech-label" style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
              03 // ABOUT
            </div>
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(32px, 5.5vw, 68px)',
                fontWeight: 400,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                lineHeight: 0.95,
              }}
            >
              ABOUT
            </h2>
          </div>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: 'var(--text-secondary)',
              letterSpacing: '0.06em',
            }}
          >
            STRATEGY // DESIGN // CODE
          </div>
        </div>

        {/* Master 3-Column Framed Editorial Composition */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
            marginBottom: '48px',
          }}
        >
          {/* COLUMN 1: SHORT EDITORIAL STATEMENT */}
          <div
            style={{
              padding: 'clamp(28px, 4vw, 52px)',
              borderRight: '1px solid var(--border-subtle)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: '380px',
            }}
          >
            <div
              className="tech-label"
              style={{
                color: 'var(--text-tertiary)',
                marginBottom: '16px',
              }}
            >
              PHILOSOPHY
            </div>

            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(20px, 2.2vw, 32px)',
                fontWeight: 400,
                color: 'var(--text-primary)',
                lineHeight: 1.4,
                letterSpacing: '-0.015em',
              }}
            >
              I design and build digital products where strategy, interaction, development and visual identity work as one system.
            </p>

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                marginTop: '20px',
              }}
            >
              Working independently with founders, creative agencies, and product teams to engineer digital experiences that stand out without unnecessary noise.
            </p>
          </div>

          {/* COLUMN 2: SINGLE PERSISTENT MESH DOCKING TARGET */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              borderRight: '1px solid var(--border-subtle)',
              borderBottom: '1px solid var(--border-subtle)',
              minHeight: '380px',
              backgroundColor: 'var(--bg-canvas)',
            }}
          >
            {/* The persistent 3D Mesh Docking Point */}
            <div
              data-bubble-target="true"
              data-section="about"
              style={{
                width: 'clamp(220px, 22vw, 320px)',
                height: 'clamp(220px, 22vw, 320px)',
                position: 'relative',
                pointerEvents: 'none',
              }}
            />

            {/* Corner Crosshairs */}
            <span className="corner-crosshair corner-crosshair-tl" />
            <span className="corner-crosshair corner-crosshair-tr" />
            <span className="corner-crosshair corner-crosshair-bl" />
            <span className="corner-crosshair corner-crosshair-br" />

            <div
              style={{
                position: 'absolute',
                bottom: '16px',
                left: '20px',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: 'var(--text-tertiary)',
                letterSpacing: '0.08em',
              }}
            >
              FIG. 03 // PROCEDURAL CAVITY
            </div>
          </div>

          {/* COLUMN 3: EDITORIAL PORTRAIT / FRAMED COMPOSITION */}
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              minHeight: '380px',
              borderBottom: '1px solid var(--border-subtle)',
              backgroundColor: 'var(--bg-surface)',
            }}
          >
            <Image
              src="/images/milosz_portrait.jpg"
              alt="Miłosz Wiater - Creative Developer"
              fill
              sizes="(max-width: 768px) 100vw, 400px"
              style={{ objectFit: 'cover' }}
            />

            {/* Subtle Overlay gradient for text legibility */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 40%)',
              }}
            />

            {/* Portrait Annotation */}
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

            {/* Corner Crosshairs */}
            <span className="corner-crosshair corner-crosshair-tl" />
            <span className="corner-crosshair corner-crosshair-tr" />
            <span className="corner-crosshair corner-crosshair-bl" />
            <span className="corner-crosshair corner-crosshair-br" />
          </div>
        </div>

        {/* TECHNOLOGY RAIL (Thin horizontal ticker under About) */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            borderTop: '1px solid var(--border-subtle)',
            borderBottom: '1px solid var(--border-subtle)',
            padding: '14px 0',
            backgroundColor: 'var(--bg-canvas)',
          }}
        >
          <div
            style={{
              display: 'flex',
              width: 'max-content',
              animation: 'marquee 35s linear infinite',
              gap: '40px',
            }}
          >
            {/* Duplicate array for seamless infinite loop */}
            {[...TECH_ITEMS, ...TECH_ITEMS].map((item, index) => (
              <span
                key={`${item}-${index}`}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--text-secondary)',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '16px',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{item}</span>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '8px' }}>—</span>
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
