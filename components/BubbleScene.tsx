'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/context/ThemeContext';
import { useBubble } from '@/context/BubbleContext';
import { useScrollProgress } from '@/context/ScrollContext';
import { BUBBLE_CONFIG, HERO_MORPH_END, WOBBLE_TYPES } from '@/lib/motionMap';
import type { SectionId } from '@/lib/grid';
import { bubbleVertexShader, bubbleFragmentShader } from '@/components/bubble/shaders';

const CAMERA_DISTANCE = 8;
const CAMERA_FOV = 50;
const PARTICLE_COUNT = 26000;

function alignCameraToScreenPoint(
  camera: THREE.PerspectiveCamera,
  screenX: number,
  screenY: number,
  w: number,
  h: number
) {
  camera.fov = CAMERA_FOV;
  camera.aspect = w / h;
  camera.position.set(0, 0, CAMERA_DISTANCE);
  camera.rotation.set(0, 0, 0);
  camera.clearViewOffset();
  camera.setViewOffset(w, h, Math.round(w / 2 - screenX), Math.round(h / 2 - screenY), w, h);
  camera.updateProjectionMatrix();
}

function getProductionParticleScale(blockSize: number, vh: number): number {
  const n = 2 * Math.tan((25 * Math.PI) / 180) * CAMERA_DISTANCE;
  return Math.max(0.5, Math.min(1.8, (3.2 * blockSize) / ((vh / n) * 2)));
}

function fibonacciSphere(count: number, radius = 1.6): Float32Array {
  const positions = new Float32Array(count * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    positions[i * 3] = Math.cos(theta) * r * radius;
    positions[i * 3 + 1] = y * radius;
    positions[i * 3 + 2] = Math.sin(theta) * r * radius;
  }
  return positions;
}

function lerpUniform(current: number, target: number, rate: number, dt: number) {
  return current + (target - current) * Math.min(1, rate * dt * 60);
}

