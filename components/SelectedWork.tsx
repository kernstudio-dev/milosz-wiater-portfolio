'use client';

import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { useRouter } from 'next/navigation';
import { PinnedSection } from '@/components/PinnedSection';
import { useScrollProgress } from '@/context/ScrollContext';
import { useBubble } from '@/context/BubbleContext';
import { PROJECTS } from '@/data/projects';
import { useLanguage } from '@/context/LanguageContext';

const COLORS = ['#b15ee8', '#e96c24', '#2f6cff', '#43cabc', '#8aa19b'];
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const p = clamp01(value); return p * p * (3 - 2 * p); };

export function SelectedWork() {
  const router = useRouter();
  const navigationTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const projectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeIndexRef = useRef(0);
  const manualProgress = useRef<number | null>(null);
  const progress = useScrollProgress('work');
  const progressRef = useRef(progress);
  const { gridMetrics, setWorkProjectColor } = useBubble();
  const { dictionary } = useLanguage();
  const [opening, setOpening] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [switching, setSwitching] = useState(false);
  progressRef.current = progress;

  const start = 1 / 6;
  const end = .84;
  const raw = clamp01((progress - start) / (end - start)) * (PROJECTS.length - 1);
  const scrollIndex = Math.min(PROJECTS.length - 1, Math.round(raw));
  const horizontal = smooth((progress - .27) / .58);
  const horizontalTravel = horizontal * Math.min(96, Math.max(0, (gridMetrics?.xOffset ?? 48) - 8));
  const entry = smooth((progress - .045) / .115);
  const exit = smooth((progress - .9) / .075);
  const project = PROJECTS[activeIndex];
  const projectCopy = dictionary.projects[project.id];
  const previousProject = previousIndex === null ? null : PROJECTS[previousIndex];
  const href = `/work/${project.id}`;

  const selectProject = useCallback((targetIndex: number, manual = true) => {
    const normalized = (targetIndex + PROJECTS.length) % PROJECTS.length;
    const current = activeIndexRef.current;
    if (normalized === current) return;
    if (projectTimer.current) clearTimeout(projectTimer.current);
    setPreviousIndex(current);
    setDirection(normalized > current || (current === PROJECTS.length - 1 && normalized === 0) ? 1 : -1);
    activeIndexRef.current = normalized;
    setActiveIndex(normalized);
    setSwitching(true);
    if (manual) manualProgress.current = progressRef.current;
    projectTimer.current = setTimeout(() => {
      setPreviousIndex(null);
      setSwitching(false);
    }, 720);
  }, []);

  useEffect(() => {
    if (manualProgress.current !== null && Math.abs(progress - manualProgress.current) < .075) return;
    manualProgress.current = null;
    selectProject(scrollIndex, false);
  }, [progress, scrollIndex, selectProject]);

  useEffect(() => setWorkProjectColor(COLORS[activeIndex]), [activeIndex, setWorkProjectColor]);
  useEffect(() => () => {
    if (navigationTimer.current) clearTimeout(navigationTimer.current);
    if (projectTimer.current) clearTimeout(projectTimer.current);
  }, []);

  const openProject = (event: MouseEvent<HTMLAnchorElement>, destination: string) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    if (opening) return;
    setOpening(true);
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    navigationTimer.current = setTimeout(() => router.push(destination), reduced ? 0 : 320);
  };

  const moveMedia = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - .5) * 7;
    const y = ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - .5) * 5;
    event.currentTarget.style.setProperty('--media-x', `${x.toFixed(2)}px`);
    event.currentTarget.style.setProperty('--media-y', `${y.toFixed(2)}px`);
  };
  const resetMedia = (event: ReactPointerEvent<HTMLAnchorElement>) => {
    event.currentTarget.style.setProperty('--media-x', '0px');
    event.currentTarget.style.setProperty('--media-y', '0px');
  };

  return (
    <PinnedSection id="work">
      <div className="work-layout" style={{ opacity: 1 - exit, transform: `translateY(${-exit * 90}px)` }}>
        <div className="work-heading" style={{ opacity: entry, clipPath: `inset(0 ${(1 - entry) * 100}% 0 0)` }}><h2>{dictionary.work.title}</h2><p>{dictionary.work.intro}</p></div>
        <a href="#footer" className="work-cta">{dictionary.work.cta}</a>
        <div className="work-stage" style={{ opacity: entry, clipPath: `inset(0 ${(1 - entry) * 100}% 0 0)`, transform: `translate3d(${-horizontalTravel}px,${(1 - entry) * 34}px,0)` }} data-active-project={activeIndex}>
          <a className={`work-main-media work-project-link direction-${direction}`} href={href} data-cursor="view" data-cursor-text={dictionary.work.view} aria-label={`${dictionary.work.view} ${project.title}`} onPointerMove={moveMedia} onPointerLeave={resetMedia} onClick={(event) => openProject(event, href)}>
            {switching && previousProject && <img key={`previous-${previousProject.id}`} className="work-media work-media--outgoing" src={previousProject.media.src} alt="" />}
            <img key={project.id} className={`work-media work-media--active ${switching ? 'is-entering' : ''}`} src={project.media.src} alt={projectCopy.mediaAlt} />
          </a>
          <div className="work-thumbs" aria-label={dictionary.work.selectProject}>
            {PROJECTS.map((item, itemIndex) => <button key={item.id} type="button" aria-label={`${dictionary.work.show} ${item.title}`} aria-current={itemIndex === activeIndex ? 'true' : undefined} onClick={() => selectProject(itemIndex)}><img src={item.media.src} alt="" className={itemIndex === activeIndex ? 'is-active' : ''} /><span>{item.number}</span><em>{item.title}</em></button>)}
          </div>
          <a className="work-mobile-media work-project-link" href={href} data-cursor="view" data-cursor-text={dictionary.work.view} aria-label={`${dictionary.work.view} ${project.title}`} onPointerMove={moveMedia} onPointerLeave={resetMedia} onClick={(event) => openProject(event, href)}><img key={`mobile-${project.id}`} className="work-media work-media--active" src={project.media.src} alt={projectCopy.mediaAlt} /></a>
          <div className="work-stack" key={`stack-${project.id}`}>{project.technologies.slice(0, 5).map((technology) => <span key={technology}>{technology.split(' ')[0]}</span>)}</div>
          <div className="work-description" key={`copy-${project.id}-${dictionary.work.title}`}><div className="work-meta"><span>{projectCopy.category}</span><span>{project.year}</span></div><p>{projectCopy.description}</p><p>{projectCopy.longDescription}</p></div>
          <div className="work-controls"><button type="button" onClick={() => selectProject(activeIndex - 1)} aria-label={dictionary.work.previous}>←</button><span className="work-control-index" key={`index-${project.id}`}>{project.number} / 0{PROJECTS.length}</span><button type="button" onClick={() => selectProject(activeIndex + 1)} aria-label={dictionary.work.next}>→</button></div>
          <a className="work-title" href={href} data-cursor="view" data-cursor-text={dictionary.work.view} onClick={(event) => openProject(event, href)}><span key={`title-${project.id}`}>{project.title}</span><span className="work-title-arrow" aria-hidden="true">↗</span></a>
        </div>
      </div>
      <div className={opening ? 'work-page-wipe is-opening' : 'work-page-wipe'} aria-hidden="true"><span>{dictionary.work.opening}</span></div>
      <style jsx>{`
        .work-layout{position:relative;height:100%;display:grid;grid-template-columns:repeat(var(--grid-cols),var(--grid-block-size));grid-template-rows:repeat(12,var(--grid-block-size));overflow:hidden}.work-heading{grid-column:1/8;grid-row:3/4;align-self:end}.work-heading h2{font:200 clamp(30px,2.8vw,42px)/.95 var(--font-display);letter-spacing:-.035em;color:var(--text-secondary)}.work-heading p{margin-top:4px;max-width:520px;font:300 14px/1.2 var(--font-sans);color:var(--text-tertiary)}.work-cta{grid-column:-3/-1;grid-row:3/4;display:flex;align-items:center;justify-content:center;border:1px solid var(--border-primary);color:var(--text-secondary);font-size:15px}
        .work-stage{grid-column:1/-1;grid-row:4/11;position:relative;display:grid;grid-template-columns:repeat(var(--grid-cols),var(--grid-block-size));grid-template-rows:repeat(7,var(--grid-block-size));will-change:transform,clip-path}.work-main-media,.work-mobile-media{position:relative;overflow:hidden;background:#0c0c0e;border:1px solid var(--border-primary)}.work-main-media{grid-column:3/12;grid-row:1/6;margin:15px 15px 0}.work-project-link{display:block;cursor:pointer}.work-media{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:saturate(.86) contrast(1.02);will-change:transform,clip-path}.work-media--active{z-index:2}.work-media--active:not(.is-entering){animation:mediaDrift 9s ease-in-out infinite alternate}.work-media--active.is-entering{animation:mediaIn .72s var(--ease-out-expo) both}.work-media--outgoing{z-index:1;animation:mediaOut .58s var(--ease-in-out-cubic) both}.direction-1{--media-from:9%;--media-to:-5%;--media-clip:inset(0 100% 0 0)}.direction--1{--media-from:-9%;--media-to:5%;--media-clip:inset(0 0 0 100%)}.work-project-link:hover .work-media--active{animation-play-state:paused;transform:translate3d(var(--media-x,0),var(--media-y,0),0) scale(1.022);transition:transform .45s cubic-bezier(.16,1,.3,1)}
        .work-thumbs{grid-column:3/12;grid-row:6/7;display:grid;grid-template-columns:repeat(5,1fr);gap:5px;padding:9px 14px;border:1px solid var(--border-primary);overflow:hidden}.work-thumbs button{position:relative;min-width:0;overflow:hidden;background:#08090a}.work-thumbs button::after{content:'';position:absolute;inset:42% 0 0;background:linear-gradient(transparent,rgba(0,0,0,.8));pointer-events:none}.work-thumbs img{width:100%;height:100%;object-fit:cover;opacity:.24;filter:grayscale(.5);transition:opacity .35s ease,filter .35s ease,transform .45s var(--ease-out-expo)}.work-thumbs button[aria-current='true'] img,.work-thumbs button:hover img{opacity:.96;filter:none}.work-thumbs button:hover img{transform:scale(1.03)}.work-thumbs span,.work-thumbs em{position:absolute;z-index:2;bottom:6px;color:#fff;font:500 8px/1 var(--font-mono);font-style:normal;text-shadow:0 1px 4px #000}.work-thumbs span{left:7px}.work-thumbs em{right:7px;left:28px;overflow:hidden;text-align:right;text-overflow:ellipsis;white-space:nowrap}.work-mobile-media{grid-column:12/15;grid-row:1/7;margin:15px}.work-stack{grid-column:15/16;grid-row:1/7;display:grid;grid-template-rows:repeat(5,1fr);border:1px solid var(--border-primary);animation:copyIn .62s var(--ease-out-expo) both}.work-stack span{display:flex;align-items:center;justify-content:center;border-bottom:1px solid var(--border-primary);font:600 11px/1 var(--font-sans);color:var(--text-quaternary);text-transform:uppercase;overflow:hidden}
        .work-description{grid-column:16/-1;grid-row:1/7;padding:24px;border:1px solid var(--border-primary);overflow:hidden;animation:copyIn .62s var(--ease-out-expo) both}.work-meta{display:flex;justify-content:space-between;gap:12px;margin-bottom:20px;font:500 9px/1.4 var(--font-mono);letter-spacing:.06em;color:var(--text-quaternary);text-transform:uppercase}.work-description p{margin-bottom:18px;font-size:14px;line-height:1.5;color:var(--text-secondary)}.work-description p+p{color:var(--text-tertiary)}.work-controls{grid-column:1/4;grid-row:7/8;display:grid;grid-template-columns:1fr 1.35fr 1fr;border:1px solid var(--border-primary)}.work-controls>*{display:flex;align-items:center;justify-content:center;border-right:1px solid var(--border-primary);font-size:14px;color:var(--text-secondary)}.work-control-index{animation:titleIn .55s var(--ease-out-expo) both}.work-controls button:hover{color:var(--bg-canvas);background:var(--text-primary)}.work-title{grid-column:4/-2;grid-row:7/8;display:flex;align-items:center;justify-content:center;border-block:1px solid var(--border-primary);font-size:22px;color:var(--text-secondary);text-transform:lowercase}.work-title>span:first-child{animation:titleIn .62s var(--ease-out-expo) both}.work-title-arrow{margin-left:16px;font-size:17px;opacity:.45;transition:transform .3s ease,opacity .3s ease}.work-title:hover .work-title-arrow{transform:translate(4px,-4px);opacity:1}
        .work-page-wipe{position:fixed;inset:0;z-index:400;pointer-events:none;display:grid;place-items:center;background:var(--bg-canvas);clip-path:inset(100% 0 0);transition:clip-path .32s cubic-bezier(.65,0,.35,1)}.work-page-wipe.is-opening{clip-path:inset(0)}.work-page-wipe span{color:var(--text-secondary);font:300 14px/1 var(--font-mono);letter-spacing:.08em;text-transform:uppercase}@keyframes mediaIn{from{clip-path:var(--media-clip);transform:translateX(var(--media-from)) scale(1.045)}to{clip-path:inset(0);transform:none}}@keyframes mediaOut{to{transform:translateX(var(--media-to)) scale(.985);opacity:.25}}@keyframes mediaDrift{from{transform:scale(1.002) translate3d(-.25%,0,0)}to{transform:scale(1.012) translate3d(.25%,-.35%,0)}}@keyframes copyIn{from{clip-path:inset(0 0 100%);transform:translateY(18px)}to{clip-path:inset(0);transform:none}}@keyframes titleIn{from{clip-path:inset(0 100% 0 0);transform:translateX(22px)}to{clip-path:inset(0);transform:none}}
        @media(max-width:767px){.work-layout{display:block;padding:110px 20px 30px}.work-heading{margin-bottom:24px}.work-cta{position:absolute;right:20px;top:34px;padding:12px 16px}.work-stage{display:block;transform:none!important}.work-main-media{aspect-ratio:16/10;margin:0}.work-thumbs{height:90px}.work-mobile-media,.work-stack,.work-description p+p{display:none}.work-description{padding:20px 0;border:0}.work-title{min-height:60px;border:1px solid var(--border-primary)}.work-controls{height:54px;margin-top:12px}}@media(prefers-reduced-motion:reduce){.work-media,.work-description,.work-title>span:first-child{animation:none!important}}
      `}</style>
    </PinnedSection>
  );
}
