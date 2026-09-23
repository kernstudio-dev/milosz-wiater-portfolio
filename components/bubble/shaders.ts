export const bubbleVertexShader = /* glsl */ `
uniform float uTime;
uniform float uWobble;
uniform float uWobbleType;
uniform float uCurl;
uniform float uCurlFrequency;
uniform float uLockShell;
uniform float uScale;
uniform float uMorphProgress;

attribute vec3 aBasePosition;
attribute float aRandom;

varying float vAlpha;
varying vec3 vColor;

// Simplex-ish noise
float hash(vec3 p) {
  p = fract(p * 0.3183099 + 0.1);
  p *= 17.0;
  return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
}

float noise(vec3 x) {
  vec3 i = floor(x);
  vec3 f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x),
        mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
    mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
        mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}

vec3 wobbleOrganic(vec3 p, float t) {
  float n = noise(p * 2.0 + t);
  return p + normalize(p) * n * uWobble * 0.35;
}

vec3 wobbleSpikeBurst(vec3 p, float t) {
  float spikes = pow(abs(sin(p.x * 8.0 + t) * sin(p.y * 8.0 + t) * sin(p.z * 8.0 + t)), 0.3);
  return p + normalize(p) * spikes * uWobble * 0.5;
}

vec3 wobbleCorona(vec3 p, float t) {
  float flare = pow(max(0.0, dot(normalize(p), vec3(0.0, 0.0, 1.0))), 2.0);
  float n = noise(p * 3.0 + t * 0.5);
  return p + normalize(p) * (flare * 0.6 + n * 0.2) * uWobble * 0.45;
}

vec3 wobbleCubeLattice(vec3 p, float t) {
  vec3 q = abs(fract(p * 2.0 + t * 0.1) - 0.5);
  float edge = min(min(q.x, q.y), q.z);
  return p + normalize(p) * (1.0 - smoothstep(0.0, 0.15, edge)) * uWobble * 0.4;
}

vec3 applyWobble(vec3 p, float t) {
  int type = int(uWobbleType + 0.5);
  if (type == 3) return wobbleSpikeBurst(p, t);
  if (type == 4) return wobbleCorona(p, t);
  // Reference quirk: NEBULA (9) falls through to cube lattice
  if (type == 9 || type == 8) return wobbleCubeLattice(p, t);
  if (type == 0) return wobbleOrganic(p, t);
  return wobbleOrganic(p, t);
}

vec3 applyCurl(vec3 p, float t) {
  if (uCurl < 0.01) return p;
  float eps = 0.01;
  float n1 = noise(p * uCurlFrequency + t);
  float n2 = noise(p * uCurlFrequency + vec3(eps, 0.0, 0.0) + t);
  float n3 = noise(p * uCurlFrequency + vec3(0.0, eps, 0.0) + t);
  vec3 curl = vec3(n2 - n1, n3 - n1, n1 - n2);
  return p + curl * uCurl * 0.8;
}

void main() {
  vec3 pos = mix(aBasePosition, aBasePosition, uMorphProgress);
  pos *= uScale;

  float shell = length(pos);
  vec3 dir = normalize(pos);

  pos = applyWobble(pos, uTime);
  pos = applyCurl(pos, uTime);

  if (uLockShell > 0.5) {
    pos = normalize(pos) * shell;
  }

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float pointSize = 5.0 / -mvPosition.z;
  gl_PointSize = pointSize;

  vAlpha = 0.55 + aRandom * 0.45;
  vColor = vec3(0.92, 0.92, 0.94);
}
`;

export const bubbleFragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform float uColorMix;
uniform float uRim;
uniform float uShellTint;
uniform vec3 uTintColor;
uniform float uAdditive;

varying float vAlpha;
varying vec3 vColor;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;

  float soft = smoothstep(0.5, 0.1, d);
  vec3 col = mix(vColor, uTintColor, uShellTint);
  col = mix(col, uColor, uColorMix);
  col += uRim * soft * vec3(0.3, 0.8, 0.75);

  float alpha = soft * vAlpha;
  if (uAdditive > 0.5) {
    gl_FragColor = vec4(col * alpha, alpha);
  } else {
    gl_FragColor = vec4(col, alpha);
  }
}
`;
