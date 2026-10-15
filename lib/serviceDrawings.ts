/**
 * Services chapter: six technical drawings on one canvas.
 *
 * Every scene is authored in one 825 × 615 drawing space (11 × 8.2 grid
 * modules of 75 px at 1440 px) and scaled uniformly into the stage. A scene is
 * a pure function of
 *   a   assembly 0..1 — 0 shows construction lines only, 1 the finished drawing
 *       (scroll drives it; outgoing scenes return to their construction lines)
 *   t   seconds of autoplay (each scene loops on its own period)
 *   mx, my  damped pointer −1..1 (parallax of at most ~8 px)
 * so any frame can be rendered at any time, and every frame is a finished still.
 */
import type { Dictionary } from '@/data/translations';

export type DrawCopy = Dictionary['services']['draw'];
type RGB = [number, number, number];
type Ctx = CanvasRenderingContext2D & { letterSpacing?: string };
export type SceneArgs = { a: number; t: number; mx: number; my: number };

export const DRAW_W = 825;
export const DRAW_H = 615;
/** muted print-ink accents, one per service */
export const ACCENTS = ['#6cc4b4', '#df9fb4', '#7ea4ff', '#ef8458', '#e0b04a', '#a99bf0'];
export const SCENE_LOOPS = [13, 14, 11, 12, 16, 14];
/** autoplay time of each scene's resting frame (reduced motion, static layouts) */
export const REST_T = [10, 11, 9.4, 7, 14, 13.86];

/* ------------------------------------------------------------------ palette */
const P = {
  ink: [236, 235, 230] as RGB,
  bg: [28, 28, 28] as RGB,
  accents: ACCENTS.map(hex),
  disp: 'Montserrat, sans-serif',
  sans: 'Inter, sans-serif',
  mono: '"IBM Plex Mono", monospace',
};
let CUR: RGB = P.accents[0];
let HASLS = false;

