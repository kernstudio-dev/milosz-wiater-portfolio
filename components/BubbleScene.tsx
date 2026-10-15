'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useBubble } from '@/context/BubbleContext';
import { getLiveScroll } from '@/context/ScrollContext';
import { frameTop, getPortraitSections, SECTION_ORDER, type PortraitSection } from '@/lib/portraitGeometry';
import { addFrameCallback, FRAME_ORDER } from '@/lib/frameLoop';
import { bubbleVertexShader, bubbleFragmentShader } from '@/components/bubble/shaders';
import { sampleOrbTravel } from '@/lib/orbMotion';
import { V } from '@/lib/sceneTiming';
import { servicesOrb } from '@/lib/servicesStage';
import {
  HERO,
  SERVICE_PERSONALITIES,
  clonePersonality,
  lerpPersonality,
  samplePersonality,
} from '@/lib/orbPersonality';

const CAMERA_DISTANCE = 8;
const CAMERA_FOV = 50;
const BASE_RADIUS = 1.58;
const DESKTOP_PARTICLES = 62000;
const MOBILE_PARTICLES = 26000;

declare global {
  interface Window {
    __orbDebug?: { rect: [number, number, number, number]; time: number; g: number; personality: Record<string, number> };
  }
}

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => {
  const p = clamp01(t);
  return p * p * (3 - 2 * p);
};

function productionScale(blockSize: number, viewportHeight: number) {
  const visibleHeight = 2 * Math.tan((CAMERA_FOV * Math.PI) / 360) * CAMERA_DISTANCE;
  return Math.max(0.36, Math.min(1.35, (2.35 * blockSize) / ((viewportHeight / visibleHeight) * 2)));
}

/** Orb radius as a fraction of its portrait window's shorter side. */
const PORTRAIT_RADIUS = .3;

/**
 * Portrait orb target: the window of the scene on screen; while the next
 * scene scrolls in (its top travelling from the bottom of the viewport to the
 * top), blend from the outgoing window to the incoming one.
 */
function portraitTarget(scrollY: number, viewportHeight: number) {
  const registry = getPortraitSections();
  const list = SECTION_ORDER.map((id) => registry[id]).filter((s): s is PortraitSection => Boolean(s?.hole));
  if (!list.length) return null;
  const at = (s: PortraitSection) => {
    const hole = s.hole!;
    return { x: hole.x + hole.w / 2, y: frameTop(s, scrollY) + hole.y + hole.h / 2, size: Math.min(hole.w, hole.h) };
  };
  const next = list.findIndex((s) => s.top - scrollY > 0);
  if (next === -1) return at(list[list.length - 1]);
  if (next === 0) return at(list[0]);
  const incomingTop = list[next].top - scrollY;
  if (incomingTop >= viewportHeight) return at(list[next - 1]);
  const w = smooth((1 - incomingTop / viewportHeight - .15) / .7);
  const a = at(list[next - 1]);
  const b = at(list[next]);
  return { x: lerp(a.x, b.x, w), y: lerp(a.y, b.y, w), size: lerp(a.size, b.size, w) };
}

