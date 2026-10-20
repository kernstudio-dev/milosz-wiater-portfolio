'use client';

import { useCallback, useEffect, useRef, useState, type CSSProperties, type MouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
import { PinnedSection } from '@/components/PinnedSection';
import { useScene } from '@/hooks/useScene';
import { useBubble } from '@/context/BubbleContext';
import { usePageTransition } from '@/context/TransitionContext';
import { PROJECTS } from '@/data/projects';
import { useLanguage } from '@/context/LanguageContext';

type Vars = CSSProperties & Record<`--${string}`, string | number>;

const COUNT = PROJECTS.length;
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const p = clamp01(value); return p * p * (3 - 2 * p); };
const SCROLL_START = 1 / 6;
const SCROLL_END = .8;
const SWITCH_MS = 1500;

/** Section progress at which the viewer rests on project `index` (used when returning from a case study). */
export function workProgressForProject(index: number) {
  const clamped = Math.max(0, Math.min(COUNT - 1, index));
  return SCROLL_START + (clamped / (COUNT - 1)) * (SCROLL_END - SCROLL_START) + .004;
}

/**
 * Selected Work — a plate and a project card.
 *
 *   plate     the real screen, mounted on a lifted mat with registration marks,
 *             an accent hairline and a plate caption; sized from the viewport
 *             height so it never crops on short screens
 *   card      the column the site route lands in: chapter, number, name,
 *             context, action
 *   tabs      the three projects as typographic tabs under the plate, with a
 *             continuous scroll ruler
 *
 * Switching is one choreography: a shutter in the incoming project's accent
 * crosses the plate, the screen changes under it, and number, name and copy
 * arrive on the same beat.
 */
