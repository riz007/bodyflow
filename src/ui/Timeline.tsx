"use client";
import type { Simulation } from "@/pk/simulate";
import { SPEEDS, useApp } from "@/state/store";
import { PkChart } from "./PkChart";
import { fmtTime } from "./format";

export function Timeline({ sim, compare }: { sim: Simulation; compare: Simulation | null }) {
  const t = useApp((s) => s.t);
  const playing = useApp((s) => s.playing);
  const speed = useApp((s) => s.speed);
  const { setT, setPlaying, setSpeed } = useApp.getState();
  const tEnd = compare ? Math.max(sim.tEnd, compare.tEnd) : sim.tEnd;

  const toggle = () => {
    if (!playing && t >= tEnd) setT(0);
    setPlaying(!playing);
  };

  return (
    <section aria-label="Timeline" className="panel flex flex-col gap-2 px-4 pb-3 pt-3">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--fg)] text-[var(--bg)] transition hover:scale-105"
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <rect x="1.5" y="1" width="3" height="10" rx="1" fill="currentColor" />
              <rect x="7.5" y="1" width="3" height="10" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <path d="M3 1.2v9.6a.6.6 0 0 0 .9.5l7.6-4.8a.6.6 0 0 0 0-1L3.9.7a.6.6 0 0 0-.9.5Z" fill="currentColor" />
            </svg>
          )}
        </button>

        <div className="font-mono text-sm tabular-nums">
          <span className="text-[var(--fg)]">{fmtTime(t)}</span>
          <span className="text-[var(--muted)]"> after dose</span>
        </div>

        <input
          type="range"
          min={0}
          max={tEnd}
          step={tEnd / 1000}
          value={Math.min(t, tEnd)}
          onChange={(e) => {
            setPlaying(false);
            setT(parseFloat(e.target.value));
          }}
          aria-label="Time since dose"
          aria-valuetext={fmtTime(t)}
          className="scrubber mx-2 flex-1"
        />

        <div role="radiogroup" aria-label="Playback speed" className="seg">
          {SPEEDS.map((s) => (
            <button key={s} role="radio" aria-checked={speed === s} onClick={() => setSpeed(s)} className="seg-btn font-mono">
              {s}×
            </button>
          ))}
        </div>
      </div>
      <PkChart sim={sim} compare={compare} />
      <p className="text-[10.5px] text-[var(--muted)]">
        1× = 1 simulated minute per second · drag the chart to scrub · single dose, 70 kg adult
      </p>
    </section>
  );
}
