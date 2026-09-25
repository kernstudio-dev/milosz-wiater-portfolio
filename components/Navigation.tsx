'use client';

import { useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useLanguage } from '@/context/LanguageContext';

const LINK_IDS = ['work', 'services', 'about', 'footer'] as const;

export function Navigation() {
  const { theme, toggleTheme } = useTheme();
  const { language, dictionary, toggleLanguage } = useLanguage();
  const [open, setOpen] = useState(false);

  const go = (id: string) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <header className="site-nav">
        <div className="site-nav__inner">
          <button className="brand" onClick={() => go('hero-section')} aria-label={dictionary.navigation.backTop}><span>KE</span>RN</button>
          <button className="menu" onClick={() => setOpen((value) => !value)} aria-label={dictionary.navigation.menu} aria-expanded={open}>M</button>
          <button className="language" onClick={toggleLanguage} aria-label={dictionary.navigation.language}>{language === 'en' ? 'PL' : 'EN'}</button>
          <button className="theme" onClick={toggleTheme} aria-label={dictionary.navigation.theme}>{theme === 'dark' ? dictionary.navigation.light : dictionary.navigation.dark}</button>
        </div>
      </header>
      <div className={`nav-overlay ${open ? 'nav-overlay--open' : ''}`}>
        <nav>{LINK_IDS.map((id, index) => <button key={id} onClick={() => go(id)}><span>0{index + 1}</span>{dictionary.navigation.links[index]}</button>)}</nav>
        <p>{dictionary.navigation.footer}</p>
      </div>
      <style jsx>{`
        .site-nav { position: fixed; inset: 0 0 auto; height: var(--header-height); z-index: 100; pointer-events: none; }
        .site-nav__inner { width: var(--grid-max-width); height: 100%; margin: 0 auto; display: grid; grid-template-columns: repeat(var(--grid-cols),var(--grid-block-size)); pointer-events: none; }
        .site-nav button { pointer-events: auto; border: 1px solid var(--border-primary); background: var(--bg-canvas); color: var(--text-tertiary); }
        .brand { grid-column: 1 / 3; font: 300 14px/1 var(--font-display); letter-spacing: .02em; }
        .brand span { color: var(--accent-cyan); }
        .menu { grid-column: 3 / 4; font-size: 16px; }
        .language { grid-column: -3 / -2; font-size: 11px; }
        .theme { grid-column: -2 / -1; font: 500 9px/1 var(--font-mono); letter-spacing: .04em; }
        .nav-overlay { position: fixed; inset: 0; z-index: 90; display: grid; place-items: center; background: var(--bg-canvas); clip-path: inset(0 0 100% 0); transition: clip-path .7s cubic-bezier(.16,1,.3,1); pointer-events: none; }
        .nav-overlay--open { clip-path: inset(0); pointer-events: auto; }
        .nav-overlay nav { display: flex; flex-direction: column; }
        .nav-overlay nav button { font: 200 clamp(42px,7vw,96px)/1.15 var(--font-display); color: var(--text-secondary); text-align: left; }
        .nav-overlay nav span { display: inline-block; width: 50px; font: 11px/1 var(--font-mono); color: var(--text-tertiary); }
        .nav-overlay p { position: absolute; bottom: 40px; font: 11px/1 var(--font-mono); color: var(--text-tertiary); letter-spacing: .12em; }
        @media (max-width: 767px) {
          .site-nav__inner { width: calc(100% - 32px); display: flex; }
          .brand { width: 120px; }
          .menu { width: var(--header-height); }
          .language { margin-left: auto; width: var(--header-height); }
          .theme { width: var(--header-height); }
        }
      `}</style>
    </>
  );
}
