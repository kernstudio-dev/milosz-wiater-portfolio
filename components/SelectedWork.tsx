'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import {
  ArrowLeft,
  ArrowRight,
  Maximize2,
  Monitor,
  Smartphone,
  Terminal,
  Activity,
  ExternalLink,
} from 'lucide-react';
import { PROJECTS, Project } from '@/data/projects';
import { ProjectModal } from './ProjectModal';
import { sound } from '@/utils/sound';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

type ViewMode = 'desktop' | 'mobile' | 'hud';

export function SelectedWork() {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<ViewMode>('desktop');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const workRef = useRef<HTMLElement>(null);

  // 3D Gyroscopic tilt state
  const stageRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ rotateX: number; rotateY: number }>({ rotateX: 0, rotateY: 0 });

  const currentProject = PROJECTS[activeIndex];

  // Pinning and scroll wipe progression (Scroll to Look)
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!workRef.current) return;

    const st = ScrollTrigger.create({
      trigger: workRef.current,
      start: 'top top',
      end: () => `+=${PROJECTS.length * 90}%`,
      pin: true,
      scrub: 0.5,
      onUpdate: (self) => {
        const nextIdx = Math.min(
          PROJECTS.length - 1,
          Math.floor(self.progress * PROJECTS.length)
        );
        setActiveIndex((prev) => {
          if (prev !== nextIdx) {
            sound.playClick(1200 + nextIdx * 60);
          }
          return nextIdx;
        });
      },
    });

    return () => {
      st.kill();
    };
  }, []);

  // Clip-path wipe logic matching vanlent.dev WipeWorkPreviewSection (om function)
  const getClipPath = (index: number) => {
    let diff = index - activeIndex;
    const len = PROJECTS.length;
    if (diff > len / 2) diff -= len;
    if (diff < -len / 2) diff += len;

    if (diff === 0) return 'inset(0% 0% 0% 0%)';
    if (diff > 0) return 'inset(0% 0% 100% 0%)';
    return 'inset(100% 0% 0% 0%)';
  };

  const handleNext = () => {
    sound.playClick(1400);
    setActiveIndex((prev) => (prev + 1) % PROJECTS.length);
  };

  const handlePrev = () => {
    sound.playClick(1100);
    setActiveIndex((prev) => (prev - 1 + PROJECTS.length) % PROJECTS.length);
  };

  const selectProject = (idx: number) => {
    sound.playClick(1200 + idx * 80);
    setActiveIndex(idx);
  };

  const changeViewMode = (mode: ViewMode) => {
    sound.playClick(1600);
    setViewMode(mode);
  };

  // 3D Mouse Parallax calculation
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateY = ((x - centerX) / centerX) * 6;
    const rotateX = -((y - centerY) / centerY) * 5;

    setTilt({ rotateX, rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (['1', '2', '3', '4', '5'].includes(e.key)) {
        const idx = parseInt(e.key, 10) - 1;
        if (idx < PROJECTS.length) selectProject(idx);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <section
      id="work"
      ref={workRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        borderTop: '1px solid var(--border-subtle)',
        overflow: 'hidden',
        paddingTop: '64px',
        paddingBottom: '64px',
      }}
    >
      <div className="content-constraint">
        {/* Section Top Telemetry Bar */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            gap: '16px',
            marginBottom: '32px',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '20px',
          }}
        >
          <div>
            <div className="tech-label" style={{ marginBottom: '8px' }}>
              01 // DIGITAL LABORATORY & SHOWCASE
            </div>
            <h2
              style={{
                fontSize: 'clamp(32px, 5vw, 64px)',
                fontWeight: 800,
                letterSpacing: '-0.03em',
                textTransform: 'uppercase',
                color: 'var(--text-primary)',
                lineHeight: 1,
              }}
            >
              SELECTED WORK
            </h2>
          </div>

          {/* Interactive Viewport Mode Selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <span className="tech-label" style={{ marginRight: '8px', color: 'var(--text-tertiary)' }}>
              VIEWPORT:
            </span>

            <button
              type="button"
              onClick={() => changeViewMode('desktop')}
              className="corner-box"
              data-cursor="hover"
              style={{
                padding: '6px 12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: viewMode === 'desktop' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                backgroundColor: viewMode === 'desktop' ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
                borderColor: viewMode === 'desktop' ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span className="corner-crosshair corner-crosshair-tl" />
              <span className="corner-crosshair corner-crosshair-tr" />
              <span className="corner-crosshair corner-crosshair-bl" />
              <span className="corner-crosshair corner-crosshair-br" />
              <Monitor size={13} />
              <span>DESKTOP</span>
            </button>

            <button
              type="button"
              onClick={() => changeViewMode('mobile')}
              className="corner-box"
              data-cursor="hover"
              style={{
                padding: '6px 12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: viewMode === 'mobile' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                backgroundColor: viewMode === 'mobile' ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
                borderColor: viewMode === 'mobile' ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span className="corner-crosshair corner-crosshair-tl" />
              <span className="corner-crosshair corner-crosshair-tr" />
              <span className="corner-crosshair corner-crosshair-bl" />
              <span className="corner-crosshair corner-crosshair-br" />
              <Smartphone size={13} />
              <span>MOBILE</span>
            </button>

            <button
              type="button"
              onClick={() => changeViewMode('hud')}
              className="corner-box"
              data-cursor="hover"
              style={{
                padding: '6px 12px',
                fontFamily: 'var(--font-mono)',
                fontSize: '11px',
                color: viewMode === 'hud' ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                backgroundColor: viewMode === 'hud' ? 'rgba(0, 240, 255, 0.08)' : 'transparent',
                borderColor: viewMode === 'hud' ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span className="corner-crosshair corner-crosshair-tl" />
              <span className="corner-crosshair corner-crosshair-tr" />
              <span className="corner-crosshair corner-crosshair-bl" />
              <span className="corner-crosshair corner-crosshair-br" />
              <Terminal size={13} />
              <span>TECH HUD</span>
            </button>
          </div>
        </div>

        {/* 3D INTERACTIVE PERSPECTIVE STAGE WITH VANLENT WIPE MOCKUP ENGINE */}
        <div
          ref={stageRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="perspective-stage"
          style={{
            position: 'relative',
            width: '100%',
            minHeight: '640px',
            marginBottom: '48px',
            cursor: 'pointer',
          }}
          onClick={() => setSelectedProject(currentProject)}
          data-cursor="view"
          data-cursor-text="EXPAND"
        >
          {/* Animated 3D Rotational Container */}
          <div
            className="preserve-3d"
            style={{
              width: '100%',
              height: '100%',
              transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`,
              transition:
                tilt.rotateX === 0 && tilt.rotateY === 0
                  ? 'transform 0.5s var(--ease-out-expo)'
                  : 'transform 0.08s ease-out',
              position: 'relative',
            }}
          >
            {/* LAYER 0: Deep Background Numeral Watermark */}
            <div
              className="layer-bg"
              aria-hidden="true"
              style={{
                position: 'absolute',
                top: '-20px',
                right: '4%',
                fontFamily: 'var(--font-sans)',
                fontSize: 'clamp(140px, 22vw, 340px)',
                fontWeight: 900,
                color: 'rgba(255, 255, 255, 0.025)',
                userSelect: 'none',
                pointerEvents: 'none',
                lineHeight: 0.8,
                zIndex: 1,
              }}
            >
              {currentProject.number}
            </div>

            {/* 3D PARTICLE BUBBLE DOCKING TARGET FOR WORK SECTION */}
            <div
              data-bubble-target="true"
              data-section="work"
              style={{
                position: 'absolute',
                top: '50%',
                right: '10%',
                transform: 'translateY(-50%)',
                width: '280px',
                height: '280px',
                pointerEvents: 'none',
                zIndex: 4,
              }}
            />

            {/* LAYER 1: Main Viewport Chassis */}
            <div
              className="viewport-chassis layer-base"
              style={{
                width: '100%',
                overflow: 'hidden',
                position: 'relative',
                zIndex: 2,
              }}
            >
              {/* CAD Corner Crosshairs */}
              <span className="corner-crosshair corner-crosshair-tl" style={{ borderColor: 'var(--accent-cyan)' }} />
              <span className="corner-crosshair corner-crosshair-tr" style={{ borderColor: 'var(--accent-cyan)' }} />
              <span className="corner-crosshair corner-crosshair-bl" style={{ borderColor: 'var(--accent-cyan)' }} />
              <span className="corner-crosshair corner-crosshair-br" style={{ borderColor: 'var(--accent-cyan)' }} />

              {/* Browser / Chassis Header Bar */}
              <div className="chassis-header">
                <div className="traffic-lights">
                  <span className="traffic-light traffic-light--red" />
                  <span className="traffic-light traffic-light--yellow" />
                  <span className="traffic-light traffic-light--green" />
                </div>

                <div className="chassis-url">
                  https://miloszwiater.dev/work/{currentProject.id}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span className="tech-label" style={{ color: 'var(--accent-cyan)' }}>
                    clip-path: {getClipPath(activeIndex)}
                  </span>
                  <span className="tech-label" style={{ color: 'var(--text-tertiary)' }}>
                    [60 FPS // LOCKED]
                  </span>
                </div>
              </div>

              {/* Viewport Display Area with Stacked Wipe Mechanism */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  aspectRatio: viewMode === 'mobile' ? '16 / 9' : '16 / 9',
                  minHeight: '460px',
                  backgroundColor: '#050507',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                {/* MODE 1: DESKTOP VIEWPORT WITH VERTICAL CLIP-PATH WIPE */}
                {viewMode === 'desktop' && (
                  <div style={{ position: 'absolute', inset: 0 }}>
                    {PROJECTS.map((proj, idx) => {
                      const isCur = idx === activeIndex;
                      return (
                        <div
                          key={proj.id}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            clipPath: getClipPath(idx),
                            transition: 'clip-path 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                            zIndex: isCur ? 3 : 1,
                            willChange: 'clip-path',
                            overflow: 'hidden',
                          }}
                        >
                          <Image
                            src={proj.media.src}
                            alt={proj.media.alt}
                            fill
                            sizes="(max-width: 1440px) 100vw, 1440px"
                            style={{
                              objectFit: 'cover',
                              transform: isCur ? 'scale(1)' : 'scale(1.04)',
                              transition: 'transform 0.9s cubic-bezier(0.22, 1, 0.36, 1)',
                            }}
                            priority={idx === 0}
                          />

                          {/* Subtle CAD Grid Overlay on Mockup */}
                          <div
                            style={{
                              position: 'absolute',
                              inset: 0,
                              backgroundImage:
                                'linear-gradient(to right, rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.03) 1px, transparent 1px)',
                              backgroundSize: '54px 54px',
                              pointerEvents: 'none',
                            }}
                          />
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* MODE 2: MOBILE SMARTPHONE VIEWPORT WITH VERTICAL CLIP-PATH WIPE */}
                {viewMode === 'mobile' && (
                  <div
                    style={{
                      width: '280px',
                      height: '520px',
                      backgroundColor: '#09090c',
                      borderRadius: '32px',
                      border: '4px solid #27272a',
                      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 240, 255, 0.1)',
                      position: 'relative',
                      overflow: 'hidden',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Phone Notch */}
                    <div
                      style={{
                        position: 'absolute',
                        top: '8px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '80px',
                        height: '14px',
                        backgroundColor: '#18181b',
                        borderRadius: '8px',
                        zIndex: 10,
                      }}
                    />

                    {/* Inner Mobile Screen Stack with Wipe */}
                    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                      {PROJECTS.map((proj, idx) => (
                        <div
                          key={proj.id}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            clipPath: getClipPath(idx),
                            transition: 'clip-path 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
                            zIndex: idx === activeIndex ? 3 : 1,
                            willChange: 'clip-path',
                          }}
                        >
                          <Image
                            src={proj.media.src}
                            alt={proj.media.alt}
                            fill
                            sizes="320px"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* MODE 3: TECHNICAL ARCHITECTURE HUD */}
                {viewMode === 'hud' && (
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(5, 5, 8, 0.96)',
                      padding: 'clamp(20px, 4vw, 48px)',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      fontFamily: 'var(--font-mono)',
                    }}
                  >
                    {/* SVG Vector Blueprint Overlay */}
                    <svg
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0.12,
                        pointerEvents: 'none',
                      }}
                    >
                      <line x1="0" y1="50%" x2="100%" y2="50%" stroke="var(--accent-cyan)" strokeDasharray="4 4" />
                      <line x1="50%" y1="0" x2="50%" y2="100%" stroke="var(--accent-cyan)" strokeDasharray="4 4" />
                      <circle cx="50%" cy="50%" r="120" stroke="var(--accent-cyan)" fill="none" />
                      <circle cx="50%" cy="50%" r="200" stroke="var(--accent-cyan)" fill="none" strokeDasharray="6 6" />
                    </svg>

                    <div style={{ position: 'relative', zIndex: 2 }}>
                      <div style={{ color: 'var(--accent-cyan)', fontSize: '12px', marginBottom: '8px' }}>
                        SYSTEM ARCHITECTURE SPECIFICATION // {currentProject.id.toUpperCase()}
                      </div>
                      <h3 style={{ fontSize: '28px', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                        {currentProject.title}
                      </h3>
                      <p
                        style={{
                          color: 'var(--text-secondary)',
                          maxWidth: '640px',
                          marginTop: '8px',
                          fontSize: '14px',
                          lineHeight: 1.6,
                        }}
                      >
                        {currentProject.longDescription}
                      </p>
                    </div>

                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '16px',
                        position: 'relative',
                        zIndex: 2,
                      }}
                    >
                      <div className="corner-box" style={{ padding: '12px', backgroundColor: 'var(--bg-surface)' }}>
                        <div className="tech-label" style={{ marginBottom: '4px' }}>ROLE & RESPONSIBILITY</div>
                        <div style={{ color: 'var(--text-primary)', fontSize: '13px' }}>{currentProject.role}</div>
                      </div>
                      <div className="corner-box" style={{ padding: '12px', backgroundColor: 'var(--bg-surface)' }}>
                        <div className="tech-label" style={{ marginBottom: '4px' }}>GPU ACCELERATION</div>
                        <div style={{ color: 'var(--accent-cyan)', fontSize: '13px' }}>GLSL 3.0 / WEBGL 2 COMPLIANT</div>
                      </div>
                      <div className="corner-box" style={{ padding: '12px', backgroundColor: 'var(--bg-surface)' }}>
                        <div className="tech-label" style={{ marginBottom: '4px' }}>FRAME BUDGET</div>
                        <div style={{ color: 'var(--text-primary)', fontSize: '13px' }}>16.6ms LOCKED (60 FPS)</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* LAYER 2: Floating 3D Telemetry Widgets with Animated Title Wipe */}
            <div
              className="layer-float"
              style={{
                position: 'absolute',
                top: '60px',
                left: '24px',
                pointerEvents: 'none',
                zIndex: 5,
              }}
            >
              <div
                className="corner-box"
                style={{
                  padding: '12px 18px',
                  backgroundColor: 'rgba(9, 9, 11, 0.88)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid var(--accent-cyan-dim)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '4px',
                }}
              >
                <span className="corner-crosshair corner-crosshair-tl" style={{ borderColor: 'var(--accent-cyan)' }} />
                <span className="corner-crosshair corner-crosshair-tr" style={{ borderColor: 'var(--accent-cyan)' }} />
                <span className="corner-crosshair corner-crosshair-bl" style={{ borderColor: 'var(--accent-cyan)' }} />
                <span className="corner-crosshair corner-crosshair-br" style={{ borderColor: 'var(--accent-cyan)' }} />
                <div className="tech-label" style={{ color: 'var(--accent-cyan)' }}>
                  [{currentProject.number}] {currentProject.category}
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontSize: 'clamp(20px, 2.5vw, 28px)',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    color: 'var(--text-primary)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  {currentProject.title}
                </div>
              </div>
            </div>

            {/* Floating Live Metrics on Bottom-Right */}
            {currentProject.metrics && (
              <div
                className="layer-float"
                style={{
                  position: 'absolute',
                  bottom: '24px',
                  right: '24px',
                  display: 'flex',
                  gap: '8px',
                  pointerEvents: 'none',
                  zIndex: 5,
                }}
              >
                {currentProject.metrics.map((m) => (
                  <div
                    key={m.label}
                    className="corner-box"
                    style={{
                      padding: '8px 14px',
                      backgroundColor: 'rgba(9, 9, 11, 0.85)',
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    <span className="corner-crosshair corner-crosshair-tl" />
                    <span className="corner-crosshair corner-crosshair-tr" />
                    <span className="corner-crosshair corner-crosshair-bl" />
                    <span className="corner-crosshair corner-crosshair-br" />
                    <div className="tech-label" style={{ fontSize: '9px', marginBottom: '2px' }}>
                      {m.label}
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '12px',
                        color: 'var(--text-primary)',
                        fontWeight: 600,
                      }}
                    >
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Click to inspect prompt pill on bottom-left */}
            <div
              className="layer-float"
              style={{
                position: 'absolute',
                bottom: '24px',
                left: '24px',
                zIndex: 5,
              }}
            >
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedProject(currentProject);
                }}
                className="corner-box"
                data-cursor="hover"
                style={{
                  padding: '10px 18px',
                  backgroundColor: 'rgba(9, 9, 11, 0.9)',
                  backdropFilter: 'blur(10px)',
                  borderColor: 'var(--accent-cyan)',
                  color: 'var(--text-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                }}
              >
                <span className="corner-crosshair corner-crosshair-tl" style={{ borderColor: 'var(--accent-cyan)' }} />
                <span className="corner-crosshair corner-crosshair-tr" style={{ borderColor: 'var(--accent-cyan)' }} />
                <span className="corner-crosshair corner-crosshair-bl" style={{ borderColor: 'var(--accent-cyan)' }} />
                <span className="corner-crosshair corner-crosshair-br" style={{ borderColor: 'var(--accent-cyan)' }} />
                <Maximize2 size={13} color="var(--accent-cyan)" />
                <span>INSPECT ARCHITECTURE [SPACE]</span>
              </button>
            </div>
          </div>
        </div>

        {/* ARCHITECTURAL FILMSTRIP SCRUBBER RIBBON */}
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
            }}
          >
            <div className="tech-label" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Activity size={12} color="var(--accent-cyan)" />
              <span>REPERTORY SCRUBBER // 0{activeIndex + 1} OF 05</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                type="button"
                onClick={handlePrev}
                className="corner-box"
                data-cursor="hover"
                aria-label="Previous project"
                style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}
              >
                <span className="corner-crosshair corner-crosshair-tl" />
                <span className="corner-crosshair corner-crosshair-tr" />
                <span className="corner-crosshair corner-crosshair-bl" />
                <span className="corner-crosshair corner-crosshair-br" />
                <ArrowLeft size={14} />
              </button>

              <button
                type="button"
                onClick={handleNext}
                className="corner-box"
                data-cursor="hover"
                aria-label="Next project"
                style={{ padding: '8px 12px', color: 'var(--text-secondary)' }}
              >
                <span className="corner-crosshair corner-crosshair-tl" />
                <span className="corner-crosshair corner-crosshair-tr" />
                <span className="corner-crosshair corner-crosshair-bl" />
                <span className="corner-crosshair corner-crosshair-br" />
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Scrubber Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '12px',
            }}
          >
            {PROJECTS.map((proj, idx) => {
              const isActive = idx === activeIndex;
              return (
                <div
                  key={proj.id}
                  onClick={() => selectProject(idx)}
                  className="corner-box"
                  data-cursor="hover"
                  style={{
                    padding: '12px',
                    backgroundColor: isActive ? 'var(--bg-elevated)' : 'var(--bg-surface)',
                    borderColor: isActive ? 'var(--accent-cyan)' : 'var(--border-subtle)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <span
                    className="corner-crosshair corner-crosshair-tl"
                    style={isActive ? { borderColor: 'var(--accent-cyan)' } : {}}
                  />
                  <span
                    className="corner-crosshair corner-crosshair-tr"
                    style={isActive ? { borderColor: 'var(--accent-cyan)' } : {}}
                  />
                  <span
                    className="corner-crosshair corner-crosshair-bl"
                    style={isActive ? { borderColor: 'var(--accent-cyan)' } : {}}
                  />
                  <span
                    className="corner-crosshair corner-crosshair-br"
                    style={isActive ? { borderColor: 'var(--accent-cyan)' } : {}}
                  />

                  {/* Thumbnail */}
                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '16 / 9',
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundColor: '#09090b',
                    }}
                  >
                    <Image
                      src={proj.media.src}
                      alt={proj.media.alt}
                      fill
                      sizes="200px"
                      style={{
                        objectFit: 'cover',
                        opacity: isActive ? 1 : 0.6,
                        filter: isActive ? 'none' : 'grayscale(40%)',
                        transition: 'all 0.3s ease',
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '11px',
                        color: isActive ? 'var(--accent-cyan)' : 'var(--text-tertiary)',
                        fontWeight: 600,
                      }}
                    >
                      {proj.number}
                    </span>
                    <span className="tech-label" style={{ fontSize: '9px' }}>
                      {proj.year}
                    </span>
                  </div>

                  <div
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      textTransform: 'uppercase',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {proj.title}
                  </div>

                  {/* Active Progress Bar */}
                  <div
                    style={{
                      height: '2px',
                      backgroundColor: isActive ? 'var(--accent-cyan)' : 'transparent',
                      width: '100%',
                      transition: 'background-color 0.3s ease',
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Detailed Architectural Modal */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}