export function SelectedWork() {
  const { openProject, prefetch } = usePageTransition();
  const projectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeIndexRef = useRef(0);
  const manualProgress = useRef<number | null>(null);
  const changeId = useRef(0);
  const { progress, enter, leave: leaveWindow } = useScene('work');
  const progressRef = useRef(progress);
  const { setWorkProjectColor, gridMetrics } = useBubble();
  // landscape phones: the scene is plain flow, projects change by touch only
  const flowScene = gridMetrics?.layout === 'landscape';
  const { dictionary } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [previous, setPrevious] = useState<{ index: number; direction: 1 | -1; id: number } | null>(null);
  progressRef.current = progress;

  const raw = clamp01((progress - SCROLL_START) / (SCROLL_END - SCROLL_START)) * (COUNT - 1);
  const scrollIndex = Math.min(COUNT - 1, Math.round(raw));

  // Entry: the card's chapter heading first, then the plate opens, then the
  // project identity, then the tabs draw. Exit: copy leaves, the plate closes.
  const heading = smooth((enter - .4) / .3);
  const plateIn = smooth((enter - .46) / .4);
  const info = smooth((enter - .58) / .32);
  const tabsIn = smooth((enter - .64) / .3);
  const leave = smooth(leaveWindow / .32);
  const plateLeave = smooth((leaveWindow - .06) / .36);

  const project = PROJECTS[activeIndex];
  const copy = dictionary.projects[project.id];
  const work = dictionary.work;
  const previousProject = previous ? PROJECTS[previous.index] : null;
  const direction = previous?.direction ?? 1;
  const href = `/work/${project.id}`;
  const statusOf = (status?: 'concept' | 'progress') => (status === 'concept' ? work.concept : status === 'progress' ? work.progress : null);
  const status = statusOf(project.status);
  const switching = previous ? `sw-${previous.id}` : 'idle';

  const selectProject = useCallback((targetIndex: number, manual = true) => {
    const normalized = (targetIndex + COUNT) % COUNT;
    const current = activeIndexRef.current;
    if (normalized === current) return;
    if (projectTimer.current) clearTimeout(projectTimer.current);
    changeId.current += 1;
    setPrevious({ index: current, direction: normalized > current ? 1 : -1, id: changeId.current });
    activeIndexRef.current = normalized;
    setActiveIndex(normalized);
    if (manual) manualProgress.current = progressRef.current;
    projectTimer.current = setTimeout(() => setPrevious(null), SWITCH_MS);
  }, []);

  // Scroll drives the viewer unless the user just picked a project manually.
  useEffect(() => {
    if (manualProgress.current !== null && Math.abs(progress - manualProgress.current) < .06) return;
    manualProgress.current = null;
    if (flowScene) return;
    selectProject(scrollIndex, false);
  }, [progress, scrollIndex, selectProject, flowScene]);

  useEffect(() => setWorkProjectColor(PROJECTS[activeIndex].accent), [activeIndex, setWorkProjectColor]);
  useEffect(() => { prefetch(`/work/${PROJECTS[activeIndex].id}`); }, [activeIndex, prefetch]);
  useEffect(() => () => { if (projectTimer.current) clearTimeout(projectTimer.current); }, []);
  // warm the other screens so a switch never waits for an image
  useEffect(() => { PROJECTS.forEach((item) => { const img = new Image(); img.src = item.media.src; }); }, []);

  const open = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
    event.preventDefault();
    const media = document.querySelector('[data-work-viewport]') ?? event.currentTarget;
    openProject({ href, src: project.media.src, rect: media.getBoundingClientRect(), label: project.title });
  };

  const moveMedia = (event: ReactPointerEvent<HTMLElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - bounds.left) / Math.max(bounds.width, 1) - .5) * 10;
    const y = ((event.clientY - bounds.top) / Math.max(bounds.height, 1) - .5) * 6;
    event.currentTarget.style.setProperty('--media-x', `${x.toFixed(2)}px`);
    event.currentTarget.style.setProperty('--media-y', `${y.toFixed(2)}px`);
  };
  const resetMedia = (event: ReactPointerEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--media-x', '0px');
    event.currentTarget.style.setProperty('--media-y', '0px');
  };

  const cardOut = { opacity: 1 - leave, transform: `translate3d(0,${(-leave * 28).toFixed(1)}px,0)` };
  const reveal = (v: number) => ({ clipPath: `inset(0 0 ${((1 - v) * 100).toFixed(2)}% 0)` });

  return (
    <PinnedSection id="work">
      <div
        className={`work-layout dir-${direction > 0 ? 'fwd' : 'back'}`}
        data-active-project={activeIndex}
        style={{
          '--work-accent': project.accent,
          '--in-accent': project.accent,
          '--plate-in': plateIn.toFixed(4),
          '--plate-out': plateLeave.toFixed(4),
          '--tabs-in': tabsIn.toFixed(4),
          '--ruler': (raw / (COUNT - 1)).toFixed(4),
        } as Vars}
      >
        {/* ------------------------------------------------ the plate */}
        <figure className="plate" data-work-viewport>
          <span className="plate-marks" aria-hidden="true"><i /><i /><i /><i /></span>
          <div className="plate-mat">
            <i className="plate-hairline" key={`hl-${switching}`} aria-hidden="true" />
            <a
              className="plate-screen"
              href={href}
              data-cursor="view"
              data-cursor-text={work.view}
              aria-label={`${work.viewCase}: ${project.title}`}
              onPointerMove={moveMedia}
              onPointerLeave={resetMedia}
              onClick={open}
            >
              {previousProject && (
                <span className="layer is-out" key={`out-${previous!.id}`} aria-hidden="true">
                  <img src={previousProject.media.src} alt="" />
                </span>
              )}
              <span className={`layer ${previous ? 'is-in' : 'is-idle'}`} key={`in-${project.id}-${previous?.id ?? 0}`}>
                <img src={project.media.src} alt={copy.mediaAlt} />
              </span>
              {previous && <span className="shutter" key={`sh-${previous.id}`} aria-hidden="true" />}
            </a>
            <figcaption className="plate-caption">
              <span className="cap-roll" key={`c1-${switching}`}>
                <span className="cap-name">{project.title}</span>
              </span>
              <span className="cap-roll cap-right" key={`c2-${switching}`}>
                {work.capture} · {project.capture.source === 'production' ? work.production : work.localBuild} · {project.capture.viewport}
              </span>
            </figcaption>
          </div>
        </figure>

        {/* ------------------------------------------------ the project tabs */}
        <nav className="work-tabs" aria-label={work.selectProject}>
          {PROJECTS.map((item, itemIndex) => {
            const itemStatus = statusOf(item.status);
            const active = itemIndex === activeIndex;
            return (
              <button
                key={item.id}
                type="button"
                className={active ? 'is-active' : ''}
                aria-current={active ? 'true' : undefined}
                aria-label={`${work.show} ${item.title}`}
                style={{ '--tab-accent': item.accent, '--i': itemIndex } as Vars}
                onClick={() => selectProject(itemIndex)}
              >
                <span className="tab-track" aria-hidden="true"><i /></span>
                <span className="tab-name">{item.title}</span>
                <span className="tab-meta">{dictionary.projects[item.id].category.split(' / ')[0]}{itemStatus ? ` · ${itemStatus}` : ''}</span>
              </button>
            );
          })}
          <span className="tab-ruler" aria-hidden="true"><i /></span>
        </nav>

        {/* ------------------------------------------------ the project card */}
        <header className="card-head" style={{ opacity: 1 - leave }}>
          <p className="card-label" style={{ opacity: heading }}><span>{work.label}</span><span className="card-count">{work.count}</span></p>
          <h2 className="card-title">
            {work.title.split(' ').map((word, i) => (
              <span className="mask" key={word}><span style={{ transform: `translate3d(0,${((1 - heading) * 108 - leave * 108).toFixed(2)}%,0)`, transitionDelay: `${i * .06}s` }}>{word}</span></span>
            ))}
          </h2>
        </header>

        <div className="card" style={cardOut}>
          <div className="card-name" style={reveal(info)}>
            {previousProject && (
              <span className="name is-out" key={`t-out-${previous!.id}`} aria-hidden="true">
                <span className="mask"><span>{previousProject.title}</span></span>
              </span>
            )}
            <a
              className={`name ${previous ? 'is-in' : ''}`}
              key={`t-in-${project.id}-${previous?.id ?? 0}`}
              href={href}
              data-cursor="view"
              data-cursor-text={work.view}
              onClick={open}
            >
              <span className="mask"><span>{project.title}</span></span>
            </a>
          </div>

          <div className="card-context" key={`ctx-${project.id}-${previous?.id ?? 0}`} style={{ opacity: info }}>
            <p className={`card-cat ${previous ? 'copy-in' : ''}`}>
              <span>{copy.category}</span>
              <span className="card-year">{project.year}</span>
            </p>
            {status && <p className={`card-status ${previous ? 'copy-in' : ''}`}><i aria-hidden="true" />{status}</p>}
            <p className={`card-summary ${previous ? 'copy-in copy-in--late' : ''}`}>{copy.summary}</p>
            <p className={`card-stack ${previous ? 'copy-in copy-in--late' : ''}`}>{project.technologies.slice(0, 4).join(' · ')}</p>
            {project.link && (
              <a className="card-live" href={project.link} target="_blank" rel="noopener noreferrer">{work.viewProject}<i aria-hidden="true">↗</i></a>
            )}
          </div>
        </div>

        <div className="card-actions" style={{ ...cardOut, opacity: info * (1 - leave) }}>
          <a className="card-open" href={href} onClick={open}>
            <span>{work.viewCase}</span>
            <i aria-hidden="true">↗</i>
          </a>
        </div>

        {/* portrait only: the orb's window beside the heading, and the route station */}
        <div className="work-orb-slot" data-orb-slot aria-hidden="true" />
        <p className="route-station work-station" data-route-station>{dictionary.route.work}</p>
      </div>

      <style jsx>{`
        /* the chapter's own quiet grid: the drawing supports, never competes */
        :global(.site-section--work .section-grid__cell) { box-shadow: inset 1px 1px 0 0 color-mix(in srgb, var(--grid-line-large) 55%, var(--bg-canvas)); }

        .work-layout {
          --bs: var(--grid-block-size);
          --mat-pad: calc(var(--bs) * .3);
          --cap-h: calc(var(--bs) * .5);
          --plate-h: calc(var(--bs) * 8.25);
          --plate-top: calc(var(--bs) * 1.4);
          --plate-w: min(calc((var(--grid-cols) - 6) * var(--bs)), calc((var(--plate-h) - var(--mat-pad) * 2 - var(--cap-h)) * 1.6 + var(--mat-pad) * 2));
          --plate-hh: calc(var(--mat-pad) + (var(--plate-w) - var(--mat-pad) * 2) / 1.6 + var(--cap-h));
          --band-top: calc(var(--plate-top) + var(--plate-hh) + var(--bs) * .32);
          position: relative; height: 100%; overflow: hidden;
          display: grid; grid-template-columns: repeat(var(--grid-cols), var(--bs)); grid-template-rows: repeat(12, var(--bs));
        }
        .mask { display: block; overflow: hidden; }
        .mask > span { display: block; will-change: transform; }

        /* ================================================ plate */
        .plate {
          grid-column: 1 / -7; grid-row: 1 / -1; align-self: start; justify-self: start; position: relative; margin: 0;
          margin-top: var(--plate-top);
          /* as wide as the span allows, as tall as the viewport allows */
          width: var(--plate-w);
        }
        .plate-mat {
          position: relative; padding: var(--mat-pad) var(--mat-pad) 0;
          clip-path: inset(0 calc((1 - var(--plate-in)) * 100%) calc(var(--plate-out) * 100%) 0);
          will-change: clip-path;
          background: color-mix(in srgb, var(--text-primary) 5%, var(--bg-canvas));
          box-shadow: 0 0 0 1px color-mix(in srgb, var(--text-primary) 9%, transparent), 0 60px 90px -60px rgba(0,0,0,.9);
        }
        .plate-hairline { position: absolute; left: 0; top: 0; height: 2px; width: 100%; background: var(--work-accent); transform-origin: left; animation: hairline 1.1s var(--ease-out-expo) both; }
        .dir-back .plate-hairline { transform-origin: right; }
        .plate-marks i { position: absolute; z-index: 2; width: 14px; height: 14px; border: 0 solid var(--text-tertiary); pointer-events: none; opacity: calc(var(--plate-in) * (1 - var(--plate-out))); }
        .plate-marks i:nth-child(1) { left: -10px; top: -10px; border-left-width: 1px; border-top-width: 1px; }
        .plate-marks i:nth-child(2) { right: -10px; top: -10px; border-right-width: 1px; border-top-width: 1px; }
        .plate-marks i:nth-child(3) { left: -10px; bottom: -10px; border-left-width: 1px; border-bottom-width: 1px; }
        .plate-marks i:nth-child(4) { right: -10px; bottom: -10px; border-right-width: 1px; border-bottom-width: 1px; }

        .plate-screen { position: relative; display: block; aspect-ratio: 16 / 10; overflow: hidden; background: #0b0b0c; outline-offset: 4px; }
        .plate-screen::after { content: ''; position: absolute; inset: 0; z-index: 4; box-shadow: inset 0 0 0 1px rgba(255,255,255,.08); pointer-events: none; }
        .layer { position: absolute; inset: 0; overflow: hidden; }
        .layer img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; object-position: 50% 0; transform: scale(calc(1.06 - var(--plate-in) * .06)); }
        .is-idle img { transition: translate .9s var(--ease-out-expo), transform 1.2s var(--ease-out-expo); translate: var(--media-x,0) var(--media-y,0); }
        .plate-screen:hover .is-idle img { transform: scale(1.025); }
        .is-out { z-index: 1; }
        .is-out img { animation: screenOut .9s var(--ease-in-out-cubic) both; }
        .is-in { z-index: 2; animation: screenIn .01s .42s both; }
        .is-in img { animation: screenSettle 1.3s .42s var(--ease-out-expo) both; translate: var(--media-x,0) var(--media-y,0); }
        .shutter { position: absolute; inset: 0; z-index: 3; background: var(--in-accent); animation: shutter .9s var(--ease-in-out-cubic) both; }
        .dir-back .shutter { animation-name: shutterBack; }

        .plate-caption { display: flex; justify-content: space-between; align-items: center; gap: 16px; height: var(--cap-h); overflow: hidden; font: 500 10.5px/1 var(--font-mono); letter-spacing: .14em; text-transform: uppercase; color: var(--text-tertiary); white-space: nowrap; }
        .plate-caption b { color: var(--text-primary); font-weight: 500; }
        .plate-caption em { font-style: normal; margin: 0 14px 0 6px; }
        .cap-name { color: var(--text-secondary); }
        .cap-roll { display: block; overflow: hidden; text-overflow: ellipsis; }
        .dir-fwd .cap-roll, .dir-back .cap-roll { animation: capIn .7s .5s var(--ease-out-expo) both; }

        /* ================================================ tabs */
        .work-tabs {
          grid-column: 1 / -7; grid-row: 1 / -1; align-self: start; position: relative; width: var(--plate-w);
          display: grid; grid-template-columns: repeat(${COUNT}, minmax(0, 1fr)); column-gap: calc(var(--bs) * .3);
          margin-top: var(--band-top); height: calc(var(--bs) * 1.05);
        }
        .work-tabs button {
          position: relative; display: grid; grid-template-columns: auto minmax(0, 1fr); grid-template-rows: auto auto; column-gap: 14px; row-gap: 7px;
          align-content: start; padding-top: 20px; text-align: left; color: var(--text-tertiary); transition: color .45s ease;
          opacity: var(--tabs-in); transform: translate3d(0, calc((1 - var(--tabs-in)) * 14px), 0);
        }
        .tab-track { position: absolute; left: 0; right: 0; top: 0; height: 1px; background: var(--border-primary); }
        .tab-track i { position: absolute; inset: 0; background: var(--tab-accent); transform-origin: left; transform: scaleX(0); transition: transform .9s var(--ease-out-expo); }
        .work-tabs button:hover { color: var(--text-secondary); }
        .work-tabs button:hover .tab-track i { transform: scaleX(.18); }
        .work-tabs button.is-active { color: var(--text-primary); }
        .work-tabs button.is-active .tab-track i { transform: scaleX(1); }
        .tab-num { grid-row: 1 / 3; font: 500 12px/1.5 var(--font-mono); letter-spacing: .06em; transition: color .45s ease; }
        .is-active .tab-num { color: var(--tab-accent); }
        .tab-name { font: 300 clamp(18px, 1.55vw, 26px)/1.05 var(--font-display); letter-spacing: -.01em; text-transform: uppercase; transition: transform .6s var(--ease-out-expo); }
        .work-tabs button:hover .tab-name { transform: translateX(4px); }
        .tab-meta { font: 500 10px/1.3 var(--font-mono); letter-spacing: .14em; text-transform: uppercase; color: var(--text-tertiary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .tab-ruler { position: absolute; left: 0; right: 0; bottom: 0; height: 1px; background: color-mix(in srgb, var(--text-primary) 6%, transparent); opacity: var(--tabs-in); }
        .tab-ruler i { position: absolute; left: 0; top: -1px; height: 3px; width: calc(100% / ${COUNT}); background: var(--text-tertiary); transform: translate3d(calc(var(--ruler) * ${COUNT - 1} * 100%), 0, 0); transition: transform .5s var(--ease-out-expo); }

        /* ================================================ card */
        .card-head { grid-column: -6 / -1; grid-row: 2 / 4; align-self: stretch; display: flex; flex-direction: column; justify-content: space-between; padding: 18px 0 0 calc(var(--bs) * .4); }
        .card-label { display: flex; align-items: baseline; gap: 12px; font: 500 11px/1.3 var(--font-mono); letter-spacing: .16em; text-transform: uppercase; color: var(--text-tertiary); }
        .card-label b { color: var(--text-primary); font-weight: 500; }
        .card-count { margin-left: auto; }
        @media (max-width: 1599px) { .card-count { display: none; } }
        .card-title { font: 200 min(2.9vw, calc(var(--bs) * .6))/.92 var(--font-display); letter-spacing: -.045em; text-transform: uppercase; color: var(--text-primary); }
        .card-title .mask > span { transition: transform .9s var(--ease-out-expo); }

        .card { grid-column: -6 / -1; grid-row: 4 / 10; align-self: stretch; display: flex; flex-direction: column; padding: calc(var(--bs) * .45) 0 0 calc(var(--bs) * .4); min-width: 0; }
        .card-number { display: flex; align-items: baseline; gap: 12px; font: 200 min(5.4vw, calc(var(--bs) * 1.12))/.86 var(--font-display); letter-spacing: -.065em; color: var(--text-secondary); }
        .card-number small { font: 500 11px/1 var(--font-mono); letter-spacing: .12em; color: var(--text-tertiary); }
        .roll { position: relative; display: inline-block; height: .9em; overflow: hidden; min-width: 1.15em; }
        .roll > span { display: block; }
        .roll-out { position: absolute; inset: 0 auto auto 0; animation: rollOut .55s .2s var(--ease-in-out-cubic) both; }
        .roll-in { animation: rollIn .9s .38s var(--ease-out-expo) both; }
        .dir-back .roll-out { animation-name: rollOutBack; }
        .dir-back .roll-in { animation-name: rollInBack; }

        .card-name { position: relative; margin-top: calc(var(--bs) * .22); font: 300 min(3.4vw, calc(var(--bs) * .7))/1 var(--font-display); letter-spacing: -.035em; }
        .name { display: block; color: var(--text-primary); text-transform: uppercase; white-space: nowrap; }
        .name.is-out { position: absolute; inset: 0 0 auto 0; pointer-events: none; }
        .is-in.name .mask > span { animation: lineIn .95s .42s var(--ease-out-expo) both; }
        .is-out.name .mask > span { animation: lineOut .5s .14s var(--ease-in-out-cubic) both; }
        .dir-back .is-in.name .mask > span { animation-name: lineInBack; }
        .dir-back .is-out.name .mask > span { animation-name: lineOutBack; }
        .name .mask > span { transition: transform .6s var(--ease-out-expo); }
        .name:hover .mask > span { transform: translateX(6px); }

        .card-context { display: flex; flex-direction: column; margin-top: calc(var(--bs) * .28); min-height: 0; }
        .card-cat { display: flex; justify-content: space-between; gap: 16px; padding-bottom: 12px; border-bottom: 1px solid var(--border-primary); font: 500 10.5px/1.45 var(--font-mono); letter-spacing: .14em; text-transform: uppercase; color: var(--text-secondary); }
        .card-year { color: var(--text-tertiary); }
        .card-status { display: inline-flex; align-self: flex-start; align-items: center; gap: 8px; margin-top: 14px; padding: 5px 9px 4px; border: 1px solid var(--border-medium); font: 500 10px/1 var(--font-mono); letter-spacing: .16em; text-transform: uppercase; color: var(--text-primary); }
        .card-status i { width: 6px; height: 6px; background: var(--work-accent); }
        .card-summary { margin-top: 16px; font: 300 15px/1.55 var(--font-sans); color: var(--text-secondary); display: -webkit-box; -webkit-line-clamp: 5; -webkit-box-orient: vertical; overflow: hidden; }
        .card-stack { margin-top: 14px; font: 500 10px/1.5 var(--font-mono); letter-spacing: .12em; text-transform: uppercase; color: var(--text-tertiary); }
        .copy-in { animation: copyIn .8s .55s var(--ease-out-expo) both; }
        .copy-in--late { animation-delay: .64s; }

        .card-actions { grid-column: -6 / -1; grid-row: 1 / -1; align-self: start; margin-top: var(--band-top); display: flex; flex-direction: column; align-items: stretch; }
        .card-live { align-self: flex-start; margin-top: 18px; display: inline-flex; gap: 10px; font: 500 10.5px/1 var(--font-mono); letter-spacing: .16em; text-transform: uppercase; color: var(--text-tertiary); padding-bottom: 6px; border-bottom: 1px solid var(--border-primary); transition: color .35s ease, border-color .35s ease; }
        .card-live:hover { color: var(--text-primary); border-color: var(--text-primary); }
        .card-open {
          position: relative; display: flex; align-items: center; justify-content: space-between; height: calc(var(--bs) * .95); padding: 0 calc(var(--bs) * .4);
          border: 1px solid var(--border-medium); overflow: hidden; isolation: isolate;
          font: 500 11.5px/1 var(--font-mono); letter-spacing: .18em; text-transform: uppercase; color: var(--text-primary);
        }
        .card-open::before { content: ''; position: absolute; inset: 0; z-index: -1; background: var(--work-accent); transform: scaleX(0); transform-origin: left; transition: transform .6s var(--ease-out-expo); }
        .card-open i { font-style: normal; font-size: 16px; transition: transform .5s var(--ease-out-expo); }
        .card-open:hover { color: #111; border-color: var(--work-accent); }
        .card-open:hover::before { transform: scaleX(1); }
        .card-open:hover i { transform: translate(4px,-4px); }

        /* ================================================ motion */
        @keyframes hairline { from { transform: scaleX(0); } to { transform: none; } }
        @keyframes shutter { 0% { clip-path: inset(0 100% 0 0); } 46% { clip-path: inset(0 0 0 0); } 100% { clip-path: inset(0 0 0 100%); } }
        @keyframes shutterBack { 0% { clip-path: inset(0 0 0 100%); } 46% { clip-path: inset(0 0 0 0); } 100% { clip-path: inset(0 100% 0 0); } }
        @keyframes screenIn { from { visibility: hidden; } to { visibility: visible; } }
        @keyframes screenSettle { from { transform: scale(1.07); } to { transform: scale(1); } }
        @keyframes screenOut { to { transform: scale(1.04); filter: brightness(.6); } }
        @keyframes capIn { from { transform: translate3d(0,110%,0); } to { transform: none; } }
        @keyframes lineIn { from { transform: translate3d(0,105%,0); } to { transform: none; } }
        @keyframes lineOut { to { transform: translate3d(0,-105%,0); } }
        @keyframes lineInBack { from { transform: translate3d(0,-105%,0); } to { transform: none; } }
        @keyframes lineOutBack { to { transform: translate3d(0,105%,0); } }
        @keyframes rollIn { from { transform: translate3d(0,100%,0); } to { transform: none; } }
        @keyframes rollOut { to { transform: translate3d(0,-100%,0); } }
        @keyframes rollInBack { from { transform: translate3d(0,-100%,0); } to { transform: none; } }
        @keyframes rollOutBack { to { transform: translate3d(0,100%,0); } }
        @keyframes copyIn { from { clip-path: inset(0 0 100% 0); transform: translate3d(0,10px,0); } to { clip-path: inset(0 0 -10% 0); transform: none; } }

        /* short screens: the card tightens */
        @media (min-width: 768px) and (max-height: 820px) {
          .card-summary { -webkit-line-clamp: 4; font-size: 14px; margin-top: 12px; }
          .card-stack { display: none; }
          .card-status { margin-top: 10px; }
          .tab-meta { display: none; }
        }
        .work-orb-slot, .work-station { display: none; }

        /* ================================================ portrait
           label / title · orb / plate / tabs / number · name / context / action / station */
        :global(html[data-layout='portrait']) .work-layout {
          --mat-pad: 8px; --cap-h: 30px;
          display: grid; grid-template-columns: repeat(var(--grid-cols), minmax(0, 1fr));
          grid-template-rows: auto auto auto auto auto minmax(0, 1fr) auto auto;
          row-gap: clamp(10px, 1.8svh, 18px);
          padding: calc(var(--bs) + clamp(10px, 2svh, 22px)) 0 calc(clamp(12px, 2svh, 20px) + env(safe-area-inset-bottom));
        }
        :global(html[data-layout='portrait']) .card-head { grid-column: 1 / -3; grid-row: 1 / 3; padding: 0; gap: 10px; justify-content: flex-start; }
        :global(html[data-layout='portrait']) .card-count { display: none; }
        :global(html[data-layout='portrait']) .card-title { font-size: clamp(30px, 9.4vw, 64px); }
        :global(html[data-layout='portrait']) .work-orb-slot { display: block; grid-column: -3 / -1; grid-row: 1 / 3; min-height: calc(var(--bs) * 1.8); }
        :global(html[data-layout='portrait']) .plate { grid-column: 1 / -1; grid-row: 3; width: 100%; margin: 0; }
        :global(html[data-layout='portrait']) .work-tabs, :global(html[data-layout='portrait']) .card-actions { width: auto; margin-top: 0; }
        :global(html[data-layout='portrait']) .plate-marks i { width: 10px; height: 10px; }
        :global(html[data-layout='portrait']) .plate-caption { font-size: 9px; letter-spacing: .12em; }
        :global(html[data-layout='portrait']) .plate-caption em, :global(html[data-layout='portrait']) .cap-right { display: none; }
        :global(html[data-layout='portrait']) .cap-name { margin-left: 12px; }
        :global(html[data-layout='portrait']) .work-tabs { grid-column: 1 / -1; grid-row: 4; align-self: start; height: auto; margin: 0; column-gap: 10px; }
        :global(html[data-layout='portrait']) .work-tabs button { grid-template-columns: 1fr; padding: 12px 0 10px; row-gap: 4px; }
        :global(html[data-layout='portrait']) .tab-num { grid-row: auto; font-size: 10px; }
        :global(html[data-layout='portrait']) .tab-name { font-size: clamp(13px, 3.9vw, 22px); }
        :global(html[data-layout='portrait']) .tab-meta { display: none; }
        :global(html[data-layout='portrait']) .card { grid-column: 1 / -1; grid-row: 5 / 7; padding: 0; transform: none !important; display: grid; grid-template-columns: auto minmax(0, 1fr); column-gap: 18px; align-content: start; }
        :global(html[data-layout='portrait']) .card-number { grid-row: 1; font-size: clamp(44px, 13vw, 96px); }
        :global(html[data-layout='portrait']) .card-name { grid-row: 1; align-self: end; margin: 0 0 6px; font-size: clamp(24px, 7.4vw, 48px); }
        :global(html[data-layout='portrait']) .card-context { grid-column: 1 / -1; margin-top: 14px; }
        :global(html[data-layout='portrait']) .card-summary { font-size: 15px; -webkit-line-clamp: 3; }
        :global(html[data-layout='portrait']) .card-stack { display: none; }
        :global(html[data-layout='portrait']) .card-actions { grid-column: 1 / -1; grid-row: 7; margin: 0; flex-direction: row; align-items: center; justify-content: space-between; gap: 16px; transform: none !important; }
        :global(html[data-layout='portrait']) .card-open { flex: 1 1 auto; height: 52px; padding: 0 16px; }
        :global(html[data-layout='portrait']) .card-live { margin-top: 12px; }
        :global(html[data-layout='portrait']) .work-station { display: flex; grid-column: 1 / -1; grid-row: 8; }
        /* upright tablets: one-line heading, the plate sized by height so the card keeps its room */
        @media (min-width: 600px) {
          :global(html[data-layout='portrait']) .card-title { white-space: nowrap; font-size: clamp(36px, 6.4vw, 60px); }
          :global(html[data-layout='portrait']) .card-title .mask { display: inline-block; margin-right: .26em; }
          :global(html[data-layout='portrait']) .plate { width: min(100%, calc(30svh * 1.6 + 16px)); }
          :global(html[data-layout='portrait']) .work-tabs { width: min(100%, calc(30svh * 1.6 + 16px)); }
          :global(html[data-layout='portrait']) .card-number { font-size: clamp(44px, 8.4vw, 72px); }
          :global(html[data-layout='portrait']) .card-name { font-size: clamp(28px, 5.6vw, 46px); }
          :global(html[data-layout='portrait']) .card-summary { -webkit-line-clamp: 4; }
        }
        @media (max-height: 700px) {
          :global(html[data-layout='portrait']) .card-summary { -webkit-line-clamp: 3; }
        }

        @media (prefers-reduced-motion: reduce) {
          .layer, .layer img, .shutter, .roll *, .name *, .copy-in, .cap-roll, .plate-hairline { animation: none !important; }
          .shutter { display: none; }
        }

        /* ================================================ landscape phone
           title · orb | plate / tabs | card / action */
        :global(html[data-layout='landscape']) .work-layout {
          --mat-pad: 8px; --cap-h: 28px;
          display: grid; height: auto; min-height: 100svh;
          grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
          grid-template-rows: auto auto auto minmax(0, 1fr) auto auto;
          column-gap: 22px; row-gap: 12px; padding: calc(var(--bs) + 12px) 0 calc(14px + env(safe-area-inset-bottom));
        }
        :global(html[data-layout='landscape']) .card-head { grid-column: 1; grid-row: 1; padding: 0; gap: 8px; }
        :global(html[data-layout='landscape']) .card-count { display: none; }
        :global(html[data-layout='landscape']) .card-title { font-size: clamp(24px, 4vw, 40px); }
        :global(html[data-layout='landscape']) .work-orb-slot { display: block; grid-column: 1; grid-row: 2; min-height: calc(var(--bs) * 1.2); }
        :global(html[data-layout='landscape']) .plate { grid-column: 2; grid-row: 1 / 4; width: 100%; margin: 0; }
        :global(html[data-layout='landscape']) .work-tabs, :global(html[data-layout='landscape']) .card-actions { width: auto; margin-top: 0; }
        :global(html[data-layout='landscape']) .cap-right { display: none; }
        :global(html[data-layout='landscape']) .work-tabs { grid-column: 2; grid-row: 4; align-self: start; height: auto; margin: 0; }
        :global(html[data-layout='landscape']) .work-tabs button { padding: 10px 0 6px; }
        :global(html[data-layout='landscape']) .tab-meta { display: none; }
        :global(html[data-layout='landscape']) .card { grid-column: 1; grid-row: 3 / 5; padding: 0; transform: none !important; }
        :global(html[data-layout='landscape']) .card-number { font-size: clamp(32px, 6vw, 56px); }
        :global(html[data-layout='landscape']) .card-name { font-size: clamp(20px, 3.4vw, 32px); margin-top: 6px; }
        :global(html[data-layout='landscape']) .card-summary { -webkit-line-clamp: 3; font-size: 13px; }
        :global(html[data-layout='landscape']) .card-stack { display: none; }
        :global(html[data-layout='landscape']) .card-actions { grid-column: 1 / -1; grid-row: 5; margin: 0; flex-direction: row; justify-content: flex-end; align-items: center; transform: none !important; }
        :global(html[data-layout='landscape']) .card-open { height: 46px; min-width: 260px; }
        :global(html[data-layout='landscape']) .work-station { display: flex; grid-column: 1 / -1; grid-row: 6; }
      `}</style>
    </PinnedSection>
  );
}
