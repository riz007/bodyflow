"use client";
import { useI18n } from "@/i18n/I18nProvider";
import { tf, type Dict } from "@/i18n/dictionaries/en";
import { concentration } from "@/pk/model";
import type { ComponentSim, Simulation } from "@/pk/simulate";
import { useApp } from "@/state/store";
import { useProgress } from "@react-three/drei";
import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { DoseControl } from "./DoseControl";
import { OrganList } from "./OrganList";
import { ZoomControls } from "./ZoomControls";
import { fmtConc } from "./format";
import { CLASS_ACCENT, PROCESSING, TOXIC } from "./theme";

const BodyCanvas = dynamic(() => import("@/scene/BodyCanvas"), { ssr: false });

export function phaseAt(c: ComponentSim, t: number): keyof Dict["phase"] {
  const kind = c.params.kinetics.kind;
  if (t < c.peak.tmax * 0.9)
    return kind === "iv-infusion" ? "infusing" : "absorbing";
  if (t <= c.peak.tmax * 1.15 || (kind === "iv-bolus" && t < 0.05))
    return "peak";
  if (t >= c.cleared) return "cleared";
  if (c.window && t > c.window.offset) return "below";
  return "eliminating";
}

export function Stage({
  sim,
  compare,
}: {
  sim: Simulation | null;
  compare: Simulation | null;
}) {
  const { t } = useI18n();
  const introDone = useApp((s) => s.introDone);
  const selected = useApp((s) => s.selectedOrgan);
  const selectOrgan = useApp((s) => s.selectOrgan);
  const [listOpen, setListOpen] = useState(false);

  return (
    <section
      aria-label={t.stage.body}
      className="relative h-full min-h-0 overflow-hidden"
    >
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
              className="flex flex-wrap items-start justify-between gap-x-4 gap-y-3 pr-12"
            >
              <LiveReadout sim={sim} />
              <div className="pointer-events-auto ml-auto max-w-full">
                <DoseControl drug={sim.drug} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {introDone && <ZoomControls />}

      {/* Back to body: bottom-right, clear of the organ list (bottom-left) and the empty-state hint */}
      <AnimatePresence>
        {selected && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            onClick={() => selectOrgan(null)}
            className="absolute bottom-4 right-4 z-10 whitespace-nowrap rounded-full border border-white/15 bg-black/60 px-4 py-2 text-[13px] backdrop-blur hover:border-white/35"
          >
            ← {t.stage.backToBody}{" "}
            <span className="ml-1 font-mono text-[11px] text-[var(--muted)]">
              Esc
            </span>
            <span className="sr-only">
              , {tf(t.stage.viewing, { organ: t.organs[selected].name })}
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Organ list: keyboard path to every organ */}
      {sim && introDone && (
        <div
          className={`absolute bottom-4 left-4 z-10 ${listOpen ? "w-[300px] max-w-[calc(100%-2rem)]" : "w-auto max-w-[calc(100%-12rem)]"}`}
        >
          <div className="rounded-2xl border border-white/10 bg-black/45 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setListOpen(!listOpen)}
              aria-expanded={listOpen}
              className="flex w-full items-center justify-between px-3.5 py-2.5 text-left"
            >
              <span className="eyebrow mr-3">
                {listOpen ? t.stage.organs : t.stage.organList}
              </span>
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

      {/* Key to the organ glow: bottom-right, where "Back to body" sits once an organ is selected */}
      {sim && !compare && introDone && !selected && <GlowLegend sim={sim} />}

      {/* Empty state hint after the intro */}
      <AnimatePresence>
        {!sim && introDone && !selected && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-x-0 bottom-10 z-10 text-center"
          >
            <p className="eyebrow px-6">{t.stage.tagline}</p>
            <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/15 bg-black/50 px-4 py-2 text-sm backdrop-blur">
              <span className="pulse-dot" aria-hidden />
              {t.stage.pick}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/** Swatches mirror the shader: solid, diagonal stripes, horizontal bands, red. */
function GlowLegend({ sim }: { sim: Simulation }) {
  const { t } = useI18n();
  const accent = CLASS_ACCENT[sim.drug.drugClass];
  const items: [string, string][] = [
    [t.legend.works, accent],
    [t.legend.side, `repeating-linear-gradient(45deg, ${accent} 0 2px, transparent 2px 4px)`],
    [t.legend.processing, `repeating-linear-gradient(0deg, ${PROCESSING} 0 2px, transparent 2px 4px)`],
  ];
  if (sim.level === "toxic") items.push([t.legend.damage, TOXIC]);
  return (
    <div
      aria-label={t.legend.aria}
      role="group"
      className="pointer-events-none absolute bottom-4 right-4 z-10 max-w-[11.5rem] rounded-2xl border border-white/10 bg-black/45 px-3 py-2.5 text-[11.5px] leading-tight text-[var(--fg-2)] backdrop-blur-md"
    >
      <ul className="space-y-1.5">
        {items.map(([label, bg]) => (
          <li key={label} className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-white/20" style={{ background: bg }} aria-hidden />
            {label}
          </li>
        ))}
      </ul>
      <p className="mt-2 text-[10.5px] text-[var(--muted)]">{t.legend.brightness}</p>
    </div>
  );
}

function Loader() {
  const { t } = useI18n();
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
        <svg
          width="64"
          height="64"
          viewBox="0 0 64 64"
          aria-hidden
          className="mx-auto"
        >
          <circle
            cx="32"
            cy="32"
            r={r}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth="2"
            fill="none"
          />
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
            style={{
              transition: "stroke-dashoffset 0.3s",
              filter: "drop-shadow(0 0 6px #9fd8ff)",
            }}
          />
        </svg>
        <p className="eyebrow mt-4">
          {t.stage.loading} · {Math.round(progress)}%
        </p>
      </div>
    </motion.div>
  );
}

function LiveReadout({ sim }: { sim: Simulation }) {
  const { t: tr } = useI18n();
  const t = useApp((s) => s.t);
  const toxic = sim.level === "toxic";
  const accent = toxic ? TOXIC : CLASS_ACCENT[sim.drug.drugClass];
  const relative = toxic || sim.drug.relativeOnly;
  return (
    <div
      className="shrink-0 space-y-2 drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]"
      aria-live="off"
    >
      {sim.components.map((c, i) => {
        const v = concentration(c.params, t);
        const pct = (100 * v) / sim.reference[i].peak.cmax;
        return (
          <div key={c.component.id}>
            <p className="eyebrow">
              {sim.components.length > 1 ? c.component.name : tr.stage.inPlasma}{" "}
              · <span style={{ color: accent }}>{tr.phase[phaseAt(c, t)]}</span>
            </p>
            <p
              className={`font-mono tabular-nums tracking-tight ${sim.components.length > 1 ? "text-xl" : "text-3xl"}`}
              style={{ textShadow: `0 0 24px ${accent}55` }}
            >
              {relative
                ? toxic
                  ? tr.toxicLevel[levelPhrase(pct)]
                  : `${Math.round(pct)}%`
                : fmtConc(v)}
            </p>
            {/* On its own line: long translations ("93% от пика") would otherwise run under the controls. */}
            {!relative && (
              <p className="text-[12px] text-[var(--muted)]">
                {tf(tr.stage.ofPeak, { pct: Math.round(pct) })}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}

/** Qualitative words for the toxic range: no numbers. */
function levelPhrase(pctOfTypicalPeak: number): keyof Dict["toxicLevel"] {
  if (pctOfTypicalPeak < 5) return "trace";
  if (pctOfTypicalPeak < 100) return "within";
  if (pctOfTypicalPeak < 250) return "above";
  return "far";
}