function hex(h: string): RGB { return [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB; }
function parseColor(v: string, fallback: RGB): RGB {
  const s = v.trim();
  if (/^#[0-9a-f]{6}$/i.test(s)) return hex(s);
  if (/^#[0-9a-f]{3}$/i.test(s)) return hex(`#${s[1]}${s[1]}${s[2]}${s[2]}${s[3]}${s[3]}`);
  const m = s.match(/rgba?\(([^)]+)\)/);
  if (m) { const p = m[1].split(/[ ,/]+/).map(Number); if (p.length >= 3 && p.every((n) => !Number.isNaN(n))) return [p[0], p[1], p[2]]; }
  return fallback;
}

/** Reads ink, ground and the three type families from the page (call once fonts are ready). */
export function refreshPalette() {
  if (typeof document === 'undefined') return;
  const root = getComputedStyle(document.documentElement);
  const body = getComputedStyle(document.body);
  P.ink = parseColor(root.getPropertyValue('--text-primary'), [236, 235, 230]);
  P.bg = parseColor(root.getPropertyValue('--bg-canvas'), [28, 28, 28]);
  const fam = (name: string, fb: string) => (body.getPropertyValue(name).trim() || root.getPropertyValue(name).trim() || fb);
  P.disp = fam('--font-display', 'Montserrat, sans-serif');
  P.sans = fam('--font-sans', 'Inter, sans-serif');
  P.mono = fam('--font-mono', '"IBM Plex Mono", monospace');
  HASLS = typeof CanvasRenderingContext2D !== 'undefined' && 'letterSpacing' in CanvasRenderingContext2D.prototype;
}

/* ------------------------------------------------------------------ helpers */
const W = DRAW_W, H = DRAW_H;
const C = (a: number) => `rgba(${P.ink[0]},${P.ink[1]},${P.ink[2]},${Math.max(0, a).toFixed(3)})`;
const ca = (a: number) => `rgba(${CUR[0]},${CUR[1]},${CUR[2]},${Math.max(0, a).toFixed(3)})`;
const rgba = (c: RGB, a: number) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${Math.max(0, a).toFixed(3)})`;
const ground = (a = 1) => rgba(P.bg, a);
const tint = (k: number, a = 1) => rgba(mix(P.bg, P.ink, k), a);
const cl = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));
const seg = (v: number, a: number, b: number) => cl((v - a) / (b - a));
const sm = (v: number) => { const p = cl(v); return p * p * (3 - 2 * p); };
const eio = (v: number) => { const p = cl(v); return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
const eo = (v: number) => 1 - Math.pow(1 - cl(v), 4);
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const mix = (p: RGB, q: RGB, t: number): RGB => [lerp(p[0], q[0], t), lerp(p[1], q[1], t), lerp(p[2], q[2], t)];
const disp = (w: number, s: number) => `${w} ${s.toFixed(2)}px ${P.disp}`;
const mono = (s: number, w = 500) => `${w} ${s}px ${P.mono}`;
const sans = (s: number, w = 400) => `${w} ${s.toFixed(2)}px ${P.sans}`;
type Pt = [number, number];

function ls(g: Ctx, v: number) { if (HASLS) g.letterSpacing = `${v}px`; }
function ln(g: Ctx, x1: number, y1: number, x2: number, y2: number, col: string, lw = 1) {
  g.strokeStyle = col; g.lineWidth = lw; g.beginPath(); g.moveTo(x1, y1); g.lineTo(x2, y2); g.stroke();
}
function tx(g: Ctx, s: string, x: number, y: number, font: string, col: string, align: CanvasTextAlign = 'left', spacing = 0) {
  g.font = font; g.fillStyle = col; g.textAlign = align; g.textBaseline = 'alphabetic'; ls(g, spacing); g.fillText(s, x, y);
}
function tw(g: Ctx, s: string, font: string, spacing = 0) { g.font = font; ls(g, spacing); return g.measureText(s).width; }
function wrap(g: Ctx, str: string, maxW: number, font: string) {
  g.font = font; ls(g, 0);
  const out: string[] = []; let cur = '';
  for (const w of str.split(' ')) { const t = cur ? `${cur} ${w}` : w; if (g.measureText(t).width > maxW && cur) { out.push(cur); cur = w; } else cur = t; }
  if (cur) out.push(cur);
  return out;
}
/** digit roll between two strings (changed characters swap vertically, one after another) */
function roll(g: Ctx, fromS: string, toS: string, f: number, x: number, y: number, font: string, col: string, lh: number) {
  const n = Math.max(fromS.length, toS.length);
  const from = fromS.padStart(n), to = toS.padStart(n);
  g.save(); g.font = font; ls(g, 0); g.textAlign = 'left'; g.textBaseline = 'alphabetic'; g.fillStyle = col;
  g.beginPath(); g.rect(x - 4, y - lh * .84, 340, lh * 1.06); g.clip();
  const base = g.globalAlpha;
  for (let j = 0; j < n; j++) {
    const xx = lerp(x + g.measureText(from.slice(0, j)).width, x + g.measureText(to.slice(0, j)).width, eio(f));
    if (from[j] === to[j]) { g.globalAlpha = base; g.fillText(to[j], xx, y); }
    else {
      const e = eio(cl(f * 1.4 - j * .08));
      g.globalAlpha = base * (1 - e); g.fillText(from[j], xx, y - e * lh * .8);
      g.globalAlpha = base * e; g.fillText(to[j], xx, y + (1 - e) * lh * .8);
    }
  }
  g.restore();
}
function poly(g: Ctx, pts: Pt[], col: string, lw = 1, dash?: number[]) {
  if (pts.length < 2) return;
  g.strokeStyle = col; g.lineWidth = lw; if (dash) g.setLineDash(dash);
  g.beginPath(); pts.forEach((p, i) => (i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1]))); g.stroke();
  if (dash) g.setLineDash([]);
}
/** partial polyline by length fraction; returns the head point */
function polyPart(g: Ctx, pts: Pt[], f: number, col: string, lw = 1): Pt {
  let total = 0; const L: number[] = [];
  for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); L.push(d); total += d; }
  let rem = total * cl(f); const out: Pt[] = [pts[0]]; let head = pts[0];
  for (let i = 1; i < pts.length && rem > 0; i++) {
    const d = L[i - 1];
    if (rem >= d) { out.push(pts[i]); head = pts[i]; rem -= d; }
    else { const k = rem / d; head = [lerp(pts[i - 1][0], pts[i][0], k), lerp(pts[i - 1][1], pts[i][1], k)]; out.push(head); rem = 0; }
  }
  poly(g, out, col, lw);
  return head;
}
function rrect(g: Ctx, x: number, y: number, w: number, h: number, r: number) {
  g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r);
  g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath();
}

/* ------------------------------------------------------------------ the frame (never moves) */
export function drawFrame(g: Ctx, copy: DrawCopy, list: [number, number][]) {
  const m = 16, L = 10, c = C(.3);
  ([[m, m, 1, 1], [W - m, m, -1, 1], [m, H - m, 1, -1], [W - m, H - m, -1, -1]] as const).forEach(([x, y, sx, sy]) => {
    ln(g, x, y, x + L * sx, y, c); ln(g, x, y, x, y + L * sy, c);
  });
  for (const [i, w] of list) {
    if (w < .01) continue;
    tx(g, copy.captions[i][0], 34, 21, mono(8.5), C(.5 * w), 'left', 1);
    tx(g, copy.captions[i][1], W - 34, H - 12, mono(8.5), C(.34 * w), 'right', 1);
  }
}

/* ================================================================== 01 websites */
const BP = [
  { w: 640, cols: 12, h1: 54, lab: '1440', spec: 'H1 · 64 / 1.00' },
  { w: 420, cols: 8, h1: 42, lab: '834', spec: 'H1 · 48 / 1.04' },
  { w: 230, cols: 4, h1: 29, lab: '390', spec: 'H1 · 34 / 1.10' },
];
const MARG = [28, 22, 16], GUT = [14, 12, 10];
type Box = { x: number; y: number; w: number };
type Lay = { m: number; hy: number; h: number; lh: number; px: number; py: number; pw: number; my: number; mods: Box[] };
function layWeb(g: Ctx, bi: number, para: string): Lay {
  const B = BP[bi], w = B.w, m = MARG[bi], gu = GUT[bi], n = B.cols, cw = (w - 2 * m - (n - 1) * gu) / n;
  const cx = (c: number) => m + c * (cw + gu), sp = (k: number) => k * cw + (k - 1) * gu, h = B.h1, lh = h * 1.04, hy = 74;
  if (bi === 0) {
    const my = hy + 2 * lh + 64;
    return { m, hy, h, lh, px: cx(8), py: hy + 6, pw: sp(4), my, mods: [0, 1, 2].map((k) => ({ x: cx(k * 4), y: my, w: sp(4) })) };
  }
  const py = hy + 2 * lh + (bi === 1 ? 22 : 16), pw = bi === 1 ? sp(6) : w - 2 * m;
  const my = py + wrap(g, para, pw, sans(9.5)).length * 14 + 20;
  const mods = bi === 1
    ? [{ x: cx(0), y: my, w: sp(4) }, { x: cx(4), y: my, w: sp(4) }, { x: cx(0), y: my + 92, w: sp(4) }]
    : [0, 1, 2].map((k) => ({ x: m, y: my + k * 84, w: w - 2 * m }));
  return { m, hy, h, lh, px: m, py, pw, my, mods };
}
function webScene(g: Ctx, c: DrawCopy, s: SceneArgs) {
  const k = c.web, { a, mx, my } = s, t = s.t % 13;
  let b: number;
  if (t < 3.2) b = 0; else if (t < 4.6) b = eio(seg(t, 3.2, 4.6)); else if (t < 7.4) b = 1;
  else if (t < 8.8) b = 1 + eio(seg(t, 7.4, 8.8)); else if (t < 11) b = 2; else if (t < 12.6) b = 2 - 2 * eio(seg(t, 11, 12.6)); else b = 0;
  const i0 = b >= 1 ? 1 : 0, i1 = i0 + 1, f = b - i0;
  const w = lerp(BP[i0].w, BP[i1].w, f), X = 92 + mx * 5, Y = 118 + my * 3, AH = 404;
  // breakpoint ruler
  const rp = eo(seg(a, .08, .5));
  if (rp > 0) {
    ln(g, 92, 86, 92 + 640 * rp, 86, C(.22));
    tx(g, k.viewport, 92, 72, mono(8), C(.36 * rp), 'left', 1);
    BP.forEach((B, n) => {
      if (640 * rp < B.w - .5) return;
      const x = 92 + B.w, on = Math.abs(b - n) < .5;
      ln(g, x, 81, x, 91, on ? ca(.9) : C(.4));
      tx(g, B.lab, x, 72, mono(8.5), on ? ca(.95) : C(.38), 'right', .5);
    });
    ln(g, 92, 86, 92 + w * rp, 86, ca(.85), 1.5);
    g.setLineDash([2, 4]); g.strokeStyle = C(.08 * rp); g.lineWidth = 1; g.strokeRect(92, 118, 640, AH); g.setLineDash([]);
  }
  // artboard
  const ab = sm(seg(a, .12, .45));
  g.fillStyle = ground(ab); g.fillRect(X, Y, w, AH);
  g.strokeStyle = C(.24 * ab); g.lineWidth = 1; g.strokeRect(X, Y, w, AH);
  g.save(); g.beginPath(); g.rect(X, Y, w, AH); g.clip();
  const gp = seg(a, 0, .5);
  ([[i0, 1 - f], [i1, f]] as const).forEach(([bi, wt]) => {
    if (wt < .01) return;
    const n = BP[bi].cols, m = MARG[bi], gu = GUT[bi], cw = (w - 2 * m - (n - 1) * gu) / n;
    for (let col = 0; col < n; col++) {
      const gh = AH * eo(gp * 1.5 - col * .035);
      if (gh > 0) { g.fillStyle = ca(.06 * wt); g.fillRect(X - mx * 2 + m + col * (cw + gu), Y + AH - gh, cw, gh); }
    }
  });
  const ox = X + mx * 2, oy = Y + my * 1.5;
  const L0 = layWeb(g, i0, k.para), L1 = layWeb(g, i1, k.para);
  const li = (key: 'm' | 'hy' | 'h' | 'lh' | 'px' | 'py' | 'pw') => lerp(L0[key], L1[key], f);
  const m = li('m');
  const al = sm(seg(a, .3, .6));
  tx(g, k.brand, ox + m, oy + 28, disp(500, 11), C(.9 * al), 'left', .3);
  const navA = 1 - sm((b - .15) / .6);
  tx(g, k.nav, ox + w - m, oy + 28, sans(9), C(.55 * al * navA), 'right');
  tx(g, k.menu, ox + w - m, oy + 28, sans(9), C(.7 * al * (1 - navA)), 'right');
  ln(g, ox + m, oy + 42, ox + w - m, oy + 42, C(.1 * al));
  const ha = eo(seg(a, .35, .7)), h = li('h'), lh = li('lh'), hy = li('hy');
  const b1 = oy + hy + h * .82 + (1 - ha) * 12;
  tx(g, k.headline[0], ox + m, b1, disp(300, h), C(.95 * ha), 'left', -h * .025);
  tx(g, k.headline[1], ox + m, b1 + lh, disp(300, h), C(.95 * ha), 'left', -h * .025);
  tx(g, BP[Math.round(b)].spec, ox + m, oy + hy - 6, mono(8), ca(.9 * ha), 'left', .5);
  ln(g, ox + m - 8, oy + hy + h * .12, ox + m - 8, oy + hy + lh + h * .86, ca(.8 * ha));
  const pa = eo(seg(a, .5, .85));
  wrap(g, k.para, li('pw'), sans(9.5)).forEach((l, j) => tx(g, l, ox + li('px'), oy + li('py') + 9 + j * 14 + (1 - pa) * 8, sans(9.5), C(.62 * pa)));
  k.mods.forEach((md, n) => {
    const A = L0.mods[n], B = L1.mods[n];
    const ma = eo(seg(a, .6 + n * .08, .92 + n * .08));
    const x = ox + lerp(A.x, B.x, f), y = oy + lerp(A.y, B.y, f) + (1 - ma) * 10, mw = lerp(A.w, B.w, f);
    ln(g, x, y, x + mw, y, C(.28 * ma));
    tx(g, md[0], x, y + 30, disp(200, 22), C(.9 * ma), 'left', -.5);
    tx(g, md[1], x, y + 48, sans(10, 500), C(.9 * ma));
    wrap(g, md[2], mw, sans(8.5)).slice(0, 3).forEach((l, j) => tx(g, l, x, y + 62 + j * 12, sans(8.5), C(.5 * ma)));
  });
  const ov = sm((b - .5) / .5) * ha;
  if (ov > .01) {
    g.fillStyle = ground(.95 * ov); g.fillRect(X, Y + AH - 22, w, 22);
    ln(g, X, Y + AH - 22, X + w, Y + AH - 22, C(.1 * ov));
    tx(g, `↓ ${k.continues} · ${b < 1.5 ? '1 480' : '2 140'} PX`, X + w - m, Y + AH - 8, mono(8), ca(.85 * ov), 'right', .5);
  }
  g.restore();
}

/* ================================================================== 02 e-commerce */
const SHOPV = [{ sz: 1, fin: 0 }, { sz: 2, fin: 1 }, { sz: 1, fin: 2 }];
const SZ = [{ h: 270, r: 88, mm: '280' }, { h: 320, r: 100, mm: '320' }, { h: 368, r: 112, mm: '360' }];
/** lathe profile of the vessel, top (u = 0) to foot (u = 1) */
const prof = (u: number) => .17 + .8 * Math.pow(Math.sin(Math.PI * Math.pow(u, 1.25)), 1.5) + .26 * Math.pow(u, 5) + .14 * Math.exp(-u * 30);
function shopScene(g: Ctx, c: DrawCopy, s: SceneArgs) {
  const k = c.shop, { a, mx, my } = s, t = s.t % 14;
  let A = 0, B = 0, f = 0;
  if (t < 1.6) { A = B = 0; } else if (t < 2.8) { A = 0; B = 1; f = eio(seg(t, 1.6, 2.8)); } else if (t < 5.2) { A = B = 1; }
  else if (t < 6.4) { A = 1; B = 2; f = eio(seg(t, 5.2, 6.4)); } else if (t < 12.4) { A = B = 2; } else if (t < 13.6) { A = 2; B = 0; f = eio(seg(t, 12.4, 13.6)); }
  const d = eio(seg(t, 8, 9.8)) * (1 - eio(seg(t, 12.1, 12.8)));
  const VA = SHOPV[A], VB = SHOPV[B];
  const FINC: RGB[] = [mix(P.bg, P.ink, .9), mix(P.bg, P.ink, .5), CUR];
  const hh = lerp(SZ[VA.sz].h, SZ[VB.sz].h, f), R = lerp(SZ[VA.sz].r, SZ[VB.sz].r, f);
  const col = mix(FINC[VA.fin], FINC[VB.fin], f);
  const floorY = 512, cx = 236 + mx * 5, tilt = .2 + my * .025, N = 30;
  const fa = sm(seg(a, 0, .3));
  ln(g, 40, floorY, 452, floorY, C(.22 * fa));
  tx(g, k.set, 40, floorY + 24, mono(8), C(.34 * fa), 'left', 1);
  // the plotter pass: sections from the lip down
  const kp = seg(a, .05, .75) * (N + 1);
  for (let n = 0; n <= N; n++) {
    const vis = cl(kp - n); if (vis <= 0) break;
    const u = n / N, y = floorY - hh * (1 - u), rx = R * prof(u), ry = rx * tilt;
    g.lineWidth = 1;
    g.strokeStyle = C(.08 * vis); g.beginPath(); g.ellipse(cx, y, rx, ry, 0, Math.PI, Math.PI * 2); g.stroke();
    g.strokeStyle = rgba(col, (n === 0 ? .75 : .48) * vis); g.beginPath(); g.ellipse(cx, y, rx, ry, 0, 0, Math.PI); g.stroke();
  }
  const up = cl(kp / N);
  if (up > 0) {
    const L: Pt[] = [], Rr: Pt[] = [];
    for (let j = 0; j <= 60; j++) { const u = j / 60 * up, y = floorY - hh * (1 - u), r = R * prof(u); L.push([cx - r, y]); Rr.push([cx + r, y]); }
    poly(g, L, C(.85)); poly(g, Rr, C(.85));
    g.strokeStyle = C(.55); g.beginPath(); g.ellipse(cx, floorY - hh, R * prof(0), R * prof(0) * tilt, 0, Math.PI, Math.PI * 2); g.stroke();
  }
  // dimension
  const da = sm(seg(a, .55, .85));
  if (da > 0) {
    const dx = cx + R + 40, top = floorY - hh, ym = top + hh / 2 + 3;
    ln(g, dx, top, dx, floorY, C(.3 * da)); ln(g, dx - 4, top, dx + 4, top, C(.5 * da)); ln(g, dx - 4, floorY, dx + 4, floorY, C(.5 * da));
    tx(g, 'H', dx + 9, ym, mono(9), C(.45 * da));
    g.globalAlpha = da; roll(g, SZ[VA.sz].mm, SZ[VB.sz].mm, f, dx + 20, ym, mono(9), C(.85), 12); g.globalAlpha = 1;
    tx(g, 'MM', dx + 24 + tw(g, '000', mono(9)), ym, mono(9), C(.45 * da));
  }
  // information column
  const I = 520 + mx * 2.5, rv = (n: number) => eo(seg(a, .4 + n * .06, .72 + n * .06));
  let r = rv(0); tx(g, k.crumb, I, 118 + (1 - r) * 8, mono(8.5), C(.45 * r), 'left', 1);
  r = rv(1);
  tx(g, k.name, I, 168 + (1 - r) * 10, disp(300, 34), C(.95 * r), 'left', -.6);
  tx(g, k.desc, I, 192 + (1 - r) * 10, sans(10), C(.5 * r));
  r = rv(2);
  tx(g, k.finish, I, 242, mono(8), C(.38 * r), 'left', 1.2);
  const fy = 266, fx = [I];
  for (let n = 1; n < 3; n++) fx.push(fx[n - 1] + 13 + tw(g, k.finishes[n - 1], sans(11)) + 22);
  k.finishes.forEach((nm, n) => {
    const on = (n === VA.fin ? 1 - f : 0) + (n === VB.fin ? f : 0);
    g.fillStyle = rgba(FINC[n], (.35 + .6 * on) * r); g.fillRect(fx[n], fy - 8, 7, 7);
    tx(g, nm, fx[n] + 13, fy, sans(11), C((.4 + .55 * on) * r));
  });
  const uw = (n: number) => 13 + tw(g, k.finishes[n], sans(11));
  const ux = lerp(fx[VA.fin], fx[VB.fin], f);
  ln(g, ux, fy + 9, ux + lerp(uw(VA.fin), uw(VB.fin), f), fy + 9, ca(.9 * r));
  r = rv(3);
  tx(g, k.size, I, 304, mono(8), C(.38 * r), 'left', 1.2);
  const sx = [I, I + 30, I + 60];
  ['S', 'M', 'L'].forEach((nm, n) => { const on = (n === VA.sz ? 1 - f : 0) + (n === VB.sz ? f : 0); tx(g, nm, sx[n], 326, mono(11), C((.38 + .57 * on) * r)); });
  const sux = lerp(sx[VA.sz], sx[VB.sz], f); ln(g, sux, 335, sux + 8, 335, ca(.9 * r));
  r = rv(4);
  g.globalAlpha = r; roll(g, k.prices[A], k.prices[B], f, I - 2, 418, disp(200, 60), C(.96), 64); g.globalAlpha = 1;
  tx(g, k.note, I, 444, mono(8), C(.36 * r), 'left', 1);
  r = rv(5);
  const dd = seg(d, .85, 1);
  tx(g, k.add, I, 498, sans(12, 500), C(.9 * r * (1 - dd)));
  tx(g, k.inBag, I, 498, sans(12, 500), C(.95 * r * dd));
  tx(g, '→', I + 270, 498, sans(12), C(.7 * r * (1 - dd)), 'right');
  ln(g, I, 512, I + 270, 512, C(.26 * r));
  if (d > 0) ln(g, I, 512, I + 270 * d, 512, ca(.95 * r), 1.5);
  tx(g, k.delivery, I, 534, mono(8), ca(.8 * dd * r), 'left', 1);
}

/* ================================================================== 03 web applications */
// R request · A availability · H hold · P payment · C confirm · T notify · S staff · E reports
const NODE_POS: [number, number, boolean][] = [[75, 150, false], [300, 150, false], [300, 300, false], [525, 300, false], [525, 450, false], [750, 450, true], [75, 450, false], [750, 150, true]];
const NODE_MS = ['4 ms', '12 ms', '3 ms', '806 ms', '9 ms', '41 ms', '6 ms', '2 ms'];
const RUN: [number, number][] = [[.2, .6], [1.4, 1.85], [2.65, 3.1], [3.9, 4.7], [5.5, 5.95], [6.75, 7.2], [6.75, 7.2], [8.0, 8.45]];
const EDGES: [number, number, number, number][] = [[0, 1, .6, 1.4], [1, 2, 1.85, 2.65], [2, 3, 3.1, 3.9], [3, 4, 4.7, 5.5], [4, 5, 5.95, 6.75], [4, 6, 5.95, 6.75], [5, 7, 7.2, 8.0]];
const DEPS: Pt[][] = [[[75, 450], [75, 300], [187, 300], [187, 150]], [[300, 150], [750, 150]]];
const STRIP_NODE = [0, 2, 3, 4, 5];
function appScene(g: Ctx, c: DrawCopy, s: SceneArgs) {
  const k = c.app, { a } = s, t = s.t % 11, loop = Math.floor(s.t / 11);
  const reset = 1 - seg(t, 10.1, 10.9);
  g.save(); g.translate(s.mx * 6, s.my * 4);
  const ea = eo(seg(a, .15, .8));
  DEPS.forEach((pts) => { g.setLineDash([2, 4]); polyPart(g, pts, ea, C(.18)); g.setLineDash([]); });
  EDGES.forEach(([p, q, t0, t1]) => {
    const pts: Pt[] = [[NODE_POS[p][0], NODE_POS[p][1]], [NODE_POS[q][0], NODE_POS[q][1]]];
    polyPart(g, pts, ea, C(.2));
    const pr = eio(seg(t, t0, t1));
    if (pr > 0 && reset > 0) {
      const head = polyPart(g, pts, pr, ca(.75 * reset * ea), 1.2);
      if (pr < 1) { g.fillStyle = ca(ea); g.fillRect(head[0] - 3, head[1] - 3, 6, 6); }
    }
  });
  NODE_POS.forEach(([x, y, right], n) => {
    const na = eo(seg(a, n * .04, .35 + n * .04));
    if (na <= 0) return;
    const [r0, r1] = RUN[n];
    const st = t > 10.1 ? (t >= r1 ? 2 : 0) : (t < r0 ? 0 : t < r1 ? 1 : 2);
    g.fillStyle = ground(); g.fillRect(x - 5, y - 5, 10, 10);
    g.strokeStyle = st === 1 ? ca(na) : C(.55 * na); g.lineWidth = 1; g.strokeRect(x - 5, y - 5, 10, 10);
    if (st === 1) { g.fillStyle = ca(na); g.fillRect(x - 2, y - 2, 4, 4); }
    if (st === 2) { g.fillStyle = C(.85 * na * reset); g.fillRect(x - 5, y - 5, 10, 10); }
    const al: CanvasTextAlign = right ? 'right' : 'left', lx = right ? x - 13 : x + 13;
    tx(g, k.nodes[n][0], lx, y - 10, mono(9.5), C(.88 * na), al, 1);
    tx(g, k.nodes[n][1], lx, y + 20, mono(8.5, 400), C(.42 * na), al, .3);
    const label = st === 0 ? k.idle : st === 1 ? k.running : `${k.done} · ${NODE_MS[n]}`;
    tx(g, label, lx, y + 33, mono(8.5, 400), st === 1 ? ca(na) : st === 2 ? C((.42 + .3 * reset) * na) : C(.25 * na), al, .3);
  });
  g.restore();
  const ja = sm(seg(a, .5, .9));
  const el = Math.max(0, Math.min(t, 8.45) - .2);
  tx(g, `${k.job} #${4127 + loop} · ${el.toFixed(2)} s`, W - 34, 52, mono(8.5), C(.55 * ja), 'right', 1);
  // state machine strip
  const sa = eo(seg(a, .6, 1)), sy = 560 + s.my * 2, sx0 = 75 + s.mx * 3;
  let cur = -1;
  STRIP_NODE.forEach((n, i) => { if (t >= RUN[n][1] && reset > .5) cur = i; });
  ln(g, sx0, sy - 22, sx0 + 4 * 160 + 80, sy - 22, C(.08 * sa));
  k.strip.forEach((lab, i) => {
    const x = sx0 + i * 160;
    tx(g, lab, x, sy, mono(9), i === cur ? ca(.95 * sa) : i < cur ? C(.6 * sa) : C(.24 * sa), 'left', 1.2);
    const w0 = tw(g, lab, mono(9), 1.2);
    if (i < k.strip.length - 1) ln(g, x + w0 + 10, sy - 3, x + 150, sy - 3, C((i < cur ? .35 : .12) * sa));
    if (i === cur) ln(g, x, sy + 8, x + w0, sy + 8, ca(.9 * sa), 1.2);
  });
}

