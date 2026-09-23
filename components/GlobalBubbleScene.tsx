'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from '@/context/ThemeContext';

// Fast 3D Simplex noise generator
function createNoise3D() {
  const p = new Uint8Array(512);
  for (let i = 0; i < 256; i++) p[i] = p[i + 256] = Math.floor(Math.random() * 256);

  const grad3 = [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, 1, -1], [-0, -1, -1],
  ];

  function dot(g: number[], x: number, y: number, z: number) {
    return g[0] * x + g[1] * y + g[2] * z;
  }

  return function (xin: number, yin: number, zin: number) {
    const s = (xin + yin + zin) / 3;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const k = Math.floor(zin + s);
    const t = (i + j + k) / 6;
    const X0 = i - t;
    const Y0 = j - t;
    const Z0 = k - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;
    const z0 = zin - Z0;

    let i1, j1, k1, i2, j2, k2;
    if (x0 >= y0) {
      if (y0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
      else if (x0 >= z0) { i1 = 1; j1 = 0; k1 = 0; i2 = 1; j2 = 0; k2 = 1; }
      else { i1 = 0; j1 = 0; k1 = 1; i2 = 1; j2 = 0; k2 = 1; }
    } else {
      if (y0 < z0) { i1 = 0; j1 = 0; k1 = 1; i2 = 0; j2 = 1; k2 = 1; }
      else if (x0 < z0) { i1 = 0; j1 = 1; k1 = 0; i2 = 0; j2 = 1; k2 = 1; }
      else { i1 = 0; j1 = 1; k1 = 0; i2 = 1; j2 = 1; k2 = 0; }
    }

    const x1 = x0 - i1 + 1 / 6;
    const y1 = y0 - j1 + 1 / 6;
    const z1 = z0 - k1 + 1 / 6;
    const x2 = x0 - i2 + 2 / 6;
    const y2 = y0 - j2 + 2 / 6;
    const z2 = z0 - k2 + 2 / 6;
    const x3 = x0 - 1 + 3 / 6;
    const y3 = y0 - 1 + 3 / 6;
    const z3 = z0 - 1 + 3 / 6;

    const ii = i & 255;
    const jj = j & 255;
    const kk = k & 255;

    let n0 = 0, n1 = 0, n2 = 0, n3 = 0;
    let t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
    if (t0 > 0) {
      t0 *= t0;
      const gi0 = p[ii + p[jj + p[kk]]] % 12;
      n0 = t0 * t0 * dot(grad3[gi0], x0, y0, z0);
    }
    let t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
    if (t1 > 0) {
      t1 *= t1;
      const gi1 = p[ii + i1 + p[jj + j1 + p[kk + k1]]] % 12;
      n1 = t1 * t1 * dot(grad3[gi1], x1, y1, z1);
    }
    let t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
    if (t2 > 0) {
      t2 *= t2;
      const gi2 = p[ii + i2 + p[jj + j2 + p[kk + k2]]] % 12;
      n2 = t2 * t2 * dot(grad3[gi2], x2, y2, z2);
    }
    let t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
    if (t3 > 0) {
      t3 *= t3;
      const gi3 = p[ii + 1 + p[jj + 1 + p[kk + 1]]] % 12;
      n3 = t3 * t3 * dot(grad3[gi3], x3, y3, z3);
    }
    return 32 * (n0 + n1 + n2 + n3);
  };
}

// 3D Curl noise implementation for organic swirling filaments
function createCurlNoise(noise3D: (x: number, y: number, z: number) => number) {
  const eps = 0.001;
  return function (x: number, y: number, z: number) {
    const dx = (noise3D(x + eps, y, z) - noise3D(x - eps, y, z)) / (2 * eps);
    const dy = (noise3D(x, y + eps, z) - noise3D(x, y - eps, z)) / (2 * eps);
    const dz = (noise3D(x, y, z + eps) - noise3D(x, y, z - eps)) / (2 * eps);

    return {
      x: dy - dz,
      y: dz - dx,
      z: dx - dy,
    };
  };
}

// Camera offset alignment to map 3D mesh precisely to screen pixel coordinate
const BUBBLE_CAMERA_DISTANCE = 8;
const BUBBLE_CAMERA_FOV = 50;

