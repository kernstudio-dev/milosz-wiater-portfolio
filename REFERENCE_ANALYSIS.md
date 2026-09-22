# REFERENCE_ANALYSIS.md: Deep Architectural & Motion Analysis of vanlent.dev

*Subject*: Comprehensive Reverse-Engineering & Motion System Extraction of [https://vanlent.dev/](https://vanlent.dev/)  
*Target Application*: Miłosz Wiater — Creative Developer / Digital Product Developer Portfolio  
*Author*: Antigravity Advanced Agentic Pair Programmer  

---

## 1. Hero Structure
- **Screen Real Estate & Proportion**:
  - The hero occupies a strict `min-height: 100svh` with extensive negative space. In `vanlent.dev`, the desktop layout computes a pinning distance of `5 * vh` (`--grid-hero-scroll-distance: 500vh`) when pinning layout is enabled.
  - The content is partitioned into a spatial grid:
    - **Top Row (Row 1)**: Flanked by technical metadata tags: `01. CREATIVE DEVELOPER` on the top-left and `02. AMSTERDAM BASED` on the top-right.
    - **Center Axis**: Large-scale editorial typography split into two opposing blocks:
      - Left block: `SHAPING CONCEPTS` (or `SHAPING / DIGITAL IDEAS`) in high-contrast editorial typography.
      - Right block: `BUILDING EXPERIENCES` right-aligned or offset.
    - **Center Void**: Exact mathematical center is occupied by the procedural 3D WebGL particle/mesh object.
    - **Bottom Row (Row 6 / Row 12)**: Technical contact coordinates on the left (`03. T: ... M: ...`) and availability status on the right (`04. OPEN FOR PROJECTS`).
- **Core Feeling**: Highly airy, architectural, restrained. Zero SaaS banners, zero CTA buttons cluttering the hero, zero 3D floating icons or fake laptop screens.

---

## 2. Grid System
- **Dynamic Modular Blueprint Grid**:
  - `vanlent.dev` dynamically computes a block size based on viewport height and width:
    `blockSize = Math.round(vh / rowsPerViewport)` (typically 12 rows per viewport, block size 54px–72px).
    `columnsPerViewport = Math.ceil(vw / blockSize)`.
  - CSS Variables emitted to `:root`:
    - `--grid-block-size`
    - `--grid-section-columns`
    - `--grid-hero-rows`
    - `--grid-max-width`
  - Visual Grid Overlay: Extremely faint grid borders (`rgba(0, 0, 0, 0.04)` on warm off-white `#F8F8F5`), reinforced by corner crosshairs (`+`) at cell intersections. It does NOT look like graph paper; it functions as an architectural alignment spine.

---

## 3. Typography Hierarchy
- **Primary Display Typeface**:
  - High-contrast editorial display serif (or nuanced classical serif paired with neutral sans).
  - Desktop sizing: `clamp(70px, 7.5vw, 145px)`.
  - Line-height: `0.85–0.95`. Tight leading creates a sculpted sculptural word block.
- **Secondary & Technical Typeface**:
  - Neutral sans-serif / IBM Plex Mono for technical indices, labels, and numbers.
  - Sizing: `9px–12px`.
  - Letter-spacing: `0.08em–0.16em` uppercase.
- **Color Pairing**:
  - High-contrast black (`#161616`) for active words.
  - Muted slate grey (`#777774`) for secondary words, establishing immediate depth without color noise.

---

## 4. Negative Space & Compositional Restraint
- Massive whitespace allowances: 40–55% of the viewport at any moment contains no text or UI, allowing the 3D particle mesh and typography to breathe.
- Content is arranged along cell coordinates rather than stacked vertical blocks. Elements feel placed onto an architectural drafting board.

---

## 5. Header Behavior
- **Non-Intrusive Architectural Annotation**:
  - Zero background blur, zero colored pills, zero floating container bars.
  - Embedded into the top grid row (`height: var(--grid-block-size)`):
    - **Top Left**: Identity wordmark (`WIATER`) + menu trigger square `[M]`.
    - **Top Right**: Clean text toggles `EN / PL`, clean `PM / AM` or local Warsaw time indicator, and a minimal CAD-bordered `GET IN TOUCH` link.
  - Fixed or sticky with large inset margins, remaining passive while the user explores.

---

## 6. Selected Work Behavior
- **Presentation**:
  - Index label `01 // SELECTED WORK`, large section title `SELECTED WORK`, concise supporting text.
  - A single large project showcase viewport (high-resolution real project imagery) without fake browser frames, chrome tabs, or developer console clutter.
- **Micro-Interaction**:
  - On hover, visual shifts subtly with a smooth scale (`1.0 -> 1.02`), and the custom cursor transitions into `VIEW`.

---

## 7. Services Behavior
- **Interactive Editorial Capability Matrix**:
  - Avoids 6 identical rounded SaaS cards.
  - Features a large editorial heading on the left (`SERVICES: STRATEGY, DESIGN, TECHNOLOGY`).
  - An interactive index of capabilities (`01 FRONT-END DEVELOPMENT`, `02 WEB APPLICATIONS`, `03 UI / UX`, `04 MOTION & INTERACTION`, `05 AI INTEGRATION`, `06 AUTOMATION SYSTEMS`).
  - Active capability appears in solid `#161616` black; inactive items in grey `#777774`.
  - Selecting/hovering reveals a concise technical description via `clip-path` mask.

---

## 8. About Structure
- **Sparse, High-End Editorial Presentation**:
  - Heading: `ABOUT` with small subtitle.
  - 3-column framed composition:
    - **Left**: Concise philosophical statement on engineering and design.
    - **Center**: The single persistent WebGL particle mesh passes through this dock.
    - **Right**: Clean editorial portrait placeholder framed in the grid.
  - Below: Continuous horizontal technology rail / ticker (`NEXT.JS`, `TYPESCRIPT`, `THREE.JS`, `GSAP`, `PYTHON`, `FASTAPI`, etc.) moving slowly or driven by scroll.

---

## 9. Contact Structure
- **Minimalist 3-Column CAD Layout**:
  - Heading: `GET IN TOUCH`.
  - **Left**: Direct contact channels (Email, Phone, Warsaw location, NIP/VAT).
  - **Center**: The persistent WebGL particle mesh docks in its final state (large, serene, glowing white/light grey core).
  - **Right**: Clean inquiry form (Name, Email, Project details) with a sharp, thin-bordered CTA `DISCUSS A PROJECT`.

---

## 10. Scroll Choreography
- **Continuous "Scroll to Look" Narrative**:
  - The page does not scroll like a traditional long document. Scrolling drives a master timeline of pinned and choreographed states.
  - Reversing scroll precisely reverses all transitions and mesh movement.
  - Zero abrupt jumps; all section transitions are connected.

---

## 11. Clip-Path Reveal Patterns
- Used extensively for editorial text reveals, image transitions, and section entries:
  - Standard reveal: `clip-path: inset(0 0 100% 0)` -> `clip-path: inset(0 0 0% 0)`.
  - WipeWork transition (`om` function in `vanlent.dev`):
    - Active: `inset(0% 0% 0% 0%)`.
    - Next: `inset(0% 0% 100% 0%)`.
    - Previous: `inset(100% 0% 0% 0%)`.
  - Curve: `cubic-bezier(0.4, 0, 0.2, 1)`.

---

## 12. Horizontal TranslateX Patterns
- In the pinned Selected Work section:
  - Vertical scroll distance is transformed into horizontal negative translation (`translateX(0)` -> `translateX(-Npx)`).
  - Exposed technical telemetry (e.g. `translateX: -5014px`) displayed in subtle mono font, emphasizing the digital craft.

---

## 13. Cursor Behavior
- Desktop custom cursor:
  - Default: Tiny black dot (`4px–6px`) with a faint magnetic outer ring.
  - States:
    - Over projects: expands with `VIEW` label.
    - Over horizontal gallery/timeline: expands with `DRAG` label.
    - Over contact CTA: expands with `CONTACT` label.
  - Zero neon glows or distracting trails.

---

## 14. Microinteractions
- Subtle hover displacements:
  - Arrow glides by `4px` on hover.
  - Underline draws across via `transform: scaleX(0)` -> `scaleX(1)`.
  - Audio clicks synthesized via Web Audio API oscillators on interactive triggers.

---

## 15. WebGL / Procedural Visual Role
- **The Core Rule**: Exactly **ONE** primary WebGL mesh on a single global canvas.
- Persistent across the entire page journey.
- Ambient animation (simplex noise undulation, subtle breathing rotation) runs in the RAF loop affecting only geometry vertices.
- Macro motion (translation, scale, section docking) is driven **strictly by GSAP ScrollTrigger scrub**.

---

## 16. Pinned Sections
- Pinning is applied deliberately:
  - **Hero**: Pinned while left/right typography separates horizontally (`-22vw` / `+22vw`) and CAD telemetry unfolds.
  - **Selected Work**: Pinned while vertical wheel scroll cycles through projects.
  - No nested or competing pin conflicts. `anticipatePin: 1` and `invalidateOnRefresh: true` ensure stability across viewport resizes.

---

## 17. Smooth-Scroll Behavior
- Managed through **Lenis**:
  - Directly synchronized with GSAP ScrollTrigger:
    ```javascript
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => { lenis.raf(time * 1000); });
    gsap.ticker.lagSmoothing(0);
    ```
  - Only one global Lenis instance.

---

## 18. Mobile Adaptation
- On mobile viewports (`< 768px`):
  - Custom cursor is deactivated.
  - Grid simplifies from 12+ columns to 4–6 columns.
  - Hero typography stacks vertically with the 3D particle mesh positioned gracefully between blocks.
  - DPR capped at `Math.min(window.devicePixelRatio, 1.5)`, particle count optimized for 60 FPS mobile performance.
