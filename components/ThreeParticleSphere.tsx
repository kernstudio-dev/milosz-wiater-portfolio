'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Fast 3D Simplex-like noise implementation for organic sphere deformation
function createNoise3D() {
  const p = new Uint8Array(512);
  for (let i = 0; i < 256; i++) p[i] = p[i + 256] = Math.floor(Math.random() * 256);

  const grad3 = [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
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

interface ThreeParticleSphereProps {
  theme?: 'dark' | 'light';
}

export function ThreeParticleSphere({ theme = 'dark' }: ThreeParticleSphereProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 320;
    const height = container.clientHeight || 320;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create icosahedron particle sphere with subdivisions
    const detail = 24; // dense points
    const baseGeometry = new THREE.IcosahedronGeometry(1.4, detail);
    const positionAttr = baseGeometry.attributes.position;
    const count = positionAttr.count;

    // Save original positions
    const origPositions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      origPositions[i] = positionAttr.array[i];
    }

    // Colors
    const isDark = theme === 'dark';
    const pointColor = isDark ? new THREE.Color('#FAFAFA') : new THREE.Color('#18181B');

    const material = new THREE.PointsMaterial({
      color: pointColor,
      size: 0.024,
      transparent: true,
      opacity: isDark ? 0.75 : 0.65,
    });

    const points = new THREE.Points(baseGeometry, material);
    scene.add(points);

    // 3D Simplex Noise generator
    const noise3D = createNoise3D();

    // Mouse tracking for interactive rotation
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      targetX = x * 1.5;
      targetY = y * 1.5;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Animation Loop
    let clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      const time = clock.getElapsedTime() * 0.45;

      // Smooth mouse lerp
      mouseX += (targetX - mouseX) * 0.05;
      mouseY += (targetY - mouseY) * 0.05;

      points.rotation.y = time * 0.4 + mouseX;
      points.rotation.x = time * 0.25 + mouseY;

      // Deform sphere surface with organic noise
      const positions = baseGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < count; i++) {
        const i3 = i * 3;
        const ox = origPositions[i3];
        const oy = origPositions[i3 + 1];
        const oz = origPositions[i3 + 2];

        // Normalized vector
        const len = Math.sqrt(ox * ox + oy * oy + oz * oz);
        const nx = ox / len;
        const ny = oy / len;
        const nz = oz / len;

        // Noise displacement
        const noise = noise3D(nx * 1.2 + time, ny * 1.2 + time, nz * 1.2 + time);
        const displacement = 1.35 + noise * 0.22;

        positions[i3] = nx * displacement;
        positions[i3 + 1] = ny * displacement;
        positions[i3 + 2] = nz * displacement;
      }
      baseGeometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animId = requestAnimationFrame(animate);

    // Resize handling
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      baseGeometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    />
  );
}