export function BubbleScene() {
  const mountRef = useRef<HTMLDivElement>(null);
  const { theme } = useTheme();
  const bubble = useBubble();
  const scrollCtx = useScrollProgress();

  const bubbleRef = useRef(bubble);
  bubbleRef.current = bubble;
  const scrollRef = useRef(scrollCtx);
  scrollRef.current = scrollCtx;

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(CAMERA_FOV, w / h, 0.1, 100);

    const count = w < 768 ? 18000 : PARTICLE_COUNT;
    const basePositions = fibonacciSphere(count);
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(basePositions.slice(), 3));
    geometry.setAttribute('aBasePosition', new THREE.BufferAttribute(basePositions.slice(), 3));
    const randoms = new Float32Array(count);
    for (let i = 0; i < count; i++) randoms[i] = Math.random();
    geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

    const uniforms = {
      uTime: { value: 0 },
      uWobble: { value: 0.56 },
      uWobbleType: { value: WOBBLE_TYPES.NEBULA as number },
      uCurl: { value: 0 },
      uCurlFrequency: { value: 0.05 },
      uLockShell: { value: 0 },
      uScale: { value: 1 },
      uMorphProgress: { value: 1 },
      uColor: { value: new THREE.Color('#43cabc') },
      uColorMix: { value: 0 },
      uRim: { value: 0 },
      uShellTint: { value: 0 },
      uTintColor: { value: new THREE.Color('#7a3d99') },
      uAdditive: { value: 1 },
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: bubbleVertexShader,
      fragmentShader: bubbleFragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    let morphState: 'idle' | 'morphing' | 'stable' = 'idle';
    let morphProgress = 0;
    let activeSection: SectionId = 'hero';
    let targets = BUBBLE_CONFIG.hero;
    let introScale = 0;
    let introDone = false;
    let rotY = 0;
    let raf = 0;
    let last = performance.now();
    let readySent = false;

    const resize = () => {
      const nw = window.innerWidth;
      const nh = window.innerHeight;
      renderer.setSize(nw, nh);
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', resize);

    const animate = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      uniforms.uTime.value += dt;

      const {
        screenPos,
        currentSection,
        shouldMorph,
        isTransitioning,
        workProjectColor,
        gridMetrics,
        setReady,
      } = bubbleRef.current;

      const progress =
        typeof scrollRef.current === 'number'
          ? { hero: 0, work: 0, services: 0, about: 0, footer: 0 }
          : scrollRef.current.progress;

      if (currentSection !== activeSection) {
        activeSection = currentSection;
        morphState = 'morphing';
        morphProgress = 0;
        targets = BUBBLE_CONFIG[activeSection];
      }

      if (shouldMorph === activeSection && morphState === 'idle') {
        morphState = 'morphing';
        morphProgress = 0;
      }

      const morphSpeed = activeSection === 'footer' ? 0.25 : 1.5;
      if (morphState === 'morphing') {
        morphProgress += dt * morphSpeed;
        if (morphProgress >= 1) morphState = 'stable';
      }

      let heroWobble = targets.wobble;
      let heroType = targets.wobbleType;
      let heroLock = targets.lockShell;
      if (activeSection === 'hero') {
        const t = Math.min(1, progress.hero / HERO_MORPH_END);
        if (t < 0.5) {
          heroWobble = THREE.MathUtils.lerp(1, 0, t * 2);
          heroLock = THREE.MathUtils.lerp(0, 1, t * 2);
          heroType = WOBBLE_TYPES.ORGANIC;
        } else {
          heroWobble = THREE.MathUtils.lerp(0, 0.56, (t - 0.5) * 2);
          heroType = WOBBLE_TYPES.NEBULA;
          heroLock = 0;
        }
      }

      uniforms.uWobble.value = lerpUniform(uniforms.uWobble.value, heroWobble, 0.2, dt);
      uniforms.uWobbleType.value = heroType;
      uniforms.uCurl.value = lerpUniform(uniforms.uCurl.value, targets.curl, 0.1, dt);
      uniforms.uCurlFrequency.value = lerpUniform(
        uniforms.uCurlFrequency.value,
        targets.curlFrequency,
        0.1,
        dt
      );
      uniforms.uLockShell.value = lerpUniform(uniforms.uLockShell.value, heroLock, 0.15, dt);

      const bs = gridMetrics?.blockSize ?? 90;
      const targetScale = targets.scale * getProductionParticleScale(bs, window.innerHeight);
      uniforms.uScale.value = lerpUniform(uniforms.uScale.value, targetScale, 0.12, dt);

      if (activeSection === 'services' && morphState === 'stable') {
        uniforms.uColorMix.value = lerpUniform(uniforms.uColorMix.value, progress.services, 0.1, dt);
        uniforms.uRim.value = lerpUniform(uniforms.uRim.value, 0.6 * progress.services, 0.1, dt);
      } else {
        uniforms.uColorMix.value = lerpUniform(uniforms.uColorMix.value, 0, 0.1, dt);
        uniforms.uRim.value = lerpUniform(uniforms.uRim.value, 0, 0.1, dt);
      }

      if (activeSection === 'work') {
        uniforms.uShellTint.value = lerpUniform(uniforms.uShellTint.value, 0.85, 0.08, dt);
        uniforms.uTintColor.value.set(workProjectColor);
      } else {
        uniforms.uShellTint.value = lerpUniform(uniforms.uShellTint.value, 0, 0.08, dt);
      }

      if (activeSection === 'about') {
        const rotT = Math.max(0, Math.min(1, (progress.about - 0.2) / 0.8));
        rotY = rotT * ((900 * Math.PI) / 180);
        points.rotation.y = rotY;
      } else {
        points.rotation.y += dt * targets.rotationSpeed;
      }

      if (!introDone) {
        introScale += dt / 1.2;
        if (introScale >= 1) {
          introScale = 1;
          introDone = true;
        }
        points.scale.setScalar(1 - Math.pow(2, -10 * introScale));
      }

      alignCameraToScreenPoint(
        camera,
        screenPos.x,
        screenPos.y,
        window.innerWidth,
        window.innerHeight
      );

      renderer.domElement.style.opacity = isTransitioning ? '0' : '1';
      renderer.render(scene, camera);

      if (!readySent && introDone) {
        readySent = true;
        setReady(true);
      }

      raf = requestAnimationFrame(animate);
    };

    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [theme]);

  useEffect(() => {
    // Theme updates without recreating renderer — handled via separate effect if needed
  }, [theme]);

  return (
    <div
      ref={mountRef}
      className="bubble-canvas-layer"
      aria-hidden="true"
      style={{ opacity: bubble.isReady ? 1 : 0 }}
    />
  );
}
