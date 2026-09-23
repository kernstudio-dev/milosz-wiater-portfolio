'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { PROJECTS, Project } from '@/data/projects';
import { ProjectModal } from './ProjectModal';
import { sound } from '@/utils/sound';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function SelectedWork() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    const strip = stripRef.current;
    if (!section || !strip) return;

    const calculateDistance = () => {
      return strip.scrollWidth - window.innerWidth + 120;
    };

    const ctx = gsap.context(() => {
      const scrollDistance = calculateDistance();

      gsap.to(strip, {
        x: () => -Math.max(0, strip.scrollWidth - window.innerWidth + 120),
        ease: 'none',
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: () => `+=${Math.max(1200, strip.scrollWidth - window.innerWidth + 600)}`,
          pin: true,
          scrub: 1,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });
    }, sectionRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleOpenProject = (project: Project) => {
    sound.playClick(1400);
    setSelectedProject(project);
  };

  return (
    <section
      id="work"
      ref={sectionRef}
      style={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        backgroundColor: 'var(--bg-canvas)',
        borderTop: '1px solid var(--border-subtle)',
        borderBottom: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
      }}
    >
      {/* Docking Target for Global Persistent Mesh (Upper-right during Selected Work) */}
      <div
        data-bubble-target="true"
        data-section="work"
        style={{
          position: 'absolute',
          top: '12%',
          right: '8%',
          width: 'clamp(200px, 20vw, 300px)',
          height: 'clamp(200px, 20vw, 300px)',
          pointerEvents: 'none',
          zIndex: 4,
        }}
      />

      <div
        ref={containerRef}
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: 'clamp(32px, 4vw, 56px) 0',
        }}
      >
        {/* Section Header: Minimal & Editorial */}
        <div
          className="content-constraint"
          style={{
            width: '100%',
            marginBottom: 'clamp(28px, 3.5vw, 44px)',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
          }}
        >
          <div className="tech-label" style={{ color: 'var(--text-secondary)' }}>
            01 // SELECTED WORK
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
              flexWrap: 'wrap',
              gap: '16px',
            }}
          >
            <h2
              className="font-serif"
              style={{
                fontSize: 'clamp(32px, 5.5vw, 68px)',
                fontWeight: 200,
                letterSpacing: '-0.02em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                lineHeight: 0.95,
              }}
            >
              SELECTED WORK
            </h2>

            <p
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(13px, 1.1vw, 15px)',
                fontWeight: 400,
                color: 'var(--text-secondary)',
                maxWidth: '460px',
                lineHeight: 1.5,
              }}
            >
              Curated digital artifacts, interactive WebGL explorations, and production AI platforms built with precision.
            </p>
          </div>
        </div>

        {/* Horizontal Projects Strip (Master Translation Timeline) */}
        <div
          ref={stripRef}
          className="project-strip-container"
          style={{
            paddingLeft: 'max(24px, calc((100vw - var(--grid-max-width)) / 2 + 24px))',
            paddingRight: '60px',
          }}
        >
          {PROJECTS.map((project, index) => (
            <article
              key={project.id}
              className="project-card"
              onClick={() => handleOpenProject(project)}
              data-cursor="view"
              data-cursor-text="VIEW"
              style={{
                cursor: 'pointer',
              }}
            >
              {/* Visual Presentation Viewport */}
              <div className="project-media-wrap">
                <Image
                  src={project.media.src}
                  alt={project.media.alt}
                  fill
                  sizes="(max-width: 768px) 90vw, (max-width: 1440px) 45vw, 640px"
                  className="project-media-img"
                  priority={index < 2}
                />

                {/* Subtle corner crosshairs */}
                <span className="corner-crosshair corner-crosshair-tl" />
                <span className="corner-crosshair corner-crosshair-tr" />
                <span className="corner-crosshair corner-crosshair-bl" />
                <span className="corner-crosshair corner-crosshair-br" />
              </div>

              {/* Minimal Editorial Annotation Bar */}
              <div className="project-info-bar">
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'baseline',
                    borderBottom: '1px solid var(--border-subtle)',
                    paddingBottom: '10px',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--text-secondary)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {project.number} // {project.category}
                  </span>

                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '11px',
                      color: 'var(--text-tertiary)',
                    }}
                  >
                    {project.year}
                  </span>
                </div>

                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '2px',
                  }}
                >
                  <h3
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: 'clamp(20px, 2.2vw, 28px)',
                      fontWeight: 500,
                      letterSpacing: '-0.02em',
                      color: 'var(--text-primary)',
                      lineHeight: 1.1,
                    }}
                  >
                    {project.title}
                  </h3>

                  <div
                    className="project-arrow"
                    style={{
                      width: '28px',
                      height: '28px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ArrowUpRight size={18} />
                  </div>
               </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Deep-Dive Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