/* ================================================================== 04 mobile */
const spring = (tt: number) => { const z = .55, w = 13, wd = w * Math.sqrt(1 - z * z); return 1 - Math.exp(-z * w * tt) * (Math.cos(wd * tt) + (z * w / wd) * Math.sin(wd * tt)); };
const bez = (p0: Pt, p1: Pt, p2: Pt, u: number): Pt => { const v = 1 - u; return [v * v * p0[0] + 2 * v * u * p1[0] + u * u * p2[0], v * v * p0[1] + 2 * v * u * p1[1] + u * u * p2[1]]; };
/** finger samples at a fixed rate: their spacing is the velocity of the gesture */
function trace(g: Ctx, p0: Pt, p1: Pt, p2: Pt, prog: number, alpha: number) {
  if (prog <= 0 || alpha <= 0) return;
  const n = 18;
  for (let i = 0; i < n; i++) {
    const tt = i / (n - 1); if (tt > prog) break;
    const p = bez(p0, p1, p2, eo(tt)); g.fillStyle = ca(alpha * (.45 + .55 * tt)); g.fillRect(p[0] - 1.3, p[1] - 1.3, 2.6, 2.6);
  }
  g.fillStyle = ca(alpha); g.fillRect(p0[0] - 3, p0[1] - 3, 6, 6);
  if (prog >= 1) {
    const e = bez(p0, p1, p2, 1), q = bez(p0, p1, p2, .96), ang = Math.atan2(e[1] - q[1], e[0] - q[0]) + Math.PI / 2;
    ln(g, e[0] - Math.cos(ang) * 6, e[1] - Math.sin(ang) * 6, e[0] + Math.cos(ang) * 6, e[1] + Math.sin(ang) * 6, ca(alpha), 1.2);
  }
}
function mobileScene(g: Ctx, c: DrawCopy, s: SceneArgs) {
  const k = c.mobile, { a } = s, t = s.t % 12;
  const m = eio(seg(t, 1.9, 3.0)) * (1 - eio(seg(t, 9.3, 10.5)));
  const stt = cl(t - 5, 0, .9);
  const sp = (t >= 5 ? spring(stt) : 0) * (1 - eio(seg(t, 8.9, 9.5)));
  const ctx = sp > .5 ? 2 : m > .5 ? 1 : 0;
  // left: the spring the sheet uses, and the context axis
  const dx = s.mx * 3, dy = s.my * 2, da = eo(seg(a, .45, .95));
  const px0 = 48 + dx, px1 = 340 + dx, py0 = 160 + dy, py1 = 300 + dy;
  const vy = (v: number) => py1 - v / 1.2 * (py1 - py0), vx = (tt: number) => px0 + tt / .9 * (px1 - px0);
  tx(g, k.spring, px0, 128 + dy, mono(8.5), C(.5 * da), 'left', 1);
  ln(g, px0, py1, px1, py1, C(.22 * da)); ln(g, px0, py0 - 8, px0, py1, C(.22 * da));
  g.setLineDash([2, 4]); ln(g, px0, vy(1), px1, vy(1), C(.16 * da)); g.setLineDash([]);
  tx(g, '1.0', px1 + 6, vy(1) + 3, mono(8), C(.35 * da));
  tx(g, '0', px0, py1 + 14, mono(8), C(.3 * da)); tx(g, '900 ms', px1, py1 + 14, mono(8), C(.3 * da), 'right');
  const curve: Pt[] = []; for (let j = 0; j <= 90; j++) { const tt = j / 100; curve.push([vx(tt), vy(spring(tt))]); }
  poly(g, curve, C(.28 * da));
  if (t >= 5 && t < 9.5) {
    const upto = Math.round(stt * 100);
    if (upto > 0) poly(g, curve.slice(0, upto + 1), ca(.95 * da), 1.4);
    if (stt < .9) ln(g, vx(stt), py0 - 8, vx(stt), py1, ca(.5 * da));
  }
  tx(g, k.settle, px0, py1 + 34, mono(8.5, 400), C(.42 * da), 'left', .3);
  const by = 410 + dy, bx = [px0, px0 + 104, px0 + 214];
  tx(g, k.context, px0, by - 26, mono(8), C(.36 * da), 'left', 1.2);
  k.steps.forEach((lab, i) => {
    tx(g, lab, bx[i], by, mono(9), i === ctx ? ca(.95 * da) : C(.32 * da), 'left', 1);
    if (i === ctx) ln(g, bx[i], by + 8, bx[i] + tw(g, lab, mono(9), 1), by + 8, ca(.9 * da), 1.2);
  });
  for (let i = 0; i < 9; i++) { const u = eo(i / 8); g.fillStyle = ca((.45 + .55 * i / 8) * da); g.fillRect(px0 + u * 70 - 1.3, by + 50 - 1.3, 2.6, 2.6); }
  tx(g, k.samples, px0 + 84, by + 53, mono(8, 400), C(.36 * da), 'left', .4);

  // right: the screen, off-axis
  const fx = 470 + s.mx * 6, fy = 38 + s.my * 4, fw = 250, fh = 548;
  const fa = sm(seg(a, 0, .4));
  g.strokeStyle = C(.4 * fa); g.lineWidth = 1; rrect(g, fx, fy, fw, fh, 38); g.stroke();
  const sx = fx + 8, sy = fy + 8, sw = fw - 16, sh = fh - 16;
  g.save(); rrect(g, sx, sy, sw, sh, 31); g.fillStyle = tint(.035, fa); g.fill(); g.clip();
  // thumb zone
  const zc: Pt = [fx + fw + 30, fy + fh + 40], zr = 330, za = sm(seg(a, .2, .6));
  g.save(); g.beginPath(); g.arc(zc[0], zc[1], zr, 0, Math.PI * 2); g.clip();
  g.strokeStyle = ca(.07 * za); g.lineWidth = 1;
  for (let o = -sh; o < sw + sh; o += 8) { g.beginPath(); g.moveTo(sx + o, sy + sh); g.lineTo(sx + o + sh, sy); g.stroke(); }
  g.restore();
  g.setLineDash([2, 4]); g.strokeStyle = ca(.3 * za); g.beginPath(); g.arc(zc[0], zc[1], zr, Math.PI * 1.02, Math.PI * 1.5); g.stroke(); g.setLineDash([]);
  const c2 = eo(seg(a, .4, .85));
  tx(g, '9:41', sx + 22, sy + 24, mono(8.5), C(.6 * c2));
  tx(g, k.date, sx + 20, sy + 60 - m * 6, mono(8.5), C(.45 * c2 * (1 - m)), 'left', 1);
  tx(g, k.back, sx + 20, sy + 60, mono(8.5), C(.6 * c2 * m), 'left', 1);
  tx(g, k.today, sx + 20, sy + 96 - m * 10, disp(300, 30), C(.95 * c2 * (1 - m)), 'left', -.6);
  k.rows.forEach((rw, i) => {
    if (i === 1) return;
    const ra = c2 * Math.pow(1 - m, 2) * eo(seg(a, .5 + i * .06, .85 + i * .06)), yy = sy + 128 + i * 58 + m * 40;
    tx(g, rw[0], sx + 20, yy + 22, disp(400, 13), C(.9 * ra));
    tx(g, rw[1], sx + 76, yy + 22, sans(11), C(.9 * ra));
    tx(g, rw[2], sx + 76, yy + 38, sans(9), C(.45 * ra));
    ln(g, sx + 20, yy + 54, sx + sw - 20, yy + 54, C(.1 * ra));
  });
  // shared element: the 10:30 row becomes the detail header
  const y1 = sy + 128 + 58, ra = c2 * eo(seg(a, .56, .9)), row = k.rows[1];
  const press = seg(t, 1.4, 1.6) * (1 - seg(t, 2.2, 2.8));
  if (press > 0) ln(g, sx + 12, y1 + 8, sx + 12, y1 + 46, ca(press * ra), 2);
  tx(g, row[0], sx + 20, lerp(y1 + 22, sy + 152, m), disp(Math.round(lerp(400, 200, m) / 100) * 100, lerp(13, 58, m)), C(.95 * ra), 'left', lerp(0, -1.6, m));
  tx(g, row[1], lerp(sx + 76, sx + 22, m), lerp(y1 + 22, sy + 182, m), sans(lerp(11, 14, m)), C(.9 * ra));
  tx(g, row[2], sx + 76, y1 + 38, sans(9), C(.45 * ra * (1 - m)));
  ln(g, sx + 20, y1 + 54 + m * 150, sx + sw - 20, y1 + 54 + m * 150, C(.1 * ra * (1 - m)));
  const dta = seg(m, .5, 1) * ra;
  k.details.forEach(([kk, v], i) => {
    const y = sy + 224 + i * 32 + (1 - dta) * 10;
    tx(g, kk, sx + 22, y, mono(8), C(.4 * dta), 'left', 1);
    tx(g, v, sx + 104, y, sans(10.5), C(.88 * dta));
    ln(g, sx + 22, y + 12, sx + sw - 22, y + 12, C(.08 * dta));
  });
  if (sp > .001) {
    const shH = 168, ys = sy + sh - shH * sp;
    g.fillStyle = tint(.08); rrect(g, sx, ys, sw, shH + 40, 18); g.fill();
    ln(g, sx + sw / 2 - 14, ys + 10, sx + sw / 2 + 14, ys + 10, C(.3), 2);
    ln(g, sx + 20, ys + 26, sx + 52, ys + 26, ca(.9), 1.5);
    tx(g, k.confirmed, sx + 20, ys + 46, mono(8.5), ca(.95), 'left', 1);
    tx(g, k.sheetTitle, sx + 20, ys + 74, disp(300, 19), C(.95), 'left', -.3);
    tx(g, k.sheetLine, sx + 20, ys + 96, sans(9.5), C(.55));
    tx(g, k.reminder, sx + 20, ys + 112, sans(9.5), C(.55));
  }
  trace(g, [sx + 182, sy + 440], [sx + 205, sy + 300], [sx + 158, y1 + 30], seg(t, 1.4, 1.95), (1 - seg(t, 2.6, 3.6)) * ra);
  trace(g, [sx + 120, sy + 300], [sx + 100, sy + 400], [sx + 132, sy + 500], seg(t, 8.6, 9.1), (1 - seg(t, 9.7, 10.5)) * ra);
  g.restore();
  tx(g, k.thumb[0], fx + fw + 14, fy + fh - 190, mono(8), ca(.75 * za), 'left', 1);
  tx(g, k.thumb[1], fx + fw + 14, fy + fh - 178, mono(8), ca(.75 * za), 'left', 1);
}

