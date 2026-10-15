/**
 * Services chapter: one pinned stage, one timeline.
 *
 * The chapter is authored in 14 beats (u), mapped onto the section's settled
 * scroll range. Everything that moves in the chapter — the band opening in the
 * grid, the horizontal world, the morphing device, the orb — is a function of
 * the same u, so they can never drift apart.
 *
 *   0.0 ─ 0.7   intro hold: STRATEGY / DESIGN / TECHNOLOGY
 *   0.7 ─ 1.7   words condense, the stage opens into a band, the axis draws,
 *               the orb withdraws and the first drawing builds from the right
 *   1.7 ─ 12.7  six drawings: 1 beat hold + 1 beat transition each
 *   12.7 ─ 14   outro: the last drawing returns to its lines, the orb comes
 *               back and hands over to the site path, the band closes
 */
export const BEATS = 14;
export const SERVICE_COUNT = 6;

/** Channel read by the orb in the same frame (viewport px). */
export const servicesOrb = {
  weight: 0,
  x: 0,
  y: 0,
  radius: 0,
  /** continuous service position 0..5 — drives the personality morph */
  pos: 0,
};

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
export const smooth = (v: number) => { const p = clamp01(v); return p * p * (3 - 2 * p); };
/** weighty travel: slow start, committed middle, soft landing */
export const travelEase = (v: number) => {
  const p = clamp01(v);
  return p < .5 ? 8 * p * p * p * p : 1 - Math.pow(-2 * p + 2, 4) / 2;
};

/** Beat at which service k's hold is centred. */
export const holdCentre = (k: number) => 2.2 + 2 * k;

/**
 * Chapter beat from section progress.
 * Desktop: the section settles at p = .1 and About starts entering at p = .9.
 * Portrait: frames do not overlap, so the stage is settled from p = .1 to 1.
 */
export function chapterBeat(progress: number, layout: string | undefined) {
  const span = layout === 'pinned' ? .8 : .9;
  return clamp01((progress - .1) / span) * BEATS;
}

export function progressForBeat(u: number, layout: string | undefined) {
  const span = layout === 'pinned' ? .8 : .9;
  return .1 + (u / BEATS) * span;
}

export type ChapterState = {
  u: number;
  /** service position: -1 = intro (first service off stage right) … 5 = last service; 5.35 at the end */
  pos: number;
  /** intro words: 0 = standing, 1 = condensed */
  condense: number;
  /** the grid opens into a band: 0 = orb window, 1 = full-width stage */
  band: number;
  axis: number;
  /** the device has arrived */
  device: number;
  /** outro: everything converges into the orb */
  converge: number;
  /** how much the chapter (not the site path) places the orb */
  orb: number;
  /** the orb is only the entrance and the exit: 1 = gone while the drawings play */
  vanish: number;
};

export function chapterState(u: number, out?: ChapterState): ChapterState {
  const s = out ?? ({} as ChapterState);
  s.u = u;
  if (u < 1) s.pos = -1;
  else if (u < 1.7) s.pos = -1 + travelEase((u - 1) / .7);
  else if (u < 12.7) {
    const t = u - 1.7;
    const k = Math.min(5, Math.floor(t / 2));
    const f = t - k * 2;
    s.pos = k >= 5 ? 5 : k + (f <= 1 ? 0 : travelEase(f - 1));
  } else s.pos = 5 + .35 * travelEase((u - 12.7) / .9);
  s.condense = smooth((u - .7) / .6);
  s.band = smooth((u - .8) / .7) * (1 - smooth((u - 12.9) / 1));
  s.axis = smooth((u - .95) / .8) * (1 - smooth((u - 12.95) / .85));
  s.device = smooth((u - 1.05) / .6);
  s.converge = smooth((u - 12.8) / 1);
  s.orb = smooth((u - .9) / .9) * (1 - smooth((u - 12.9) / 1.1));
  s.vanish = smooth((u - 1) / .65) * (1 - smooth((u - 13) / .7));
  return s;
}
