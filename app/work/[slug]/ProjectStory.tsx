'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent } from 'react';
import type { Project } from '@/data/projects';
import { PROJECTS } from '@/data/projects';
import { CASE_STUDIES, CASE_VISUALS } from '@/data/caseStudies';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import { usePageTransition } from '@/context/TransitionContext';
import { useLenis } from '@/hooks/useLenis';
import { addFrameCallback, FRAME_ORDER } from '@/lib/frameLoop';
import styles from './project.module.css';

interface ProjectStoryProps {
  project: Project;
  next: Project;
}

const clamp = (value: number, min = 0, max = 1) => Math.max(min, Math.min(max, value));
type Vars = CSSProperties & Record<`--${string}`, string | number>;

/**
 * Case study = a sequence of scroll scenes. One rAF loop writes three CSS
 * variables on every [data-scene] element; all motion is CSS reading them:
 *   --p   passes 0→1 while the element travels through the viewport
 *   --pe  entry: 0 when the top touches the viewport bottom → 1 at the top
 *   --ps  sticky: 0→1 across the element's pinned distance (height − 100vh)
 */
function useSceneVariables(root: React.RefObject<HTMLElement | null>, key: string) {
  useEffect(() => {
    const page = root.current;
    if (!page) return;
    const scenes = Array.from(page.querySelectorAll<HTMLElement>('[data-scene]'));
    const tracks = Array.from(page.querySelectorAll<HTMLElement>('[data-track]'));
    let lastY = Number.NaN;
    let lastVh = Number.NaN;
    let dirty = true;
    const measureTracks = () => {
      tracks.forEach((track) => {
        const distance = Math.max(0, track.scrollWidth - window.innerWidth);
        (track.closest('[data-scene]') as HTMLElement | null)?.style.setProperty('--track', `${distance}px`);
      });
    };
    const update = () => {
      const vh = window.innerHeight;
      const y = window.scrollY;
      if (!dirty && y === lastY && vh === lastVh) return;
      dirty = false;
      lastY = y;
      lastVh = vh;
      // Read every rect first, then write: no forced layout between scenes.
      const rects = scenes.map((scene) => scene.getBoundingClientRect());
      scenes.forEach((scene, index) => {
        const rect = rects[index];
        if (rect.bottom < -vh * .5 || rect.top > vh * 1.5) return;
        const p = clamp((vh - rect.top) / (rect.height + vh));
        const pe = clamp((vh - rect.top) / vh);
        const ps = clamp(-rect.top / Math.max(1, rect.height - vh));
        scene.style.setProperty('--p', p.toFixed(4));
        scene.style.setProperty('--pe', pe.toFixed(4));
        scene.style.setProperty('--ps', ps.toFixed(4));
        if (pe > .18 && !scene.dataset.in) scene.dataset.in = 'true';
      });
    };
    const onResize = () => { measureTracks(); dirty = true; };
    measureTracks();
    update();
    // On the page's frame clock right after Lenis: variables are computed from
    // the scroll position of this frame, including the first frame of a gesture.
    const stop = addFrameCallback(update, FRAME_ORDER.SCENE);
    window.addEventListener('resize', onResize, { passive: true });
    const settle = window.setTimeout(onResize, 400);
    return () => {
      stop();
      window.clearTimeout(settle);
      window.removeEventListener('resize', onResize);
    };
  }, [root, key]);
}

