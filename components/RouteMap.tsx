'use client';

import type { GridMetrics, PlaceholderRect, SectionId } from '@/lib/grid';
import { useLanguage } from '@/context/LanguageContext';

/**
 * The homepage route: one thin line drawn through every pinned scene, like a
 * map of the page. It is layout, not animation — each scene draws its own
 * static fragment on cell edges (entry from the top edge, a station node in
 * the bottom corridor, a jog to where the next scene picks it up, exit off the
 * bottom edge). During a handoff window both scenes draw the same connector,
 * which travels up with the scroll along that shared line.
 *
 * Cell coordinates: columns are grid lines 0..cols (content grid), rows 0..12.
 * Everything inside the orb aperture is masked out, so the route passes
 * behind the orb window instead of drawing over the sculpture.
 */

type Station = {
  /** entry column (top stub) and the row where it meets the scene's frame */
  entry?: { col: number; toRow: number };
  /** column where the route leaves the scene's frame towards its station */
  from: { col: number; row: number };
  /** exit column: where the route leaves the scene (off the bottom edge) */
  exit?: number;
  number: string;
  label: 'start' | 'work' | 'services' | 'about' | 'contact';
  end?: boolean;
};

const STATION_ROW = 11;
const CONNECTOR_LENGTH = .42;

function stations(cols: number): Record<SectionId, Station> {
  const center = Math.floor(cols / 2);
  const x1 = cols - 5; // Selected Work viewer's right edge
  const x2 = cols;     // right content edge: CTA + Services index border
  const x3 = cols - 6; // Services index left edge = About ticker/portrait gutter
  return {
    hero: { from: { col: center, row: 6 }, exit: x1, number: '01', label: 'start' },
    work: { entry: { col: x1, toRow: 3 }, from: { col: x1, row: 10 }, exit: x2, number: '02', label: 'work' },
    services: { entry: { col: x2, toRow: 2 }, from: { col: x2, row: 10 }, exit: x3, number: '03', label: 'services' },
    about: { entry: { col: x3, toRow: 3 }, from: { col: x3, row: 10 }, exit: center, number: '04', label: 'about' },
    footer: { entry: { col: center, toRow: 6 }, from: { col: center, row: 6 }, number: '05', label: 'contact', end: true },
  };
}

const NEXT: Partial<Record<SectionId, SectionId>> = { hero: 'work', work: 'services', services: 'about', about: 'footer' };

interface RouteMapProps {
  id: SectionId;
  metrics: GridMetrics;
  hole: PlaceholderRect | null;
  /** window progress of the handoff into this scene (1 when settled) */
  enter: number;
  /** window progress of the handoff out of this scene (0 when settled) */
  leave: number;
  /** portrait layout: measured station position + frame height */
  portrait?: { stationY: number | null; frame: number } | null;
}

/**
 * Portrait: the route runs down the left content edge. Portrait frames do not
 * overlap — each frame's bottom edge meets the next frame's top edge — so a
 * line at the same x in every frame is one continuous line down the page.
 * Station labels are HTML in each scene ([data-route-station]); this layer
 * only draws the line and the nodes.
 */
function PortraitRoute({ id, metrics, hole, portrait }: { id: SectionId; metrics: GridMetrics; hole: PlaceholderRect | null; portrait: { stationY: number | null; frame: number } }) {
  const { xOffset } = metrics;
  const width = typeof window !== 'undefined' ? window.innerWidth : xOffset * 2 + metrics.sectionCols * metrics.blockSize;
  const height = portrait.frame;
  const x = Math.round(xOffset) + .5;
  const sy = portrait.stationY;
  const maskId = `route-mask-p-${id}`;
  const end = id === 'footer';
  const endX = hole ? Math.round(xOffset + hole.x + hole.width / 2) + .5 : Math.round(width / 2) + .5;

  let d = '';
  if (id === 'hero') d = sy !== null ? `M${x} ${sy} V${height}` : '';
  else if (end) d = sy !== null ? `M${x} 0 V${sy} H${endX}` : `M${x} 0 V${height}`;
  else d = `M${x} 0 V${height}`;

  return (
    <svg className="route-map" viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden="true">
      {hole && (
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={width} height={height}>
            <rect width={width} height={height} fill="#fff" />
            <rect x={xOffset + hole.x} y={hole.y} width={hole.width} height={hole.height} fill="#000" />
          </mask>
        </defs>
      )}
      <g mask={hole ? `url(#${maskId})` : undefined}>
        {d && <path d={d} className="route-line" />}
      </g>
      {sy !== null && !end && (
        <g>
          <rect x={x - 4.5} y={sy - 4.5} width={9} height={9} className="route-node" />
          <rect x={x - 1.5} y={sy - 1.5} width={3} height={3} className="route-node-core" />
        </g>
      )}
      {sy !== null && end && (
        <g>
          <rect x={x - 3} y={sy - 3} width={6} height={6} className="route-node" />
          <rect x={endX - 6} y={sy - 6} width={12} height={12} className="route-node route-node--end" />
          <rect x={endX - 2} y={sy - 2} width={4} height={4} className="route-node-core route-node-core--end" />
        </g>
      )}
    </svg>
  );
}

