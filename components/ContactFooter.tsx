'use client';

import { useState } from 'react';
import { PinnedSection } from '@/components/PinnedSection';
import { useLanguage } from '@/context/LanguageContext';
import { useScene } from '@/hooks/useScene';

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const p = clamp01(value); return p * p * (3 - 2 * p); };

export function ContactFooter() {
  const [sent, setSent] = useState(false);
  const { dictionary } = useLanguage();
  const { enter } = useScene('footer');
  const reveal = (delay: number) => smooth((enter - .45 - delay) / .32);

  return (
    <PinnedSection id="footer" pinned={false}>
      <div className="footer-layout">
        <div className="footer-contact" style={{ clipPath: `inset(0 0 ${(1 - reveal(0)) * 100}% 0)` }}>
          <h2>{dictionary.contact.contact}</h2>
          <a href="mailto:contact@kern.dev">contact@kern.dev</a>
          <span>{dictionary.contact.availability}</span>
        </div>
        <div className="footer-info" style={{ clipPath: `inset(0 0 ${(1 - reveal(.08)) * 100}% 0)` }}>
          <h2>{dictionary.contact.information}</h2>
          <p>{dictionary.contact.independent}</p>
          <p>{dictionary.contact.commissions}</p>
          <p>KERN / 2026</p>
        </div>
        <div className="footer-form-wrap" style={{ clipPath: `inset(0 0 ${(1 - reveal(.04)) * 100}% 0)` }}>
          <h2>{dictionary.contact.connect}</h2>
          {sent ? (
            <p className="footer-thanks">{dictionary.contact.thanks}</p>
          ) : (
            <form onSubmit={(event) => { event.preventDefault(); setSent(true); }}>
              <input name="name" required placeholder={dictionary.contact.name} aria-label={dictionary.contact.name} />
              <input name="email" required type="email" placeholder="your.email@example.com" aria-label={dictionary.contact.email} />
              <input name="company" placeholder={dictionary.contact.company} aria-label={dictionary.contact.company} />
              <textarea name="message" required placeholder={dictionary.contact.message} aria-label={dictionary.contact.message} />
              <button type="submit">{dictionary.contact.submit}</button>
            </form>
          )}
        </div>
        <div className="footer-legal" style={{ clipPath: `inset(0 ${(1 - reveal(.14)) * 100}% 0 0)` }}><span>KERN © 2026</span><span>{dictionary.contact.discipline}</span></div>
      </div>

      <style jsx>{`
        .footer-layout { position: relative; height: 100%; display: grid; grid-template-columns: repeat(var(--grid-cols),var(--grid-block-size)); grid-template-rows: repeat(12,var(--grid-block-size)); overflow: hidden; }
        h2 { font: 300 16px/1 var(--font-display); color: var(--text-secondary); text-transform: none; }
        .footer-contact, .footer-info { grid-column: 1 / 6; border: 1px solid var(--border-primary); padding: 24px 28px; display: flex; flex-direction: column; gap: 16px; overflow: hidden; }
        .footer-contact { grid-row: 4 / 7; }
        .footer-info { grid-row: 8 / 11; }
        .footer-contact a, .footer-contact span, .footer-info p { font-size: 16px; line-height: 1.3; color: var(--text-secondary); }
        .footer-contact span, .footer-info p:last-child { color: var(--text-tertiary); }
        .footer-form-wrap { grid-column: -6 / -1; grid-row: 4 / 12; border: 1px solid var(--border-primary); padding-top: 24px; overflow: hidden; }
        .footer-form-wrap h2 { padding: 0 14px 18px; }
        form { height: calc(100% - 36px); display: grid; grid-template-rows: var(--grid-block-size) var(--grid-block-size) var(--grid-block-size) 3fr var(--grid-block-size); }
        input, textarea { width: 100%; min-width: 0; padding: 16px 14px; color: var(--text-secondary); background: transparent; border: 0; border-top: 1px solid var(--border-primary); outline: none; font: 300 16px/1.35 var(--font-display); }
        textarea { resize: none; }
        input:focus, textarea:focus { background: color-mix(in srgb, var(--text-primary) 4%, transparent); box-shadow: inset 2px 0 0 var(--border-active); color: var(--text-primary); }
        input:focus-visible, textarea:focus-visible { outline: none; }
        button { border-top: 1px solid var(--border-primary); font-size: 16px; color: var(--text-secondary); }
        button:hover { background: var(--text-primary); color: var(--bg-canvas); }
        .footer-thanks { margin: 40px 14px; color: var(--text-secondary); }
        .footer-legal { grid-column: 1 / 6; grid-row: 11 / 12; display: grid; grid-template-columns: 2fr 3fr; border: 1px solid var(--border-primary); }
        .footer-legal span { display: flex; align-items: center; padding: 0 18px; font-size: 13px; color: var(--text-tertiary); border-right: 1px solid var(--border-primary); }
        @media (min-width: 768px) and (max-height: 800px) {
          .footer-contact, .footer-info, .footer-legal { grid-column: 1 / 7; }
          .footer-form-wrap { grid-column: -7 / -1; }
        }
        @media (max-width: 767px) {
          .footer-layout { display: block; padding: 100px 20px 30px; overflow: auto; }
          .footer-contact, .footer-info, .footer-form-wrap { margin-bottom: 18px; min-height: 190px; }
          .footer-form-wrap { min-height: 520px; }
          .footer-legal { height: 74px; }
        }
      `}</style>
    </PinnedSection>
  );
}
