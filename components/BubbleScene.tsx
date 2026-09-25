'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/context/ThemeContext';
import { useBubble } from '@/context/BubbleContext';
import { useScrollProgress } from '@/context/ScrollContext';
import { bubbleVertexShader, bubbleFragmentShader } from '@/components/bubble/shaders';
import { sampleOrbTravel } from '@/lib/orbMotion';

const CAMERA_DISTANCE = 8;
const CAMERA_FOV = 50;
const DESKTOP_PARTICLES = 48000;
const MOBILE_PARTICLES = 20000;
const SERVICE_PERSONALITIES = [
  { shape: .72, energy: .44, breath: .58, low: .43, mid: .13, detail: .026, lowFreq: 1.02, midFreq: 4.6, detailFreq: 9.2, density: .72, pointScale: .94, stretch: [1.01, .97, 1.01], axisX: .45, axisZ: .12, speed: .82, color: '#62c9bb' },
  { shape: 1.22, energy: .58, breath: .68, low: .48, mid: .17, detail: .036, lowFreq: 1.18, midFreq: 4.15, detailFreq: 8.8, density: .88, pointScale: .98, stretch: [.97, 1.04, 1], axisX: .18, axisZ: .32, speed: 1.05, color: '#63a7ff' },
  { shape: 1.68, energy: .66, breath: .72, low: .38, mid: .12, detail: .024, lowFreq: .92, midFreq: 3.65, detailFreq: 7.8, density: .62, pointScale: 1.02, stretch: [1.05, 1.01, .96], axisX: .34, axisZ: -.18, speed: .92, color: '#b15ee8' },
  { shape: 2.18, energy: .86, breath: .88, low: .57, mid: .22, detail: .052, lowFreq: 1.24, midFreq: 5.1, detailFreq: 10.4, density: 1.08, pointScale: 1.04, stretch: [1.08, .94, 1], axisX: -.22, axisZ: .4, speed: 1.32, color: '#ff7657' },
  { shape: 2.7, energy: .92, breath: .82, low: .5, mid: .24, detail: .068, lowFreq: 1.42, midFreq: 5.7, detailFreq: 12.2, density: 1.18, pointScale: .96, stretch: [.96, 1.07, 1.03], axisX: .52, axisZ: -.3, speed: 1.12, color: '#e8a933' },
  { shape: 2.96, energy: .72, breath: .7, low: .35, mid: .18, detail: .034, lowFreq: 1.08, midFreq: 4.8, detailFreq: 9.6, density: .92, pointScale: .93, stretch: [1, 1, 1], axisX: -.36, axisZ: .16, speed: .74, color: '#f39b18' },
];

type IdlePersonality = {
  at: number;
  low: number;
  mid: number;
  detail: number;
  lowFreq: number;
  midFreq: number;
  detailFreq: number;
  density: number;
  pointScale: number;
  speed: number;
  stretch: readonly [number, number, number];
};

type IdleSample = Omit<IdlePersonality, 'at' | 'stretch'> & {
  stretchX: number;
  stretchY: number;
  stretchZ: number;
};

