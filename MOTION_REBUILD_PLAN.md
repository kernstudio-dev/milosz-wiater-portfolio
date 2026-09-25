# Motion Rebuild Plan

Principle: keep every working system (one canvas, travel path, grid aperture, contexts, routes). Replace only the parts that produce the weak visual result. Every stage is verified in a real browser and committed + tagged.

## Stage A — Orb v2 (`components/bubble/shaders.ts`, `components/BubbleScene.tsx`, `lib/orbPersonality.ts`)

### A1. Geometry: an ordered membrane, not a random cloud
* One `THREE.Points`, 60k points desktop / 24k mobile.
* `aSphere`: unit directions laid out in **latitude rings** (~146 rings, points per ring ∝ sin θ, along-ring spacing ≈ ring spacing / 2.2). No radial jitter. The rings read as fine contour lines once the surface deforms, which is the "digital sculpture" look.
* `aVolume`: a random point inside the unit ball, used by the dust / neural states.
* `aShell`: 0..1 shell index, used for the ordered concentric Contact state.
* `aRandom`, `aPhase`.

### A2. Vertex shader: one displacement function, three frequency bands
Simplex noise (Ashima/Gustavson) replaces value noise.

```
w       = warp field (3 × snoise, low freq, slowly evolving)          // non-obvious repetition
fold    = snoise(p·f₁ + w·uWarp + drift₁) · .65 + snoise(p·.55f₁ + drift₂) · .35
ridge   = (1 − |snoise(p·f₂ + w·.6 + drift₃)|)³                        // travelling creases
detail  = snoise(p·f₃ + drift₄)                                       // subtle grain / crinkle
r(dir)  = 1 + uFold·fold + uRidge·(ridge − .3) + uDetail·detail
```
* Low band (uFold ≈ .16–.30 of radius) owns the **silhouette** and evolves on a 4–8 s timescale, so T=0/3/6 frames differ in outline.
* The noise domain is also slowly rotated, so the pattern morphs rather than scrolls.
* Normal from two finite-difference samples of `r` → lighting term (key light + rim) → alpha/brightness. Folds become visible *inside* the silhouette.
* Distribution modifiers (all 0..1 uniforms, blended per personality):
  * `uFlow`: latitude- and noise-dependent twist + curl-like tangential slide. Rings become flowing fibres (Work).
  * `uRibbon`: gathers azimuth toward 9 drifting meridians + petal push. Gives open lantern ribbons (About).
  * `uVolume`: morphs membrane points toward `aVolume` (dust / neural core).
  * `uShells`: snaps radius toward 5 nested shells (ordered Contact).
* Back-facing points are dimmed, which gives layered depth.

### A3. Pointer (world space)
* The pointer is un-projected to the orb's z-plane on the CPU (`uPointerWorld`) and damped (`1 − e^{−4.5dt}`).
* In the vertex shader, after `modelMatrix`, points within a Gaussian radius (≈ .55 orb radius) swell toward the camera and outward from the orb centre. A faint ripple adds local deformation intensity.
* The dent stays under the cursor regardless of the orb's rotation.
* The CPU adds a small damped lean of `ambientGroup` toward the pointer.

### A4. Three independent motion systems
| System | Owner | Inputs |
|---|---|---|
| Macro travel | `travelGroup` position/scale/rotation | `sampleOrbTravel(globalProgress)` only |
| Ambient | `uTime` (integrated with personality speed), `ambientGroup` drift rotation | time only |
| Pointer | `uPointerWorld/uPointerStrength`, lean | pointer only, damped |

### A5. Personalities (`lib/orbPersonality.ts`)
Named presets interpolated along `globalProgress`. Services blend in the damped service morph.

