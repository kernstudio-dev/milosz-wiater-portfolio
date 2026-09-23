'use client';

import { useEffect, useState } from 'react';
import { PinnedSection } from '@/components/PinnedSection';
import { useScrollProgress } from '@/context/ScrollContext';
import { scaleFontSize } from '@/lib/grid';

export function ContactFooter() {
  const scrollCtx = useScrollProgress();
  const progress = typeof scrollCtx === 'number' ? 0 : scrollCtx.progress.footer;
  const [visible, setVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    setVisible(progress >= 0.98);
  }, [progress]);

  const bs = 90;
  const headingSize = scaleFontSize(35.07, 3.46, bs);
  const bodySize = scaleFontSize(18.53, 3.46, bs);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', message: '' });
    }, 4000);
  };

  return (
    <PinnedSection id="footer" pinned={false}>
      <div className="section-grid-inner footer-grid">
        <div className={`footer-block ${visible ? 'footer-block--in' : ''}`} style={{ gridColumn: '1 / 7', gridRow: '3 / 6' }}>
          <h3 style={{ fontSize: headingSize, fontWeight: 200, textTransform: 'uppercase' }}>Contact</h3>
          <a href="mailto:contact@kern.dev" style={{ fontSize: bodySize, color: 'var(--text-secondary)' }}>contact@kern.dev</a>
        </div>

        <div className={`footer-block ${visible ? 'footer-block--in' : ''}`} style={{ gridColumn: '1 / 7', gridRow: '6 / 9', transitionDelay: '0.1s' }}>
          <h3 style={{ fontSize: headingSize, fontWeight: 200, textTransform: 'uppercase' }}>Information</h3>
          <p style={{ fontSize: bodySize, color: 'var(--text-secondary)' }}>Available for select commissions and ongoing partnerships.</p>
        </div>

        <div className={`footer-form-wrap ${visible ? 'footer-block--in' : ''}`} style={{ gridColumn: '15 / 21', gridRow: '3 / 9' }}>
          <h3 style={{ fontSize: headingSize, fontWeight: 200, textTransform: 'uppercase', marginBottom: 16 }}>Connect</h3>
          {submitted ? (
            <p className="font-mono" style={{ fontSize: bodySize }}>Message received</p>
          ) : (
            <form onSubmit={handleSubmit} className="footer-form">
              <input required placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              <input required type="email" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              <textarea required rows={3} placeholder="Message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} />
              <button type="submit">Send Message</button>
            </form>
          )}
        </div>

        <div className={`footer-legal font-mono ${visible ? 'footer-block--in' : ''}`} style={{ gridColumn: '1 / 9', gridRow: '9 / 10' }}>
          <span>© {new Date().getFullYear()} KERN</span>
        </div>
      </div>

      <style jsx>{`
        .footer-grid {
          padding-top: calc(var(--grid-block-size) * 2);
          padding-bottom: var(--grid-block-size);
        }
        .footer-block,
        .footer-form-wrap,
        .footer-legal {
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.6s cubic-bezier(0.22, 1, 0.36, 1), transform 0.6s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .footer-block--in {
          opacity: 1;
          transform: translateY(0);
        }
        .footer-form {
          display: flex;
          flex-direction: column;
          gap: var(--grid-block-size);
        }
        .footer-form input,
        .footer-form textarea {
          width: 100%;
          padding: 8px 4px;
          font-family: var(--font-mono);
          font-size: 18.53px;
          background: transparent;
          border: none;
          border-bottom: 1px solid var(--border-primary);
          color: var(--text-primary);
          outline: none;
        }
        .footer-form button {
          align-self: flex-start;
          padding: 12px 24px;
          font-family: var(--font-mono);
          font-size: 14px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          border: 1px solid var(--border-primary);
          color: var(--text-primary);
          transition: background 0.3s ease;
        }
        .footer-form button:hover {
          background: rgba(67, 202, 188, 0.2);
        }
        .footer-legal {
          font-size: 16.53px;
          color: var(--text-tertiary);
          display: flex;
          align-items: center;
          border-top: 1px solid var(--border-primary);
          padding-top: 8px;
        }
      `}</style>
    </PinnedSection>
  );
}
