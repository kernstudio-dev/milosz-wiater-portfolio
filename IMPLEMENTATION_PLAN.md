# IMPLEMENTATION_PLAN.md: Section-by-Section Architectural Map

*Project*: Miłosz Wiater — Creative Developer Portfolio  
*Design & Motion Benchmark*: [vanlent.dev](https://vanlent.dev/)  

---

## Architecture & Visual Palette
- **Canvas / Background**: Warm off-white `#F8F8F5` (dark mode alternative: `#111111`).
- **Primary Text**: `#161616`.
- **Secondary Text**: `#777774`.
- **Architectural Grid**: `rgba(0, 0, 0, 0.04)` line borders with `50px–70px` module sizing.
- **Display Typography**: High-contrast editorial display serif (`Playfair Display` / `Cinzel` / `Instrument Serif`) paired with neutral grotesque sans & IBM Plex Mono for technical telemetry.

---

## 1. Global WebGL Scene & The Single Persistent Mesh
- **Architecture**:
  ```tsx
  <App>
    <GlobalWebGLScene>
      {/* Exactly ONE persistent WebGL Canvas & ONE PrimaryMesh */}
      <PrimaryMesh />
    </GlobalWebGLScene>
    <WebsiteContent />
  </App>
  ```
- **Hierarchy**:
  - `meshTravelGroup`: Position, macro scale, and macro orientation controlled **exclusively** by GSAP ScrollTrigger.
  - `meshAmbientGroup`: Slow ambient rotation (`time * 0.2`) and subtle mouse parallax (`mouseX * 0.05`).
  - `meshGeometry`: 26,000 Fibonacci sphere particles deformed in vertex shader / RAF via 3D Simplex noise and 3D Curl vectors.
- **Scroll Synchronization**:
  - 100% driven by scroll progress. Stopping scroll stops translation; reversing scroll reverses path with zero teleportation or reset.

---

## 2. Section-by-Section Mapping

### Section 1: Hero (`#hero-section`)
- **Layout**:
  - `100svh` minimum.
  - Top row: `01. CREATIVE DEVELOPER` (left), `02. WARSAW BASED` (right).
  - Center: Left typography block `SHAPING / DIGITAL IDEAS`, Right typography block `BUILDING / EXPERIENCES`.
  - Center Void: Primary WebGL mesh centered at `(0, 0)`.
  - Bottom row: `03. T: ... M: ...` (left), `04. OPEN FOR PROJECTS` (right).
- **Animation (Load)**:
  - Mask reveal (`overflow: hidden`, `translateY(110%)` -> `translateY(0%)`, duration `1.1s`, ease `power3.out`, stagger `0.12s`).
- **Scroll Behavior**:
  - Pinned with GSAP ScrollTrigger (`pin: true`, `scrub: 0.6`, `end: '+=100%'`).
  - Left headline separates horizontally (`x: '-22vw'`), right headline separates (`x: '22vw'`).
- **Mesh State**:
  - Position: Center of hero `(0, 0)`.
  - Color: Deep charcoal / black `#161616` (or `#FAFAFA` in dark theme).
  - Form: Compact spherical nebula, gentle simplex breathing (`wobble: 0.56`, `curl: 0.15`).
- **Responsive Behavior**:
  - `< 768px`: Headlines stack vertically; mesh docks between headline rows; text size clamps to `clamp(42px, 8vw, 68px)`.

---

### Section 2: Selected Work (`#work-section`)
- **Layout**:
  - Top bar: Index `01 // SELECTED WORK`, section title `SELECTED WORK`, supporting subtitle.
  - Pinned viewport container displaying curated real projects:
    - *Eclipse Ink* (Luxury Tattoo & Visual Arts Studio)
    - *Jarvis / Odkutka* (Autonomous AI Voice & Telegram Assistant)
    - *Happy Play* (Interactive Game Development Platform)
    - *WBRent* (Luxury Property & Yacht Booking Engine)
    - *WBTrade* (Algorithmic Trading & Analytics Dashboard)
- **Animation & Interaction**:
  - Hover: Subtle scale `1.0 -> 1.02`, custom cursor becomes `VIEW`.
  - Clicking project opens deep-dive architectural case-study modal.
- **Scroll Behavior**:
  - Pinned with GSAP ScrollTrigger (`pin: true`, `scrub: 0.5`, `end: '+=400%'`).
  - Vertical scroll drives horizontal project transition using exact `clip-path: inset(...)` wipe without jarring jumps.
- **Mesh State**:
  - Position: Shifts to upper-right / behind chassis.
  - Color: Cool slate `#334155` / `#94A3B8`.
  - Form: Swirling vortex ribbons (`curl: 0.95`, `curlFreq: 0.36`).
- **Responsive Behavior**:
  - `< 768px`: Vertical touch-scroll card stack with native momentum, reduced particle complexity.

---

### Section 3: Services (`#services-section`)
- **Layout**:
  - Editorial capability matrix (no generic 6 SaaS boxes).
  - Left: Large serif headline `SERVICES: STRATEGY, DESIGN, TECHNOLOGY`.
  - Right: Interactive capability index (01..06: Front-End Development, Web Applications, UI/UX, Motion & Interaction, AI Integration, Automation Systems).
  - Right Dock: Dedicated cell for the golden/amber mesh.
- **Animation & Interaction**:
  - Hovering / active selection switches typography from grey `#777774` to solid `#161616`.
  - Description reveals via `clip-path: inset(0 0 100% 0)` -> `inset(0 0 0% 0)`.
- **Scroll Behavior**:
  - Smooth unpinned entrance flowing directly from Selected Work exit state.
- **Mesh State**:
  - Position: Docks in right-hand grid cell.
  - Color: Radiant **warm amber / golden** `#F59E0B`.
  - Form: Active solar corona flares and bursting perimeter spikes (`spike: 0.92`, `wobble: 0.88`), energetic breathing.
- **Responsive Behavior**:
  - `< 960px`: Single-column accordion list with accordion toggle and docked mesh above.

---

### Section 4: About (`#about-section`)
- **Layout**:
  - Top header: `ABOUT` + concise subtitle.
  - 3-column framed grid:
    - Column 1: Concise editorial bio statement.
    - Column 2: Mesh docking cell.
    - Column 3: Framed portrait placeholder (`[PORTRAIT PLACEHOLDER]`).
  - Bottom: Continuous horizontal technology rail (`NEXT.JS`, `TYPESCRIPT`, `THREE.JS`, `GSAP`, `PYTHON`, `FASTAPI`, etc.).
- **Animation & Interaction**:
  - Technology rail glides slowly across with live `translateX` readout.
- **Scroll Behavior**:
  - Glides into viewport; mesh smoothly transitions from Services orange into stark white cavity.
- **Mesh State**:
  - Position: Center column of About grid.
  - Color: Crisp white `#FFFFFF` / clean slate `#CBD5E1`.
  - Form: **Organic hollow cavity shell** with hollow aperture center and folded contour wave lines (`cavity: 0.88`, `curl: 0.38`).
- **Responsive Behavior**:
  - Stacks into bio -> mesh -> portrait placeholder.

---

### Section 5: Contact & Footer (`#footer-section`)
- **Layout**:
  - Heading: `GET IN TOUCH`.
  - 3-column grid:
    - Left: Direct channels (Email, Phone, Warsaw Śródmieście, NIP/VAT).
    - Center: Final mesh docking cell.
    - Right: Clean CAD input form with `DISCUSS A PROJECT` action CTA.
  - Bottom bar: `wiater © 2026`, `Privacy policy`, `Terms of service`.
- **Animation & Interaction**:
  - Form submission triggers verified micro-feedback.
  - Typing in message field creates subtle resonance in mesh vibration.
- **Scroll Behavior**:
  - Natural document termination; mesh stays docked in final pristine state.
- **Mesh State**:
  - Position: Center column.
  - Color: Luminous stark white `#FFFFFF`.
  - Form: **Dense glowing core orb** with soft floating galaxy dust halo (`wobble: 0.12`, `scale: 1.25`).

---

## 3. Phased Execution Roadmap

1. **Phase 1: Foundation, Color Tokens & Typography**
   - Configure warm off-white `#F8F8F5` background, `#161616` primary text, `#777774` secondary text, subtle architectural grid.
   - Set up Display Serif typography (`Playfair Display` or `Cinzel`) + neutral sans/mono.
   - Git checkpoint: `checkpoint/01-foundation-and-typography`.

2. **Phase 2: Global WebGL Scene & Single Persistent Mesh**
   - Ensure EXACTLY ONE Canvas and ONE PrimaryMesh instance in root layout.
   - Wire single persistent Three.js scene with Simplex + Curl noise shader and color lerping.
   - Git checkpoint: `checkpoint/02-single-persistent-mesh`.

3. **Phase 3: Hero Load & Separation Motion**
   - Mask reveals (`translateY(110%)` -> `0%`), ScrollTrigger scrub horizontal headline separation.
   - Git checkpoint: `checkpoint/03-hero-motion`.

4. **Phase 4 & 5: Selected Work Horizontal Pinning & Mesh Travel**
   - Pinned master timeline with horizontal translation and `clip-path` wipe.
   - Continuous mesh travel from Hero into Work.
   - Git checkpoint: `checkpoint/04-selected-work-pinning`.

5. **Phase 6 & 7: Services Capability Matrix & Amber Corona Morph**
   - Interactive 01..06 capability index, clip-path reveals, mesh golden/amber morph.
   - Git checkpoint: `checkpoint/05-services-matrix`.

6. **Phase 8: About Framed Layout & Hollow Cavity Morph**
   - 3-column layout, bio, portrait placeholder, tech ticker rail, hollow shell morph.
   - Git checkpoint: `checkpoint/06-about-and-tech-rail`.

7. **Phase 9: Contact 3-Column Layout & Core Orb Morph**
   - Direct contacts, dense glowing white orb, CAD inquiry form.
   - Git checkpoint: `checkpoint/07-contact-footer`.

8. **Phase 10 & 11: Microinteractions, Custom Cursor & Responsive Testing**
   - Custom dot cursor (`VIEW`, `DRAG`, `CONTACT`), mobile adaptation, performance audit.
   - Git checkpoint: `checkpoint/08-polish-and-responsive`.
