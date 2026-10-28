"use client";
import { useMemo } from "react";
import { ORGANS } from "@/data/organs";
import type { OrganId } from "@/data/schema";
import { organWindow } from "@/pk/distribute";
import type { Simulation } from "@/pk/simulate";
import { useApp } from "@/state/store";
import { fmtTime } from "./format";
import { CLASS_ACCENT } from "./theme";

export function OrganPanel({ sim, organ }: { sim: Simulation; organ: OrganId }) {
  const info = ORGANS[organ];
  const effect = sim.drug.organs[organ];
  const accent = CLASS_ACCENT[sim.drug.drugClass];
  const toxic = sim.level === "toxic";
  const atRisk = sim.drug.toxicity.organs.includes(organ);
  const win = useMemo(() => organWindow(sim, organ), [sim, organ]);
  const selectOrgan = useApp((s) => s.selectOrgan);

  return (
    <article aria-label={`${info.name} details`} className="space-y-5">
      <button type="button" onClick={() => selectOrgan(null)} className="text-[12px] text-[var(--muted)] hover:text-[var(--fg)]">
        ← Back to {sim.drug.shortName ?? sim.drug.name}
      </button>
      <header>
        <p className="eyebrow" style={{ color: accent }}>
          {effect?.target ? "Site of action" : "Organ"}
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">{info.name}</h2>
        <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--fg-2)]">{info.role}</p>
      </header>

      <Block title={`What ${sim.drug.shortName ?? sim.drug.name} does here`}>
        {effect?.therapeutic || effect?.sideEffects ? (
          <>
            {effect.therapeutic && <p>{effect.therapeutic}</p>}
            {effect.sideEffects && (
              <p className="mt-2">
                <span className="text-[var(--muted)]">Side effects: </span>
                {effect.sideEffects}
              </p>
            )}
          </>
        ) : (
          <p className="text-[var(--muted)]">Carried here in the blood; no specific effect is described for this organ.</p>
        )}
      </Block>

      <Block title="At too high a dose" tone={toxic && atRisk ? "toxic" : undefined}>
        {effect?.toxic ? <p>{effect.toxic}</p> : <p className="text-[var(--muted)]">No organ-specific toxicity is described.</p>}
      </Block>

      <Block title="When it is affected">
        {win ? (
          <p>
            From about <span className="font-mono">{fmtTime(win.start)}</span> to <span className="font-mono">{fmtTime(win.end)}</span> after the dose, peaking near{" "}
            <span className="font-mono">{fmtTime(win.peakAt)}</span>.
          </p>
        ) : (
          <p className="text-[var(--muted)]">Negligible exposure in this model.</p>
        )}
        <p className="mt-1.5 text-[11px] text-[var(--muted)]">Window where this organ&apos;s modelled level is above a quarter of its own peak. Illustrative.</p>
      </Block>
    </article>
  );
}

function Block({ title, children, tone }: { title: string; children: React.ReactNode; tone?: "toxic" }) {
  return (
    <section
      aria-label={title}
      className={`rounded-xl border px-4 py-3 text-[13px] leading-relaxed text-[var(--fg-2)] ${
        tone === "toxic" ? "border-[var(--toxic)]/40 bg-[var(--toxic)]/[0.06]" : "border-[var(--line)]"
      }`}
    >
      <h3 className={`eyebrow mb-1.5 ${tone === "toxic" ? "text-[var(--toxic)]" : ""}`}>{title}</h3>
      {children}
    </section>
  );
}
