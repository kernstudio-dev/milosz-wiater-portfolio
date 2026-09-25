'use client';

import { useCallback, useEffect, useRef, useState, type MouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { PinnedSection } from '@/components/PinnedSection';
import { useScene } from '@/hooks/useScene';
import { useBubble } from '@/context/BubbleContext';
import { usePageTransition } from '@/context/TransitionContext';
import { PROJECTS } from '@/data/projects';
import { useLanguage } from '@/context/LanguageContext';

const COLORS = ['#b15ee8', '#e96c24', '#2f6cff', '#43cabc', '#8aa19b'];
const COUNT = PROJECTS.length;
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const p = clamp01(value); return p * p * (3 - 2 * p); };
const SCROLL_START = 1 / 6;
const SCROLL_END = .8;
const SWITCH_MS = 1150;

/** Section progress at which the viewer rests on project `index` (used when returning from a case study). */
export function workProgressForProject(index: number) {
  const clamped = Math.max(0, Math.min(COUNT - 1, index));
  return SCROLL_START + (clamped / (COUNT - 1)) * (SCROLL_END - SCROLL_START) + .004;
}

export function SelectedWork() {
  const { openProject, prefetch } = usePageTransition();
  const projectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeIndexRef = useRef(0);
  const manualProgress = useRef<number | null>(null);
  const changeId = useRef(0);
  const { progress, enter, leave: leaveWindow } = useScene('work');
  const progressRef = useRef(progress);
  const { setWorkProjectColor } = useBubble();
  const { dictionary } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [previous, setPrevious] = useState<{ index: number; direction: 1 | -1; id: number } | null>(null);
  progressRef.current = progress;

  const raw = clamp01((progress - SCROLL_START) / (SCROLL_END - SCROLL_START)) * (COUNT - 1);
  const scrollIndex = Math.min(COUNT - 1, Math.round(raw));
  const isManual = manualProgress.current !== null;
  const railPosition = isManual ? activeIndex : raw;

  // Entry choreography inside the overlap window: heading → viewport opens → info → scrubber.
  const heading = smooth((enter - .42) / .3);
  const viewport = smooth((enter - .48) / .4);
  const info = smooth((enter - .6) / .3);
  const scrub = smooth((enter - .68) / .3);
  // Exit: info and scrubber leave first, the viewport closes while Services arrives.
  const leave = smooth(leaveWindow / .32);
  const viewportLeave = smooth((leaveWindow - .06) / .36);

  const project = PROJECTS[activeIndex];
  const copy = dictionary.projects[project.id];
  const previousProject = previous ? PROJECTS[previous.index] : null;
  const direction = previous?.direction ?? 1;
  const href = `/work/${project.id}`;

  const selectProject = useCallback((targetIndex: number, manual = true) => {
    const normalized = (targetIndex + COUNT) % COUNT;
    const current = activeIndexRef.current;
    if (normalized === current) return;
    if (projectTimer.current) clearTimeout(projectTimer.current);
    changeId.current += 1;
    const forward = normalized > current || (current === COUNT - 1 && normalized === 0 && manual);
    setPrevious({ index: current, direction: forward ? 1 : -1, id: changeId.current });
    activeIndexRef.current = normalized;
    setActiveIndex(normalized);
    if (manual) manualProgress.current = progressRef.current;
    projectTimer.current = setTimeout(() => setPrevious(null), SWITCH_MS);
  }, []);

  // Scroll drives the viewer unless the user just picked a project manually.
  useEffect(() => {
    if (manualProgress.current !== null && Math.abs(progress - manualProgress.current) < .06) return;
    manualProgress.current = null;
    selectProject(scrollIndex, false);
  }, [progress, scrollIndex, selectProject]);

  useEffect(() => setWorkProjectColor(COLORS[activeIndex]), [activeIndex, setWorkProjectColor]);
  useEffect(() => { prefetch(`/work/${PROJECTS[activeIndex].id}`); }, [activeIndex, prefetch]);
  useEffect(() => () => { if (projectTimer.current) clearTimeout(projectTimer.current); }, []);

  const open = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    const media = event.currentTarget.closest('[data-work-viewport]') ?? event.currentTarget;
    openProject({ href, src: project.media.src, rect: media.getBoundingClientRect(), label: project.title });
  };

  const moveMedia = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - .5) * 14;
    const y = ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - .5) * 10;
    event.currentTarget.style.setProperty('--media-x', `${x.toFixed(2)}px`);
    event.currentTarget.style.setProperty('--media-y', `${y.toFixed(2)}px`);
  };
  const resetMedia = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--media-x', '0px');
    event.currentTarget.style.setProperty('--media-y', '0px');
  };

  const pad = (n: number) => String(n).padStart(2, '0');
  const titleLines = (title: string) => title.split(' / ');

  return (
    <PinnedSection id="work">
      <div className={`work-layout dir-${direction > 0 ? 'fwd' : 'back'}`} data-active-project={activeIndex}>
        <div className="work-heading">
          <h2 className="mask"><span style={{ transform: `translate3d(0,${(1 - heading) * 105 - leave * 105}%,0)` }}>{dictionary.work.title}</span></h2>
          <p style={{ opacity: heading * (1 - leave), transform: `translate3d(0,${(1 - heading) * 12}px,0)` }}>{dictionary.work.intro}</p>
        </div>
        <a href="#footer" className="work-cta" style={{ clipPath: `inset(0 0 0 ${(1 - heading + leave) * 100}%)` }}>{dictionary.work.cta}</a>

        {/* Dominant viewport — the whole surface is the VIEW link. */}
        <div
          className="work-viewport"
          data-work-viewport
          style={{ clipPath: `inset(${(1 - viewport) * 50}% 0 ${Math.max((1 - viewport) * 50, viewportLeave * 100)}% 0)` }}
        >
          <a
            className="work-media-link"
            href={href}
            data-cursor="view"
            data-cursor-text={dictionary.work.view}
            aria-label={`${dictionary.work.view} ${project.title}`}
            onPointerMove={moveMedia}
            onPointerLeave={resetMedia}
            onClick={open}
          >
            <span className="media-zoom" style={{ transform: `scale(${(1.08 - viewport * .08).toFixed(4)})` }}>
            {previousProject && (
              <span className="media-layer is-out" key={`out-${previous!.id}`} aria-hidden="true">
                <img src={previousProject.media.src} alt="" />
              </span>
            )}
            <span className={`media-layer ${previous ? 'is-in' : 'is-idle'}`} key={`in-${project.id}-${previous?.id ?? 0}`}>
              <img src={project.media.src} alt={copy.mediaAlt} />
            </span>
            </span>
            <span className="media-shade" aria-hidden="true" />
            <span className="media-caption" aria-hidden="true">
              <span className="mask"><span key={`cap-${project.id}`} className={previous ? 'cap-in' : ''}>{copy.category}</span></span>
              <span>{project.year}</span>
            </span>
          </a>
        </div>

        {/* Info column — index, title, meta. Leaves before the viewport closes. */}
        <aside className="work-info" style={{ opacity: 1 - leave, transform: `translate3d(0,${-leave * 40}px,0)` }}>
          <div className="work-index" style={{ clipPath: `inset(0 0 ${(1 - info) * 100}% 0)` }}>
            <span className="roll">
              {previous && <span key={`o${previous.id}`} className="roll-out">{pad(previous.index + 1)}</span>}
              <span key={`i${activeIndex}-${previous?.id ?? 0}`} className={previous ? 'roll-in' : ''}>{project.number}</span>
            </span>
            <small>/ {pad(COUNT)}</small>
          </div>

          <div className="work-title-stage" style={{ clipPath: `inset(0 0 ${(1 - info) * 100}% 0)` }}>
            {previousProject && (
              <a className="work-title is-out" key={`t-out-${previous!.id}`} aria-hidden="true" tabIndex={-1}>
                {titleLines(previousProject.title).map((line) => <span className="mask" key={line}><span>{line}</span></span>)}
              </a>
            )}
            <a
              className={`work-title ${previous ? 'is-in' : ''}`}
              key={`t-in-${project.id}-${previous?.id ?? 0}`}
              href={href}
              data-cursor="view"
              data-cursor-text={dictionary.work.view}
              onClick={open}
            >
              {titleLines(project.title).map((line) => <span className="mask" key={line}><span>{line}</span></span>)}
            </a>
          </div>

          <div className="work-copy" key={`copy-${project.id}-${previous?.id ?? 0}`} style={{ opacity: scrub }}>
            <p className={previous ? 'copy-in' : ''}>{copy.description}</p>
            <ul className={previous ? 'copy-in copy-in--late' : ''}>
              {project.technologies.slice(0, 4).map((technology) => <li key={technology}>{technology}</li>)}
            </ul>
          </div>

          <a className="work-open" href={href} onClick={open} style={{ opacity: scrub }}>
            <span>{dictionary.caseStudy.caseStudy}</span>
            <i aria-hidden="true">↗</i>
          </a>
        </aside>

        {/* Scrubber — thumbnails + continuous scroll indicator. */}
        <div className="work-scrubber" style={{ clipPath: `inset(0 ${(1 - scrub) * 100}% 0 0)`, opacity: 1 - leave }} aria-label={dictionary.work.selectProject}>
          <div className="scrub-track">
            {PROJECTS.map((item, itemIndex) => (
              <button
                key={item.id}
                type="button"
                className={itemIndex === activeIndex ? 'is-active' : ''}
                aria-label={`${dictionary.work.show} ${item.title}`}
                aria-current={itemIndex === activeIndex ? 'true' : undefined}
                onClick={() => selectProject(itemIndex)}
              >
                <img src={item.media.src} alt="" />
                <span>{item.number}</span>
              </button>
            ))}
            <i className="scrub-indicator" style={{ transform: `translate3d(${railPosition * 100}%,0,0)` }} aria-hidden="true" />
          </div>
        </div>

        <div className="work-controls" style={{ clipPath: `inset(0 0 0 ${(1 - scrub) * 100}%)`, opacity: 1 - leave }}>
          <button type="button" onClick={() => selectProject(activeIndex - 1)} aria-label={dictionary.work.previous}><span>←</span></button>
          <button type="button" onClick={() => selectProject(activeIndex + 1)} aria-label={dictionary.work.next}><span>→</span></button>
        </div>
      </div>

      <style jsx>{`
        .work-layout { position: relative; height: 100%; display: grid; grid-template-columns: repeat(var(--grid-cols),var(--grid-block-size)); grid-template-rows: repeat(12,var(--grid-block-size)); overflow: hidden; }
        .mask { display: block; overflow: hidden; }
        .mask > span { display: block; will-change: transform; }

        .work-heading { grid-column: 1 / 11; grid-row: 2 / 4; align-self: end; padding-bottom: 6px; }
        .work-heading h2 { font: 200 clamp(30px,2.8vw,42px)/1 var(--font-display); letter-spacing: -.035em; color: var(--text-primary); }
        .work-heading p { margin-top: 6px; max-width: 520px; font: 300 14px/1.3 var(--font-sans); color: var(--text-tertiary); }
        .work-cta { grid-column: -3 / -1; grid-row: 3 / 4; display: flex; align-items: center; justify-content: center; border: 1px solid var(--border-primary); color: var(--text-secondary); font-size: 15px; transition: background .3s ease, color .3s ease; }
        .work-cta:hover { background: var(--text-primary); color: var(--bg-canvas); }

        .work-viewport { grid-column: 3 / -6; grid-row: 4 / 10; position: relative; will-change: clip-path; }
        .work-media-link { position: absolute; inset: 0; display: block; overflow: hidden; background: #0b0b0c; }
        .media-zoom { position: absolute; inset: 0; display: block; }
        .media-layer { position: absolute; inset: 0; overflow: hidden; }
        .media-layer img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
        .is-idle img, .is-in img { transition: translate .9s var(--ease-out-expo); translate: var(--media-x,0) var(--media-y,0); }
        .is-idle { animation: drift 14s ease-in-out infinite alternate; }
        .is-in { z-index: 2; animation: mediaIn 1.1s var(--ease-out-expo) both; }
        .is-in img { animation: mediaScale 1.3s var(--ease-out-expo) both; }
        .is-out { z-index: 1; animation: mediaOut 1s var(--ease-in-out-cubic) both; }
        .dir-back .is-in { animation-name: mediaInBack; }
        .dir-back .is-out { animation-name: mediaOutBack; }
        .media-shade { position: absolute; inset: 0; z-index: 3; pointer-events: none; background: linear-gradient(180deg, transparent 62%, rgba(0,0,0,.55)); }
        .media-caption { position: absolute; z-index: 4; left: 18px; right: 18px; bottom: 14px; display: flex; justify-content: space-between; color: #fff; font: 500 10px/1.2 var(--font-mono); letter-spacing: .09em; text-transform: uppercase; pointer-events: none; }
        .cap-in { animation: lineIn .8s .25s var(--ease-out-expo) both; }
        .work-media-link:hover .is-idle img { transform: scale(1.025); transition: transform 1.1s var(--ease-out-expo), translate .9s var(--ease-out-expo); }
        .work-media-link::after { content: ''; position: absolute; inset: 0; z-index: 5; border: 1px solid var(--media-border); pointer-events: none; }

        .work-info { grid-column: -6 / -1; grid-row: 4 / 11; display: flex; flex-direction: column; padding: 0 0 0 28px; min-width: 0; }
        .work-index { display: flex; align-items: baseline; gap: 10px; font: 200 clamp(56px,5.2vw,96px)/.9 var(--font-display); letter-spacing: -.06em; color: var(--text-primary); }
        .work-index small { font: 500 11px/1 var(--font-mono); letter-spacing: .08em; color: var(--text-tertiary); }
        .roll { position: relative; display: inline-block; height: .92em; overflow: hidden; min-width: 1.1em; }
        .roll > span { display: block; }
        .roll-out { position: absolute; inset: 0 auto auto 0; animation: rollOut .6s var(--ease-in-out-cubic) both; }
        .roll-in { animation: rollIn .85s .1s var(--ease-out-expo) both; }
        .dir-back .roll-out { animation-name: rollOutBack; }
        .dir-back .roll-in { animation-name: rollInBack; }

        .work-title-stage { position: relative; margin-top: 26px; min-height: 2.3em; font: 200 clamp(28px,2.55vw,46px)/1.02 var(--font-display); letter-spacing: -.045em; }
        .work-title { display: block; color: var(--text-primary); text-transform: uppercase; }
        .work-title.is-out { position: absolute; inset: 0 0 auto 0; pointer-events: none; }
        .is-in.work-title .mask > span { animation: lineIn .9s var(--ease-out-expo) both; }
        .is-in.work-title .mask:nth-child(2) > span { animation-delay: .08s; }
        .is-out.work-title .mask > span { animation: lineOut .5s var(--ease-in-out-cubic) both; }
        .dir-back .is-in.work-title .mask > span { animation-name: lineInBack; }
        .dir-back .is-out.work-title .mask > span { animation-name: lineOutBack; }
        .work-title .mask > span { transition: transform .6s var(--ease-out-expo); }
        .work-title:hover .mask > span { transform: translateX(8px); }

        .work-copy { margin-top: auto; }
        .work-copy p { font: 300 14px/1.55 var(--font-sans); color: var(--text-secondary); display: -webkit-box; -webkit-line-clamp: 4; -webkit-box-orient: vertical; overflow: hidden; }
        .work-copy ul { list-style: none; display: flex; flex-wrap: wrap; gap: 6px 14px; margin-top: 18px; font: 500 10px/1.3 var(--font-mono); letter-spacing: .06em; color: var(--text-tertiary); text-transform: uppercase; }
        .copy-in { animation: copyIn .8s .22s var(--ease-out-expo) both; }
        .copy-in--late { animation-delay: .32s; }
        .work-open { margin-top: 22px; display: flex; align-items: center; justify-content: space-between; height: var(--grid-block-size); padding: 0 18px; border: 1px solid var(--border-primary); font: 500 10px/1 var(--font-mono); letter-spacing: .1em; color: var(--text-secondary); transition: background .35s ease, color .35s ease; }
        .work-open i { font-style: normal; font-size: 16px; transition: transform .5s var(--ease-out-expo); }
        .work-open:hover { background: var(--text-primary); color: var(--bg-canvas); }
        .work-open:hover i { transform: translate(4px,-4px); }

        .work-scrubber { grid-column: 3 / -6; grid-row: 10 / 11; padding-top: 12px; }
        .scrub-track { position: relative; height: calc(100% - 4px); display: grid; grid-template-columns: repeat(${COUNT},1fr); gap: 8px; }
        .scrub-track button { position: relative; min-width: 0; overflow: hidden; background: #0b0b0c; }
        .scrub-track img { width: 100%; height: 100%; object-fit: cover; opacity: .32; filter: grayscale(1); transform: scale(1.06); transition: opacity .5s ease, filter .5s ease, transform .9s var(--ease-out-expo); }
        .scrub-track button:hover img { opacity: .75; filter: grayscale(.3); transform: scale(1.02); }
        .scrub-track button.is-active img { opacity: 1; filter: none; transform: scale(1); }
        .scrub-track span { position: absolute; left: 7px; bottom: 6px; color: #fff; font: 500 9px/1 var(--font-mono); text-shadow: 0 1px 4px #000; }
        .scrub-indicator { position: absolute; left: 0; bottom: -6px; width: calc((100% - ${(COUNT - 1) * 8}px) / ${COUNT}); height: 2px; background: var(--text-primary); pointer-events: none; transition: transform .7s var(--ease-out-expo); }
        .scrub-indicator { margin-right: 8px; }

        .work-controls { grid-column: 1 / 3; grid-row: 10 / 11; display: grid; grid-template-columns: 1fr 1fr; border: 1px solid var(--border-primary); background: var(--bg-canvas); }
        .work-controls button { overflow: hidden; color: var(--text-secondary); font-size: 17px; transition: background .3s ease, color .3s ease; }
        .work-controls button + button { border-left: 1px solid var(--border-primary); }
        .work-controls button span { display: inline-block; transition: transform .5s var(--ease-out-expo); }
        .work-controls button:hover { background: var(--text-primary); color: var(--bg-canvas); }
        .work-controls button:first-child:hover span { transform: translateX(-4px); }
        .work-controls button:last-child:hover span { transform: translateX(4px); }

        @keyframes mediaIn { from { clip-path: inset(0 0 0 100%); } to { clip-path: inset(0); } }
        @keyframes mediaInBack { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0); } }
        @keyframes mediaScale { from { transform: scale(1.14) translate3d(3%,0,0); } to { transform: scale(1); } }
        @keyframes mediaOut { to { transform: translate3d(-9%,0,0) scale(.97); filter: brightness(.35); } }
        @keyframes mediaOutBack { to { transform: translate3d(9%,0,0) scale(.97); filter: brightness(.35); } }
        @keyframes drift { from { transform: scale(1.005) translate3d(-.3%,0,0); } to { transform: scale(1.03) translate3d(.3%,-.4%,0); } }
        @keyframes lineIn { from { transform: translate3d(0,105%,0); } to { transform: none; } }
        @keyframes lineOut { to { transform: translate3d(0,-105%,0); } }
        @keyframes lineInBack { from { transform: translate3d(0,-105%,0); } to { transform: none; } }
        @keyframes lineOutBack { to { transform: translate3d(0,105%,0); } }
        @keyframes rollIn { from { transform: translate3d(0,100%,0); } to { transform: none; } }
        @keyframes rollOut { to { transform: translate3d(0,-100%,0); } }
        @keyframes rollInBack { from { transform: translate3d(0,-100%,0); } to { transform: none; } }
        @keyframes rollOutBack { to { transform: translate3d(0,100%,0); } }
        @keyframes copyIn { from { clip-path: inset(0 0 100% 0); transform: translate3d(0,14px,0); } to { clip-path: inset(0 0 -10% 0); transform: none; } }

        @media (min-width: 768px) and (max-height: 800px) {
          .work-title-stage { margin-top: 16px; }
          .work-copy p { -webkit-line-clamp: 3; font-size: 13px; }
          .work-open { height: calc(var(--grid-block-size) * .8); }
        }
        @media (max-width: 767px) {
          .work-layout { display: flex; flex-direction: column; padding: 100px 20px 30px; gap: 16px; }
          .work-heading { order: 0; }
          .work-cta { position: absolute; right: 20px; top: 34px; padding: 12px 16px; }
          .work-viewport { order: 1; aspect-ratio: 16 / 10; clip-path: none !important; }
          .work-scrubber { order: 2; height: 64px; padding: 0; }
          .work-controls { order: 3; height: 52px; }
          .work-info { order: 4; padding: 0; transform: none !important; }
          .work-index { font-size: 44px; }
          .work-copy { margin-top: 12px; }
          .work-open { height: 56px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .media-layer, .media-layer img, .roll *, .work-title *, .copy-in, .cap-in { animation: none !important; }
        }
      `}</style>
    </PinnedSection>
  );
}