export function ProjectStory({ project, next }: ProjectStoryProps) {
  const { theme, toggleTheme } = useTheme();
  const { language, dictionary, toggleLanguage } = useLanguage();
  const { pageReady, openProject, wipeTo, prefetch } = usePageTransition();
  const pageRef = useRef<HTMLElement>(null);
  const heroImage = useRef<HTMLImageElement>(null);
  const nextPreview = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [smooth, setSmooth] = useState(false);
  const copy = dictionary.projects[project.id];
  const story = CASE_STUDIES[language][project.id];
  const visuals = CASE_VISUALS[project.id];
  const nextCopy = dictionary.projects[next.id];
  const index = PROJECTS.findIndex((item) => item.id === project.id);
  const titleLines = project.title.split(' / ');
  const nextLines = next.title.split(' / ');
  const statementWords = story.statement.split(' ');

  useLenis(smooth);
  useSceneVariables(pageRef, `${project.id}-${language}`);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
    setSmooth(window.matchMedia('(min-width: 768px) and (pointer: fine)').matches);
    prefetch(`/work/${next.id}`);
    prefetch('/');
    let done = false;
    const reveal = () => {
      if (done) return;
      done = true;
      pageReady();
      window.setTimeout(() => setReady(true), 120);
    };
    const image = heroImage.current;
    if (image?.complete) reveal();
    else image?.addEventListener('load', reveal, { once: true });
    const cap = window.setTimeout(reveal, 1400);
    return () => window.clearTimeout(cap);
  }, [pageReady, prefetch, next.id]);

  const back = useCallback((event: MouseEvent<HTMLAnchorElement>, href: string, label: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (href.includes('work')) {
      try { sessionStorage.setItem('kern-return', JSON.stringify({ section: 'work', project: index })); } catch { /* storage unavailable */ }
    }
    wipeTo(href.split('#')[0] || '/', label);
  }, [index, wipeTo]);

  const openNext = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    const rect = nextPreview.current?.getBoundingClientRect() ?? new DOMRect(0, 0, window.innerWidth, window.innerHeight);
    openProject({ href: `/work/${next.id}`, src: next.media.src, rect, label: next.title });
  };

  const crop = (i: number): Vars => {
    const c = visuals.crops[i % visuals.crops.length];
    return { '--cx': `${c.x}%`, '--cy': `${c.y}%`, '--zoom': c.zoom };
  };

  // System tour: the camera visits each build point on the full interface.
  // Focal points are clamped so the zoomed image always covers its frame.
  const ZOOM = 2.1;
  const edge = 50 / ZOOM;
  const focus = (v: number) => Math.min(100 - edge, Math.max(edge, v));
  const tour: Vars = { '--zmax': ZOOM };
  visuals.crops.slice(0, 4).forEach((c, i) => {
    tour[`--x${i}`] = focus(c.x);
    tour[`--y${i}`] = focus(c.y);
  });

  const total = String(PROJECTS.length).padStart(2, '0');
  const mark = (number: string, label: string, light = false) => (
    <div className={`${styles.mark} ${light ? styles.markLight : ''}`}>
      <i aria-hidden="true" />
      <span className={styles.markNum}>{number}</span>
      <span className={styles.markLabel}>{label}</span>
    </div>
  );

  return (
    <main
      ref={pageRef}
      className={`${styles.page} ${ready ? styles.ready : ''}`}
      data-language={language}
      data-project={project.id}
      style={{ '--accent': visuals.accent } as Vars}
    >
      <header className={styles.header}>
        <a href="/" className={styles.brand} onClick={(event) => back(event, '/', 'KERN')}><span>KE</span>RN</a>
        <nav className={styles.headerControls}>
          <button type="button" className={styles.control} onClick={toggleLanguage} aria-label={dictionary.caseStudy.switchLanguage}>
            <span className={language === 'en' ? styles.activeOption : ''}>EN</span><i>/</i><span className={language === 'pl' ? styles.activeOption : ''}>PL</span>
          </button>
          <button type="button" className={styles.control} onClick={toggleTheme} aria-label={dictionary.caseStudy.switchTheme}>{theme === 'dark' ? dictionary.navigation.light : dictionary.navigation.dark}</button>
          <a href="/#work" className={styles.back} onClick={(event) => back(event, '/#work', dictionary.caseStudy.back)}><i>←</i> {dictionary.caseStudy.back}</a>
        </nav>
      </header>

      {/* The page's route: one rail in the left gutter, a station at every chapter. */}
      <div className={styles.rail} aria-hidden="true" />

      {/* 00 — PROJECT: full-bleed (matches the route transition), insets into a framed window */}
      <section className={styles.hero} data-scene>
        <div className={styles.heroSticky}>
          <div className={styles.heroMedia}>
            <img ref={heroImage} src={project.media.src} alt={copy.mediaAlt} />
            <span className={styles.heroShade} />
          </div>
          <span className={styles.heroCorners} aria-hidden="true"><i /><i /><i /><i /></span>
          <div className={styles.heroCopy}>
            <div className={styles.kicker}>
              <span>{dictionary.caseStudy.project} / {project.number}</span>
              <span>{copy.category}</span>
              <span>{project.year}</span>
            </div>
            <h1 className={styles.heroTitle} aria-label={project.title}>
              {titleLines.map((line, i) => (
                <span className={styles.line} key={line}><span style={{ '--d': `${.18 + i * .1}s` } as Vars}>{line}</span></span>
              ))}
            </h1>
            <div className={styles.heroFoot}>
              <p className={styles.subtitle}>{copy.subtitle}</p>
              <span className={styles.scrollCue}>{dictionary.caseStudy.scroll}<i /></span>
            </div>
          </div>
        </div>
      </section>

      {/* 01 — CONTEXT: oversized statement, index column, floating detail */}
      <section className={styles.statement} data-scene>
        <div className={styles.statementHead}>{mark('01', dictionary.caseStudy.overview)}</div>
        <div className={styles.statementAside}>
          <span className={styles.statementIndex}>{project.number}<small>/ {total}</small></span>
          <span className={styles.statementCategory}>{copy.category}</span>
        </div>
        <p className={styles.statementText} style={{ '--n': statementWords.length } as Vars}>
          {statementWords.map((word, i) => <span key={`${word}-${i}`} style={{ '--i': i } as Vars}>{word} </span>)}
        </p>
        <figure className={styles.detail} style={crop(2)}>
          <div className={styles.detailMedia}><img src={project.media.src} alt="" /></div>
          <figcaption><span>{dictionary.caseStudy.figure} 01</span>{story.build[1]?.title}</figcaption>
        </figure>
        <dl className={styles.facts}>
          <div style={{ '--d': '0s' } as Vars}><dt>{dictionary.caseStudy.role}</dt><dd>{copy.role}</dd></div>
          <div style={{ '--d': '.08s' } as Vars}><dt>{dictionary.caseStudy.technology}</dt><dd>{project.technologies.join(' / ')}</dd></div>
          <div style={{ '--d': '.16s' } as Vars}><dt>{dictionary.caseStudy.deliverables}</dt><dd>{copy.deliverables.join(' / ')}</dd></div>
          <div style={{ '--d': '.24s' } as Vars}><dt>{dictionary.caseStudy.year}</dt><dd>{project.year}</dd></div>
        </dl>
      </section>

      {/* 02 — CHALLENGE: sticky cinematic crop, statement reveals over it */}
      <section className={styles.challenge} data-scene>
        <div className={styles.challengeSticky}>
          <div className={styles.challengeMedia} style={crop(0)}><img src={project.media.src} alt="" /></div>
          <div className={styles.challengeCopy}>
            {mark('02', dictionary.caseStudy.challenge, true)}
            <h2>{story.challengeTitle}</h2>
            <p>{story.challenge}</p>
          </div>
        </div>
      </section>

      {/* 03 — SYSTEM: the full interface as an annotated map; the camera tours each build point */}
      <section className={styles.system} data-scene style={tour}>
        <div className={styles.systemSticky}>
          <div className={styles.systemHead}>
            {mark('03', dictionary.caseStudy.build)}
            <span className={styles.systemCount}>01<i>—</i>{String(story.build.length).padStart(2, '0')}</span>
          </div>
          <div className={styles.systemBody}>
            <figure className={styles.blueprint}>
              <div className={styles.bpFrame}>
                <div className={styles.bpZoom}><img src={project.media.src} alt={copy.mediaAlt} /></div>
                {visuals.crops.slice(0, 4).map((c, i) => (
                  <span key={i} className={styles.bpMarker} style={{ '--mx': c.x, '--my': c.y, '--i': i } as Vars} aria-hidden="true">
                    <b>{String(i + 1).padStart(2, '0')}</b>
                  </span>
                ))}
              </div>
              <span className={styles.bpRulerX} aria-hidden="true" />
              <span className={styles.bpRulerY} aria-hidden="true" />
              <figcaption><span>{dictionary.caseStudy.figure} 03</span>{dictionary.caseStudy.systemMap}</figcaption>
            </figure>
            <ol className={styles.bpList}>
              {story.build.map((item, i) => (
                <li key={item.title} style={{ '--i': i } as Vars}>
                  <span className={styles.bpIndex}>{String(i + 1).padStart(2, '0')}</span>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
          <div className={styles.buildRail}><i /></div>
        </div>
      </section>

      {/* 04 — APPROACH: a purely typographic spread */}
      <section className={styles.approach} data-scene>
        {mark('04', dictionary.caseStudy.approach)}
        <h2 className={styles.approachTitle}>{story.approachTitle}</h2>
        <div className={styles.approachGrid}>
          <span className={styles.approachAside}>{copy.subtitle}</span>
          <p className={styles.approachText}>{story.approach}</p>
          <div className={styles.stack}>
            <span className={styles.stackLabel}>{dictionary.caseStudy.stack}</span>
            <ol>
              {project.technologies.map((technology, i) => (
                <li key={technology}><span>{String(i + 1).padStart(2, '0')}</span>{technology}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* 05 — RESULT: the product, framed and staged */}
      <section className={styles.result} data-scene>
        <div className={styles.resultSticky}>
          <div className={styles.resultStage}>
            <div className={styles.browser}>
              <div className={styles.browserBar} aria-hidden="true">
                <i /><i /><i />
                <span>{project.title}</span>
              </div>
              <div className={styles.browserMedia}><img src={project.media.src} alt={`${project.title} — ${dictionary.caseStudy.finalExperience}`} /></div>
            </div>
          </div>
          <div className={styles.resultCard}>
            {mark('05', dictionary.caseStudy.result)}
            <p>{story.closing}</p>
            <span className={styles.resultMeta}>{copy.category} · {project.year}</span>
          </div>
        </div>
      </section>

      {/* 06 — NEXT: the route continues into the next project */}
      <section className={styles.next} data-scene style={{ '--lines': nextLines.length } as Vars}>
        <div className={styles.nextSticky}>
          <a
            href={`/work/${next.id}`}
            className={styles.nextLink}
            data-cursor="view"
            data-cursor-text={dictionary.work.view}
            aria-label={`${dictionary.caseStudy.viewNext}: ${next.title}`}
            onClick={openNext}
          >
            <span className={styles.nextHead}>{mark('06', dictionary.caseStudy.nextProject)}</span>
            <span className={styles.nextCount}>{next.number} / {total}</span>
            <span className={styles.nextNumber} aria-hidden="true">{next.number}</span>
            <span className={styles.nextRoute} aria-hidden="true"><i /></span>
            <div className={styles.nextPreview} ref={nextPreview}><img src={next.media.src} alt={nextCopy.mediaAlt} /></div>
            <span className={styles.nextTitle}>
              {nextLines.map((line) => <span className={styles.line} key={line}><span>{line}</span></span>)}
            </span>
            <span className={styles.nextMeta}>{nextCopy.category}<i>↗</i></span>
          </a>
          <div className={styles.nextFoot}>
            <a href="/#work" onClick={(event) => back(event, '/#work', dictionary.caseStudy.back)}>← {dictionary.caseStudy.allWork}</a>
            <span>KERN © 2026</span>
          </div>
        </div>
      </section>
    </main>
  );
}
