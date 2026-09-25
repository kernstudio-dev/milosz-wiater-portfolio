# Scroll Jitter Audit

Scope: technical stability only. No visual or motion-design changes.

## How it was measured

* Production build (`next build` + `next start`), headed Chrome on the real GPU (ANGLE / NVIDIA RTX 4070 SUPER), 144 Hz display, DPR 1.
* Viewports 1920×1080, 1440×900, 1366×768.
* Scroll driven by real wheel events (CDP `Input.dispatchMouseEvent`), through Lenis exactly as a user would:

| Scenario | Input |
|---|---|
| slow | 40 px wheel every 60 ms |
| normal | 100 px every 40 ms |
| fast | 260 px every 18 ms |
| trackpad | 7 px every 9 ms |
| reverse | 100 px every 40 ms, bottom to top |

* A frame probe records per frame, inside a `ResizeObserver` callback (runs after all rAF callbacks and after layout, immediately before paint — i.e. exactly what gets painted):
  * **shake**: `rect.top` of every visible sticky scene frame. By design every visible scene frame sits at exactly `top: 0`, so any non-zero value is visible displacement.
  * **orbLag**: difference in pixels between the scroll position the page is painted at and the scroll position the orb was rendered with.
  * WebGL canvas size, document height, long animation frames (LoAF, > 50 ms) with script attribution.
* CDP `Performance.getMetrics` + JS sampling profiler for main-thread cost while scrolling.
* Case studies: same pre-paint probe, comparing the `--pe/--ps` scroll variables about to be painted against the values implied by each scene's real rect.

## Architecture as found

There is **no GSAP ScrollTrigger** in this project (GSAP is only used by the intro loader). Scroll is:

* **Lenis** (one instance per page, `hooks/useLenis.ts`) driven by its own `requestAnimationFrame` loop.
* **ScrollContext** listens to `scroll`, schedules a rAF, reads positions and calls React `setState`. React commits that update in a separate task, **after the frame has been painted**.
* **Pinning** is CSS `position: sticky` (`.pinning-container`, 100svh) inside tall sections. Each section after the hero has `margin-top: -100svh`, so consecutive scenes share one viewport of scroll: the *handoff window*.
* **BubbleScene** runs a third rAF loop and reads scroll from a ref that is only refreshed when React re-renders.
* CustomCursor, the Services timer and the case-study scene updater run further independent rAF loops.

ScrollTrigger-specific items of the brief (pin spacing, anticipatePin, scrub values, refresh calls) do not apply. Their equivalents were audited below.

## Reproduced issues

### J1 — Scene handoff shake (all four handoffs) — **primary visible jitter**

| Handoff | Scroll range 1440×900 | 1920×1080 | 1366×768 |
|---|---|---|---|
| Hero → Work | 318–900 | 385–1110 | 270–769 |
| Work → Services | 4821–5400 | 5793–6494 | 4106–4618 |
| Services → About | 9325–9926 | 11192–11923 | 7949–8450 |
| About → Contact | 12020–12600 | 14425–15120 | 10260–10752 |

Max displacement of the incoming scene, in px:

| Viewport | slow | normal | fast | trackpad | reverse |
|---|---|---|---|---|---|
| 1440×900 | 5 | 30 | 73 | 4 | 21 |
| 1920×1080 | – | 30 | 73 | – | 20 |
| 1366×768 | 11 | 21 | 76 | 3 | 22 |

* Only happens inside handoff windows; never while a scene is fully pinned.
* Incoming scene: **not yet sticky**. During its window the section is still in normal flow, and it is held at `top: 0` by `transform: translateY(-(1 − enter) · 100vh)` on `.pinning-container`.
* Outgoing scene: sticky (stable).
* Orb: moving (travel between anchors). Text: masked entrances/exits animating. Layout height: constant (13500 / 16200 / 11520 px, never changes). WebGL canvas: constant, never resizes.
* **Root cause:** the browser moves the incoming section with the new scroll position immediately, but the compensating transform comes from React state that is committed after paint. So the scene is painted one frame late, displaced by that frame's scroll delta, then snaps back. The scene's 1 px grid lines also land on changing fractional offsets, so they shimmer.

### J2 — Orb position lags the page and steps irregularly

| Viewport / scenario | orbLag median | orbLag max |
|---|---|---|
| 1440 normal / fast | 9 px / 18 px | 32 px / 96 px |
| 1920 normal / fast | 9 px / 26 px | 30 px / 112 px |
| 1366 normal / fast | 9 px / 8 px | 30 px / 76 px |

* On about 20 frames per full pass, the page moved but the orb's scroll input did not, so the orb holds for one frame and then jumps.
* **Root cause:** the orb reads `globalProgress` from React render (see J3), not from the current frame's scroll.

### J3 — Several independent frame clocks (root cause of J1, J2)

* Lenis, the ScrollContext update, the React commit task, BubbleScene, CustomCursor, the Services timer and the case-study updater each run on their own schedule.
* Whether a React commit lands before or after a given paint varies from frame to frame, so the lag in J1/J2 is irregular, not a constant offset.

