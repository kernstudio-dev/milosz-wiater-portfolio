export const bubbleVertexShader = /* glsl */ `
uniform float uTime;
uniform float uShape;
uniform float uEnergy;
uniform float uBreath;
uniform float uLowAmplitude;
uniform float uMediumAmplitude;
uniform float uDetailAmplitude;
uniform float uLowFrequency;
uniform float uMediumFrequency;
uniform float uDetailFrequency;
uniform float uDensityMotion;
uniform vec3 uStretch;
uniform float uScale;
uniform float uPointSize;
uniform float uPresence;
uniform float uLightTheme;
uniform float uTransition;
uniform vec2 uPointer;
uniform float uPointerStrength;

attribute vec3 aBasePosition;
attribute float aRandom;
attribute float aLayer;
attribute float aPhase;

varying float vAlpha;
varying float vLayer;
varying float vEdge;
varying vec3 vColor;

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
    mix(mix(hash(i), hash(i + vec3(1.0, 0.0, 0.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 0.0)), hash(i + vec3(1.0, 1.0, 0.0)), f.x), f.y),
    mix(mix(hash(i + vec3(0.0, 0.0, 1.0)), hash(i + vec3(1.0, 0.0, 1.0)), f.x),
        mix(hash(i + vec3(0.0, 1.0, 1.0)), hash(i + vec3(1.0, 1.0, 1.0)), f.x), f.y), f.z
  );
}

float fbm(vec3 p) {
  float value = 0.0;
  float amplitude = 0.5;
  for (int octave = 0; octave < 4; octave++) {
    value += noise(p) * amplitude;
    p = p * 2.03 + vec3(9.2, 4.7, 7.1);
    amplitude *= 0.5;
  }
  return value;
}

mat2 rotate2d(float angle) {
  float s = sin(angle);
  float c = cos(angle);
  return mat2(c, -s, s, c);
}

float layerResponse() {
  if (aLayer < 0.5) return 1.0;
  if (aLayer < 1.5) return 0.56;
  return 0.34;
}

vec3 organicShape(vec3 p, float t) {
  vec3 dir = normalize(p);
  float response = layerResponse();
  float broad = fbm(dir * 2.35 + vec3(t * 0.045, -t * 0.032, t * 0.038));
  float fine = fbm(dir * 5.4 - vec3(t * 0.026, t * 0.021, -t * 0.018));
  float ripple = sin(dir.y * 5.0 + aPhase + t * 0.11) * 0.5 + 0.5;
  float displacement = ((broad - 0.48) * 0.19 + (fine - 0.5) * 0.055 + (ripple - 0.5) * 0.035);
  return p + dir * displacement * uEnergy * response;
}

vec3 ribbonShape(vec3 p, float t) {
  vec3 dir = normalize(p);
  float response = layerResponse();
  float latitude = dir.y * 3.1;
  float twist = sin(latitude + aPhase * 0.16 + t * 0.055) * 0.2 * uEnergy * response;
  p.xz = rotate2d(twist) * p.xz;
  float band = sin(latitude * 2.15 + atan(dir.z, dir.x) * 1.7 + t * 0.08);
  float grain = fbm(dir * 3.8 + vec3(t * 0.028, 0.0, -t * 0.021)) - 0.5;
  return p + normalize(p) * (band * 0.105 + grain * 0.11) * uEnergy * response;
}

vec3 petalShape(vec3 p, float t) {
  vec3 dir = normalize(p);
  float response = layerResponse();
  float azimuth = atan(dir.y, dir.x);
  float elevation = asin(clamp(dir.z, -1.0, 1.0));
  float petals = sin(azimuth * 6.0 + elevation * 2.25 + t * 0.075);
  float secondary = sin(azimuth * 3.0 - elevation * 4.0 - t * 0.052);
  float grain = fbm(dir * 4.1 + vec3(-t * 0.018, t * 0.024, t * 0.016)) - 0.5;
  float filament = pow(max(0.0, petals), 7.0) * smoothstep(0.965, 1.0, aRandom) * 0.2;
  float displacement = petals * 0.09 + secondary * 0.036 + grain * 0.11 + filament;
  return p + dir * displacement * uEnergy * response;
}

vec3 foldedShape(vec3 p, float t) {
  vec3 dir = normalize(p);
  float response = layerResponse();
  float azimuth = atan(dir.y, dir.x);
  float elevation = asin(clamp(dir.z, -1.0, 1.0));
  float fourFold = cos(azimuth * 4.0 + sin(elevation * 3.0) * 0.72 + t * 0.045);
  float seam = sin(azimuth * 2.0 - elevation * 5.0 - t * 0.036);
  float grain = fbm(dir * 3.25 + vec3(t * 0.016, -t * 0.019, t * 0.013)) - 0.5;
  float crease = pow(1.0 - abs(seam), 5.0);
  float displacement = fourFold * 0.09 + seam * 0.05 + grain * 0.09 - crease * 0.055;
  vec3 folded = p + dir * displacement * uEnergy * response;
  folded.xy *= 1.0 + (0.028 * fourFold - 0.045 * crease) * uEnergy * response;
  return folded;
}

vec3 morphShape(vec3 p, float t) {
  vec3 organic = organicShape(p, t);
  vec3 ribbon = ribbonShape(p, t);
  vec3 petal = petalShape(p, t);
  vec3 folded = foldedShape(p, t);

  if (uShape < 1.0) return mix(organic, ribbon, smoothstep(0.0, 1.0, uShape));
  if (uShape < 2.0) return mix(ribbon, petal, smoothstep(1.0, 2.0, uShape));
  return mix(petal, folded, smoothstep(2.0, 3.0, uShape));
}

// A shared flow field moves the silhouette coherently. Fine point drift below
// adds life without turning the outer surface into independent jitter.
vec3 ambientShape(vec3 p, float t) {
  vec3 dir = normalize(p);
  float response = layerResponse();
  vec3 lowOffset = vec3(t * 0.19, -t * 0.137, t * 0.163);
  vec3 midOffset = vec3(-t * 0.27, t * 0.215, -t * 0.23);
  vec3 warp = vec3(
    fbm(dir * 1.05 + lowOffset),
    fbm(dir.yzx * 1.2 - lowOffset * 0.73),
    fbm(dir.zxy * 0.94 + lowOffset * 0.51)
  ) - 0.5;
  float low = fbm(dir * uLowFrequency + warp * 0.82 + lowOffset) - 0.49;
  float mid = fbm(dir * uMediumFrequency + warp * 0.38 + midOffset) - 0.49;
  float travelling = fbm(dir * 2.55 + vec3(t * 0.105, t * 0.052, -t * 0.145)) - 0.49;
  float high = fbm(dir * uDetailFrequency + vec3(t * 0.12, -t * 0.16, t * 0.09)) - 0.49;
  vec3 lobeAxis = normalize(vec3(
    noise(vec3(t * 0.18, 2.1, 4.7)) - 0.5,
    noise(vec3(5.4, t * 0.145, 1.6)) - 0.5,
    noise(vec3(3.8, 7.2, t * 0.205)) - 0.5
  ));
  vec3 counterAxis = normalize(vec3(
    noise(vec3(8.2, t * 0.11, 1.3)) - 0.5,
    noise(vec3(t * 0.16, 4.1, 6.8)) - 0.5,
    noise(vec3(2.7, t * 0.095, 9.1)) - 0.5
  ));
  float primaryLobe = dot(dir, lobeAxis) * (0.12 + abs(low) * 0.17);
  float secondaryLobe = (pow(abs(dot(dir, counterAxis)), 2.2) - 0.34) * 0.115;
  float activity = 0.78 + uEnergy * 0.46;
  float radial = (low * uLowAmplitude + mid * uMediumAmplitude + travelling * (uLowAmplitude * .28) + high * uDetailAmplitude + primaryLobe + secondaryLobe)
    * uBreath * activity * response;
  float evolvingFold = fbm(
    dir * 1.36
    + vec3(t * 0.36, -t * 0.27, t * 0.21)
    + warp * 0.46
  ) - 0.49;
  float counterFold = fbm(
    dir.yzx * 2.08
    + vec3(-t * 0.19, t * 0.24, -t * 0.31)
  ) - 0.49;
  radial += (evolvingFold * 0.18 + counterFold * 0.075)
    * (0.72 + uLowAmplitude * 0.58)
    * uBreath
    * response;
  return p + dir * radial;
}

void main() {
  vec3 pos = ambientShape(morphShape(aBasePosition, uTime), uTime) * uStretch;

  vec2 pointerDelta = pos.xy - uPointer;
  float pointerDistance = dot(pointerDelta, pointerDelta);
  float pointerField = exp(-pointerDistance * 1.65)
    * smoothstep(-0.65, 0.95, pos.z)
    * uPointerStrength
    * layerResponse();
  vec2 pointerDirection = pointerDelta / max(length(pointerDelta), 0.001);
  pos.xy += pointerDirection * pointerField * 0.145;
  pos += normalize(pos) * pointerField * 0.075;

  // Scroll-controlled transitional compression stays separate from the
  // continuously evolving ambient field above.
  pos.xz *= 1.0 + uTransition * 0.07 * layerResponse();
  pos.y *= 1.0 - uTransition * 0.055 * layerResponse();

  float layerSpin = aLayer < 0.5 ? 0.012 : (aLayer < 1.5 ? -0.021 : 0.029);
  pos.xz = rotate2d(uTime * layerSpin + sin(aPhase + uTime * 0.12) * 0.007 * aLayer) * pos.xz;
  pos.xy = rotate2d(uTime * 0.0065) * pos.xy;

  vec3 direction = normalize(pos);
  vec3 tangentA = normalize(cross(direction, normalize(vec3(0.31, 0.82, 0.47))));
  vec3 tangentB = normalize(cross(direction, tangentA));
  float flowA = sin(aPhase + uTime * 0.54 + pos.y * 2.1);
  float flowB = cos(aPhase * 0.73 - uTime * 0.42 + pos.x * 1.8);
  float flowNoise = fbm(direction * 3.7 + vec3(uTime * 0.12, -uTime * 0.09, uTime * 0.15)) - 0.5;
  pos += (tangentA * (flowA + flowNoise) * 0.021 + tangentB * (flowB - flowNoise) * 0.014)
    * uBreath * (0.72 + uDensityMotion * .28) * (0.68 + layerResponse() * 0.32);

  float breathing = 1.0 + sin(uTime * 0.42) * 0.014 * uBreath
    + sin(uTime * 0.31 + aPhase) * 0.006 * uBreath * (0.55 + aLayer * 0.22);
  pos *= breathing * uScale;

  vec3 surfaceDirection = normalize(pos);
  float edge = pow(1.0 - abs(surfaceDirection.z), 1.35);
  float layerAlpha = aLayer < 0.5
    ? mix(0.42, 0.82, aRandom)
    : (aLayer < 1.5 ? mix(0.2, 0.46, aRandom) : mix(0.11, 0.3, aRandom));

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_Position = projectionMatrix * mvPosition;
  float layerSize = aLayer < 0.5 ? 1.0 : (aLayer < 1.5 ? 0.76 : 0.62);
  gl_PointSize = uPointSize * mix(1.0, 1.04, uLightTheme) * layerSize * mix(0.82, 1.16, aRandom) / -mvPosition.z;

  float densityField = fbm(surfaceDirection * 3.1 + vec3(uTime * 0.07, -uTime * 0.045, uTime * 0.055));
  float densityBreath = 0.88 + densityField * (0.12 + uDensityMotion * .1)
    + sin(aPhase + uTime * (0.22 + uDensityMotion * .09)) * (0.015 + uDensityMotion * .013) * uBreath
    + pointerField * 0.08;
  vAlpha = layerAlpha * mix(0.68, 1.22, edge) * densityBreath * uPresence;
  vLayer = aLayer;
  vEdge = edge;
  vColor = mix(vec3(0.72, 0.76, 0.84), vec3(0.96, 0.96, 0.98), edge);
}
`;

