/**
 * Orb personalities — parameter states of the ONE orb.
 * Sections never swap the object; they only interpolate these values.
 */
export type OrbPersonality = {
  fold: number;        // low-frequency silhouette amplitude (fraction of radius)
  foldFreq: number;
  warp: number;        // domain-warp strength of the fold field
  ridge: number;       // ridged mid-frequency crease amplitude
  ridgeFreq: number;
  detail: number;      // fine grain amplitude
  detailFreq: number;
  flow: number;        // 0..1 fibre twist
  ribbon: number;      // 0..1 meridian lantern
  volume: number;      // 0..1 membrane -> dust body
  shells: number;      // 0..1 concentric ordering
  speed: number;       // multiplier of ambient time
  pointScale: number;
};

export const PERSONALITY_KEYS = [
  'fold', 'foldFreq', 'warp', 'ridge', 'ridgeFreq', 'detail', 'detailFreq',
  'flow', 'ribbon', 'volume', 'shells', 'speed', 'pointScale',
] as const satisfies readonly (keyof OrbPersonality)[];

export const HERO: OrbPersonality = {
  fold: .27, foldFreq: .88, warp: .42, ridge: .03, ridgeFreq: 1.7, detail: .005, detailFreq: 6.5,
  flow: .08, ribbon: 0, volume: 0, shells: 0, speed: 1, pointScale: 1,
};

export const WORK: OrbPersonality = {
  fold: .15, foldFreq: 1.2, warp: .8, ridge: .05, ridgeFreq: 2.6, detail: .008, detailFreq: 8,
  flow: .85, ribbon: 0, volume: 0, shells: 0, speed: .72, pointScale: .96,
};

export const ABOUT: OrbPersonality = {
  fold: .13, foldFreq: .9, warp: .45, ridge: .06, ridgeFreq: 2.1, detail: .006, detailFreq: 6.5,
  flow: .22, ribbon: .88, volume: 0, shells: 0, speed: .55, pointScale: 1.02,
};

export const CONTACT: OrbPersonality = {
  fold: .11, foldFreq: .9, warp: .35, ridge: .03, ridgeFreq: 2, detail: .003, detailFreq: 6,
  flow: 0, ribbon: 0, volume: 0, shells: .9, speed: .55, pointScale: .94,
};

/** Services: the most expressive states. One per capability, same order as the content. */
export const SERVICE_PERSONALITIES: (OrbPersonality & { color: string })[] = [
  // 01 web development — crisp, structured membrane with fine creases
  { fold: .2, foldFreq: 1.1, warp: .5, ridge: .08, ridgeFreq: 2.6, detail: .008, detailFreq: 8,
    flow: .04, ribbon: 0, volume: 0, shells: 0, speed: 1.05, pointScale: .98, color: '#62c9bb' },
  // 02 web applications — layered fibres, systemic flow
  { fold: .16, foldFreq: 1.2, warp: .65, ridge: .04, ridgeFreq: 2.2, detail: .006, detailFreq: 7,
    flow: .62, ribbon: 0, volume: 0, shells: 0, speed: 1.1, pointScale: 1, color: '#63a7ff' },
  // 03 product design — elegant petals / meridians
  { fold: .16, foldFreq: .95, warp: .45, ridge: .06, ridgeFreq: 2.2, detail: .006, detailFreq: 7,
    flow: .12, ribbon: .72, volume: 0, shells: 0, speed: .9, pointScale: 1.02, color: '#b15ee8' },
  // 04 motion & interaction — largest, fastest folding
  { fold: .34, foldFreq: 1.15, warp: 1, ridge: .07, ridgeFreq: 2.3, detail: .01, detailFreq: 8,
    flow: .22, ribbon: 0, volume: 0, shells: 0, speed: 1.55, pointScale: 1.04, color: '#ff7657' },
  // 05 AI systems — neural dust core inside a crinkled skin
  { fold: .17, foldFreq: 1.3, warp: .8, ridge: .06, ridgeFreq: 3, detail: .03, detailFreq: 10,
    flow: .15, ribbon: 0, volume: .38, shells: 0, speed: 1.2, pointScale: .98, color: '#e8a933' },
  // 06 automation — ordered meridian cage with nested layers, mechanical precision
  { fold: .12, foldFreq: 1, warp: .35, ridge: .05, ridgeFreq: 2.4, detail: .005, detailFreq: 7,
    flow: 0, ribbon: .5, volume: 0, shells: .38, speed: 1.1, pointScale: .96, color: '#f39b18' },
];

export function lerpPersonality(a: OrbPersonality, b: OrbPersonality, t: number, target: OrbPersonality) {
  for (const key of PERSONALITY_KEYS) target[key] = a[key] + (b[key] - a[key]) * t;
  return target;
}

export function clonePersonality(p: OrbPersonality): OrbPersonality {
  const out = {} as OrbPersonality;
  for (const key of PERSONALITY_KEYS) out[key] = p[key];
  return out;
}

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const smooth = (v: number) => { const p = clamp01(v); return p * p * (3 - 2 * p); };

type Stop = { at: number; preset: OrbPersonality | 'services' };

/** Section path along globalProgress; 'services' resolves to the live service blend. */
const PATH: Stop[] = [
  { at: 0, preset: HERO },
  { at: .01, preset: HERO },
  { at: .066, preset: WORK },
  { at: .35, preset: WORK },
  { at: .425, preset: 'services' },
  { at: .715, preset: 'services' },
  { at: .782, preset: ABOUT },
  { at: .93, preset: ABOUT },
  { at: .99, preset: CONTACT },
];

export function samplePersonality(progress: number, services: OrbPersonality, target: OrbPersonality) {
  const value = clamp01(progress);
  let from = PATH[0];
  let to = PATH[PATH.length - 1];
  if (value >= to.at) from = to;
  else {
    for (let i = 1; i < PATH.length; i += 1) {
      if (value <= PATH[i].at) { from = PATH[i - 1]; to = PATH[i]; break; }
    }
  }
  const a = from.preset === 'services' ? services : from.preset;
  const b = to.preset === 'services' ? services : to.preset;
  const t = from === to ? 0 : smooth((value - from.at) / Math.max(.0001, to.at - from.at));
  return lerpPersonality(a, b, t, target);
}