/* ================================================================== 05 growth */
const INC = [.31, .22, .35, .24, .19];
const BASE = 2.08;
const lvl = (w: number) => INC.reduce((v, d, n) => v + d * sm((w - 4 * (n + 1)) / 1.4), BASE);
const val = (w: number) => lvl(w) + .045 * Math.sin(w * 1.9) + .03 * Math.sin(w * .7 + 1) + .02 * Math.sin(w * 4.3);
function growthScene(g: Ctx, c: DrawCopy, s: SceneArgs) {
  const k = c.growth, { a } = s, t = s.t % 16, ox = s.mx * 4, oy = s.my * 3;
  const num = (v: number, d = 2) => v.toFixed(d).replace('.', k.decimal);
  let hw = 0; for (let j = 0; j < 6; j++) hw += 4 * eio(seg(t, .4 + j * 2.1, 1.9 + j * 2.1));
  hw *= 1 - eio(seg(t, 14.4, 15.6));
  const x0 = 64 + ox, x1 = 556 + ox, y0 = 118 + oy, y1 = 470 + oy;
  const X = (w: number) => x0 + w / 24 * (x1 - x0), Y = (v: number) => y1 - (v - 1.5) / 2.5 * (y1 - y0);
  const ga = eo(seg(a, 0, .5));
  [2, 2.5, 3, 3.5, 4].forEach((v) => { ln(g, x0, Y(v), x0 + (x1 - x0) * ga, Y(v), C(.07)); tx(g, num(v, 1), x0 - 10, Y(v) + 3, mono(8), C(.34 * ga), 'right'); });
  tx(g, k.axis, x0 - 10, y0 - 22, mono(8), C(.34 * ga), 'right', 1);
  ln(g, x0, y1, x0 + (x1 - x0) * ga, y1, C(.26 * ga));
  for (let w = 0; w <= 24; w += 4) tx(g, `${k.week}${w}`, X(w), y1 + 18, mono(8), C(.34 * ga), 'center');
  const la = eo(seg(a, .35, .8));
  for (let n = 1; n <= 5; n++) {
    const on = hw >= 4 * n - .05, x = X(4 * n);
    ln(g, x, y0 - 4, x, y1, C((.05 + (on ? .08 : 0)) * la));
    tx(g, `v${n}`, x, y0 - 10, mono(8.5), on ? C(.8 * la) : C(.25 * la), 'center', .5);
  }
  g.setLineDash([3, 4]); ln(g, x0, Y(BASE), x0 + (x1 - x0) * la, Y(BASE), C(.3 * la)); g.setLineDash([]);
  tx(g, `${k.baseline} ${num(BASE)}`, x1, Y(BASE) + 14, mono(8), C(.36 * la), 'right', .5);
  // the effect: hatch between the baseline and the measurement
  for (let w = 0; w <= hw; w += .4) { const v = val(w); if (v > BASE + .02) ln(g, X(w), Y(BASE), X(w), Y(v), ca(.16 * la)); }
  const pts: Pt[] = []; for (let w = 0; w <= hw + 1e-6; w += .2) pts.push([X(w), Y(val(w))]);
  if (hw > 0) pts.push([X(hw), Y(val(hw))]);
  if (pts.length > 1) {
    const cut = Math.min(pts.length, 21);
    poly(g, pts.slice(0, cut), C(.7 * la), 1.2);
    if (pts.length > cut) poly(g, pts.slice(cut - 1), ca(.95 * la), 1.5);
    g.fillStyle = hw > 4 ? ca(la) : C(.9 * la); g.fillRect(X(hw) - 2.5, Y(val(hw)) - 2.5, 5, 5);
  }
  // numbers and the test log
  const RX = 612 + ox * .5, ra = eo(seg(a, .5, .95));
  const cur = Math.min(5, Math.floor((hw + .05) / 4)), L = lvl(hw), Ls = num(L);
  tx(g, k.rate, RX, 128, mono(8), C(.4 * ra), 'left', 1.2);
  tx(g, Ls, RX - 2, 186, disp(200, 54), C(.96 * ra), 'left', -1.5);
  tx(g, '%', RX + tw(g, Ls, disp(200, 54), -1.5) + 4, 186, disp(300, 18), C(.6 * ra));
  const upPct = Math.round((L / BASE - 1) * 100);
  tx(g, `${upPct > 0 ? `+${upPct}` : '±0'} % ${k.vs}`, RX, 210, mono(8.5), upPct > 0 ? ca(.95 * ra) : C(.4 * ra), 'left', 1);
  k.tests.forEach((nm, n) => {
    const y = 268 + n * 30, launched = cur >= n + 1, isCur = cur === n + 1;
    const al = (launched ? (isCur ? 1 : .62) : .22) * ra;
    ln(g, RX, y - 17, W - 34, y - 17, C(.08 * ra));
    tx(g, `v${n + 1}`, RX, y, mono(9), isCur ? ca(al) : C(al), 'left', .5);
    tx(g, nm, RX + 26, y, sans(10), C(al));
    tx(g, `+${num(INC[n])}`, W - 34, y, mono(9), isCur ? ca(al) : C(al), 'right');
  });
  ln(g, RX, 268 + 5 * 30 - 17, W - 34, 268 + 5 * 30 - 17, C(.08 * ra));
  tx(g, k.note, RX, 268 + 5 * 30 + 2, mono(8), C(.32 * ra), 'left', .8);
}

