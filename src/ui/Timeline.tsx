"use client";
import type { Simulation } from "@/pk/simulate";
import { SPEEDS, useApp } from "@/state/store";
import { PkChart } from "./PkChart";
import { useI18n } from "@/i18n/I18nProvider";

export function Timeline({
  sim,
  compare,
}: {
  sim: Simulation;
  compare: Simulation | null;
}) {
  const { t: tr, f } = useI18n();
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
    <section
      aria-label={tr.timeline.label}
      className="panel flex flex-col gap-2 px-4 pb-3 pt-3"
    >
      <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? tr.timeline.pause : tr.timeline.play}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-[var(--fg)] text-[var(--bg)] transition hover:scale-105"
        >
          {playing ? (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <rect
                x="1.5"
                y="1"
                width="3"
                height="10"
                rx="1"
                fill="currentColor"
              />
              <rect
                x="7.5"
                y="1"
                width="3"
                height="10"
                rx="1"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden>
              <path
                d="M3 1.2v9.6a.6.6 0 0 0 .9.5l7.6-4.8a.6.6 0 0 0 0-1L3.9.7a.6.6 0 0 0-.9.5Z"
                fill="currentColor"
              />
            </svg>
          )}
        </button>

        <div className="whitespace-nowrap font-mono text-sm tabular-nums">
          <span className="text-[var(--fg)]">{f.time(t)}</span>
          <span className="text-[var(--muted)]"> {tr.timeline.afterDose}</span>
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
          aria-label={tr.timeline.scrub}
          aria-valuetext={f.time(t)}
          className="scrubber mx-2 min-w-[120px] flex-1"
        />

        <div
          role="radiogroup"
          aria-label={tr.timeline.speed}
          className="seg shrink-0"
        >
          {SPEEDS.map((s) => (
            <button
              key={s}
              role="radio"
              aria-checked={speed === s}
              onClick={() => setSpeed(s)}
              className="seg-btn font-mono"
            >
              {s}×
            </button>
          ))}
        </div>
      </div>
      <PkChart sim={sim} compare={compare} />
      <p className="text-[10.5px] text-[var(--muted)]">{tr.timeline.help}</p>
    </section>
  );
}
