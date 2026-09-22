'use client';

import { useState } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { sound } from '@/utils/sound';

export function ContactFooter() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick(1500);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 4000);
  };

  return (
    <footer
      id="contact"
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        padding: 'clamp(64px, 8vw, 120px) 0 40px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-canvas)',
        overflow: 'hidden',
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
              04 // CONTACT
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
              GET IN TOUCH
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
            AVAILABILITY // SELECT COMMISSIONS
          </div>
        </div>

        {/* Master 3-Column Sparse Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-surface)',
            marginBottom: '48px',
          }}
        >
          {/* COLUMN 1: DIRECT CONTACT INFORMATION */}
          <div
            style={{
              padding: 'clamp(28px, 4vw, 44px)',
              borderRight: '1px solid var(--border-subtle)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '420px',
            }}
          >
            <div>
              <div className="tech-label" style={{ color: 'var(--text-tertiary)', marginBottom: '18px' }}>
                DIRECT INQUIRY
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <a
                  href="mailto:contact@miloszwiater.dev"
                  data-cursor="hover"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    color: 'var(--text-primary)',
                    textDecoration: 'none',
                    letterSpacing: '0.04em',
                    transition: 'color 0.2s ease',
                  }}
                >
                  contact@miloszwiater.dev
                </a>

                <a
                  href="tel:+48500000000"
                  data-cursor="hover"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    letterSpacing: '0.04em',
                  }}
                >
                  +48 500 000 000
                </a>

                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '11px',
                    color: 'var(--text-tertiary)',
                    letterSpacing: '0.06em',
                    marginTop: '8px',
                  }}
                >
                  LOCAL TIME: WARSAW (CET / CEST)
                </div>
              </div>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-tertiary)',
                lineHeight: 1.6,
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '20px',
              }}
            >
              <div>WARSAW, POLAND</div>
              <div>CREATIVE ENGINEERING & DIRECTION</div>
            </div>
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
              minHeight: '420px',
              backgroundColor: 'var(--bg-canvas)',
            }}
          >
            {/* The persistent 3D Mesh Docking Point */}
            <div
              data-bubble-target="true"
              data-section="footer"
              style={{
                width: 'clamp(240px, 24vw, 340px)',
                height: 'clamp(240px, 24vw, 340px)',
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
              FIG. 04 // HARMONIC RESTING STATE
            </div>
          </div>

          {/* COLUMN 3: PROJECT INQUIRY FORM */}
          <div
            style={{
              padding: 'clamp(28px, 4vw, 44px)',
              borderBottom: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: '420px',
            }}
          >
            <div className="tech-label" style={{ color: 'var(--text-tertiary)', marginBottom: '18px' }}>
              PROJECT BRIEF
            </div>

            {submitted ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '20px',
                  backgroundColor: 'var(--bg-canvas)',
                  border: '1px solid var(--border-medium)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                }}
              >
                <Check size={16} />
                <span>INQUIRY TRANSMITTED. WILL RESPOND WITHIN 24 HOURS.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div>
                  <input
                    type="text"
                    required
                    placeholder="NAME *"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.06em',
                      backgroundColor: 'var(--bg-canvas)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <input
                    type="email"
                    required
                    placeholder="EMAIL *"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.06em',
                      backgroundColor: 'var(--bg-canvas)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <input
                    type="tel"
                    placeholder="PHONE (OPTIONAL)"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.06em',
                      backgroundColor: 'var(--bg-canvas)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <textarea
                    required
                    rows={3}
                    placeholder="PROJECT SCOPE / OBJECTIVES *"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      letterSpacing: '0.06em',
                      backgroundColor: 'var(--bg-canvas)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--text-primary)',
                      outline: 'none',
                      resize: 'none',
                    }}
                  />
                </div>

                <button
                  type="submit"
                  className="magnetic-button"
                  data-cursor="contact"
                  data-cursor-text="SEND"
                  style={{
                    width: '100%',
                    cursor: 'pointer',
                    marginTop: '4px',
                  }}
                >
                  <span className="magnetic-button__bg" />
                  <span
                    style={{
                      position: 'relative',
                      zIndex: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>DISCUSS A PROJECT</span>
                    <ArrowUpRight size={14} />
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Technical Annotation Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingTop: '20px',
            borderTop: '1px solid var(--border-subtle)',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div>© {new Date().getFullYear()} MIŁOSZ WIATER. ALL RIGHTS RESERVED.</div>
          <div>WARSAW // POLAND</div>
        </div>
      </div>
    </footer>
  );
}
