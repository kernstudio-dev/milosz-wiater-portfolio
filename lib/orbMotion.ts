export type OrbTravelState = {
  anchor: number;
  row: number;
  scale: number;
  shape: number;
  energy: number;
  breath: number;
  colorMix: number;
  rim: number;
  shellTint: number;
  presence: number;
  transition: number;
  rotationX: number;
  rotationY: number;
  phase: string;
};

type TravelKeyframe = OrbTravelState & { at: number };

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (value: number) => {
  const p = clamp01(value);
  return p * p * (3 - 2 * p);
};

const TRAVEL_PATH: TravelKeyframe[] = [
  { at: 0, anchor: 0, row: 6, scale: .84, shape: .16, energy: .62, breath: .74, colorMix: 0, rim: 0, shellTint: 0, presence: 1, transition: 0, rotationX: 0, rotationY: 0, phase: 'hero / ambient' },
  { at: .06, anchor: 0, row: 6, scale: .86, shape: .3, energy: .66, breath: .76, colorMix: 0, rim: 0, shellTint: 0, presence: 1, transition: .18, rotationX: .08, rotationY: .38, phase: 'hero -> work' },
  { at: .115, anchor: -1, row: 6, scale: .84, shape: .92, energy: .48, breath: .58, colorMix: 0, rim: 0, shellTint: .92, presence: .88, transition: 0, rotationX: .13, rotationY: 1.24, phase: 'work / arrival' },
  { at: .35, anchor: -1, row: 6, scale: .86, shape: 1.08, energy: .5, breath: .6, colorMix: 0, rim: 0, shellTint: .92, presence: .9, transition: 0, rotationX: .21, rotationY: 4.7, phase: 'work / projects' },
  { at: .405, anchor: -.62, row: 5.85, scale: .88, shape: 1.34, energy: .6, breath: .68, colorMix: .08, rim: .03, shellTint: .58, presence: .94, transition: .82, rotationX: .12, rotationY: 5.35, phase: 'work -> services' },
  { at: .465, anchor: 0, row: 5.5, scale: .84, shape: 1.8, energy: .76, breath: .78, colorMix: .5, rim: .12, shellTint: .08, presence: 1, transition: .24, rotationX: -.04, rotationY: 6.15, phase: 'services / reveal' },
  { at: .58, anchor: 0, row: 5.5, scale: .8, shape: 2.12, energy: .78, breath: .8, colorMix: 1, rim: .24, shellTint: 0, presence: 1, transition: 0, rotationX: -.2, rotationY: 7.8, phase: 'services / feature' },
  { at: .66, anchor: 1, row: 5.5, scale: .71, shape: 2.34, energy: .74, breath: .76, colorMix: 1, rim: .24, shellTint: 0, presence: 1, transition: .56, rotationX: -.25, rotationY: 9.05, phase: 'services / dock' },
  { at: .75, anchor: 1, row: 5.5, scale: .73, shape: 2.5, energy: .72, breath: .72, colorMix: .9, rim: .2, shellTint: 0, presence: 1, transition: 0, rotationX: -.18, rotationY: 10.2, phase: 'services -> about' },
  { at: .82, anchor: 0, row: 5.5, scale: .84, shape: 2.86, energy: .7, breath: .68, colorMix: 0, rim: 0, shellTint: 0, presence: 1, transition: .5, rotationX: .14, rotationY: 11.15, phase: 'about / arrival' },
  { at: .93, anchor: 0, row: 5.62, scale: .84, shape: 2.62, energy: .64, breath: .64, colorMix: 0, rim: 0, shellTint: 0, presence: 1, transition: 0, rotationX: .28, rotationY: 12.4, phase: 'about / system' },
  { at: 1, anchor: 0, row: 6, scale: .7, shape: .28, energy: .4, breath: .5, colorMix: 0, rim: 0, shellTint: 0, presence: .92, transition: .22, rotationX: .14, rotationY: 13.15, phase: 'contact / settle' },
];

export function sampleOrbTravel(progress: number): OrbTravelState {
  const value = clamp01(progress);
  let from = TRAVEL_PATH[0];
  let to = TRAVEL_PATH[TRAVEL_PATH.length - 1];
  for (let index = 1; index < TRAVEL_PATH.length; index += 1) {
    if (value <= TRAVEL_PATH[index].at) {
      from = TRAVEL_PATH[index - 1];
      to = TRAVEL_PATH[index];
      break;
    }
  }
  const local = smooth((value - from.at) / Math.max(.0001, to.at - from.at));
  return {
    anchor: lerp(from.anchor, to.anchor, local), row: lerp(from.row, to.row, local),
    scale: lerp(from.scale, to.scale, local), shape: lerp(from.shape, to.shape, local),
    energy: lerp(from.energy, to.energy, local), breath: lerp(from.breath, to.breath, local),
    colorMix: lerp(from.colorMix, to.colorMix, local), rim: lerp(from.rim, to.rim, local),
    shellTint: lerp(from.shellTint, to.shellTint, local), presence: lerp(from.presence, to.presence, local),
    transition: lerp(from.transition, to.transition, local), rotationX: lerp(from.rotationX, to.rotationX, local),
    rotationY: lerp(from.rotationY, to.rotationY, local), phase: local < .5 ? from.phase : to.phase,
  };
}