### J4 — Forced layout on every scroll event (CustomCursor)

* `readTarget()` calls `document.elementFromPoint` on every `scroll` event. That forces style and layout before Lenis and the scene writes of the same frame, so the browser lays out twice per frame.
* Measured at 0.44 ms per frame.

### J5 — Two owners for one transform (Selected Work scrub indicator)

* `.scrub-indicator` gets a scroll-driven inline `transform` every frame and also has `transition: transform .7s`.
* The transition restarts toward a new target each frame, so its velocity depends on frame timing.

### J6 — Leftover full-viewport compositor layer

* `.services-layout { will-change: transform }` no longer animates transform (exit is a clip-path). It permanently promotes a viewport-sized layer.

### J7 — Per-frame allocations in the WebGL loop

* `window.__orbDebug` is rebuilt every frame, with a new array plus a spread of the personality object.
* `uTintColor.value.set(string)` re-parses a colour string every frame.

### J8 — Wasted React work in the hot path (SectionGrid)

* Each section renders about 260 grid cells, about 1,300 in total.
* The aperture rect is a new object on every render, so every cell of every section is recomputed and reconciled on every scroll frame, including hidden scenes.
* This is most of React's roughly 1 ms per frame.

### J9 — Case studies: first frame of a scroll gesture

* Scene variables are painted in sync with scroll except on the first frame of a gesture: 1–3 frames per pass, ≤ 9 px.
* The updater is triggered by the previous frame's `scroll` event on its own clock.

## Verified non-issues

| Brief item | Finding |
|---|---|
| One smooth-scroll authority | One Lenis instance per page, no other scroll library |
| CSS smooth scroll | `scroll-behavior: auto` on `html` (and `!important` under reduced motion) |
| Transformed ancestors of sticky frames | none: `#main-content` only has `opacity` + `position: relative`; `.site-section` has no transform. The only transform on a sticky frame is J1's compensation |
| WebGL resize during scroll | never; `setSize` only in the `resize` listener; canvas size constant in every run |
| DPR | fixed `min(devicePixelRatio, 1.75)` at init/resize, no adaptive DPR |
| Layout shift | document height constant during every run; images sit in fixed grid cells / aspect-ratio boxes |
| Long tasks | no long animation frames (> 50 ms) in any run |
| Main-thread cost while scrolling | ≈ 2.8 ms / frame total (script 1.6, style 0.4, layout 0.04) |
| Ambient vs travel ownership | ambient drift and pointer lean write only `ambientGroup.rotation`; travel writes only `travelGroup` |
| Services autoplay vs scroll | autoplay only advances after 4.6 s without scroll input; scroll input restarts the idle clock (verified earlier: `scrollY` constant during idle cycle, no autoplay during wheel input) |

## Not caused by the site (environment floor)

About 7–9% of frames miss a 144 Hz vsync in every run: homepage idle, homepage scrolling, and case studies, which have no WebGL. An empty `data:` page with a single rAF loop, in the same Selenium-driven Chrome, misses 6.7–7.1%. So this is the test environment's frame-pacing floor, not the site. There are no long animation frames anywhere.

## Fix plan

1. **J1:** remove the compensation instead of making it faster. Each overlapping scene's sticky frame lives in a wrapper that starts one viewport above the section. The wrapper is absolutely positioned, so the section's box, the progress maths and the document height stay unchanged. The frame is then natively stuck at `top: 0` for its whole handoff window, and the browser positions it with zero lag.
2. **J2/J3/J9:** one frame clock per page. A single rAF ticker runs, in order:
   1. `lenis.raf`
   2. read scroll and synchronously commit the scroll state to React (`flushSync`)
   3. render the orb from that same scroll value
   4. the case-study scene variables
   5. the cursor hit-test

   Everything scroll-driven is then computed from one scroll value and painted in the same frame.
3. **J4:** the cursor hit-test runs once per frame at the end of the ticker, and only if scroll or pointer changed.
4. **J5:** the indicator transition applies only to manual (discrete) project changes; scroll owns it otherwise.
5. **J6:** drop the leftover `will-change`.
6. **J7:** mutate the debug object in place; set the tint colour only when it changes.
7. **J8:** memoize SectionGrid on the actual hole geometry; hidden scenes get a stable hole so they skip rendering.

## Fixes applied

