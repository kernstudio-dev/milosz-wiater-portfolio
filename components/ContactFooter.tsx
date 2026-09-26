'use client';

import { useState } from 'react';
import { PinnedSection } from '@/components/PinnedSection';
import { useLanguage } from '@/context/LanguageContext';
import { useScene } from '@/hooks/useScene';
import { useBubble } from '@/context/BubbleContext';

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const p = clamp01(value); return p * p * (3 - 2 * p); };

export function ContactFooter() {
  const [sent, setSent] = useState(false);
  const { dictionary } = useLanguage();
  const { enter } = useScene('footer');
  const { gridMetrics } = useBubble();
  // Portrait: the closing scene is ordinary flow as tall as its content, so a
  // reveal tied to section progress would keep visible blocks hidden.
  const portrait = gridMetrics?.layout === 'portrait' || gridMetrics?.layout === 'landscape';
  const reveal = (delay: number) => (portrait ? 1 : smooth((enter - .45 - delay) / .32));

  return (
    <PinnedSection id="footer" pinned={false}>
      <div className="footer-layout">
        {/* portrait only: the last orb window and the route's END */}
        <div className="footer-orb-slot" data-orb-slot aria-hidden="true" />
        <p className="route-station footer-station" data-route-station><b>05</b> / {dictionary.route.contact} <em>● {dictionary.route.end}</em></p>
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
          :global(html[data-layout='flow']) .footer-layout { display: block; padding: 100px 20px 30px; overflow: auto; }
          :global(html[data-layout='flow']) .footer-contact, :global(html[data-layout='flow']) .footer-info, :global(html[data-layout='flow']) .footer-form-wrap { margin-bottom: 18px; min-height: 190px; }
          :global(html[data-layout='flow']) .footer-form-wrap { min-height: 520px; }
          :global(html[data-layout='flow']) .footer-legal { height: 74px; }
        }
        .footer-orb-slot, .footer-station { display: none; }

        /* ---------------------------------------------------------- portrait
           the route comes down the left edge and turns into the END node under
           the last orb window; contact, form and information follow in flow. */
        :global(html[data-layout='portrait']) .footer-layout {
          display: grid; grid-template-columns: repeat(var(--grid-cols), minmax(0, 1fr)); grid-template-rows: none; grid-auto-rows: auto; height: auto; overflow: visible;
          row-gap: 14px;
          padding: calc(var(--grid-block-size) + clamp(16px, 3svh, 32px)) 0 calc(28px + env(safe-area-inset-bottom));
        }
        :global(html[data-layout='portrait']) .footer-orb-slot { display: block; grid-column: 2 / -2; aspect-ratio: 1; max-height: 42svh; justify-self: center; width: 100%; }
        :global(html[data-layout='portrait']) .footer-station { display: block; grid-column: 1 / -1; height: auto; padding: 14px 0 0 16px; margin-bottom: 10px; }
        :global(html[data-layout='portrait']) .footer-station em { font-style: normal; margin-left: 1em; color: var(--text-primary); }
        :global(html[data-layout='portrait']) .footer-contact, :global(html[data-layout='portrait']) .footer-info, :global(html[data-layout='portrait']) .footer-form-wrap, :global(html[data-layout='portrait']) .footer-legal { grid-column: 1 / -1; grid-row: auto; }
        :global(html[data-layout='portrait']) .footer-contact, :global(html[data-layout='portrait']) .footer-info { padding: 20px; gap: 12px; }
        :global(html[data-layout='portrait']) .footer-form-wrap { padding-top: 20px; }
        :global(html[data-layout='portrait']) .footer-form-wrap h2 { padding: 0 16px 16px; }
        :global(html[data-layout='portrait']) form { height: auto; grid-template-rows: none; }
        :global(html[data-layout='portrait']) input { height: max(52px, calc(var(--grid-block-size) * .92)); padding: 0 16px; }
        :global(html[data-layout='portrait']) textarea { min-height: 132px; padding: 16px; }
        :global(html[data-layout='portrait']) button { height: max(52px, calc(var(--grid-block-size) * .92)); }
        :global(html[data-layout='portrait']) .footer-legal { height: max(52px, calc(var(--grid-block-size) * .92)); }
        :global(html[data-layout='portrait']) .footer-legal span { padding: 0 14px; font-size: 12px; }
        :global(html[data-layout='portrait']) .footer-contact a { padding: 12px 0; margin: -12px 0; }

        /* ---------------------------------------------------------- landscape phone
           orb window · END / contact · information | form */
        :global(html[data-layout='landscape']) .footer-layout {
          display: grid; height: auto; overflow: visible;
          grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); grid-template-rows: none; grid-auto-rows: auto;
          column-gap: 20px; row-gap: 12px; padding: calc(var(--grid-block-size) + 16px) 0 calc(24px + env(safe-area-inset-bottom));
        }
        :global(html[data-layout='landscape']) .footer-orb-slot { display: block; grid-column: 1; grid-row: 1; aspect-ratio: 1; width: 100%; max-height: 48svh; justify-self: center; }
        :global(html[data-layout='landscape']) .footer-station { display: block; grid-column: 1; grid-row: 2; height: auto; padding: 8px 0 0 16px; }
        :global(html[data-layout='landscape']) .footer-station em { font-style: normal; margin-left: 1em; color: var(--text-primary); }
        :global(html[data-layout='landscape']) .footer-contact { grid-column: 1; grid-row: 3; }
        :global(html[data-layout='landscape']) .footer-info { grid-column: 1; grid-row: 4; }
        :global(html[data-layout='landscape']) .footer-legal { grid-column: 1; grid-row: 5; height: 52px; }
        :global(html[data-layout='landscape']) .footer-form-wrap { grid-column: 2; grid-row: 1 / 6; padding-top: 18px; }
        :global(html[data-layout='landscape']) .footer-contact, :global(html[data-layout='landscape']) .footer-info { padding: 16px 18px; gap: 10px; }
        :global(html[data-layout='landscape']) .footer-form-wrap h2 { padding: 0 16px 14px; }
        :global(html[data-layout='landscape']) form { height: auto; grid-template-rows: none; }
        :global(html[data-layout='landscape']) input { height: 52px; padding: 0 16px; }
        :global(html[data-layout='landscape']) textarea { min-height: 120px; padding: 14px 16px; }
        :global(html[data-layout='landscape']) button { height: 52px; }
        :global(html[data-layout='landscape']) .footer-legal span { padding: 0 14px; font-size: 12px; }
        :global(html[data-layout='landscape']) .footer-contact a { padding: 12px 0; margin: -12px 0; }
      `}</style>
    </PinnedSection>
  );
}