export function RouteMap({ id, metrics, hole, enter, leave, portrait }: RouteMapProps) {
  const { dictionary } = useLanguage();
  if (metrics.layout === 'portrait') {
    return portrait ? <PortraitRoute id={id} metrics={metrics} hole={hole} portrait={portrait} /> : null;
  }
  if (!metrics.isPinned) return null;

  const { blockSize: bs, sectionCols: cols, xOffset } = metrics;
  const width = xOffset * 2 + cols * bs;
  const height = 12 * bs;
  const X = (c: number) => Math.round(xOffset + c * bs) + .5;
  const Y = (r: number) => Math.round(r * bs) + .5;
  const all = stations(cols);
  const s = all[id];
  const next = NEXT[id];
  const labels = dictionary.route;
  const maskId = `route-mask-${id}`;

  const lines: string[] = [];
  if (s.entry) lines.push(`M${X(s.entry.col)} 0 V${Y(s.entry.toRow)}`);
  lines.push(`M${X(s.from.col)} ${Y(s.from.row)} V${Y(STATION_ROW)}`);
  if (s.exit !== undefined) lines.push(`M${X(s.from.col)} ${Y(STATION_ROW)} H${X(s.exit)} V${height}`);

  // Measurement ticks along the jog (half-cell spacing).
  const ticks: string[] = [];
  if (s.exit !== undefined && s.exit !== s.from.col) {
    const dir = s.exit > s.from.col ? 1 : -1;
    for (let c = s.from.col + dir * .5; dir > 0 ? c < s.exit : c > s.exit; c += dir * .5) {
      ticks.push(`M${X(c)} ${Y(STATION_ROW)} v${Number.isInteger(c) ? 6 : 3.5}`);
    }
  }

  const nodeX = X(s.from.col);
  const nodeY = Y(STATION_ROW);
  const labelRight = s.exit === undefined || s.exit >= s.from.col;
  const textX = labelRight ? nodeX + 14 : nodeX - 14;
  const anchor = labelRight ? 'start' : 'end';

  const connector = (w: number, handoffInto: SectionId) => {
    if (w <= 0 || w >= 1) return null;
    const into = all[handoffInto];
    const col = into.entry ? into.entry.col : into.from.col;
    const x = X(col);
    const top = height * (1 - (1 + CONNECTOR_LENGTH) * w);
    const bottom = top + height * CONNECTOR_LENGTH;
    const fromId = (Object.keys(NEXT) as SectionId[]).find((key) => NEXT[key] === handoffInto)!;
    const from = all[fromId];
    return (
      <g className="route-connector" key={`c-${handoffInto}`}>
        <path d={`M${x} ${top} V${bottom}`} className="route-dash" />
        <rect x={x - 3.5} y={top - 3.5} width={7} height={7} className="route-node" />
        <rect x={x - 3.5} y={bottom - 3.5} width={7} height={7} className="route-node route-node--next" />
        <text x={x - 14} y={top + 3.5} textAnchor="end" className="route-text">
          <tspan className="route-text--num">{from.number}</tspan><tspan dx="8">/ {labels[from.label]}</tspan>
        </text>
        <text x={x - 14} y={bottom + 3.5} textAnchor="end" className="route-text">
          <tspan className="route-text--num">{into.number}</tspan><tspan dx="8">/ {labels[into.label]}</tspan>
        </text>
      </g>
    );
  };

  return (
    <svg className="route-map" viewBox={`0 0 ${width} ${height}`} width={width} height={height} aria-hidden="true">
      {hole && (
        <defs>
          <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={width} height={height}>
            <rect width={width} height={height} fill="#fff" />
            <rect x={xOffset + hole.x} y={hole.y} width={hole.width} height={hole.height} fill="#000" />
          </mask>
        </defs>
      )}
      <g mask={hole ? `url(#${maskId})` : undefined}>
        <path d={lines.join(' ')} className="route-line" />
        {ticks.length > 0 && <path d={ticks.join(' ')} className="route-tick" />}
        {s.entry && <rect x={X(s.entry.col) - 3.5} y={Y(s.entry.toRow) - 3.5} width={7} height={7} className="route-node" />}
        {id !== 'hero' && enter < 1 && connector(enter, id)}
        {next && leave > 0 && connector(leave, next)}
      </g>

      {/* station: always drawn above the mask, it sits in the free bottom corridor */}
      {s.end ? (
        <g>
          <rect x={nodeX - 6} y={nodeY - 6} width={12} height={12} className="route-node route-node--end" />
          <rect x={nodeX - 2} y={nodeY - 2} width={4} height={4} className="route-node-core route-node-core--end" />
        </g>
      ) : (
        <g>
          <rect x={nodeX - 4.5} y={nodeY - 4.5} width={9} height={9} className="route-node" />
          <rect x={nodeX - 1.5} y={nodeY - 1.5} width={3} height={3} className="route-node-core" />
        </g>
      )}
      <text x={textX} y={nodeY - 10} textAnchor={anchor} className="route-text">
        <tspan className="route-text--num">{s.number}</tspan>
        <tspan dx="8">/ {labels[s.label]}</tspan>
        {s.end && <tspan dx="14" className="route-text--num">● {labels.end}</tspan>}
      </text>
      {(id === 'hero' || s.end) && (
        <text x={textX} y={nodeY + 20} textAnchor={anchor} className="route-text route-text--coord">
          X {String(s.from.col).padStart(2, '0')} · Y {String(STATION_ROW).padStart(2, '0')}
        </text>
      )}
    </svg>
  );
}
