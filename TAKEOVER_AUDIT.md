# Takeover Audit — KERN / Miłosz Wiater portfolio

Audited at commit `bb4aa93` (tag `checkpoint/takeover`), Next.js 15 + React 19 + three 0.186 + Lenis.
Reference studied live at https://vanlent.dev/ (1440×900, headless Chrome, idle frames + 21 scroll positions).

## 1. Current architecture

```
app/layout.tsx            fonts, theme/lang bootstrap script, scrollRestoration='manual' + scrollTo(0,0)
 └ AppProviders           ThemeProvider → LanguageProvider
    ├ CustomCursor        one global cursor; reads [data-cursor] / [data-cursor-text] under the pointer
    └ app/page.tsx        ScrollProvider → BubbleProvider → HomeInner
         ├ PageLoader     GSAP letter reveal, ~2.3 s, gates #main-content opacity
         ├ BubbleScene    THE orb (single fixed WebGL canvas, z-index 30)
         └ #main-content  (z-index 40, above canvas)
              Navigation · HeroSection · SelectedWork · ServicesIndex · TechPhilosophy · ContactFooter
app/work/[slug]           static params from data/projects.ts → ProjectStory (client) + project.module.css
```

* **Scroll model.** No GSAP ScrollTrigger. Every section is a `PinnedSection`: a tall `<section>` (`SECTION_HEIGHT_VH`: hero 200, work 600, services 600, about 400, footer 100) containing a `position: sticky` 100svh `pinning-container`. On pinned desktop each non-hero section uses `margin-top: -100svh`, so consecutive scenes overlap by one viewport. `ScrollContext` publishes per-section progress (`(scrollY + vh - top) / height`) and `globalProgress` once per rAF, as React state.
* **Scene visibility.** `PinnedSection` fades each pinned scene in/out from neighbour progress (`entrance * (1 - exit)`) and hides it with `display:none` when invisible.
* **Orb aperture.** Each scene renders `SectionGrid`: opaque grid cells in the canvas colour. Cells whose centre falls inside a moving "hole" (derived from the orb travel path) are hidden, so the orb, which sits *behind* the content layer, is only visible through that aperture. This is how the orb reads as embedded in the editorial grid.
* **Lenis** smooth scroll on pinned desktop only (`window.kernLenis`).
* **Theme / language** are React contexts persisted in localStorage (`site-theme`, `site-language`), bootstrapped pre-hydration in `layout.tsx`. Both are consumed on the homepage and case studies.

## 2. Working systems (preserve)

| System | Evidence |
|---|---|
| One orb, one canvas | `document.querySelectorAll('canvas').length === 1` at runtime; only `BubbleScene` creates a renderer |
| Orb time runs independently of scroll | `uTime += dt * speed` in the rAF loop; idle frames differ |
| Macro travel is a pure function of `globalProgress` | `sampleOrbTravel()` keyframes in `lib/orbMotion.ts`; retraces on reverse scroll |
| Grid aperture follows the orb | `PinnedSection` recomputes the hole from the same travel sample |
| Selected Work next / previous / thumbnails / VIEW cursor / click → `/work/<id>` | verified by the previous QA pass (`scratch/polish_qa.py`) |
| Services cycles 01→06→01 without moving the document | same QA pass |
| EN/PL + light/dark on homepage and case studies | contexts + dictionary in `data/translations.ts` |
| Production build | passes |

## 3. Exact active orb shader architecture

`components/BubbleScene.tsx` → `THREE.WebGLRenderer` (alpha, DPR ≤ 1.5) → `Scene` → `travelGroup` (scroll: position/scale/rotation) → `ambientGroup` (time: rotation drift + 1% breathing scale) → one `THREE.Points` with `ShaderMaterial` (`components/bubble/shaders.ts`).

* **Geometry** `layeredSphere(count)`: 48k desktop / 20k mobile points in three Fibonacci layers, 72% outer shell (r = 1.58 ± jitter), 20% inner shell (r = 1.22 ± larger jitter), 8% random core. Attributes: `aBasePosition`, `aRandom`, `aLayer`, `aPhase`.
* **Vertex shader** (value-noise `hash`/`noise`/4-octave `fbm`):
  1. `morphShape()` evaluates **four** full shape functions every vertex (organic, ribbon, petal, folded), then blends two of them by `uShape` (0..3). They are built on `sin()` patterns (petals `sin(az*6)`, bands, four-fold) and read as regular, mechanical symmetry.
  2. `ambientShape()` adds ~8 more fbm calls (domain warp, low/mid/travelling/high bands, two noise-driven lobe axes, two fold fields) along the radial direction.
  3. Pointer: Gaussian push in **object-space xy**, but the object is rotated by `ambientGroup`/`travelGroup`, so the dent does not stay under the cursor as the orb rotates.
  4. Scroll "transition" squash, per-layer spin, tangential sin/cos jitter (`flowA/flowB`), sin breathing.
  5. Alpha from edge facing (`1 - |dir.z|`) × density fbm; colour grey → white by edge.
