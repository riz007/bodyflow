"use client";
import { useEffect, useMemo, useRef, useState, type PointerEvent } from "react";
import { concentration } from "@/pk/model";
import type { Simulation } from "@/pk/simulate";
import { useApp } from "@/state/store";
import { fmtTime, fmtTimeShort } from "./format";
import { CLASS_ACCENT, COMPARE_ACCENT, TOXIC } from "./theme";

interface Series {
  key: string;
  label: string;
  color: string;
  dashed?: boolean;
  /** y values already in chart units. */
  ys: number[];
}

const N = 360;
const PAD = { l: 52, r: 16, t: 14, b: 26 };

/**
 * Concentration–time chart. Absolute (mg/L) for single drugs; % of typical-dose peak for
 * combinations, compare mode and relative-only drugs.
 * The toxic range is normalised to its own peak with no numbers, thresholds or typical-dose
 * reference, so the chart's proportions cannot reveal a toxic dose amount.
 */
export function PkChart({ sim, compare }: { sim: Simulation; compare: Simulation | null }) {
  const wrap = useRef<HTMLDivElement>(null);
  const [w, setW] = useState(640);
  const h = 190;
  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(280, e.contentRect.width)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const toxic = sim.level === "toxic";
  const relative = toxic || !!compare || sim.components.length > 1 || sim.drug.relativeOnly;
  const tEnd = compare ? Math.max(sim.tEnd, compare.tEnd) : sim.tEnd;
  const accent = CLASS_ACCENT[sim.drug.drugClass];
  const palette = [accent, "#ffffff", "#7aa2ff"];

  const { series, yMax, thresholds } = useMemo(() => {
    const ts = Array.from({ length: N + 1 }, (_, i) => (tEnd * i) / N);
    const mk = (s: Simulation, color: (i: number) => string, dashed: boolean, prefix: string): Series[] =>
      s.components.map((c, i) => {
        const ref = toxic ? c.peak.cmax : s.reference[i].peak.cmax;
        return {
          key: `${prefix}${c.component.id}`,
          label: s.components.length > 1 ? c.component.name : s.drug.name,
          color: color(i),
          dashed,
          ys: ts.map((t) => {
            const v = concentration(c.params, t);
            return relative ? (100 * v) / ref : v;
          }),
        };
      });
    const series = [
      ...mk(sim, (i) => palette[i % palette.length], false, "a-"),
      ...(compare ? mk(compare, () => COMPARE_ACCENT, true, "b-") : []),
    ];
    const thresholds = sim.components.flatMap((c, i) => {
      const lvl = c.component.effectiveLevel;
      if (!lvl || toxic) return [];
      const y = relative ? (100 * lvl.value) / sim.reference[i].peak.cmax : lvl.value;
      return [{ y, label: sim.components.length > 1 ? `${c.component.name} ${lvl.label}` : lvl.label, color: palette[i % palette.length] }];
    });
    const peakY = Math.max(...series.flatMap((s) => s.ys));
    const yMax = niceMax(Math.max(peakY, ...thresholds.map((t) => t.y)) * 1.08);
    return { series, yMax, thresholds };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sim, compare, relative, toxic, tEnd, accent]);

  const iw = w - PAD.l - PAD.r;
  const ih = h - PAD.t - PAD.b;
  const x = (t: number) => PAD.l + (t / tEnd) * iw;
  const y = (v: number) => PAD.t + ih - (Math.min(v, yMax) / yMax) * ih;
  const path = (ys: number[]) => ys.map((v, i) => `${i ? "L" : "M"}${x((tEnd * i) / N).toFixed(1)},${y(v).toFixed(1)}`).join("");

  const xTicks = timeTicks(tEnd);
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * yMax);
  const primary = sim.components[0];
  const markerColor = toxic ? TOXIC : accent;

  // Scrubbing.
  const setT = useApp((s) => s.setT);
  const setPlaying = useApp((s) => s.setPlaying);
  const dragging = useRef(false);
  const scrub = (e: PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * w;
    setT(Math.max(0, Math.min(tEnd, ((px - PAD.l) / iw) * tEnd)));
  };

  return (
    <div ref={wrap} className="relative w-full select-none">
      <svg
        width={w}
        height={h}
        role="img"
        aria-label={`Plasma concentration over time for ${sim.drug.name}${compare ? ` compared with ${compare.drug.name}` : ""}`}
        className="block touch-none cursor-crosshair"
        onPointerDown={(e) => {
          dragging.current = true;
          setPlaying(false);
          e.currentTarget.setPointerCapture(e.pointerId);
          scrub(e);
        }}
        onPointerMove={(e) => dragging.current && scrub(e)}
        onPointerUp={() => (dragging.current = false)}
      >
        <defs>
          {series.map((s) => (
            <linearGradient key={s.key} id={`fill-${s.key}`} x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={toxic ? TOXIC : s.color} stopOpacity={s.dashed ? 0.12 : 0.28} />
              <stop offset="100%" stopColor={toxic ? TOXIC : s.color} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>

        {/* grid */}
        {yTicks.map((v) => (
          <g key={v}>
            <line x1={PAD.l} x2={w - PAD.r} y1={y(v)} y2={y(v)} stroke="var(--grid)" />
            {!toxic && (
              <text x={PAD.l - 8} y={y(v) + 3} textAnchor="end" className="chart-label">
                {relative ? `${Math.round(v)}%` : axisValue(v, yMax)}
              </text>
            )}
          </g>
        ))}
        <text x={10} y={PAD.t + ih / 2} transform={`rotate(-90 10 ${PAD.t + ih / 2})`} textAnchor="middle" className="chart-label">
          {toxic ? "relative level" : relative ? "% of typical peak" : unitOf(yMax)}
        </text>
        {xTicks.map((t) => (
          <text key={t} x={x(t)} y={h - 8} textAnchor="middle" className="chart-label">
            {fmtTimeShort(t)}
          </text>
        ))}

        {/* effective-level window and lines */}
        {primary.window && !compare && !toxic && (
          <rect
            x={x(primary.window.onset)}
            y={PAD.t}
            width={Math.max(0, x(Math.min(tEnd, primary.window.offset)) - x(primary.window.onset))}
            height={ih}
            fill={accent}
            opacity={0.06}
          />
        )}
        {thresholds.map((th) => (
          <g key={th.label}>
            <line x1={PAD.l} x2={w - PAD.r} y1={y(th.y)} y2={y(th.y)} stroke={th.color} strokeDasharray="2 4" opacity={0.7} />
            <text x={w - PAD.r - 4} y={y(th.y) - 5} textAnchor="end" className="chart-label" fill={th.color}>
              {th.label}
            </text>
          </g>
        ))}

        {/* curves */}
        {series.map((s) => (
          <g key={s.key}>
            {!s.dashed && <path d={`${path(s.ys)}L${x(tEnd)},${y(0)}L${x(0)},${y(0)}Z`} fill={`url(#fill-${s.key})`} />}
            <path
              d={path(s.ys)}
              fill="none"
              stroke={toxic && !s.dashed ? TOXIC : s.color}
              strokeWidth={s.dashed ? 1.5 : 2}
              strokeDasharray={s.dashed ? "5 4" : undefined}
            />
          </g>
        ))}

        {/* markers for the primary component */}
        {!compare && (
          <g className="chart-label">
            <Marker x={x(primary.peak.tmax)} top={PAD.t} bottom={PAD.t + ih} color={markerColor} label="Tmax" />
            {primary.halvings.slice(0, 4).map((t, i) =>
              t < tEnd ? (
                <g key={i}>
                  <line x1={x(t)} x2={x(t)} y1={PAD.t + ih - 6} y2={PAD.t + ih} stroke="var(--muted)" />
                  <text x={x(t)} y={PAD.t + ih - 9} textAnchor="middle" fontSize={9}>
                    {["½", "¼", "⅛", "1/16"][i]}
                  </text>
                </g>
              ) : null,
            )}
            {primary.cleared < tEnd && (
              <Marker x={x(primary.cleared)} top={PAD.t} bottom={PAD.t + ih} color="var(--muted)" label="≈ cleared" dashed />
            )}
          </g>
        )}

        <Playhead x={x} y={y} top={PAD.t} bottom={PAD.t + ih} series={series} tEnd={tEnd} />
      </svg>

      <Legend series={series} compare={compare} sim={sim} />
    </div>
  );
}

function Marker({ x, top, bottom, color, label, dashed }: { x: number; top: number; bottom: number; color: string; label: string; dashed?: boolean }) {
  return (
    <g>
      <line x1={x} x2={x} y1={top} y2={bottom} stroke={color} strokeDasharray={dashed ? "3 3" : "1 3"} opacity={0.8} />
      <text x={x + 4} y={top + 9} fill={color} fontSize={10}>
        {label}
      </text>
    </g>
  );
}

/** Subscribes to time on its own so the curves don't re-render every frame. */
function Playhead({
  x,
  y,
  top,
  bottom,
  series,
  tEnd,
}: {
  x: (t: number) => number;
  y: (v: number) => number;
  top: number;
  bottom: number;
  series: Series[];
  tEnd: number;
}) {
  const t = Math.min(useApp((s) => s.t), tEnd);
  const i = Math.round((t / tEnd) * N);
  return (
    <g pointerEvents="none">
      <line x1={x(t)} x2={x(t)} y1={top} y2={bottom} stroke="var(--fg)" strokeOpacity={0.55} />
      {series.map((s) => (
        <circle key={s.key} cx={x(t)} cy={y(s.ys[i] ?? 0)} r={3.5} fill="var(--bg)" stroke={s.color} strokeWidth={2} />
      ))}
      <text x={x(t)} y={top - 3} textAnchor="middle" className="chart-label" fill="var(--fg)">
        {fmtTime(t)}
      </text>
    </g>
  );
}

function Legend({ series, compare, sim }: { series: Series[]; compare: Simulation | null; sim: Simulation }) {
  if (series.length < 2) return null;
  return (
    <ul className="mt-1 flex flex-wrap gap-x-4 gap-y-1 pl-[52px] text-[11px] text-[var(--muted)]">
      {series.map((s, i) => (
        <li key={s.key} className="flex items-center gap-1.5">
          <svg width="16" height="6" aria-hidden>
            <line x1="0" x2="16" y1="3" y2="3" stroke={s.color} strokeWidth={2} strokeDasharray={s.dashed ? "4 3" : undefined} />
          </svg>
          {compare && i >= sim.components.length ? compare.drug.name : s.label}
        </li>
      ))}
    </ul>
  );
}

function axisValue(v: number, yMax: number): string {
  const n = yMax >= 1 ? v : v * 1000;
  return n >= 10 ? n.toFixed(0) : n === 0 ? "0" : n.toPrecision(2).replace(/\.?0+$/, "");
}

function unitOf(yMax: number) {
  return yMax >= 1 ? "mg/L" : "ng/mL";
}

function niceMax(v: number): number {
  if (v <= 0) return 1;
  const p = 10 ** Math.floor(Math.log10(v));
  const m = v / p;
  return (m <= 1 ? 1 : m <= 2 ? 2 : m <= 2.5 ? 2.5 : m <= 5 ? 5 : 10) * p;
}

function timeTicks(tEnd: number): number[] {
  const steps = [5 / 60, 10 / 60, 0.25, 0.5, 1, 2, 3, 4, 6, 12, 24, 48, 72, 168];
  const step = steps.find((s) => tEnd / s <= 8) ?? 168;
  const out: number[] = [];
  for (let t = 0; t <= tEnd + 1e-9; t += step) out.push(+t.toFixed(6));
  return out;
}