| Preset | fold | ridge | detail | flow | ribbon | volume | shells | speed | read |
|---|---|---|---|---|---|---|---|---|---|
| HERO | .26 | .10 | .012 | .10 | 0 | 0 | 0 | 1.0 | confident sculpture |
| WORK | .14 | .06 | .008 | .85 | 0 | 0 | 0 | .7 | quiet fibres, project tint |
| SERVICES ×6 | .14–.34 | .05–.22 | .01–.05 | 0–.7 | 0–.8 | 0–.45 | 0–.7 | .9–1.5 | six distinct, most energetic |
| ABOUT | .12 | .05 | .006 | .2 | .85 | 0 | 0 | .55 | calm open lantern |
| CONTACT | .07 | .03 | .004 | 0 | 0 | .15 | .85 | .45 | ordered concentric shells |

**Acceptance:** at 1440×900 with no input, silhouette change (1 − IoU of the occupied mask) must be clearly larger than the baseline between T=0→3 and T=0→6, and visual inspection must show a different outline, not only different grain. It must stay calm over 20 s.

## Stage B — Services (`components/ServicesIndex.tsx`)
* **Relative state model:** `display = (scrollSlot + autoOffset) mod 6`.
  * Scrolling changes `scrollSlot`, so the display always moves in the scroll direction.
  * Autoplay increments `autoOffset` after 2.2 s of idle, then every 5 s.
  * Any scroll input cancels the pending autoplay immediately.
  * Leaving the scene resets `autoOffset = 0`, so re-entry is deterministic: 01 from the top, 06 from below.
* Transition = one composition, all starting in the same frame:
  * Index digits roll through a mask.
  * Title line 1 and the highlighted line 2 each slide out and in through their own masks, with a staggered start.
  * The description line-masks in after a short delay.
  * The scope row wipes.
  * The orb morph (damped) starts on the same frame.
* The progress bar shows autoplay time, and the index list marks the active item.

## Stage C — Selected Work (`components/SelectedWork.tsx`)
* New hierarchy:
  * A heading.
  * A dominant media viewport (≈ 2/3 of the grid width, 6 rows), which is the only thing that is large.
  * A right column with a big index numeral, a line-masked project title, category / year and a two-line description.
  * A bottom scrubber with five thumbnails and a progress rail, plus prev / next.
* The whole media viewport is the VIEW link.
* Project change = one composition:
  * The media is clipped out in the travel direction while the new image scales in from 1.08.
  * The title line-masks and the index numeral rolls.
  * Meta and description stagger.
  * The thumbnail rail indicator slides.
* Entry: the heading mask reveals, then the viewport opens with a clip from its centre line.
* Exit: the viewport clips upward while Services' heading is already revealing and the orb is travelling. No dead gap.

## Stage D — Case studies (`app/work/[slug]`)
* Per-project story copy (EN/PL) for challenge, approach, the build, key numbers and a closing line, in `data/caseStudies.ts`.
* Structure:
  * Hero: split-line masked title, meta stagger and a media window that expands from inset to full-bleed on scroll.
  * Overview + facts.
  * A sticky "challenge" statement over a parallax visual.
  * A horizontal detail strip driven by vertical scroll.
  * Approach / build columns.
  * The final full-bleed visual.
  * A **Next Project** closing scene, 100vh, where the huge title and preview grow with scroll progress.
* Scroll-linked variables are written by one rAF loop (`--p` per section), not one-shot fades.
* Entry transition: clicking VIEW captures the media rect; a fixed overlay image animates from that rect to full-viewport before `router.push`, and the case study hero starts from the same full-bleed frame. The fallback is a clip wipe.
* Next project: the same overlay animation from the next-project preview.

## Stage E — QA
* Viewports 1920×1080, 1440×900 and 1366×768.
* Orb idle 20 s.
* Services: full idle cycle, forward / backward, stop halfway, resume.
* Work: all thumbnails, prev / next, VIEW, click.
* Three case studies, scrolled fully, plus next project.
* Dark / light, EN / PL.
* Full backward scroll.
* Reload determinism.
* Build.

## Rollback
Tags: `checkpoint/takeover`, `checkpoint/orb`, `checkpoint/services`, `checkpoint/selected-work`, `checkpoint/case-studies`, `checkpoint/final-motion`. On regression: `git checkout <tag> -- <files>`.