const IDLE_PERSONALITY_PATH: IdlePersonality[] = [
  { at: 0, low: .5, mid: .18, detail: .036, lowFreq: 1.05, midFreq: 4.15, detailFreq: 8.8, density: .84, pointScale: 1, speed: .92, stretch: [1.04, .97, 1] },
  { at: .1, low: .47, mid: .17, detail: .034, lowFreq: 1.08, midFreq: 4.3, detailFreq: 9, density: .82, pointScale: 1, speed: .9, stretch: [1.03, .98, 1] },
  { at: .17, low: .37, mid: .13, detail: .026, lowFreq: .96, midFreq: 3.75, detailFreq: 8.1, density: .66, pointScale: .94, speed: .72, stretch: [1.02, .98, .99] },
  { at: .4, low: .36, mid: .13, detail: .027, lowFreq: .98, midFreq: 3.8, detailFreq: 8.2, density: .68, pointScale: .95, speed: .74, stretch: [1.01, .99, .99] },
  { at: .48, low: .53, mid: .21, detail: .052, lowFreq: 1.24, midFreq: 5.15, detailFreq: 10.6, density: 1.06, pointScale: 1.03, speed: 1.16, stretch: [1.06, .95, 1.02] },
  { at: .73, low: .5, mid: .2, detail: .048, lowFreq: 1.2, midFreq: 5, detailFreq: 10.2, density: 1, pointScale: 1.02, speed: 1.08, stretch: [1.04, .97, 1.01] },
  { at: .82, low: .34, mid: .12, detail: .025, lowFreq: .9, midFreq: 3.55, detailFreq: 7.6, density: .58, pointScale: .98, speed: .58, stretch: [1.05, 1.01, .97] },
  { at: .94, low: .31, mid: .11, detail: .023, lowFreq: .86, midFreq: 3.4, detailFreq: 7.3, density: .54, pointScale: .98, speed: .54, stretch: [1.04, 1.02, .98] },
  { at: 1, low: .25, mid: .09, detail: .019, lowFreq: .78, midFreq: 3.15, detailFreq: 6.8, density: .44, pointScale: .92, speed: .46, stretch: [1, 1, 1] },
];
const clamp01 = (value: number) => Math.max(0, Math.min(1, value));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const smooth = (t: number) => {
  const p = clamp01(t);
  return p * p * (3 - 2 * p);
};

function sampleIdlePersonality(progress: number, target: IdleSample) {
  const value = clamp01(progress);
  let from = IDLE_PERSONALITY_PATH[0];
  let to = IDLE_PERSONALITY_PATH[IDLE_PERSONALITY_PATH.length - 1];
  for (let index = 1; index < IDLE_PERSONALITY_PATH.length; index += 1) {
    if (value <= IDLE_PERSONALITY_PATH[index].at) {
      from = IDLE_PERSONALITY_PATH[index - 1];
      to = IDLE_PERSONALITY_PATH[index];
      break;
    }
  }
  const t = smooth((value - from.at) / Math.max(.0001, to.at - from.at));
  target.low = lerp(from.low, to.low, t);
  target.mid = lerp(from.mid, to.mid, t);
  target.detail = lerp(from.detail, to.detail, t);
  target.lowFreq = lerp(from.lowFreq, to.lowFreq, t);
  target.midFreq = lerp(from.midFreq, to.midFreq, t);
  target.detailFreq = lerp(from.detailFreq, to.detailFreq, t);
  target.density = lerp(from.density, to.density, t);
  target.pointScale = lerp(from.pointScale, to.pointScale, t);
  target.speed = lerp(from.speed, to.speed, t);
  target.stretchX = lerp(from.stretch[0], to.stretch[0], t);
  target.stretchY = lerp(from.stretch[1], to.stretch[1], t);
  target.stretchZ = lerp(from.stretch[2], to.stretch[2], t);
  return target;
}

function alignCamera(camera: THREE.PerspectiveCamera, width: number, height: number) {
  camera.fov = CAMERA_FOV;
  camera.aspect = width / height;
  camera.position.set(0, 0, CAMERA_DISTANCE);
  camera.rotation.set(0, 0, 0);
  camera.clearViewOffset();
  camera.updateProjectionMatrix();
}

function productionScale(blockSize: number, viewportHeight: number) {
  const visibleHeight = 2 * Math.tan((CAMERA_FOV * Math.PI) / 360) * CAMERA_DISTANCE;
  return Math.max(0.36, Math.min(1.35, (2.35 * blockSize) / ((viewportHeight / visibleHeight) * 2)));
}

function seededRandom(index: number, salt: number) {
  const value = Math.sin((index + 1) * 12.9898 + salt * 78.233) * 43758.5453;
  return value - Math.floor(value);
}