export const bubbleFragmentShader = /* glsl */ `
uniform vec3 uColor;
uniform float uColorMix;
uniform float uRim;
uniform float uShellTint;
uniform vec3 uTintColor;
uniform float uAdditive;
uniform float uLightTheme;

varying float vAlpha;
varying float vLayer;
varying float vEdge;
varying vec3 vColor;

void main() {
  vec2 centered = gl_PointCoord - 0.5;
  float distanceFromCenter = length(centered);
  if (distanceFromCenter > 0.5) discard;

  float softDisc = smoothstep(0.5, 0.08, distanceFromCenter);
  float layerAccent = vLayer < 0.5 ? 0.58 : (vLayer < 1.5 ? 0.78 : 0.9);
  vec3 lightThemeBase = mix(vec3(0.12, 0.125, 0.14), vec3(0.012, 0.016, 0.021), 0.34 + vEdge * 0.66);
  vec3 baseColor = mix(vColor, lightThemeBase, uLightTheme);
  vec3 themeTint = mix(uTintColor, uTintColor * 0.5, uLightTheme);
  vec3 themeAccent = mix(uColor, uColor * 0.46, uLightTheme);
  vec3 color = mix(baseColor, themeTint, uShellTint * layerAccent);
  color = mix(color, themeAccent, uColorMix * mix(0.78, 1.0, layerAccent));
  vec3 rimColor = mix(vec3(0.22, 0.55, 0.48), vec3(0.025, 0.05, 0.048), uLightTheme);
  color = mix(color, rimColor, uRim * vEdge * 0.72);

  float alpha = softDisc * vAlpha * mix(1.0, 1.28, uLightTheme);
  if (uAdditive > 0.5) {
    gl_FragColor = vec4(color, alpha);
  } else {
    gl_FragColor = vec4(color, alpha);
  }
}
`;