/* ================================================================== 06 care & development */
const ver = (i: number) => `2.${Math.floor(i / 3)}.${i % 3}`;
function careScene(g: Ctx, c: DrawCopy, s: SceneArgs) {
  const k = c.care, { a } = s, q = (s.t % 14) / 14, loop = Math.floor(s.t / 14);
  const S = 92, TX = 640, MY = 286, UY = 430, AY = 520, I0 = 12 + loop;
  const xOf = (i: number) => TX + (i - I0 - q) * S + s.mx * 5;
  const fade = (x: number) => sm((x - 128) / 90) * sm((W - 36 - x) / 30);
  const rv = 128 + (W - 160) * eo(seg(a, 0, .65));
  const oy = s.my * 3, my = MY + oy;
  g.save(); g.beginPath(); g.rect(0, 0, rv, H); g.clip();
  tx(g, k.releases, 34, my + 3, mono(8), C(.36), 'left', 1.2);
  tx(g, k.uptime, 34, UY + oy + 3, mono(8), C(.36), 'left', 1.2);
  ln(g, 128, my, TX, my, C(.42));
  g.setLineDash([2, 4]); ln(g, TX, my, W - 36, my, C(.14)); g.setLineDash([]);
  ln(g, 128, AY + oy, W - 36, AY + oy, C(.14));
  for (let i = I0 - 10; i <= I0 + 3; i++) {
    if (i % 2) continue;
    const x = xOf(i) - S / 2, fa = fade(x); if (fa <= 0) continue;
    ln(g, x, AY + oy - 4, x, AY + oy + 4, C(.3 * fa));
    tx(g, k.months[((i / 2) + 2) % 12], x + 6, AY + oy + 16, mono(8), C(.36 * fa), 'left', 1);
  }
  // uptime, with short incidents closed by a fix
  const incid: number[] = []; for (let i = I0 - 10; i <= I0; i++) if (i % 4 === 1) incid.push(xOf(i) - .35 * S);
  const ua = sm(seg(a, .4, .9));
  const upts: Pt[] = [];
  for (let x = 128; x <= TX; x += 2) { const dd = incid.reduce((v, xd) => v + 10 * Math.exp(-Math.pow((x - xd) / 7, 2)), 0); upts.push([x, UY + oy + dd]); }
  poly(g, upts, C(.42 * ua));
  incid.forEach((xd) => { if (xd > TX || xd < 128) return; poly(g, upts.filter((p) => Math.abs(p[0] - xd) < 16), ca(.9 * ua * fade(xd)), 1.2); });
  tx(g, k.uptimeValue, TX + 10, UY + oy + 3, mono(8.5), C(.7 * ua), 'left', .6);
  // releases: feature branches leave and return; patches tick below the line
  for (let i = I0 - 10; i <= I0 + 1; i++) {
    const x = xOf(i), released = i <= I0, fa = fade(x);
    const hot = i === I0 ? 1 - seg(q, 0, .35) : 0;
    if (i % 3 === 0) {
      const xs = x - 1.6 * S, yb = my - 44;
      g.save(); g.beginPath(); g.rect(128, 0, TX - 127.5, H); g.clip();
      poly(g, [[xs, my], [xs + 44, yb], [x - 44, yb], [x, my]], released ? (hot > 0 ? ca(.5 + .4 * hot) : C(.5 * Math.max(fa, .15))) : ca(.85), released ? 1 : 1.3);
      g.restore();
      const mxp = (Math.min(x - 44, TX) + xs + 44) / 2;
      tx(g, k.features[Math.floor(i / 3) % k.features.length], mxp, yb - 9, sans(9.5), released ? C(.5 * fade(mxp)) : ca(.9 * fade(mxp)), 'center');
      if (!released && xs + 44 < TX && x - 44 > TX) { g.fillStyle = ca(1); g.fillRect(TX - 2.5, yb - 2.5, 5, 5); }
      if (released) {
        g.fillStyle = hot > 0 ? ca(.6 + .4 * hot) : C(.85 * fa); g.fillRect(x - 3.5, my - 3.5, 7, 7);
        tx(g, `v${ver(i)}`, x, my + 26, mono(9), hot > 0 ? ca(1) : C(.8 * fa), 'center', .4);
      }
    } else if (released) {
      const fix = i % 4 === 1;
      ln(g, x, my, x, my + 12, fix ? ca(.9 * fa) : hot > 0 ? ca(.5 + .5 * hot) : C(.45 * fa));
      tx(g, ver(i), x, my + 26, mono(8), hot > 0 ? ca(1) : C(.42 * fa), 'center', .3);
      if (fix) tx(g, k.fix, x, my + 38, mono(8), ca(.8 * fa), 'center', .3);
    }
  }
  g.restore();
  const ta = sm(seg(a, .5, .9));
  g.setLineDash([2, 4]); ln(g, TX, 92, TX, AY + oy + 8, C(.28 * ta)); g.setLineDash([]);
  tx(g, k.today, TX, 84, mono(8.5), ca(.95 * ta), 'center', 1.2);
  tx(g, `${k.production} · v${ver(I0)}`, W - 34, 52, mono(8.5), C(.62 * ta), 'right', 1);
  tx(g, `${k.deploy} #${136 + I0} · 38 s`, W - 34, 66, mono(8), C(.36 * ta), 'right', 1);
}

const SCENES = [webScene, shopScene, appScene, mobileScene, growthScene, careScene];

/** Draws scene i (drawing-space units; the caller sets the transform). */
export function drawScene(g: CanvasRenderingContext2D, i: number, copy: DrawCopy, args: SceneArgs, dx = 0) {
  if (args.a <= .001) return;
  CUR = P.accents[i];
  g.save(); g.translate(dx, 0); SCENES[i](g, copy, args); g.restore();
}

/** Assembly and horizontal offset of scene i at continuous service position `pos`. */
export function sceneAt(pos: number, i: number) {
  const d = pos - i;
  const a = d <= 0 ? sm((1 + d - .45) / .55) : 1 - sm(d / .55);
  return { a, dx: -cl(d, -1, 1) * 40 };
}
