'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUpRight, Check } from 'lucide-react';
import { sound } from '@/utils/sound';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function ContactFooter() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-reveal',
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sound.playClick(1500);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <footer
      id="contact"
      ref={sectionRef}
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
      {/* Docking target */}
      <div
        data-bubble-target="true"
        data-section="footer"
        style={{
          position: 'absolute',
          top: '15%',
          right: '10%',
          width: 'clamp(220px, 22vw, 320px)',
          height: 'clamp(220px, 22vw, 320px)',
          pointerEvents: 'none',
          zIndex: 4,
        }}
      />

      <div className="content-constraint" style={{ width: '100%' }}>
        {/* Large Title */}
        <div className="contact-reveal" style={{ marginBottom: 'clamp(40px, 5vw, 72px)' }}>
          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(48px, 8vw, 120px)',
              fontWeight: 100,
              letterSpacing: '-0.03em',
              lineHeight: 0.9,
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
            }}
          >
            LET&apos;S WORK
            <br />
            <span style={{ color: 'var(--text-secondary)' }}>TOGETHER</span>
          </h2>
        </div>

        {/* 2-Column: Contact Info + Form */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: 'clamp(32px, 5vw, 64px)',
            marginBottom: '64px',
          }}
        >
          {/* Contact Details */}
          <div className="contact-reveal" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <a
                href="mailto:contact@miloszwiater.dev"
                data-cursor="hover"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '14px',
                  color: 'var(--text-primary)',
                  textDecoration: 'none',
                  letterSpacing: '0.04em',
                }}
              >
                contact@miloszwiater.dev
              </a>

              <div
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  color: 'var(--text-tertiary)',
                  letterSpacing: '0.06em',
                }}
              >
                WARSAW, POLAND — CET / CEST
              </div>
            </div>

            <div
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
                maxWidth: '400px',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '20px',
              }}
            >
              Available for select commissions and ongoing partnerships. Let&apos;s discuss your next project.
            </div>
          </div>

          {/* Form */}
          <div className="contact-reveal">
            {submitted ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '20px',
                  border: '1px solid var(--border-medium)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                }}
              >
                <Check size={16} />
                <span>MESSAGE SENT. WILL RESPOND WITHIN 24H.</span>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <input
                  type="text"
                  required
                  placeholder="NAME"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    letterSpacing: '0.06em',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                />

                <input
                  type="email"
                  required
                  placeholder="EMAIL"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    letterSpacing: '0.06em',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                />

                <textarea
                  required
                  rows={4}
                  placeholder="PROJECT DETAILS"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    letterSpacing: '0.06em',
                    backgroundColor: 'var(--bg-surface)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    outline: 'none',
                    resize: 'none',
                    transition: 'border-color 0.2s ease',
                  }}
                />

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
                    <span>SEND MESSAGE</span>
                    <ArrowUpRight size={14} />
                  </span>
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Clean Footer */}
        <div
          className="contact-reveal"
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
          <div>© {new Date().getFullYear()} MIŁOSZ WIATER</div>
          <div>WARSAW, POLAND</div>
        </div>
      </div>
    </footer>
  );
}
