'use client';

import { useState } from 'react';
import { Check, Send } from 'lucide-react';
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
        minHeight: '100svh',
        paddingTop: '64px',
        paddingBottom: '48px',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        backgroundColor: 'var(--bg-canvas)',
        overflow: 'hidden',
      }}
    >
      <div className="content-constraint" style={{ width: '100%' }}>
        {/* Master 3-Column CAD Grid (vanlent.dev Screenshot 4 1:1) */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(240px, 1.1fr) minmax(320px, 1.4fr) minmax(340px, 1.5fr)',
            border: '1px solid var(--border-subtle)',
            backgroundColor: 'var(--bg-canvas)',
            marginBottom: '40px',
          }}
        >
          {/* COLUMN 1: DIRECT CONTACT INFORMATION */}
          <div
            style={{
              borderRight: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Top Box: Email, Phone, WhatsApp */}
            <div
              style={{
                padding: '36px 32px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '13px',
              }}
            >
              <a
                href="mailto:contact@miloszwiater.dev"
                data-cursor="hover"
                style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
              >
                contact@miloszwiater.dev
              </a>

              <a
                href="tel:+48500000000"
                data-cursor="hover"
                style={{
                  color: 'var(--text-secondary)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease',
                }}
              >
                +48 500 000 000
              </a>

              <a
                href="https://wa.me/48500000000"
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="hover"
                style={{
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'color 0.2s ease',
                }}
              >
                <span style={{ fontSize: '12px' }}>○</span>
                <span>WhatsApp</span>
              </a>
            </div>

            {/* Bottom Box: Location & Legal */}
            <div
              style={{
                padding: '36px 32px',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                gap: '8px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--text-tertiary)',
                lineHeight: 1.6,
              }}
            >
              <div>Warsaw, Poland</div>
              <div>00-001 Śródmieście</div>
              <div style={{ color: 'var(--text-quaternary)', fontSize: '11px', marginTop: '4px' }}>
                NIP / VAT: PL004164150B01
              </div>
            </div>
          </div>

          {/* COLUMN 2: 3D PARTICLE SPHERE DOCKING CELL (vanlent.dev Screenshot 4 1:1) */}
          <div
            style={{
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '32px',
              borderRight: '1px solid var(--border-subtle)',
              minHeight: '480px',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
            }}
          >
            {/* The 3D Bubble Docking Target */}
            <div
              data-bubble-target="true"
              data-section="footer"
              style={{
                width: 'clamp(260px, 28vw, 360px)',
                height: 'clamp(260px, 28vw, 360px)',
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

          {/* COLUMN 3: INTERACTIVE GRID CONTACT FORM (vanlent.dev Screenshot 4 1:1) */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {/* Field: Name */}
            <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <input
                type="text"
                required
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '24px 28px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Field: Email */}
            <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <input
                type="email"
                required
                placeholder="your.email@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                style={{
                  width: '100%',
                  padding: '24px 28px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Field: Phone */}
            <div style={{ borderBottom: '1px solid var(--border-subtle)' }}>
              <input
                type="tel"
                placeholder="+48 500 000 000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                style={{
                  width: '100%',
                  padding: '24px 28px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Field: Message */}
            <div style={{ flex: 1, minHeight: '140px', borderBottom: '1px solid var(--border-subtle)' }}>
              <textarea
                required
                placeholder="Tell me about your project..."
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                style={{
                  width: '100%',
                  height: '100%',
                  padding: '24px 28px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '14px',
                  outline: 'none',
                  resize: 'none',
                }}
              />
            </div>

            {/* Submit Button Row */}
            <div
              style={{
                padding: '20px 28px',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              <button
                type="submit"
                data-cursor="hover"
                className="corner-box"
                style={{
                  padding: '12px 24px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--text-primary)',
                  backgroundColor: 'transparent',
                  borderColor: 'var(--border-medium)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <span className="corner-crosshair corner-crosshair-tl" />
                <span className="corner-crosshair corner-crosshair-tr" />
                <span className="corner-crosshair corner-crosshair-bl" />
                <span className="corner-crosshair corner-crosshair-br" />

                {submitted ? (
                  <>
                    <Check size={14} color="var(--accent-cyan)" />
                    <span style={{ color: 'var(--accent-cyan)' }}>TRANSMITTED [200 OK]</span>
                  </>
                ) : (
                  <>
                    <Send size={13} />
                    <span>Discuss a project</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Bottom Bar: Copyright, Legal & Navigation (Screenshot 4 vanlent.dev 1:1) */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '16px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            padding: '12px 0',
          }}
        >
          {/* Left: Copyright */}
          <div className="corner-box" style={{ padding: '8px 16px', borderColor: 'var(--border-subtle)' }}>
            Miłosz Wiater © {new Date().getFullYear()}
          </div>

          {/* Center Links: Privacy & Terms */}
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              type="button"
              className="corner-box"
              style={{
                padding: '8px 16px',
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              Privacy policy
            </button>

            <button
              type="button"
              className="corner-box"
              style={{
                padding: '8px 16px',
                borderColor: 'var(--border-subtle)',
                backgroundColor: 'transparent',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              Terms of service
            </button>
          </div>

          {/* Right: Back to Top / Discuss */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="corner-box"
            data-cursor="hover"
            style={{
              padding: '8px 16px',
              borderColor: 'var(--border-subtle)',
              backgroundColor: 'transparent',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            Discuss a project ↑
          </button>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 960px) {
          #contact > div > div:first-child {
            grid-template-columns: 1fr !important;
          }
          #contact > div > div:first-child > div,
          #contact > div > div:first-child > form {
            border-right: none !important;
            border-bottom: 1px solid var(--border-subtle);
          }
        }
      `}</style>
    </footer>
  );
}
