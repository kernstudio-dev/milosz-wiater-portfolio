'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { X, ExternalLink, CheckCircle2, Cpu } from 'lucide-react';
import { Project } from '@/data/projects';
import { MagneticButton } from './MagneticButton';

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export function ProjectModal({ project, onClose }: ProjectModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-modal)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(9, 9, 11, 0.88)',
        backdropFilter: 'blur(16px)',
        padding: '24px',
      }}
      onClick={onClose}
    >
      <div
        className="corner-box"
        style={{
          width: '100%',
          maxWidth: '960px',
          maxHeight: '90vh',
          backgroundColor: 'var(--bg-surface)',
          borderColor: 'var(--border-light)',
          overflowY: 'auto',
          position: 'relative',
          padding: 'clamp(24px, 4vw, 44px)',
          display: 'flex',
          flexDirection: 'column',
          gap: '28px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <span className="corner-crosshair corner-crosshair-tl" style={{ borderColor: 'var(--accent-cyan)' }} />
        <span className="corner-crosshair corner-crosshair-tr" style={{ borderColor: 'var(--accent-cyan)' }} />
        <span className="corner-crosshair corner-crosshair-bl" style={{ borderColor: 'var(--accent-cyan)' }} />
        <span className="corner-crosshair corner-crosshair-br" style={{ borderColor: 'var(--accent-cyan)' }} />

        {/* Modal Top Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: 'var(--accent-cyan)',
                border: '1px solid var(--accent-cyan-dim)',
                padding: '2px 8px',
              }}
            >
              {project.number}
            </span>
            <span className="tech-label">{project.category}</span>
          </div>

          <button
            onClick={onClose}
            className="corner-box"
            style={{
              padding: '6px',
              color: 'var(--text-secondary)',
            }}
            aria-label="Close project modal"
            data-cursor="hover"
          >
            <span className="corner-crosshair corner-crosshair-tl" />
            <span className="corner-crosshair corner-crosshair-tr" />
            <span className="corner-crosshair corner-crosshair-bl" />
            <span className="corner-crosshair corner-crosshair-br" />
            <X size={18} />
          </button>
        </div>

        {/* Project Header */}
        <div>
          <h2
            style={{
              fontSize: 'clamp(28px, 4vw, 48px)',
              fontWeight: 700,
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              color: 'var(--text-primary)',
              lineHeight: 1.1,
            }}
          >
            {project.title}
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: 'var(--text-secondary)',
              marginTop: '6px',
              fontFamily: 'var(--font-mono)',
            }}
          >
            {project.subtitle}
          </p>
        </div>

        {/* High-Resolution Media Display */}
        <div
          className="corner-box"
          style={{
            width: '100%',
            aspectRatio: '16 / 9',
            position: 'relative',
            overflow: 'hidden',
            backgroundColor: 'var(--bg-canvas)',
          }}
        >
          <Image
            src={project.media.src}
            alt={project.media.alt}
            fill
            sizes="(max-width: 960px) 100vw, 960px"
            style={{ objectFit: 'cover' }}
            priority
          />
        </div>

        {/* In-depth Architecture & Role Breakdown */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '32px',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '24px',
          }}
        >
          <div>
            <h3
              className="tech-label"
              style={{ color: 'var(--text-primary)', marginBottom: '12px', fontSize: '12px' }}
            >
              ENGINEERING ARCHITECTURE
            </h3>
            <p
              style={{
                fontSize: '15px',
                color: 'var(--text-secondary)',
                lineHeight: 1.7,
              }}
            >
              {project.longDescription}
            </p>
          </div>

          <div>
            <h3
              className="tech-label"
              style={{ color: 'var(--text-primary)', marginBottom: '12px', fontSize: '12px' }}
            >
              KEY DELIVERABLES
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {project.deliverables.map((item) => (
                <div
                  key={item}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                  }}
                >
                  <CheckCircle2 size={16} color="var(--accent-cyan)" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div style={{ marginTop: '24px' }}>
              <h3
                className="tech-label"
                style={{ color: 'var(--text-primary)', marginBottom: '10px', fontSize: '12px' }}
              >
                TECHNOLOGY STACK
              </h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {project.technologies.map((tech) => (
                  <span key={tech} className="tech-tag">
                    <Cpu size={10} color="var(--accent-cyan)" />
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '20px',
          }}
        >
          <MagneticButton href="#contact" onClick={onClose} cursorState="contact">
            <span>DISCUSS SIMILAR ARCHITECTURE</span>
            <ExternalLink size={14} />
          </MagneticButton>
        </div>
      </div>
    </div>
  );
}
