/*
 * KERN orb — one point membrane, three independent motion systems.
 *
 *  macro   : travelGroup transform (scroll only, CPU)
 *  ambient : uTime-driven deformation below + ambientGroup drift (time only)
 *  pointer : world-space swell under the cursor (pointer only, damped on CPU)
 *
 * The membrane is a set of latitude rings (see BubbleScene#buildOrbGeometry).
 * All shape comes from ONE radius function r(dir) with three frequency bands:
 *   fold   – low frequency, domain-warped, owns the silhouette
 *   ridge  – medium frequency ridged noise, travelling creases
 *   detail – fine grain, very small
 * Distribution modifiers (flow / ribbon / volume / shells) re-arrange the same
 * points so each section personality reads as a different sculpture.
 */

const simplex = /* glsl */ `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0))
    + i.y + vec4(0.0, i1.y, i2.y, 1.0))
    + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
}
`;

export const bubbleVertexShader = /* glsl */ `
uniform float uTime;
uniform float uFold;
uniform float uFoldFreq;
uniform float uWarp;
uniform float uRidge;
uniform float uRidgeFreq;
uniform float uDetail;
uniform float uDetailFreq;
uniform float uFlow;
uniform float uRibbon;
uniform float uVolume;
uniform float uShells;
uniform float uBaseRadius;
uniform float uPointSize;
uniform float uPresence;
uniform float uTransition;
uniform vec3 uPointerWorld;
uniform float uPointerStrength;
uniform vec3 uOrbCenter;
uniform float uOrbRadius;

attribute vec3 aSphere;
attribute vec3 aVolume;
attribute float aShell;
attribute float aRandom;
attribute float aPhase;

varying float vAlpha;
varying float vShade;
varying float vRim;
varying float vDepth;

${simplex}

mat2 rot2(float a) { float s = sin(a); float c = cos(a); return mat2(c, -s, s, c); }

// Slow, non-periodic domain rotation so the field morphs instead of scrolling.
vec3 domain(vec3 d, float t) {
  d.xz = rot2(t * 0.047) * d.xz;
  d.xy = rot2(t * 0.031 + 0.6) * d.xy;
  return d;
}

vec3 warpField(vec3 p, float t) {
  return vec3(
    snoise(p * 0.72 + vec3(0.0, 0.0, t * 0.105)),
    snoise(p * 0.72 + vec3(5.2, 1.3, -t * 0.089)),
    snoise(p * 0.72 + vec3(2.1, 7.7, t * 0.097))
  );
}

// r(dir) - 1 : the whole sculptural form.
float relief(vec3 d, vec3 w, float t) {
  vec3 p = domain(d, t);
  float fold = snoise(p * uFoldFreq + w * uWarp + vec3(t * 0.121, -t * 0.083, t * 0.064)) * 0.58
             + snoise(p * uFoldFreq * 0.52 + vec3(-t * 0.071, t * 0.093, 3.7)) * 0.5;
  float ridge = 1.0 - abs(snoise(p * uRidgeFreq + w * 0.62 + vec3(t * 0.087, -t * 0.113, t * 0.069)));
  ridge = ridge * ridge * ridge;
  float detail = snoise(d * uDetailFreq + vec3(t * 0.19, t * 0.14, -t * 0.17));
  float breath = snoise(vec3(t * 0.083, 1.7, 3.1)) * 0.018;
  return uFold * fold + uRidge * (ridge - 0.3) + uDetail * detail + breath;
}

void main() {
  float t = uTime;
  vec3 d = aSphere;
  vec3 w = warpField(d, t);

  // RIBBON — gather azimuth toward drifting meridians (open lantern).
  if (uRibbon > 0.001) {
    float az = atan(d.z, d.x);
    float el = asin(clamp(d.y, -1.0, 1.0));
    float k = 9.0;
    float drift = t * 0.035 + w.x * 0.25;
    az -= uRibbon * 0.92 * sin(k * (az - drift)) / k;
    d = vec3(cos(el) * cos(az), sin(el), cos(el) * sin(az));
  }

  // FLOW — latitude/noise dependent twist + tangential slide: rings become fibres.
  if (uFlow > 0.001) {
    float twist = uFlow * (1.55 * d.y + 1.05 * snoise(d * 1.15 + vec3(0.0, t * 0.074, 1.9)));
    d.xz = rot2(twist) * d.xz;
    vec3 tangential = w - dot(w, d) * d;
    d = normalize(d + tangential * uFlow * 0.2);
  }

  // SHELLS — ordered nested layers, counter-rotating slowly.
  float shellRadius = mix(0.4, 1.0, aShell);
  if (uShells > 0.001) {
    d.xz = rot2(uShells * (aShell - 0.5) * t * 0.26) * d.xz;
    d.yz = rot2(uShells * (aShell - 0.5) * 0.9) * d.yz;
  }

  float r = 1.0 + relief(d, w, t);

  // Normal of the displaced surface from two tangent samples.
  vec3 helper = abs(d.y) < 0.98 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 ta = normalize(cross(d, helper));
  vec3 tb = cross(d, ta);
  const float e = 0.045;
  float ra = 1.0 + relief(normalize(d + ta * e), w, t);
  float rb = 1.0 + relief(normalize(d + tb * e), w, t);
  vec3 n = normalize(d - (((ra - r) / e) * ta + ((rb - r) / e) * tb) / r);

  float layered = r * mix(1.0, shellRadius, uShells);
  vec3 pos = d * layered;

  // VOLUME — the same points collapse into a slowly swirling dust body.
  vec3 v = aVolume;
  v.xz = rot2(t * (0.05 + (1.0 - length(aVolume)) * 0.09)) * v.xz;
  // Only a growing fraction of points leaves the skin, so the membrane survives.
  float toCore = clamp((uVolume * 1.15 - aRandom) * 9.0, 0.0, 1.0);
  pos = mix(pos, v * r * 0.92, toCore);
  n = normalize(mix(n, d, toCore * 0.8 + uShells * 0.5));

  pos *= uBaseRadius;

  // Scroll-owned transitional compression (macro system).
  pos.xz *= 1.0 + uTransition * 0.06;
  pos.y *= 1.0 - uTransition * 0.05;

  vec4 world = modelMatrix * vec4(pos, 1.0);
  vec3 sphereView = normalize(normalMatrix * aSphere);
  vec3 normalView = normalize(normalMatrix * n);

  // POINTER — world-space swell that stays under the cursor whatever the rotation.
  vec2 dp = world.xy - uPointerWorld.xy;
  float sigma = uOrbRadius * 0.52;
  float field = exp(-dot(dp, dp) / (sigma * sigma)) * uPointerStrength * smoothstep(-0.25, 0.45, sphereView.z);
  vec3 outward = normalize(world.xyz - uOrbCenter + vec3(0.0001));
  float ripple = sin(length(dp) / sigma * 5.5 - t * 2.1 + aPhase * 0.15);
  world.xyz += outward * field * uOrbRadius * (0.17 + ripple * 0.025);
  world.z += field * uOrbRadius * 0.15;
  world.xy -= dp * field * 0.1;

  vec4 mvPosition = viewMatrix * world;
  gl_Position = projectionMatrix * mvPosition;

  // Sculptural light: key light + rim, back hemisphere dimmed for depth.
  vec3 lightDir = normalize(vec3(-0.5, 0.62, 0.6));
  float lambert = max(dot(normalView, lightDir), 0.0);
  float rim = 1.0 - abs(normalView.z);
  float front = smoothstep(-0.45, 0.3, sphereView.z);
  vShade = clamp(0.16 + lambert * 0.74 + field * 0.3, 0.0, 1.2);
  vRim = rim;
  vDepth = front;

  float grain = mix(0.72, 1.0, aRandom);
  float lit = mix(0.2 + 0.8 * vShade, 0.5, toCore);
  vAlpha = grain * lit * mix(0.34, 1.0, front) * (0.62 + 0.55 * pow(rim, 2.2)) * uPresence;

  gl_PointSize = uPointSize * mix(0.82, 1.18, aRandom) * mix(1.0, 0.8, toCore) / -mvPosition.z;
}
`;

export const bubbleFragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform float uColorMix;
uniform float uRim;
uniform float uShellTint;
uniform vec3 uTintColor;

varying float vAlpha;
varying float vShade;
varying float vRim;
varying float vDepth;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float dist = length(c);
  if (dist > 0.5) discard;
  float disc = smoothstep(0.5, 0.22, dist);

  // light points, brightness follows the key light
  vec3 color = mix(vec3(0.46, 0.49, 0.55), vec3(0.97, 0.97, 0.99), clamp(vShade, 0.0, 1.0));

  vec3 tint = uTintColor * (0.55 + 0.6 * vShade);
  color = mix(color, tint, uShellTint * (0.45 + 0.4 * vRim));
  vec3 accent = uColor * (0.5 + 0.7 * vShade);
  color = mix(color, accent, uColorMix * (0.55 + 0.35 * vRim));
  vec3 rimColor = vec3(0.3, 0.72, 0.65);
  color = mix(color, rimColor, uRim * pow(vRim, 3.0) * 0.8);

  float alpha = disc * vAlpha;
  gl_FragColor = vec4(color, alpha);
}
`;