function alignCameraToScreenPoint(
  camera: THREE.PerspectiveCamera,
  screenX: number,
  screenY: number,
  viewportWidth: number,
  viewportHeight: number
) {
  camera.fov = BUBBLE_CAMERA_FOV;
  camera.aspect = viewportWidth / viewportHeight;
  camera.position.set(0, 0, BUBBLE_CAMERA_DISTANCE);
  camera.rotation.set(0, 0, 0);
  camera.clearViewOffset();
  camera.updateProjectionMatrix();
  camera.updateMatrixWorld(true);

  const offsetX = Math.round(viewportWidth / 2 - screenX);
  const offsetY = Math.round(viewportHeight / 2 - screenY);
  if (offsetX !== 0 || offsetY !== 0) {
    camera.setViewOffset(viewportWidth, viewportHeight, offsetX, offsetY, viewportWidth, viewportHeight);
    camera.updateProjectionMatrix();
  }
}

export function GlobalBubbleScene() {
  const { theme } = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let width = window.innerWidth;
    let height = window.innerHeight;

    // Three.js Scene Setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(BUBBLE_CAMERA_FOV, width / height, 0.1, 100);
    camera.position.z = BUBBLE_CAMERA_DISTANCE;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // High Density Fibonacci-distributed sphere particles (26,000 points)
    const particleCount = 26000;
    const baseGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const origPositions = new Float32Array(particleCount * 3);

    const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
    const baseRadius = 1.0;

    for (let i = 0; i < particleCount; i++) {
      const y = 1 - (i / (particleCount - 1)) * 2;
      const radiusAtY = Math.sqrt(Math.max(0, 1 - y * y));
      const theta = phi * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const i3 = i * 3;
      origPositions[i3] = x * baseRadius;
      origPositions[i3 + 1] = y * baseRadius;
      origPositions[i3 + 2] = z * baseRadius;

      positions[i3] = origPositions[i3];
      positions[i3 + 1] = origPositions[i3 + 1];
      positions[i3 + 2] = origPositions[i3 + 2];
    }

    baseGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const isDark = theme === 'dark';
    const initialColor = isDark ? new THREE.Color('#FAFAFA') : new THREE.Color('#161616');

    const material = new THREE.PointsMaterial({
      color: initialColor,
      size: 0.02,
      transparent: true,
      opacity: isDark ? 0.9 : 0.85,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    });

    const sphere = new THREE.Points(baseGeometry, material);

    // Architectural Hierarchy: meshTravelGroup -> meshAmbientGroup -> meshGeometry
    const meshTravelGroup = new THREE.Group();
    const meshAmbientGroup = new THREE.Group();
    meshAmbientGroup.add(sphere);
    meshTravelGroup.add(meshAmbientGroup);
    scene.add(meshTravelGroup);

    // Subtle faint motion residue (strictly <= 0.06 opacity)
    const dustCount = 350;
    const dustGeometry = new THREE.BufferGeometry();
    const dustPositions = new Float32Array(dustCount * 3);
    for (let i = 0; i < dustCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.1 + Math.random() * 0.35;
      const sinPhi = Math.sin(phi);
      dustPositions[i * 3] = r * sinPhi * Math.cos(theta);
      dustPositions[i * 3 + 1] = r * sinPhi * Math.sin(theta);
      dustPositions[i * 3 + 2] = r * Math.cos(phi);
    }
    dustGeometry.setAttribute('position', new THREE.BufferAttribute(dustPositions, 3));
    const dustMaterial = new THREE.PointsMaterial({
      color: initialColor,
      size: 0.012,
      transparent: true,
      opacity: 0.05,
      blending: isDark ? THREE.AdditiveBlending : THREE.NormalBlending,
      depthWrite: false,
    });
    const dustPoints = new THREE.Points(dustGeometry, dustMaterial);
    meshAmbientGroup.add(dustPoints);

    const noise3D = createNoise3D();
    const curlNoise = createCurlNoise(noise3D);

    // Mouse tracking for micro-parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetMouseX = 0;
    let targetMouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      targetMouseX = (e.clientX / width - 0.5) * 2;
      targetMouseY = (e.clientY / height - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Smooth motion states
    let currentScreenX = width / 2;
    let currentScreenY = height / 2;
    let currentScale = 1.0;

    // Morph state variables
    let currentWobble = 0.56;
    let currentCurl = 0.15;
    let currentCurlFreq = 0.18;
    let currentSpike = 0.0;
    let currentCavity = 0.0;

    const targetColor = new THREE.Color(initialColor);

    const clock = new THREE.Clock();
    let animId: number;

    const render = () => {
      const time = clock.getElapsedTime() * 0.45;

      // 1. Query all registered target docking elements across sections
      const targetElements = Array.from(
        document.querySelectorAll<HTMLElement>('[data-bubble-target="true"]')
      );

      let targetScreenX = width / 2;
      let targetScreenY = height / 2;
      let targetScale = 1.0;

      let targetWobble = 0.56;
      let targetCurl = 0.15;
      let targetCurlFreq = 0.18;
      let targetSpike = 0.0;
      let targetCavity = 0.0;

      if (targetElements.length > 0) {
        // Sort elements by vertical placement in document
        const targetInfos = targetElements
          .map((el) => {
            const rect = el.getBoundingClientRect();
            const section = el.getAttribute('data-section') || 'unknown';

            // Master chromatic and morph profiles per section
            let colorHex = isDark ? '#FAFAFA' : '#161616';
            let wobble = 0.56;
            let curl = 0.15;
            let curlFreq = 0.18;
            let spike = 0.0;
            let cavity = 0.0;
            let scale = 1.0;

            if (section === 'hero') {
              colorHex = isDark ? '#FAFAFA' : '#161616';
              wobble = 0.56;
              curl = 0.15;
              curlFreq = 0.18;
              spike = 0.0;
              cavity = 0.0;
              scale = 1.0;
            } else if (section === 'work') {
              colorHex = isDark ? '#E2E8F0' : '#262626';
              wobble = 0.22;
              curl = 0.95;
              curlFreq = 0.36;
              spike = 0.0;
              cavity = 0.0;
              scale = 1.06;
            } else if (section === 'services') {
              colorHex = isDark ? '#E8E8E8' : '#1A1A1A';
              wobble = 0.65;
              curl = 0.22;
              curlFreq = 0.24;
              spike = 0.55;
              cavity = 0.0;
              scale = 1.06;
            } else if (section === 'about') {
              // White / pale grey organic cavity shell
              colorHex = isDark ? '#FFFFFF' : '#404040';
              wobble = 0.75;
              curl = 0.38;
              curlFreq = 0.28;
              spike = 0.05;
              cavity = 0.88;
              scale = 1.02;
            } else if (section === 'footer') {
              // Dense resting orb
              colorHex = isDark ? '#FAFAFA' : '#161616';
              wobble = 0.14;
              curl = 0.08;
              curlFreq = 0.12;
              spike = 0.0;
              cavity = 0.0;
              scale = 1.2;
            }

            return {
              element: el,
              section,
              rect,
              cx: rect.left + rect.width / 2,
              cy: rect.top + rect.height / 2,
              color: new THREE.Color(colorHex),
              wobble,
              curl,
              curlFreq,
              spike,
              cavity,
              scale,
            };
          })
          .sort((a, b) => a.cy - b.cy);

        const vCenterY = height * 0.5;

        // Continuous spline interpolation based on scroll position
        if (targetInfos.length === 1 || vCenterY <= targetInfos[0].cy) {
          const t0 = targetInfos[0];
          targetScreenX = t0.cx;
          targetScreenY = t0.cy;
          targetScale = t0.scale;
          targetWobble = t0.wobble;
          targetCurl = t0.curl;
          targetCurlFreq = t0.curlFreq;
          targetSpike = t0.spike;
          targetCavity = t0.cavity;
          targetColor.copy(t0.color);
        } else if (vCenterY >= targetInfos[targetInfos.length - 1].cy) {
          const tLast = targetInfos[targetInfos.length - 1];
          targetScreenX = tLast.cx;
          targetScreenY = tLast.cy;
          targetScale = tLast.scale;
          targetWobble = tLast.wobble;
          targetCurl = tLast.curl;
          targetCurlFreq = tLast.curlFreq;
          targetSpike = tLast.spike;
          targetCavity = tLast.cavity;
          targetColor.copy(tLast.color);
        } else {
          let idxA = 0;
          for (let i = 0; i < targetInfos.length - 1; i++) {
            if (targetInfos[i].cy <= vCenterY && targetInfos[i + 1].cy >= vCenterY) {
              idxA = i;
              break;
            }
          }
          const tA = targetInfos[idxA];
          const tB = targetInfos[idxA + 1];
          const span = tB.cy - tA.cy;
          const rawT = span > 0 ? (vCenterY - tA.cy) / span : 0;
          const clampedT = Math.max(0, Math.min(1, rawT));
          const easeT = clampedT * clampedT * (3 - 2 * clampedT);

          targetScreenX = tA.cx + (tB.cx - tA.cx) * easeT;
          targetScreenY = tA.cy + (tB.cy - tA.cy) * easeT;
          targetScale = tA.scale + (tB.scale - tA.scale) * easeT;
          targetWobble = tA.wobble + (tB.wobble - tA.wobble) * easeT;
          targetCurl = tA.curl + (tB.curl - tA.curl) * easeT;
          targetCurlFreq = tA.curlFreq + (tB.curlFreq - tA.curlFreq) * easeT;
          targetSpike = tA.spike + (tB.spike - tA.spike) * easeT;
          targetCavity = tA.cavity + (tB.cavity - tA.cavity) * easeT;
          targetColor.copy(tA.color).lerp(tB.color, easeT);
        }
      }

      // Tight scroll following — stops when scrolling stops
      currentScreenX += (targetScreenX - currentScreenX) * 0.4;
      currentScreenY += (targetScreenY - currentScreenY) * 0.4;
      currentScale += (targetScale - currentScale) * 0.3;

      currentWobble += (targetWobble - currentWobble) * 0.25;
      currentCurl += (targetCurl - currentCurl) * 0.25;
      currentCurlFreq += (targetCurlFreq - currentCurlFreq) * 0.25;
      currentSpike += (targetSpike - currentSpike) * 0.25;
      currentCavity += (targetCavity - currentCavity) * 0.25;

      // Color interpolation
      material.color.lerp(targetColor, 0.2);
      dustMaterial.color.lerp(targetColor, 0.2);

      // Micro mouse parallax
      mouseX += (targetMouseX - mouseX) * 0.08;
      mouseY += (targetMouseY - mouseY) * 0.08;

      // Align camera to target screen coordinates (only camera view offset writes screen position)
      alignCameraToScreenPoint(camera, currentScreenX, currentScreenY, width, height);

      // Macro scale and position strictly written to meshTravelGroup
      meshTravelGroup.scale.setScalar(currentScale);

      // Ambient micro-rotation written strictly to meshAmbientGroup
      meshAmbientGroup.rotation.y = time * 0.25 + mouseX * 0.15;
      meshAmbientGroup.rotation.x = time * 0.15 + mouseY * 0.12;
      dustPoints.rotation.y = -time * 0.15;

      // Organic Simplex + Curl + Spikes + Cavity Shell Deformation
      const posArray = baseGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        const ox = origPositions[i3];
        const oy = origPositions[i3 + 1];
        const oz = origPositions[i3 + 2];

        const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
        const nx = ox / len;
        const ny = oy / len;
        const nz = oz / len;

        // Base 3D Simplex
        const nVal = noise3D(nx * 1.4 + time, ny * 1.4 + time, nz * 1.4 + time);

        // 3D Curl turbulence
        const curl = curlNoise(
          nx * currentCurlFreq + time * 0.2,
          ny * currentCurlFreq + time * 0.2,
          nz * currentCurlFreq + time * 0.2
        );

        // Spike bursts for services
        const spikeVal =
          Math.pow(Math.max(0, nVal), 3.4) * currentSpike * 1.15 +
          Math.sin(nx * 14.0 + time * 2.5) * Math.cos(nz * 14.0 + time * 2.5) * currentSpike * 0.14;

        // Shell cavity wave for about section
        const rXZ = Math.sqrt(nx * nx + nz * nz);
        const cavityIndentation =
          (Math.sin(ny * 5.0 + time * 1.4) * 0.35 - Math.exp(-rXZ * 2.8) * 0.55) * currentCavity;

        const displacement = 1.0 + nVal * currentWobble * 0.22 + spikeVal + cavityIndentation;

        posArray[i3] = (nx + curl.x * currentCurl * 0.35) * displacement;
        posArray[i3 + 1] = (ny + curl.y * currentCurl * 0.35) * displacement;
        posArray[i3 + 2] = (nz + curl.z * currentCurl * 0.35) * displacement;
      }
      baseGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      renderer.setSize(width, height);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        cancelAnimationFrame(animId);
      } else {
        clock.start();
        animId = requestAnimationFrame(render);
      }
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      baseGeometry.dispose();
      dustGeometry.dispose();
      material.dispose();
      dustMaterial.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 4,
      }}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />
    </div>
  );
}