function seededRandom(index: number, salt: number) {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

/**
 * Ordered membrane: latitude rings with points-per-ring ∝ sin(θ). Points along a
 * ring are ~2.2× closer than the rings themselves, so once the surface deforms
 * the rings read as fine contour lines instead of noisy grain.
 */
function buildOrbGeometry(count: number) {
  const ratio = 2.2;
  const rings = Math.max(24, Math.round(Math.sqrt((count * Math.PI) / (4 * ratio))));
  const weights: number[] = [];
  let weightSum = 0;
  for (let i = 0; i < rings; i += 1) {
    const w = Math.sin(((i + 0.5) / rings) * Math.PI);
    weights.push(w);
    weightSum += w;
  }
  const perRing = weights.map((w) => Math.max(3, Math.round((w / weightSum) * count)));
  const total = perRing.reduce((sum, n) => sum + n, 0);

  const sphere = new Float32Array(total * 3);
  const volume = new Float32Array(total * 3);
  const shell = new Float32Array(total);
  const random = new Float32Array(total);
  const phase = new Float32Array(total);
  const golden = Math.PI * (3 - Math.sqrt(5));

  let cursor = 0;
  for (let ring = 0; ring < rings; ring += 1) {
    const theta = ((ring + 0.5) / rings) * Math.PI;
    const y = Math.cos(theta);
    const radius = Math.sin(theta);
    const n = perRing[ring];
    const offset = ring * golden;
    for (let j = 0; j < n; j += 1) {
      const phi = offset + (j / n) * Math.PI * 2;
      sphere[cursor * 3] = Math.cos(phi) * radius;
      sphere[cursor * 3 + 1] = y;
      sphere[cursor * 3 + 2] = Math.sin(phi) * radius;

      // Dust body: random direction, radius biased toward the core.
      const u = seededRandom(cursor, 3) * 2 - 1;
      const a = seededRandom(cursor, 5) * Math.PI * 2;
      const s = Math.sqrt(1 - u * u);
      const r = Math.pow(seededRandom(cursor, 7), 0.62) * 0.96;
      volume[cursor * 3] = Math.cos(a) * s * r;
      volume[cursor * 3 + 1] = u * r;
      volume[cursor * 3 + 2] = Math.sin(a) * s * r;

      // Whole rings share a shell, so nested layers keep their contour lines.
      shell[cursor] = (ring % 4) / 3;
      random[cursor] = seededRandom(cursor, 13);
      phase[cursor] = seededRandom(cursor, 17) * Math.PI * 2;
      cursor += 1;
    }
  }

  return { total, sphere, volume, shell, random, phase };
}

export function BubbleScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const bubble = useBubble();
  const bubbleRef = useRef(bubble);
  bubbleRef.current = bubble;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(0, 0, CAMERA_DISTANCE);
    const isSmall = window.innerWidth < 768;
    const cloud = buildOrbGeometry(isSmall ? MOBILE_PARTICLES : DESKTOP_PARTICLES);
    const geometry = new THREE.BufferGeometry();
    // `position` is only used for bounds; the shader reads aSphere / aVolume.
    geometry.setAttribute('position', new THREE.BufferAttribute(cloud.sphere, 3));
    geometry.setAttribute('aSphere', new THREE.BufferAttribute(cloud.sphere, 3));
    geometry.setAttribute('aVolume', new THREE.BufferAttribute(cloud.volume, 3));
    geometry.setAttribute('aShell', new THREE.BufferAttribute(cloud.shell, 1));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(cloud.random, 1));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(cloud.phase, 1));
    geometry.boundingSphere = new THREE.Sphere(new THREE.Vector3(), BASE_RADIUS * 2);

    const basePointSize = () => (window.innerWidth < 768 ? 10.5 : 11.5);
    const uniforms = {
      uTime: { value: 0 },
      uFold: { value: HERO.fold },
      uFoldFreq: { value: HERO.foldFreq },
      uWarp: { value: HERO.warp },
      uRidge: { value: HERO.ridge },
      uRidgeFreq: { value: HERO.ridgeFreq },
      uDetail: { value: HERO.detail },
      uDetailFreq: { value: HERO.detailFreq },
      uFlow: { value: HERO.flow },
      uRibbon: { value: 0 },
      uVolume: { value: 0 },
      uShells: { value: 0 },
      uBaseRadius: { value: BASE_RADIUS },
      uPointSize: { value: basePointSize() },
      uPresence: { value: 1 },
      uTransition: { value: 0 },
      uPointerWorld: { value: new THREE.Vector3(0, 0, 0) },
      uPointerStrength: { value: 0 },
      uOrbCenter: { value: new THREE.Vector3() },
      uOrbRadius: { value: 1 },
      uColor: { value: new THREE.Color('#f3a61a') },
      uColorMix: { value: 0 },
      uRim: { value: 0 },
      uShellTint: { value: 0 },
      uTintColor: { value: new THREE.Color('#b15ee8') },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader: bubbleVertexShader,
      fragmentShader: bubbleFragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      depthTest: false,
      blending: THREE.AdditiveBlending,
    });

    // Three motion systems, three owners:
    //   travelGroup  – scroll-driven macro transform
    //   ambientGroup – time-driven drift rotation + pointer lean
    //   shader       – time-driven sculpture + world-space pointer swell
    const travelGroup = new THREE.Group();
    const ambientGroup = new THREE.Group();
    const points = new THREE.Points(geometry, material);
    points.frustumCulled = false;
    ambientGroup.add(points);
    travelGroup.add(ambientGroup);
    scene.add(travelGroup);

    let ready = false;
    let tintHex = '';
    const debug = {
      rect: [0, 0, 0, 0] as [number, number, number, number],
      time: 0,
      g: 0,
      personality: { ...HERO, serviceWeight: 0 } as Record<string, number>,
    };
    window.__orbDebug = debug;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointerTarget = { x: -9999, y: -9999, active: false };
    const pointerState = { x: 0, y: 0, strength: 0, leanX: 0, leanY: 0 };
    const servicePalette = SERVICE_PERSONALITIES.map((p) => new THREE.Color(p.color));
    const serviceColor = new THREE.Color();
    const neutralAccent = new THREE.Color('#f3a61a');
    const serviceBlend = clonePersonality(SERVICE_PERSONALITIES[0]);
    const personality = clonePersonality(HERO);
    let serviceMorph = 0;
    let serviceTarget = 0;
    let previousServiceIndex = 0;
    const travelState = sampleOrbTravel(0);
    const rotation = { x: 0.18, y: 0, z: 0, vx: 0.01, vy: 0.05, vz: 0 };

    const onPointerMove = (event: PointerEvent) => {
      pointerTarget.x = event.clientX;
      pointerTarget.y = event.clientY;
      pointerTarget.active = event.pointerType !== 'touch';
    };
    const onPointerLeave = () => { pointerTarget.active = false; };

    const resize = () => {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave, { passive: true });
    window.addEventListener('blur', onPointerLeave);

    // Runs on the page's single frame clock, after Lenis and after the scroll
    // state commit, so the orb and the grid aperture use the same scroll value
    // and land in the same painted frame.
    const render = (_now: number, deltaMs: number) => {
      const dt = Math.min(0.05, deltaMs / 1000);
      const { globalProgress } = getLiveScroll();
      const { gridMetrics, workProjectColor, activeServiceIndex, setReady } = bubbleRef.current;
      const width = window.innerWidth;
      const height = window.innerHeight;

      // ---- MACRO (scroll only) -------------------------------------------
      const bs = gridMetrics?.blockSize ?? Math.round(height / 12);
      const sectionCols = gridMetrics?.sectionCols ?? 18;
      const xOffset = gridMetrics?.xOffset ?? Math.max(0, (width - bs * sectionCols) / 2);
      const centerX = width < 768 ? width / 2 : xOffset + bs * (sectionCols / 2);
      const workX = width < 768 ? width / 2 : xOffset + bs * 1.55;
      const rightX = width < 768 ? width / 2 : xOffset + bs * (sectionCols - 3);
      const travel = sampleOrbTravel(globalProgress, travelState);
      const visibleHeight = 2 * Math.tan((CAMERA_FOV * Math.PI) / 360) * CAMERA_DISTANCE;
      const worldPerPixel = visibleHeight / height;
      let x = travel.anchor < 0 ? lerp(centerX, workX, -travel.anchor) : lerp(centerX, rightX, travel.anchor);
      let y = height < 700 ? height * 0.5 : (gridMetrics?.yOffset ?? 0) + bs * travel.row;
      let scale = productionScale(bs, height) * travel.scale;
      // Portrait: the orb lives in each scene's measured window (position and
      // size only — shape, shader and personality are unchanged).
      if (gridMetrics?.layout === 'portrait' || gridMetrics?.layout === 'landscape') {
        const target = portraitTarget(getLiveScroll().scrollY, height);
        if (target) {
          x = target.x;
          y = target.y;
          scale = (target.size * PORTRAIT_RADIUS * worldPerPixel) / BASE_RADIUS;
        }
      }
      // Services chapter: the chapter places the orb inside its moving stage
      // (same orb, same shader — position and size only, blended by weight).
      const ov = servicesOrb;
      if (ov.weight > .0005) {
        const ovScale = (ov.radius * worldPerPixel) / BASE_RADIUS;
        x = lerp(x, ov.x, ov.weight);
        y = lerp(y, ov.y, ov.weight);
        scale = lerp(scale, ovScale, ov.weight);
      }
      const worldX = (x - width / 2) * worldPerPixel;
      const worldY = -(y - height / 2) * worldPerPixel;
      travelGroup.position.set(worldX, worldY, 0);
      travelGroup.scale.setScalar(scale);
      travelGroup.rotation.set(travel.rotationX, travel.rotationY, 0);

      // ---- PERSONALITY (section + service state) -------------------------
      if (activeServiceIndex !== previousServiceIndex) {
        let delta = activeServiceIndex - previousServiceIndex;
        const n = SERVICE_PERSONALITIES.length;
        if (delta > n / 2) delta -= n;
        if (delta < -n / 2) delta += n;
        serviceTarget += delta;
        previousServiceIndex = activeServiceIndex;
      }
      if (ov.weight > .0005) {
        // inside the chapter the form follows the scroll position continuously
        serviceTarget = ov.pos;
        previousServiceIndex = activeServiceIndex;
        serviceMorph = lerp(serviceMorph, serviceTarget, 1 - Math.exp(-dt * 9));
      } else {
        serviceMorph = lerp(serviceMorph, serviceTarget, 1 - Math.exp(-dt * 1.9));
      }
      const n = SERVICE_PERSONALITIES.length;
      const wrapped = ((serviceMorph % n) + n) % n;
      const fromIndex = Math.floor(wrapped);
      const toIndex = (fromIndex + 1) % n;
      const local = smooth(wrapped - fromIndex);
      lerpPersonality(SERVICE_PERSONALITIES[fromIndex], SERVICE_PERSONALITIES[toIndex], local, serviceBlend);
      serviceColor.copy(servicePalette[fromIndex]).lerp(servicePalette[toIndex], local);
      const serviceWeight = smooth((globalProgress - V(520.8)) / V(70)) * (1 - smooth((globalProgress - V(1402.4)) / V(84)));
      samplePersonality(globalProgress, serviceBlend, personality);

      // ---- AMBIENT (time only) --------------------------------------------
      uniforms.uTime.value += dt * (reduceMotion ? 0.3 : personality.speed);
      const time = uniforms.uTime.value;

      // ---- POINTER (pointer only, damped) ---------------------------------
      const pointerWorldX = (pointerTarget.x - width / 2) * worldPerPixel;
      const pointerWorldY = -(pointerTarget.y - height / 2) * worldPerPixel;
      const orbRadiusWorld = BASE_RADIUS * scale;
      const orbRadiusPixels = orbRadiusWorld / worldPerPixel;
      const pointerDistance = Math.hypot(pointerTarget.x - x, pointerTarget.y - y);
      const proximity = 1 - smooth((pointerDistance - orbRadiusPixels * 0.55) / (orbRadiusPixels * 0.9));
      const targetStrength = pointerTarget.active && !reduceMotion ? proximity * travel.presence : 0;
      const follow = 1 - Math.exp(-dt * 4.5);
      if (pointerState.strength < 0.01 && targetStrength > 0) {
        // Enter from where the cursor is instead of sweeping in from the last spot.
        pointerState.x = pointerWorldX;
        pointerState.y = pointerWorldY;
      }
      pointerState.x = lerp(pointerState.x, pointerWorldX, follow);
      pointerState.y = lerp(pointerState.y, pointerWorldY, follow);
      pointerState.strength = lerp(pointerState.strength, targetStrength, 1 - Math.exp(-dt * 3.2));
      const leanFollow = 1 - Math.exp(-dt * 2.2);
      pointerState.leanX = lerp(pointerState.leanX, -((pointerTarget.y - y) / Math.max(orbRadiusPixels, 1)) * 0.09 * targetStrength, leanFollow);
      pointerState.leanY = lerp(pointerState.leanY, ((pointerTarget.x - x) / Math.max(orbRadiusPixels, 1)) * 0.12 * targetStrength, leanFollow);

      // Drift rotation: slowly wandering angular velocity on three axes, so it
      // never reads as a globe spinning on a fixed pole.
      const rotEase = 1 - Math.exp(-dt * 0.4);
      rotation.vx = lerp(rotation.vx, 0.012 + Math.sin(time * 0.041 + 1.1) * 0.03, rotEase);
      rotation.vy = lerp(rotation.vy, 0.05 + Math.sin(time * 0.029 + 0.4) * 0.035, rotEase);
      rotation.vz = lerp(rotation.vz, Math.sin(time * 0.023 + 2.1) * 0.022, rotEase);
      rotation.x += rotation.vx * dt;
      rotation.y += rotation.vy * dt;
      rotation.z += rotation.vz * dt;
      ambientGroup.rotation.set(rotation.x + pointerState.leanX, rotation.y + pointerState.leanY, rotation.z);

      // ---- UNIFORMS ---------------------------------------------------------
      uniforms.uFold.value = personality.fold;
      uniforms.uFoldFreq.value = personality.foldFreq;
      uniforms.uWarp.value = personality.warp;
      uniforms.uRidge.value = personality.ridge;
      uniforms.uRidgeFreq.value = personality.ridgeFreq;
      uniforms.uDetail.value = personality.detail;
      uniforms.uDetailFreq.value = personality.detailFreq;
      uniforms.uFlow.value = personality.flow;
      uniforms.uRibbon.value = personality.ribbon;
      uniforms.uVolume.value = personality.volume;
      uniforms.uShells.value = personality.shells;
      uniforms.uPresence.value = travel.presence;
      uniforms.uTransition.value = travel.transition;
      uniforms.uPointerWorld.value.set(pointerState.x, pointerState.y, 0);
      uniforms.uPointerStrength.value = pointerState.strength;
      uniforms.uOrbCenter.value.set(worldX, worldY, 0);
      uniforms.uOrbRadius.value = orbRadiusWorld;
      uniforms.uColorMix.value = travel.colorMix;
      uniforms.uRim.value = travel.rim;
      uniforms.uShellTint.value = travel.shellTint;
      if (workProjectColor !== tintHex) {
        tintHex = workProjectColor;
        uniforms.uTintColor.value.set(workProjectColor);
      }
      uniforms.uColor.value.copy(neutralAccent).lerp(serviceColor, serviceWeight);

      const depth = globalProgress < .08 || globalProgress > .94 ? 'foreground' : globalProgress < .43 ? 'background' : 'midground';
      if (mount.dataset.depth !== depth) mount.dataset.depth = depth;

      uniforms.uPointSize.value = basePointSize() * personality.pointScale;

      renderer.render(scene, camera);

      const half = orbRadiusPixels * 1.45;
      debug.rect[0] = x - half;
      debug.rect[1] = y - half;
      debug.rect[2] = x + half;
      debug.rect[3] = y + half;
      debug.time = time;
      debug.g = globalProgress;
      Object.assign(debug.personality, personality);
      debug.personality.serviceWeight = serviceWeight;

      if (!ready) {
        ready = true;
        setReady(true);
      }
    };

    const stop = addFrameCallback(render, FRAME_ORDER.ORB);
    return () => {
      stop();
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('blur', onPointerLeave);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
      delete window.__orbDebug;
    };
  }, []);

  return <div ref={mountRef} className="bubble-canvas-layer" aria-hidden="true" style={{ opacity: bubble.isReady ? 1 : 0 }} />;
}