function layeredSphere(count: number) {
  const positions = new Float32Array(count * 3);
  const random = new Float32Array(count);
  const layers = new Float32Array(count);
  const phases = new Float32Array(count);
  const golden = Math.PI * (3 - Math.sqrt(5));

  const layerCounts = [Math.round(count * 0.72), Math.round(count * 0.2)];
  layerCounts.push(count - layerCounts[0] - layerCounts[1]);

  let cursor = 0;
  layerCounts.forEach((layerCount, layer) => {
    for (let i = 0; i < layerCount; i += 1) {
      const seed = seededRandom(i, layer + 1);
      const y = 1 - ((i + 0.5) / layerCount) * 2;
      const ring = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = golden * i + layer * 0.83;
      const directionX = Math.cos(theta) * ring;
      const directionZ = Math.sin(theta) * ring;
      const radius = layer === 0
        ? 1.58 + (seed - 0.5) * 0.035
        : layer === 1
          ? 1.22 + (seed - 0.5) * 0.09
          : 0.28 + Math.pow(seed, 0.38) * 0.76;

      positions[cursor * 3] = directionX * radius;
      positions[cursor * 3 + 1] = y * radius;
      positions[cursor * 3 + 2] = directionZ * radius;
      random[cursor] = seededRandom(i, layer + 4);
      layers[cursor] = layer;
      phases[cursor] = seededRandom(i, layer + 8) * Math.PI * 2;
      cursor += 1;
    }
  });

  return { positions, random, layers, phases };
}

function dampedShape(shape: number) {
  return Math.max(0, Math.min(3, shape));
}

function disposeAttributeGeometry(geometry: THREE.BufferGeometry) {
  for (const name of Object.keys(geometry.attributes)) {
    geometry.deleteAttribute(name);
  }
}