| Issue | Change | Files |
|---|---|---|
| J1 | Every overlapping scene's sticky frame sits in a `.pinning-lead` wrapper (`position: absolute; top: -100svh; bottom: 0`), so it is natively stuck at `top: 0` for its whole handoff window. The script-driven `translateY` compensation is removed. The wrapper is `display: contents` for the hero and the non-pinned (mobile / short viewport) layout, so the tree is stable across breakpoints. Overlapping scenes always use the sticky frame (the footer previously used a relative frame plus compensation). | `components/PinnedSection.tsx`, `app/globals.css` |
| J2, J3 | New single frame clock `lib/frameLoop.ts`. Fixed order per frame: Lenis, then scroll state (read once, committed with `flushSync`), then scene writers, then timers, then orb, then cursor. `ScrollContext` exposes the frame's scroll state (`getLiveScroll`) and the orb reads it directly. | `lib/frameLoop.ts`, `hooks/useLenis.ts`, `context/ScrollContext.tsx`, `components/BubbleScene.tsx` |
| J4 | The cursor's hit-test runs once per frame, last, and only when the pointer or scroll changed. It no longer listens to `scroll`. The follower loop is on the frame clock. | `components/CustomCursor.tsx` |
| J5 | The scrub indicator has one writer: a damped follower on the frame clock (rate 9.9/s, the decay of the former 0.7 s ease-out-expo). Its CSS transform transition is removed. | `components/SelectedWork.tsx` |
| J6 | Removed the leftover `will-change: transform` from `.services-layout`. | `components/ServicesIndex.tsx` |
| J7 | The orb debug object is mutated in place, and the tint colour is only parsed when it changes. | `components/BubbleScene.tsx` |
| J8 | The grid computes its hidden-cell mask cheaply every render. The ~260-cell subtree is memoized on that mask, so it only re-renders when a cell actually changes. Hidden scenes receive no aperture. | `components/SectionGrid.tsx`, `components/PinnedSection.tsx` |
| J9 | Case-study scene variables are computed on the frame clock right after Lenis, reading every rect first and then writing, with no layout between scenes. | `app/work/[slug]/ProjectStory.tsx` |
| Services ownership | The autoplay timer runs on the frame clock after the scroll state, and marks any scroll movement in the frame as input first, so autoplay can never advance in a frame that scrolled. | `components/ServicesIndex.tsx` |

## Results (same probe, same production conditions)

### Homepage scene shake (max px)

| Viewport | slow | normal | fast | trackpad | reverse | rapid reverse + stop mid-handoff |
|---|---|---|---|---|---|---|
| 1440×900 before | 5 | 30 | 73 | 4 | 21 | – |
| 1440×900 after | **0** | **0** | **0** | **0** | **0** | **0** |
| 1366×768 before | 11 | 21 | 76 | 3 | 22 | – |
| 1366×768 after | **0** | **0** | **0** | **0** | **0** | **0** |
| 1920×1080 before | – | 30 | 73 | – | 20 | – |
| 1920×1080 after | – | **0** | **0** | **0** | **0** | **0** |

### Orb lag (px between painted page and orb input)

| | normal (max) | fast (max) |
|---|---|---|
| before, 1440 / 1366 / 1920 | 32 / 30 / 30 | 96 / 76 / 112 |
| after, all viewports and scenarios | **0** | **0** |

### Case-study scroll variables (frames painted with an error > 1 px)

| | normal | fast | trackpad |
|---|---|---|---|
| WBTrade 1440 before | 2 | 3 | 1 |
| WBTrade 1440 after | **0** | **0** | **0** |
| Eclipse Ink 1366 after | **0** | **0** | **0** |

### Main thread while scrolling (per frame)

| | task | script | style | layout |
|---|---|---|---|---|
| before | 2.78 ms | 1.56 ms | 0.37 ms | 0.04 ms |
| after | 1.74 ms | 0.75 ms | 0.23 ms | 0.03 ms |

The `elementFromPoint` forced layout is gone. There are no long animation frames. The canvas size and document height stayed constant in every run.

### Visual regression

The pre-fix commit and the fixed build were pixel-diffed with the time-driven orb canvas and cursor hidden and all CSS animations frozen. Each run covered 45 scroll positions, including several points inside every handoff window.

| Viewport / theme | Identical positions | Remaining differences |
|---|---|---|
| 1440×900 dark | 38 / 45 | timer bar tip · one antialiased row on the Services exit clip edge · footer text smoothing |
| 1920×1080 dark | 36 / 45 | same three |
| 1366×768 light | 38 / 45 | timer bar tip only |
| 390×844 (non-pinned) | 40 / 45 | timer bar tip · one clip-edge row |
| 1280×600 (non-pinned) | 39 / 45 | timer bar tip · one clip-edge row |

* **Timer bar tip:** the Services autoplay bar fills with elapsed time, so its length differs between any two captures.
* **Clip-edge row:** a single antialiased pixel row where a mid-transition clip edge cuts text. Layer composition changed (J6, and no transform on scene frames), so that one row blends differently.
* **Footer text smoothing:** the Contact frame is now sticky like the other four scenes, and Chrome composites sticky elements, so its text uses grayscale smoothing like the rest of the site. Glyph positions are identical. The old footer used grayscale during its handoff (while it had the compensation transform) and switched to colour subpixel smoothing at the final scroll position. That visible switch is gone.

### Functional regression

All pass unchanged:

* Services idle cycle 01 to 06 and back to 01 with `scrollY` constant, forward and backward wheel scrolling, stop halfway and resume.
* Selected Work: every thumbnail, prev / next, the VIEW cursor, scroll mapping, and open case study.
* Case study: next project, and back to the same project with no loader replay.
* Footer form focus and typing, Services index hit-testing, hero link hit-testing.
