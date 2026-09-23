'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { sound } from '@/utils/sound';

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    sound.playClick(1400);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { label: 'WORK', id: 'work' },
    { label: 'SERVICES', id: 'services' },
    { label: 'ABOUT', id: 'about' },
    { label: 'CONTACT', id: 'footer' },
  ];

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner section-content">
          <div className="site-header__left">
            <a href="#hero-section" className="site-header__brand" data-cursor="hover">
              KERN
            </a>
            <button
              type="button"
              className="site-header__menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Open navigation menu"
            >
              M
            </button>
          </div>

          <nav className="site-header__nav" aria-label="Primary">
            {navLinks.map((link) => (
              <button
                key={link.id}
                type="button"
                className="site-header__nav-item"
                onClick={() => scrollToSection(link.id)}
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="site-header__right">
            <button type="button" className="site-header__toggle" onClick={toggleTheme} aria-label="Toggle theme">
              {theme === 'dark' ? 'PM' : 'AM'}
            </button>
            <button type="button" className="site-header__cta" onClick={() => scrollToSection('footer')}>
              Get in touch
            </button>
          </div>
        </div>
      </header>

      <div className={`site-menu ${isMobileMenuOpen ? 'site-menu--open' : ''}`}>
        {navLinks.map((link) => (
          <button
            key={link.id}
            type="button"
            className="site-menu__link"
            onClick={() => {
              setIsMobileMenuOpen(false);
              scrollToSection(link.id);
            }}
          >
            {link.label}
          </button>
        ))}
        <p className="site-menu__meta font-mono">KERN — CREATIVE DEVELOPMENT</p>
      </div>

      <style jsx>{`
        .site-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--header-height);
          z-index: 100;
          pointer-events: none;
        }
        .site-header__inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 100%;
          pointer-events: auto;
        }
        .site-header__left,
        .site-header__right {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .site-header__brand {
          font-family: var(--font-display);
          font-size: 14px;
          font-weight: 400;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--text-primary);
          text-decoration: none;
          width: calc(var(--grid-block-size) * 2);
        }
        .site-header__menu-btn,
        .site-header__toggle,
        .site-header__cta,
        .site-header__nav-item {
          font-family: var(--font-mono);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--text-secondary);
          background: transparent;
          border: 1px solid var(--border-primary);
          padding: 6px 10px;
          cursor: pointer;
        }
        .site-header__nav {
          display: none;
          gap: 0;
        }
        @media (min-width: 1024px) {
          .site-header__nav {
            display: flex;
          }
          .site-header__menu-btn {
            display: none;
          }
        }
        .site-menu {
          position: fixed;
          inset: 0;
          z-index: 90;
          background: var(--bg-canvas);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 24px;
          clip-path: inset(0 0 100% 0);
          transition: clip-path 0.5s cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }
        .site-menu--open {
          clip-path: inset(0 0 0 0);
          pointer-events: auto;
        }
        .site-menu__link {
          font-family: var(--font-display);
          font-size: clamp(32px, 6vw, 48px);
          font-weight: 200;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: var(--text-primary);
          background: none;
          border: none;
          cursor: pointer;
        }
        .site-menu__meta {
          margin-top: 32px;
          font-size: 11px;
          color: var(--text-tertiary);
          letter-spacing: 0.12em;
        }
      `}</style>
    </>
  );
}