* **Fragment**: soft disc; colour mix of base / project tint (`uShellTint`) / service colour (`uColorMix`) / rim; additive blending in dark theme, normal in light.
* **Parameters** come from three places: `TRAVEL_PATH` (shape/energy/breath/colour…), `IDLE_PERSONALITY_PATH` (amplitudes/frequencies per scroll range), `SERVICE_PERSONALITIES` (6 presets blended with a damped `serviceMorph`).

### Why the orb still reads as "a particle sphere with some noise"
Measured at 1440×900, idle, no pointer (T = 0/3/6/10/15/20 s): the silhouette stays a near-circle; changes are edge fuzz. Causes:
* Random radial jitter + three layers + tangential jitter produce a **fuzzy, grainy cloud**. There is no readable membrane, so the eye cannot perceive form.
* Displacement budget is spread across ~12 overlapping mid/high-frequency fields that average each other out. The low-frequency term that actually changes the silhouette is small (≈ ±5–8% radius).
* Value noise shows lattice artefacts; `sin()` shape families create repetitive symmetric patterns.
* No shading: interior folds are invisible because alpha depends only on view-facing edge.
* Point distribution never changes, so section "personalities" are only colour + amplitude variations of the same cloud.

## 4. Current Services state machine (`components/ServicesIndex.tsx`)

* `scrollIndex = floor(clamp((p - 1/6) / (0.78 - 1/6)) * 6)`.
* Any scroll movement while the scene is active calls `changeService(scrollIndex)` and sets `scrollPaused` for 1.75 s.
* Autoplay: `setTimeout(4.8 s)` → `changeService(active + 1)` while not paused.
* **Fight condition:** autoplay can advance the display to, say, 04 while the scroll slot is 01. The next tiny wheel tick snaps back to 01, so scrolling down makes the content go backwards.
* Transition: outgoing/incoming copy with CSS keyframes (clip + translate), keyed number and scope rows. The orb morph starts in the same frame (`activeServiceIndex` → damped `serviceMorph`), which is correct.
* The copy change is one block. Title, description and index do not have separate staggered masks.

## 5. Current Selected Work architecture (`components/SelectedWork.tsx`)

* Pinned 600vh scene. Scroll maps to project index (`round`), manual selection overrides until the scroll moves by more than 0.075 progress.
* Layout copies the reference almost literally: 9-col desktop screenshot, a cropped duplicate as "mobile view", a technology column, a description column, a controls row and a lowercase title bar.
* Media transition: outgoing/incoming `<img>` with keyframes. Title, index and copy re-key with separate keyframes.
* VIEW: `data-cursor="view"` on the media anchor. Click → full-screen bottom-up wipe (320 ms) → `router.push('/work/id')`.
* **Weaknesses:** the media is not dominant; there are too many equal-weight boxes; information density is dashboard-like; the "mobile" crop is a fake duplicate; the thumbnail strip is small and dark. Exit is an opacity fade + 90 px lift that completes before Services is legible.

## 6. Case study architecture (`app/work/[slug]`)

* Server `page.tsx` → client `ProjectStory`. Sticky header (KERN, EN/PL, theme, back).
* Sections: hero (kicker, h1 mask, subtitle, image wipe) → overview → full visual → challenge → process visual → detail crops → facts → final visual → next link.
* Motion: IntersectionObserver sets `data-visible` → CSS transitions (mostly clip + translate once). Parallax via `--media-shift`.
* **Weaknesses:** the same image appears six times with different crops; the copy is generic and identical across projects (challenge, idea, experience, detail are shared dictionary strings); all reveals are fire-once transitions rather than scroll-linked choreography; the hero title is a single line; next project is a card rather than a closing scene; the entry transition is an unrelated wipe with a text label.

## 7. Other findings

* `lib/motionMap.ts` is unused legacy.
* Hero shows debug-style `clip-path: inset(...)` labels. They are intentionally "engineered" decoration and are kept.
* Reload: `scrollRestoration = 'manual'` + `scrollTo(0,0)` runs on full load. Returning from a case study via `/#work` relies on hash scroll.
* The SwiftShader fps figures in headless QA are not representative of real GPUs.

## 8. Problems to solve (in priority order)

1. Orb: replace the fuzzy cloud with an ordered, shaded membrane whose **low-frequency silhouette** evolves visibly over 3–6 s, with ridged folds and a per-section point *distribution* (membrane → fibres → crinkled shell → meridian ribbons → ordered concentric shells).
2. Pointer: world-space local bulge/attraction under the cursor, damped, plus a small lean.
3. Section personalities as named presets, interpolated on one orb.
4. Services: scroll + autoplay that never fight (relative offset model); staggered masked title/description/index transitions overlapping the orb morph.
5. Selected Work: dominant media viewer with a scrubber, minimal metadata and coordinated transitions; overlapping exit into Services.
6. Case studies: project-specific storytelling copy (EN/PL), scroll-linked choreography, a full-viewport entry transition, and a major Next Project closing scene.
