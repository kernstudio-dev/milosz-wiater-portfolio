'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState, type MouseEvent } from 'react';
import type { Project } from '@/data/projects';
import { useLanguage } from '@/context/LanguageContext';
import { useTheme } from '@/context/ThemeContext';
import styles from './project.module.css';

interface ProjectStoryProps {
  project: Project;
  next: Project;
}

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

export function ProjectStory({ project, next }: ProjectStoryProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { language, dictionary, toggleLanguage } = useLanguage();
  const pageRef = useRef<HTMLElement>(null);
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [opening, setOpening] = useState(false);
  const [openingLabel, setOpeningLabel] = useState(dictionary.caseStudy.opening);
  const copy = dictionary.projects[project.id];
  const nextCopy = dictionary.projects[next.id];

  useEffect(() => setOpeningLabel(dictionary.caseStudy.opening), [dictionary]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const page = pageRef.current;
    if (!page) return;

    const revealItems = Array.from(page.querySelectorAll<HTMLElement>('[data-reveal]'));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.setAttribute('data-visible', 'true');
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
    revealItems.forEach((item) => observer.observe(item));

    let frame = 0;
    const updateMotion = () => {
      frame = 0;
      const height = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      page.style.setProperty('--page-progress', String(clamp(window.scrollY / height, 0, 1)));
      page.querySelectorAll<HTMLElement>('[data-parallax]').forEach((element) => {
        const bounds = element.getBoundingClientRect();
        const distance = window.innerHeight * .5 - (bounds.top + bounds.height * .5);
        element.style.setProperty('--media-shift', `${clamp(distance * .055, -46, 46).toFixed(2)}px`);
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(updateMotion);
    };
    updateMotion();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      observer.disconnect();
      if (frame) cancelAnimationFrame(frame);
      if (navigationTimer.current) clearTimeout(navigationTimer.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [project.id]);

  const openDestination = useCallback((event: MouseEvent<HTMLAnchorElement>, destination: string, label: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (opening) return;
    setOpeningLabel(label);
    setOpening(true);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    navigationTimer.current = setTimeout(() => router.push(destination), reduced ? 0 : 440);
  }, [opening, router]);

  return (
    <main ref={pageRef} className={styles.page} data-language={language}>
      <header className={styles.header}>
        <Link href="/#work" className={styles.brand} onClick={(event) => openDestination(event, '/#work', dictionary.caseStudy.back)}><span>KE</span>RN</Link>
        <div className={styles.headerControls}>
          <button type="button" className={styles.control} onClick={toggleLanguage} aria-label={dictionary.caseStudy.switchLanguage}>
            <span className={language === 'en' ? styles.activeOption : ''}>EN</span><i>/</i><span className={language === 'pl' ? styles.activeOption : ''}>PL</span>
          </button>
          <button type="button" className={styles.control} onClick={toggleTheme} aria-label={dictionary.caseStudy.switchTheme}>{theme === 'dark' ? dictionary.navigation.light : dictionary.navigation.dark}</button>
          <Link href="/#work" className={styles.back} onClick={(event) => openDestination(event, '/#work', dictionary.caseStudy.back)}>← {dictionary.caseStudy.back}</Link>
        </div>
      </header>

      <article className={styles.article}>
        <section className={styles.hero}>
          <div className={styles.kicker}>
            <span>{dictionary.caseStudy.caseStudy} / {project.number}</span>
            <span>{copy.category}</span>
            <span>{project.year}</span>
          </div>
          <div className={styles.titleMask}><h1>{project.title}</h1></div>
          <div className={styles.heroLead}>
            <p className={styles.subtitle}>{copy.subtitle}</p>
            <span className={styles.scrollCue}>{dictionary.caseStudy.scroll} <i>↓</i></span>
          </div>
          <div className={styles.heroMedia} data-parallax>
            <img src={project.media.src} alt={copy.mediaAlt} />
            <span className={styles.mediaIndex}>{project.number} / 05</span>
          </div>
        </section>

        <section className={styles.intro} data-reveal>
          <span className={styles.label}>{dictionary.caseStudy.overview}</span>
          <p>{copy.description}</p>
          <p>{copy.longDescription}</p>
        </section>

        <figure className={`${styles.fullVisual} ${styles.revealVisual}`} data-reveal data-parallax>
          <div className={styles.visualMask}><img src={project.media.src} alt={`${project.title} — ${dictionary.caseStudy.selectedDetail}`} /></div>
          <figcaption>{dictionary.caseStudy.selectedDetail}</figcaption>
        </figure>

        <section className={styles.challenge} data-reveal>
          <div>
            <span className={styles.label}>{dictionary.caseStudy.challenge}</span>
            <h2>{dictionary.caseStudy.challengeTitle}</h2>
          </div>
          <p>{copy.description}</p>
          <div>
            <span className={styles.label}>{dictionary.caseStudy.idea}</span>
            <p>{dictionary.caseStudy.ideaCopy}</p>
          </div>
        </section>

        <section className={styles.processVisual} data-reveal>
          <div className={styles.processFrame} data-parallax>
            <img src={project.media.src} alt={`${project.title} — ${dictionary.caseStudy.experience}`} />
          </div>
          <div className={styles.processCaption}>
            <span className={styles.label}>{dictionary.caseStudy.experience}</span>
            <p>{dictionary.caseStudy.experienceCopy}</p>
          </div>
        </section>

        <section className={styles.detailMoment} data-reveal>
          <div className={styles.detailCopy}>
            <span className={styles.label}>{dictionary.caseStudy.detail}</span>
            <h2>{dictionary.caseStudy.detailTitle}</h2>
            <p>{dictionary.caseStudy.detailCopy}</p>
          </div>
          <div className={`${styles.detailCrop} ${styles.detailCropWide}`} data-parallax><img src={project.media.src} alt="" /></div>
          <div className={`${styles.detailCrop} ${styles.detailCropTall}`} data-parallax><img src={project.media.src} alt="" /></div>
        </section>

        <section className={styles.facts} data-reveal>
          <div><span className={styles.label}>{dictionary.caseStudy.role}</span><p>{copy.role}</p></div>
          <div><span className={styles.label}>{dictionary.caseStudy.technology}</span><p>{project.technologies.join(' / ')}</p></div>
          <div><span className={styles.label}>{dictionary.caseStudy.process}</span><p>{copy.deliverables.join(' / ')}</p></div>
        </section>

        <figure className={`${styles.finalVisual} ${styles.revealVisual}`} data-reveal data-parallax>
          <div className={styles.visualMask}><img src={project.media.src} alt={`${project.title} — ${dictionary.caseStudy.finalExperience}`} /></div>
          <figcaption>{dictionary.caseStudy.finalExperience} / {project.year}</figcaption>
        </figure>

        <Link href={`/work/${next.id}`} className={styles.next} data-cursor="view" data-cursor-text={dictionary.work.view} onClick={(event) => openDestination(event, `/work/${next.id}`, dictionary.caseStudy.nextProject)}>
          <img src={next.media.src} alt={nextCopy.mediaAlt} />
          <span>{dictionary.caseStudy.nextProject}</span>
          <strong>{next.title}</strong>
          <i>↗</i>
        </Link>
      </article>
      <div className={`${styles.pageWipe} ${opening ? styles.pageWipeOpening : ''}`} aria-hidden="true"><span>{openingLabel}</span></div>
    </main>
  );
}
