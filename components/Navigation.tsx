'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { sound } from '@/utils/sound';

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const [lang, setLang] = useState<'EN' | 'PL'>('EN');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleThemeToggle = () => {
    sound.playClick(1500);
    toggleTheme();
  };

  const handleLangToggle = (newLang: 'EN' | 'PL') => {
    sound.playClick(1300);
    setLang(newLang);
  };

  const scrollToContact = () => {
    sound.playClick(1400);
    const contactEl = document.getElementById('contact');
    if (contactEl) {
      contactEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'WORK', href: '#work', number: '01' },
    { label: 'SERVICES', href: '#services', number: '02' },
    { label: 'ABOUT', href: '#about', number: '03' },
    { label: 'PROCESS', href: '#process', number: '04' },
    { label: 'CONTACT', href: '#contact', number: '05' },
  ];

  return (
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '56px',
          zIndex: 80,
          backgroundColor: 'transparent',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <div
          className="content-constraint"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            width: '100%',
            height: '100%',
            position: 'relative',
            pointerEvents: 'auto',
          }}
        >
          {/* Left: Brand WIATER + Menu Button 'M' (vanlent.dev Screenshot 3 & 5 1:1) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <a
              href="#hero-section"
              data-cursor="hover"
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '14px',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                textDecoration: 'none',
              }}
            >
              WIATER
            </a>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="corner-box"
              data-cursor="hover"
              aria-label="Open navigation menu"
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                fontWeight: 600,
                color: 'var(--text-secondary)',
                backgroundColor: 'transparent',
                borderColor: 'var(--border-subtle)',
                cursor: 'pointer',
              }}
            >
              <span className="corner-crosshair corner-crosshair-tl" />
              <span className="corner-crosshair corner-crosshair-tr" />
              <span className="corner-crosshair corner-crosshair-bl" />
              <span className="corner-crosshair corner-crosshair-br" />
              M
            </button>
          </div>

          {/* Right: Language toggle + Theme toggle (AM / PM) + Get in touch (Screenshot 3, 4, 5!) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Language Selector EN / PL */}
            <button
              type="button"
              onClick={() => handleLangToggle(lang === 'EN' ? 'PL' : 'EN')}
              className="corner-box"
              data-cursor="hover"
              style={{
                padding: '6px 10px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: 'var(--text-secondary)',
                backgroundColor: 'transparent',
                borderColor: 'var(--border-subtle)',
                cursor: 'pointer',
              }}
            >
              <span className="corner-crosshair corner-crosshair-tl" />
              <span className="corner-crosshair corner-crosshair-tr" />
              <span className="corner-crosshair corner-crosshair-bl" />
              <span className="corner-crosshair corner-crosshair-br" />
              {lang}
            </button>

            {/* Theme Toggle AM / PM */}
            <button
              type="button"
              onClick={handleThemeToggle}
              className="corner-box"
              data-cursor="hover"
              aria-label="Toggle AM / PM theme"
              style={{
                width: '38px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                fontWeight: 600,
                color: 'var(--text-primary)',
                backgroundColor: 'transparent',
                borderColor: 'var(--border-subtle)',
                cursor: 'pointer',
              }}
            >
              <span className="corner-crosshair corner-crosshair-tl" />
              <span className="corner-crosshair corner-crosshair-tr" />
              <span className="corner-crosshair corner-crosshair-bl" />
              <span className="corner-crosshair corner-crosshair-br" />
              <span>{theme === 'dark' ? 'PM' : 'AM'}</span>
            </button>

            {/* Get in touch button (matching Screenshot 3 & 5 exactly!) */}
            <button
              type="button"
              onClick={scrollToContact}
              className="corner-box"
              data-cursor="hover"
              style={{
                padding: '7px 16px',
                fontFamily: 'var(--font-sans)',
                fontSize: '12px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                backgroundColor: 'transparent',
                borderColor: 'var(--border-subtle)',
                cursor: 'pointer',
              }}
            >
              <span className="corner-crosshair corner-crosshair-tl" />
              <span className="corner-crosshair corner-crosshair-tr" />
              <span className="corner-crosshair corner-crosshair-bl" />
              <span className="corner-crosshair corner-crosshair-br" />
              Get in touch
            </button>
          </div>
        </div>
      </header>

      {/* Fullscreen Masked Menu Drawer */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 90,
          backgroundColor: 'var(--bg-canvas)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '40px 24px',
          clipPath: isMobileMenuOpen ? 'inset(0 0 0% 0)' : 'inset(0 0 100% 0)',
          transition: 'clip-path 0.5s var(--ease-out-expo)',
          pointerEvents: isMobileMenuOpen ? 'auto' : 'none',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            maxWidth: '440px',
            margin: '0 auto',
            width: '100%',
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              style={{
                display: 'flex',
                alignItems: 'baseline',
                justifyContent: 'space-between',
                borderBottom: '1px solid var(--border-subtle)',
                paddingBottom: '14px',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(32px, 6vw, 48px)',
                fontWeight: 300,
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
                textDecoration: 'none',
              }}
            >
              <span style={{ display: 'flex', alignItems: 'baseline', gap: '20px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '14px', color: 'var(--text-tertiary)' }}>
                  {link.number}
                </span>
                {link.label}
              </span>
            </a>
          ))}
        </div>

        <div
          style={{
            marginTop: '48px',
            textAlign: 'center',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            color: 'var(--text-tertiary)',
            letterSpacing: '0.12em',
          }}
        >
          MIŁOSZ WIATER // CREATIVE DEVELOPER
          <br />
          WARSAW, PL [52.2297° N, 21.0122° E]
        </div>
      </div>
    </>
  );
}
