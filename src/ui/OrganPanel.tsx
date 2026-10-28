"use client";
import type { OrganId } from "@/data/schema";
import { useI18n } from "@/i18n/I18nProvider";
import { tf } from "@/i18n/dictionaries/en";
import { organWindow } from "@/pk/distribute";
import type { Simulation } from "@/pk/simulate";
import { useApp } from "@/state/store";
import { useMemo } from "react";
import { CLASS_ACCENT } from "./theme";

export function OrganPanel({
  sim,
  organ,
}: {
  sim: Simulation;
  organ: OrganId;
}) {
  const { t, f } = useI18n();
  const info = t.organs[organ];
  const drugName = sim.drug.shortName ?? sim.drug.name;
  const effect = sim.drug.organs[organ];
  const accent = CLASS_ACCENT[sim.drug.drugClass];
  const toxic = sim.level === "toxic";
  const atRisk = sim.drug.toxicity.organs.includes(organ);
  const win = useMemo(() => organWindow(sim, organ), [sim, organ]);
  const selectOrgan = useApp((s) => s.selectOrgan);

  return (
    <article
      aria-label={tf(t.organPanel.aria, { organ: info.name })}
      className="space-y-5"
    >
      <button
        type="button"
        onClick={() => selectOrgan(null)}
        className="text-[12px] text-[var(--muted)] hover:text-[var(--fg)]"
      >
        ← {tf(t.organPanel.backTo, { name: drugName })}
      </button>
      <header>
        <p className="eyebrow" style={{ color: accent }}>
          {effect?.target ? t.organPanel.site : t.organPanel.organ}
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight">
          {info.name}
        </h2>
        <p className="mt-3 text-[13.5px] leading-relaxed text-[var(--fg-2)]">
          {info.role}
        </p>
      </header>

      <Block title={tf(t.organPanel.whatDoes, { name: drugName })}>
        {effect?.therapeutic || effect?.sideEffects ? (
          <>
            {effect.therapeutic && <p lang="en">{effect.therapeutic}</p>}
            {effect.sideEffects && (
              <p className="mt-2">
                <span className="text-[var(--muted)]">
                  {t.organPanel.sideEffects}{" "}
                </span>
                <span lang="en">{effect.sideEffects}</span>
              </p>
            )}
          </>
        ) : (
          <p className="text-[var(--muted)]">{t.organPanel.noEffect}</p>
        )}
      </Block>

      <Block
        title={t.organPanel.tooHigh}
        tone={toxic && atRisk ? "toxic" : undefined}
      >
        {effect?.toxic ? (
          <p lang="en">{effect.toxic}</p>
        ) : (
          <p className="text-[var(--muted)]">{t.organPanel.noToxic}</p>
        )}
      </Block>

      <Block title={t.organPanel.when}>
        {win ? (
          <p>
            {tf(t.organPanel.window, {
              start: f.time(win.start),
              end: f.time(win.end),
              peak: f.time(win.peakAt),
            })}
          </p>
        ) : (
          <p className="text-[var(--muted)]">{t.organPanel.negligible}</p>
        )}
        <p className="mt-1.5 text-[11px] text-[var(--muted)]">
          {t.organPanel.windowNote}
        </p>
      </Block>
    </article>
  );
}

function Block({
  title,
  children,
  tone,
}: {
  title: string;
  children: React.ReactNode;
  tone?: "toxic";
}) {
  return (
    <section
      aria-label={title}
      className={`rounded-xl border px-4 py-3 text-[13px] leading-relaxed text-[var(--fg-2)] ${
        tone === "toxic"
          ? "border-[var(--toxic)]/40 bg-[var(--toxic)]/[0.06]"
          : "border-[var(--line)]"
      }`}
    >
      <h3
        className={`eyebrow mb-1.5 ${tone === "toxic" ? "text-[var(--toxic)]" : ""}`}
      >
        {title}
      </h3>
      {children}
    </section>
  );
}