export function BubbleScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const scroll = useScrollProgress();
  const bubble = useBubble();
  const { theme } = useTheme();
  const scrollRef = useRef(scroll);
  const bubbleRef = useRef(bubble);
  const themeRef = useRef(theme);
  scrollRef.current = scroll;
  bubbleRef.current = bubble;
  themeRef.current = theme;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, window.innerWidth / window.innerHeight, 0.1, 100);
    const count = window.innerWidth < 768 ? MOBILE_PARTICLES : DESKTOP_PARTICLES;
    const cloud = layeredSphere(count);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(cloud.positions.slice(), 3));
    geometry.setAttribute('aBasePosition', new THREE.BufferAttribute(cloud.positions, 3));
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(cloud.random, 1));
    geometry.setAttribute('aLayer', new THREE.BufferAttribute(cloud.layers, 1));
    geometry.setAttribute('aPhase', new THREE.BufferAttribute(cloud.phases, 1));

    const uniforms = {
      uTime: { value: 0 },
      uShape: { value: 0.16 },
      uEnergy: { value: 0.56 },
      uBreath: { value: 0.6 },
      uLowAmplitude: { value: .5 },
      uMediumAmplitude: { value: .18 },
      uDetailAmplitude: { value: .036 },
      uLowFrequency: { value: 1.05 },
      uMediumFrequency: { value: 4.15 },
      uDetailFrequency: { value: 8.8 },
      uDensityMotion: { value: .84 },
      uStretch: { value: new THREE.Vector3(1.04, .97, 1) },
      uScale: { value: 1 },
      uPointSize: { value: window.innerWidth < 768 ? 8.2 : 9.4 },
      uColor: { value: new THREE.Color('#f3a61a') },
      uColorMix: { value: 0 },
      uRim: { value: 0 },
      uShellTint: { value: 0 },
      uPresence: { value: 1 },
      uLightTheme: { value: themeRef.current === 'light' ? 1 : 0 },
      uTransition: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uPointerStrength: { value: 0 },
      uTintColor: { value: new THREE.Color('#b15ee8') },
      uAdditive: { value: themeRef.current === 'dark' ? 1 : 0 },
    };
    const material = new THREE.ShaderMaterial({
      vertexShader: bubbleVertexShader,
      fragmentShader: bubbleFragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: themeRef.current === 'dark' ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    // Macro travel, ambient motion, and vertex deformation are deliberately
    // isolated so none of the three systems can overwrite another one.
    const travelGroup = new THREE.Group();
    const ambientGroup = new THREE.Group();
    const points = new THREE.Points(geometry, material);
    ambientGroup.add(points);
    travelGroup.add(ambientGroup);
    scene.add(travelGroup);

    let raf = 0;
    let previous = performance.now();
    let ready = false;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const pointerTarget = { x: window.innerWidth / 2, y: window.innerHeight / 2, active: false };
    const pointerState = { x: 0, y: 0, strength: 0, rotationX: 0, rotationY: 0 };
    const servicePalette = SERVICE_PERSONALITIES.map((personality) => new THREE.Color(personality.color));
    const serviceColor = new THREE.Color();
    let serviceMorph = 0;
    let serviceTarget = 0;
    let previousServiceIndex = 0;
    const travelState = sampleOrbTravel(0);
    const idleState: IdleSample = {
      low: .5, mid: .18, detail: .036, lowFreq: 1.05, midFreq: 4.15, detailFreq: 8.8,
      density: .84, pointScale: 1, speed: .92, stretchX: 1.04, stretchY: .97, stretchZ: 1,
    };
    const rotationState = { x: 0, y: 0, z: 0, velocityX: .012, velocityY: .038, velocityZ: 0 };

    const onPointerMove = (event: PointerEvent) => {
      pointerTarget.x = event.clientX;
      pointerTarget.y = event.clientY;
      pointerTarget.active = event.pointerType !== 'touch';
    };
    const onPointerLeave = () => { pointerTarget.active = false; };

    const resize = () => {
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      renderer.setSize(window.innerWidth, window.innerHeight);
      uniforms.uPointSize.value = window.innerWidth < 768 ? 8.2 : 9.4;
    };
    window.addEventListener('resize', resize, { passive: true });
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onPointerLeave, { passive: true });
    window.addEventListener('blur', onPointerLeave);

    const render = (now: number) => {
      const dt = Math.min(0.05, (now - previous) / 1000);
      previous = now;
      const { globalProgress } = scrollRef.current;
      const { gridMetrics, workProjectColor, activeServiceIndex, setReady } = bubbleRef.current;
      const width = window.innerWidth;
      const height = window.innerHeight;
      const bs = gridMetrics?.blockSize ?? Math.round(height / 12);
      const sectionCols = gridMetrics?.sectionCols ?? 18;
      const xOffset = gridMetrics?.xOffset ?? Math.max(0, (width - bs * sectionCols) / 2);
      const centerX = width < 768 ? width / 2 : xOffset + bs * (sectionCols / 2);
      const workX = width < 768 ? width / 2 : xOffset + bs * 3;
      const rightX = width < 768 ? width / 2 : xOffset + bs * (sectionCols - 3);
      const centerY = height < 700 ? height * 0.5 : bs * 6;
      const baseScale = productionScale(bs, height);
      const travel = sampleOrbTravel(globalProgress, travelState);
      const x = travel.anchor < 0
        ? lerp(centerX, workX, -travel.anchor)
        : lerp(centerX, rightX, travel.anchor);
      const y = height < 700 ? centerY : bs * travel.row;
      const scale = baseScale * travel.scale;
      const idle = sampleIdlePersonality(globalProgress, idleState);
      if (activeServiceIndex !== previousServiceIndex) {
        let delta = activeServiceIndex - previousServiceIndex;
        if (delta > SERVICE_PERSONALITIES.length / 2) delta -= SERVICE_PERSONALITIES.length;
        if (delta < -SERVICE_PERSONALITIES.length / 2) delta += SERVICE_PERSONALITIES.length;
        serviceTarget += delta;
        previousServiceIndex = activeServiceIndex;
      }
      const serviceEase = 1 - Math.exp(-dt * 1.65);
      serviceMorph = lerp(serviceMorph, serviceTarget, serviceEase);
      const wrappedServiceMorph = ((serviceMorph % SERVICE_PERSONALITIES.length) + SERVICE_PERSONALITIES.length) % SERVICE_PERSONALITIES.length;
      const serviceFromIndex = Math.floor(wrappedServiceMorph);
      const serviceToIndex = (serviceFromIndex + 1) % SERVICE_PERSONALITIES.length;
      const serviceLocal = smooth(wrappedServiceMorph - serviceFromIndex);
      const serviceFrom = SERVICE_PERSONALITIES[serviceFromIndex];
      const serviceTo = SERVICE_PERSONALITIES[serviceToIndex];
      const serviceWeight = smooth((globalProgress - .43) / .07) * (1 - smooth((globalProgress - .76) / .07));
      const serviceShape = lerp(serviceFrom.shape, serviceTo.shape, serviceLocal);
      const serviceEnergy = lerp(serviceFrom.energy, serviceTo.energy, serviceLocal);
      const serviceBreath = lerp(serviceFrom.breath, serviceTo.breath, serviceLocal);
      const serviceAxisX = lerp(serviceFrom.axisX, serviceTo.axisX, serviceLocal);
      const serviceAxisZ = lerp(serviceFrom.axisZ, serviceTo.axisZ, serviceLocal);
      const serviceSpeed = lerp(serviceFrom.speed, serviceTo.speed, serviceLocal);
      const serviceLow = lerp(serviceFrom.low, serviceTo.low, serviceLocal);
      const serviceMid = lerp(serviceFrom.mid, serviceTo.mid, serviceLocal);
      const serviceDetail = lerp(serviceFrom.detail, serviceTo.detail, serviceLocal);
      const serviceLowFreq = lerp(serviceFrom.lowFreq, serviceTo.lowFreq, serviceLocal);
      const serviceMidFreq = lerp(serviceFrom.midFreq, serviceTo.midFreq, serviceLocal);
      const serviceDetailFreq = lerp(serviceFrom.detailFreq, serviceTo.detailFreq, serviceLocal);
      const serviceDensity = lerp(serviceFrom.density, serviceTo.density, serviceLocal);
      const servicePointScale = lerp(serviceFrom.pointScale, serviceTo.pointScale, serviceLocal);
      serviceColor.copy(servicePalette[serviceFromIndex]).lerp(servicePalette[serviceToIndex], serviceLocal);
      const idleSpeed = lerp(idle.speed, serviceSpeed, serviceWeight);
      // Time advances independently from scroll. Macro travel below remains a
      // pure function of globalProgress and can never pause this deformation.
      uniforms.uTime.value += dt * (reduceMotion ? .38 : idleSpeed * 1.32);

      const visibleHeight = 2 * Math.tan((CAMERA_FOV * Math.PI) / 360) * CAMERA_DISTANCE;
      const worldPerPixel = visibleHeight / height;
      const pointerDx = pointerTarget.x - x;
      const pointerDy = pointerTarget.y - y;
      const orbRadiusPixels = (1.72 * scale) / worldPerPixel;
      const pointerDistance = Math.hypot(pointerDx, pointerDy);
      const proximity = 1 - smooth((pointerDistance - orbRadiusPixels * 0.42) / (orbRadiusPixels * 1.05));
      const targetStrength = pointerTarget.active && !reduceMotion ? proximity : 0;
      const pointerEase = 1 - Math.exp(-dt * 4.6);
      const safeScale = Math.max(scale, 0.001);
      const localPointerX = pointerDx * worldPerPixel / safeScale;
      const localPointerY = -pointerDy * worldPerPixel / safeScale;
      pointerState.x = lerp(pointerState.x, localPointerX, pointerEase);
      pointerState.y = lerp(pointerState.y, localPointerY, pointerEase);
      pointerState.strength = lerp(pointerState.strength, targetStrength, pointerEase);
      pointerState.rotationX = lerp(pointerState.rotationX, -pointerDy / Math.max(height, 1) * targetStrength * 0.18, pointerEase);
      pointerState.rotationY = lerp(pointerState.rotationY, pointerDx / Math.max(width, 1) * targetStrength * 0.24, pointerEase);

      uniforms.uScale.value = 1;
      uniforms.uShape.value = dampedShape(lerp(travel.shape, serviceShape, serviceWeight));
      uniforms.uEnergy.value = lerp(travel.energy, serviceEnergy, serviceWeight);
      uniforms.uBreath.value = lerp(travel.breath, serviceBreath, serviceWeight);
      uniforms.uLowAmplitude.value = lerp(idle.low, serviceLow, serviceWeight);
      uniforms.uMediumAmplitude.value = lerp(idle.mid, serviceMid, serviceWeight);
      uniforms.uDetailAmplitude.value = lerp(idle.detail, serviceDetail, serviceWeight);
      uniforms.uLowFrequency.value = lerp(idle.lowFreq, serviceLowFreq, serviceWeight);
      uniforms.uMediumFrequency.value = lerp(idle.midFreq, serviceMidFreq, serviceWeight);
      uniforms.uDetailFrequency.value = lerp(idle.detailFreq, serviceDetailFreq, serviceWeight);
      uniforms.uDensityMotion.value = lerp(idle.density, serviceDensity, serviceWeight);
      uniforms.uStretch.value.set(
        lerp(idle.stretchX, lerp(serviceFrom.stretch[0], serviceTo.stretch[0], serviceLocal), serviceWeight),
        lerp(idle.stretchY, lerp(serviceFrom.stretch[1], serviceTo.stretch[1], serviceLocal), serviceWeight),
        lerp(idle.stretchZ, lerp(serviceFrom.stretch[2], serviceTo.stretch[2], serviceLocal), serviceWeight),
      );
      uniforms.uColorMix.value = travel.colorMix;
      uniforms.uRim.value = travel.rim;
      uniforms.uShellTint.value = travel.shellTint;
      uniforms.uPresence.value = travel.presence;
      uniforms.uTransition.value = travel.transition;
      uniforms.uPointer.value.set(pointerState.x, pointerState.y);
      uniforms.uPointerStrength.value = pointerState.strength;
      uniforms.uTintColor.value.set(workProjectColor);
      uniforms.uColor.value.set('#f3a61a').lerp(serviceColor, serviceWeight);
      const worldX = (x - width / 2) * worldPerPixel;
      const worldY = -(y - height / 2) * worldPerPixel;
      travelGroup.position.set(worldX, worldY, 0);
      travelGroup.scale.setScalar(scale);
      travelGroup.rotation.set(travel.rotationX, travel.rotationY, 0);

      const time = uniforms.uTime.value;
      const sectionActivity = lerp(.88, 1.16, serviceWeight);
      const ambientBreathing = 1 + (Math.sin(time * .31) * .009 + Math.sin(time * .137 + 1.9) * .005) * sectionActivity;
      ambientGroup.scale.setScalar(ambientBreathing);
      const rotationEase = 1 - Math.exp(-dt * .42);
      const targetVelocityX = .008 + Math.sin(time * .043 + 1.1) * .009 + Math.sin(time * .017) * .004;
      const targetVelocityY = .034 + Math.sin(time * .031 + .4) * .018 + Math.sin(time * .013 + 2.5) * .007;
      const targetVelocityZ = Math.sin(time * .027 + 2.1) * .008 + Math.sin(time * .011) * .003;
      rotationState.velocityX = lerp(rotationState.velocityX, targetVelocityX, rotationEase);
      rotationState.velocityY = lerp(rotationState.velocityY, targetVelocityY * lerp(1, serviceSpeed, serviceWeight), rotationEase);
      rotationState.velocityZ = lerp(rotationState.velocityZ, targetVelocityZ, rotationEase);
      rotationState.x += rotationState.velocityX * dt;
      rotationState.y += rotationState.velocityY * dt;
      rotationState.z += rotationState.velocityZ * dt;
      ambientGroup.rotation.set(
        rotationState.x + Math.sin(time * .11) * .04 + serviceAxisX * serviceWeight * .12 + pointerState.rotationX,
        rotationState.y + Math.sin(time * .073 + .7) * .046 + pointerState.rotationY,
        rotationState.z + Math.sin(time * .057 + 2.1) * .022 + serviceAxisZ * serviceWeight * .1,
      );

      const depth = globalProgress < .08 || globalProgress > .94
        ? 'foreground'
        : globalProgress < .43 ? 'background' : 'midground';
      if (mount.dataset.depth !== depth) mount.dataset.depth = depth;

      const isDark = themeRef.current === 'dark';
      const blend = isDark ? THREE.AdditiveBlending : THREE.NormalBlending;
      if (material.blending !== blend) {
        material.blending = blend;
        material.needsUpdate = true;
      }
      uniforms.uAdditive.value = isDark ? 1 : 0;
      uniforms.uLightTheme.value = isDark ? 0 : 1;
      uniforms.uPointSize.value = (width < 768 ? 8.2 : 9.4) * (isDark ? 1 : 1.16) * lerp(idle.pointScale, servicePointScale, serviceWeight);

      alignCamera(camera, width, height);
      renderer.render(scene, camera);
      if (!ready) {
        ready = true;
        setReady(true);
      }
      raf = requestAnimationFrame(render);
    };

    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      document.documentElement.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('blur', onPointerLeave);
      disposeAttributeGeometry(geometry);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={mountRef} className="bubble-canvas-layer" aria-hidden="true" style={{ opacity: bubble.isReady ? 1 : 0 }} />;
}
