"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useProgress } from "@react-three/drei";
import { ORGANS } from "@/data/organs";
import { concentration } from "@/pk/model";
import type { ComponentSim, Simulation } from "@/pk/simulate";
import { useApp } from "@/state/store";
import { DoseControl } from "./DoseControl";
import { OrganList } from "./OrganList";
import { ToxicBanner } from "./ToxicPanel";
import { fmtConc } from "./format";
import { CLASS_ACCENT, TOXIC } from "./theme";

const BodyCanvas = dynamic(() => import("@/scene/BodyCanvas"), { ssr: false });

export function phaseAt(c: ComponentSim, t: number): string {
  const kind = c.params.kinetics.kind;
  if (t < c.peak.tmax * 0.9) return kind === "iv-infusion" ? "Infusing" : "Absorbing";
  if (t <= c.peak.tmax * 1.15 || (kind === "iv-bolus" && t < 0.05)) return "At peak";
  if (t >= c.cleared) return "≈ Cleared";
  if (c.window && t > c.window.offset) return "Below effective level";
  return "Eliminating";
}

export function Stage({ sim, compare }: { sim: Simulation | null; compare: Simulation | null }) {
  const introDone = useApp((s) => s.introDone);
  const selected = useApp((s) => s.selectedOrgan);
  const selectOrgan = useApp((s) => s.selectOrgan);
  const [listOpen, setListOpen] = useState(false);

  return (
    <section aria-label="Body view" className="relative h-full min-h-0 overflow-hidden">
      <div className="absolute inset-0">
        <BodyCanvas sim={sim} compare={compare} />
      </div>
      <Loader />

      {/* Top overlay */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex flex-col gap-3 p-5">
        <AnimatePresence mode="wait">
          {sim && introDone && (
            <motion.div
              key={sim.drug.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex flex-wrap items-start justify-between gap-4"
            >
              <LiveReadout sim={sim} />
              <div className="pointer-events-auto">
                <DoseControl drug={sim.drug} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {sim?.level === "toxic" && introDone && (
          <div className="pointer-events-auto max-w-2xl">
            <ToxicBanner />
          </div>
        )}
      </div>

      {/* Back to body */}
      <AnimatePresence>
        {selected && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={() => selectOrgan(null)}
            className="absolute bottom-5 left-1/2 z-10 -translate-x-1/2 rounded-full border border-white/15 bg-black/60 px-4 py-2 text-[13px] backdrop-blur hover:border-white/35"
          >
            ← Back to body <span className="ml-1 font-mono text-[11px] text-[var(--muted)]">Esc</span>
            <span className="sr-only">, currently viewing {ORGANS[selected].name}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Organ list: keyboard path to every organ */}
      {sim && introDone && (
        <div className={`absolute bottom-4 left-4 z-10 max-w-[calc(100%-2rem)] ${listOpen ? "w-[300px]" : "w-auto"}`}>
          <div className="rounded-2xl border border-white/10 bg-black/45 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setListOpen(!listOpen)}
              aria-expanded={listOpen}
              className="flex w-full items-center justify-between px-3.5 py-2.5 text-left"
            >
              <span className="eyebrow mr-3">{listOpen ? "Organs" : "Organ list"}</span>
              <span className="text-[var(--muted)]" aria-hidden>
                {listOpen ? "–" : "+"}
              </span>
            </button>
            {listOpen && (
              <div className="max-h-[46vh] overflow-y-auto px-1 pb-2">
                <OrganList sim={sim} compact />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Empty state hint after the intro */}
      <AnimatePresence>
        {!sim && introDone && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pointer-events-none absolute inset-x-0 bottom-10 z-10 text-center">
            <p className="eyebrow">How medicines move through you</p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-4 py-2 text-sm backdrop-blur">
              <span className="pulse-dot" aria-hidden />
              Pick a medicine
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

function Loader() {
  const { progress, active } = useProgress();
  const [gone, setGone] = useState(false);
  const done = !active && progress >= 100;
  if (gone) return null;
  const r = 26;
  const c = 2 * Math.PI * r;
  return (
    <motion.div
      role="status"
      aria-live="polite"
      animate={{ opacity: done ? 0 : 1 }}
      transition={{ duration: 0.6, delay: done ? 0.2 : 0 }}
      onAnimationComplete={() => done && setGone(true)}
      className="absolute inset-0 z-20 grid place-items-center bg-[var(--bg)]"
    >
      <div className="text-center">
        <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden className="mx-auto">
          <circle cx="32" cy="32" r={r} stroke="rgba(255,255,255,0.08)" strokeWidth="2" fill="none" />
          <circle
            cx="32"
            cy="32"
            r={r}
            stroke="#9fd8ff"
            strokeWidth="2"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={c}
            strokeDashoffset={c * (1 - progress / 100)}
            transform="rotate(-90 32 32)"
            style={{ transition: "stroke-dashoffset 0.3s", filter: "drop-shadow(0 0 6px #9fd8ff)" }}
          />
        </svg>
        <p className="mt-4 font-mono text-[11px] tracking-[0.2em] text-[var(--muted)]">LOADING ANATOMY · {Math.round(progress)}%</p>
      </div>
    </motion.div>
  );
}

function LiveReadout({ sim }: { sim: Simulation }) {
  const t = useApp((s) => s.t);
  const toxic = sim.level === "toxic";
  const accent = toxic ? TOXIC : CLASS_ACCENT[sim.drug.drugClass];
  const relative = toxic || sim.drug.relativeOnly;
  return (
    <div className="space-y-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]" aria-live="off">
      {sim.components.map((c, i) => {
        const v = concentration(c.params, t);
        const pct = (100 * v) / sim.reference[i].peak.cmax;
        return (
          <div key={c.component.id}>
            <p className="eyebrow">
              {sim.components.length > 1 ? c.component.name : "In plasma now"} · <span style={{ color: accent }}>{phaseAt(c, t)}</span>
            </p>
            <p className={`font-mono tabular-nums tracking-tight ${sim.components.length > 1 ? "text-xl" : "text-3xl"}`} style={{ textShadow: `0 0 24px ${accent}55` }}>
              {relative ? (toxic ? levelPhrase(pct) : `${Math.round(pct)}%`) : fmtConc(v)}
              {!relative && <span className="ml-2 text-sm text-[var(--muted)]">{Math.round(pct)}% of peak</span>}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/** Qualitative words for the toxic range: no numbers. */
function levelPhrase(pctOfTypicalPeak: number) {
  if (pctOfTypicalPeak < 5) return "Trace";
  if (pctOfTypicalPeak < 100) return "Within typical range";
  if (pctOfTypicalPeak < 250) return "Above typical";
  return "Far above typical";
}
