'use client';

import Image from 'next/image';

export function TechPhilosophy() {
  const techLogos = [
    { name: 'NEXT.JS', icon: '▲' },
    { name: 'HTML5', icon: '5' },
    { name: 'CSS3', icon: 'CSS' },
    { name: 'JS / TS', icon: 'TS' },
    { name: 'THREE.JS', icon: '3' },
    { name: 'GSAP', icon: 'GSAP' },
    { name: 'PYTHON', icon: 'PY' },
    { name: 'FASTAPI', icon: '⚡' },
    { name: 'DOCKER', icon: '🐳' },
    { name: 'FIGMA', icon: 'F' },
  ];

  return (
    <section
      id="about"
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
        {/* Top Header Row (vanlent.dev Screenshot 3 1:1) */}
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
            <h2
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(28px, 4.2vw, 54px)',
                fontWeight: 300,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                lineHeight: 1.1,
                marginBottom: '8px',
              }}
            >
              ABOUT
            </h2>
            <div
              className="tech-label"
              style={{
                fontSize: '12px',
                color: 'var(--text-tertiary)',
                letterSpacing: '0.04em',
              }}
            >
              Strategy, design and development — connected from concept to launch.
            </div>
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

        {/* Master 3-Column Grid (vanlent.dev Screenshot 3 1:1) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(280px, 1.2fr) minmax(280px, 1.1fr) minmax(320px, 1.4fr)',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-canvas)',
          }}
        >
          {/* COLUMN 1: EDITORIAL PHILOSOPHY BIO */}
          <div
            style={{
              padding: 'clamp(28px, 4vw, 48px)',
              borderRight: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: '440px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(16px, 1.8vw, 22px)',
                fontWeight: 300,
                color: 'var(--text-primary)',
                lineHeight: 1.6,
                letterSpacing: '-0.01em',
              }}
            >
              I design and build distinctive digital experiences for ambitious brands, combining strategy, design and development from first idea to final build.
            </p>
          </div>

          {/* COLUMN 2: 3D PARTICLE CAVITY SPHERE (vanlent.dev Screenshot 2 & 3!) */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px',
              borderRight: '1px solid var(--border-subtle)',
              minHeight: '440px',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* The 3D Bubble Docking Target */}
            <div
              data-bubble-target="true"
              data-section="about"
              style={{
                width: 'clamp(240px, 24vw, 320px)',
                height: 'clamp(240px, 24vw, 320px)',
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

          {/* COLUMN 3: EDITORIAL PORTRAIT IN LEATHER ARMCHAIR (Screenshot 3 1:1) */}
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              minHeight: '440px',
              backgroundColor: '#09090b',
            }}
          >
            <Image
              src="/images/milosz_portrait.jpg"
              alt="Miłosz Wiater - Creative Developer"
              fill
              sizes="(max-width: 1024px) 100vw, 500px"
              style={{ objectFit: 'cover' }}
              priority
            />

            {/* Corner Crosshairs */}
            <span className="corner-crosshair corner-crosshair-tl" style={{ borderColor: 'var(--border-medium)' }} />
            <span className="corner-crosshair corner-crosshair-tr" style={{ borderColor: 'var(--border-medium)' }} />
            <span className="corner-crosshair corner-crosshair-bl" style={{ borderColor: 'var(--border-medium)' }} />
            <span className="corner-crosshair corner-crosshair-br" style={{ borderColor: 'var(--border-medium)' }} />
          </div>
        </div>

        {/* Bottom Technology Icons Ribbon Bar (Screenshot 3 vanlent.dev 1:1) */}
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '48px',
            borderBottom: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 16px',
            overflow: 'hidden',
          }}
        >
          {/* Tech Icons Track */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
            {techLogos.map((tech) => (
              <div
                key={tech.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text-tertiary)',
                  letterSpacing: '0.08em',
                }}
              >
                <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{tech.icon}</span>
                <span>{tech.name}</span>
              </div>
            ))}
          </div>

          {/* Live CAD telemetry label */}
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              color: 'var(--text-quaternary)',
              letterSpacing: '0.08em',
              whiteSpace: 'nowrap',
              marginLeft: '20px',
            }}
          >
            translateX: 98px
          </span>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          #about > div > div:nth-child(2) {
            grid-template-columns: 1fr !important;
          }
          #about > div > div:nth-child(2) > div {
            border-right: none !important;
            border-bottom: 1px solid var(--border-subtle);
          }
        }
      `}</style>
    </section>
  );
}
