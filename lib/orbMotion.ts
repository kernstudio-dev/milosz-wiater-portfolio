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

import { V } from './sceneTiming';

type TravelKeyframe = OrbTravelState & { at: number };

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (value: number) => {
  const p = clamp01(value);
  return p * p * (3 - 2 * p);
};

const TRAVEL_PATH: TravelKeyframe[] = [
  { at: 0, anchor: 0, row: 6, scale: .84, shape: .16, energy: .62, breath: .74, colorMix: 0, rim: 0, shellTint: 0, presence: 1, transition: 0, rotationX: 0, rotationY: 0, phase: 'hero / ambient' },
  { at: V(16.8), anchor: 0, row: 6, scale: .86, shape: .3, energy: .66, breath: .76, colorMix: 0, rim: 0, shellTint: 0, presence: 1, transition: .18, rotationX: .08, rotationY: .38, phase: 'hero -> work' },
  { at: V(95.2), anchor: -1, row: 6.4, scale: .78, shape: .92, energy: .48, breath: .58, colorMix: 0, rim: 0, shellTint: .92, presence: .88, transition: 0, rotationX: .13, rotationY: 1.24, phase: 'work / arrival' },
  { at: V(490), anchor: -1, row: 6.6, scale: .8, shape: 1.08, energy: .5, breath: .6, colorMix: 0, rim: 0, shellTint: .92, presence: .9, transition: 0, rotationX: .21, rotationY: 4.7, phase: 'work / projects' },
  { at: V(546), anchor: -.62, row: 5.85, scale: .88, shape: 1.34, energy: .6, breath: .68, colorMix: .08, rim: .03, shellTint: .58, presence: .94, transition: .82, rotationX: .12, rotationY: 5.35, phase: 'work -> services' },
  { at: V(602), anchor: 0, row: 6, scale: .86, shape: 1.8, energy: .76, breath: .78, colorMix: .55, rim: .12, shellTint: .08, presence: 1, transition: .24, rotationX: -.04, rotationY: 6.15, phase: 'services / reveal' },
  { at: V(1024), anchor: 0, row: 6, scale: .9, shape: 2.12, energy: .78, breath: .8, colorMix: 1, rim: .22, shellTint: 0, presence: 1, transition: 0, rotationX: -.2, rotationY: 7.8, phase: 'services / feature' },
  { at: V(1304), anchor: 0, row: 6, scale: .86, shape: 2.34, energy: .74, breath: .76, colorMix: 1, rim: .24, shellTint: 0, presence: 1, transition: .18, rotationX: -.25, rotationY: 9.05, phase: 'services / hold' },
  { at: V(1402.4), anchor: 0, row: 6, scale: .84, shape: 2.5, energy: .72, breath: .72, colorMix: .85, rim: .2, shellTint: 0, presence: 1, transition: 0, rotationX: -.18, rotationY: 10.2, phase: 'services -> about' },
  { at: V(1497.6), anchor: 0, row: 5.5, scale: .84, shape: 2.86, energy: .7, breath: .68, colorMix: 0, rim: 0, shellTint: 0, presence: 1, transition: .5, rotationX: .14, rotationY: 11.15, phase: 'about / arrival' },
  { at: V(1702), anchor: 0, row: 5.62, scale: .84, shape: 2.62, energy: .64, breath: .64, colorMix: 0, rim: 0, shellTint: 0, presence: 1, transition: 0, rotationX: .28, rotationY: 12.4, phase: 'about / system' },
  { at: 1, anchor: 0, row: 6, scale: .7, shape: .28, energy: .4, breath: .5, colorMix: 0, rim: 0, shellTint: 0, presence: .92, transition: .22, rotationX: .14, rotationY: 13.15, phase: 'contact / settle' },
];

export function sampleOrbTravel(progress: number, target?: OrbTravelState): OrbTravelState {
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
  const state = target ?? { ...from };
  state.anchor = lerp(from.anchor, to.anchor, local);
  state.row = lerp(from.row, to.row, local);
  state.scale = lerp(from.scale, to.scale, local);
  state.shape = lerp(from.shape, to.shape, local);
  state.energy = lerp(from.energy, to.energy, local);
  state.breath = lerp(from.breath, to.breath, local);
  state.colorMix = lerp(from.colorMix, to.colorMix, local);
  state.rim = lerp(from.rim, to.rim, local);
  state.shellTint = lerp(from.shellTint, to.shellTint, local);
  state.presence = lerp(from.presence, to.presence, local);
  state.transition = lerp(from.transition, to.transition, local);
  state.rotationX = lerp(from.rotationX, to.rotationX, local);
  state.rotationY = lerp(from.rotationY, to.rotationY, local);
  state.phase = local < .5 ? from.phase : to.phase;
  return state;
}
