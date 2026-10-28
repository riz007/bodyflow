"use client";
import { useMemo } from "react";
import { SOURCES, type Sourced } from "@/data";
import type { SourceId } from "@/data/sources";
import { excretion } from "@/pk/excretion";
import type { ComponentSim, Simulation } from "@/pk/simulate";
import { useApp } from "@/state/store";
import { useI18n } from "@/i18n/I18nProvider";
import { tf } from "@/i18n/dictionaries/en";
import { fmtConc, fmtMg, fmtPct, type fmtSourced } from "./format";
import { CLASS_ACCENT } from "./theme";

export function OverviewPanel({ sim }: { sim: Simulation }) {
  const { t, locale } = useI18n();
  const { drug } = sim;
  const toxic = sim.level === "toxic";
  const accent = CLASS_ACCENT[drug.drugClass];
  const multi = sim.components.length > 1;

  return (
    <article
      aria-label={tf(t.overview.aria, { name: drug.name })}
      className="space-y-6"
    >
      <header>
        <p className="eyebrow" style={{ color: accent }}>
          {drug.classLabel}
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-tight [overflow-wrap:anywhere]">
          {drug.shortName ?? drug.name}
        </h2>
        <p className="mt-1 text-sm text-[var(--muted)]">
          {[...drug.altNames, ...drug.brands].join(" · ")}
        </p>
        {locale !== "en" && (
          <p
            lang={locale}
            className="mt-4 rounded-lg border border-[var(--line)] bg-white/[0.02] px-3 py-2 text-[12px] leading-relaxed text-[var(--muted)]"
          >
            {t.overview.englishOnly}
          </p>
        )}
        <p
          lang="en"
          className="mt-4 text-[14px] leading-relaxed text-[var(--fg-2)]"
        >
          {drug.mechanism}
        </p>
      </header>

      {sim.components.map((c) => (
        <ComponentStats
          key={c.component.id}
          c={c}
          toxic={toxic}
          relativeOnly={drug.relativeOnly}
          title={multi ? c.component.name : undefined}
          accent={accent}
        />
      ))}

      {drug.modelNotes.length > 0 && (
        <Section title={t.overview.modelNotes}>
          <ul lang="en" className="space-y-1.5 text-[13px] text-[var(--fg-2)]">
            {drug.modelNotes.map((n) => (
              <li key={n} className="flex gap-2">
                <span className="text-[var(--muted)]">›</span>
                {n}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title={t.overview.interactions}>
        <dl lang="en" className="space-y-2.5 text-[13px]">
          {drug.interactions.map((i) => (
            <div key={i.with}>
              <dt className="font-medium text-[var(--fg)]">{i.with}</dt>
              <dd className="text-[var(--fg-2)]">{i.effect}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <aside className="rounded-xl border border-[var(--line)] bg-white/[0.02] p-4">
        <p className="eyebrow">{t.overview.didYouKnow}</p>
        <p
          lang="en"
          className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--fg-2)]"
        >
          {drug.didYouKnow}
        </p>
      </aside>

      <SourceList sim={sim} />
    </article>
  );
}

function ComponentStats({
  c,
  toxic,
  relativeOnly,
  title,
  accent,
}: {
  c: ComponentSim;
  toxic: boolean;
  relativeOnly: boolean;
  title?: string;
  accent: string;
}) {
  const { t, f } = useI18n();
  const comp = c.component;
  const r = c.regimen;
  const lvl = comp.effectiveLevel;
  const administered = c.params.dose / (comp.moietyFactor?.value ?? 1);

  return (
    <section aria-label={title ?? t.overview.pk} className="space-y-3">
      {title && <h3 className="text-sm font-semibold">{title}</h3>}

      <div className="grid grid-cols-2 gap-2">
        <Stat
          label={t.overview.dose}
          value={toxic ? t.overview.toxicRange : fmtMg(administered)}
          sub={r.label}
          hidden={toxic}
        />
        <Stat
          label={t.overview.peak}
          value={f.time(c.peak.tmax)}
          sub={
            toxic || relativeOnly
              ? t.overview.concHidden
              : `Cmax ${fmtConc(c.peak.cmax)}`
          }
        />
        <Stat
          label={t.overview.halfLife}
          value={f.time(comp.halfLife.value)}
          sub={
            comp.halfLife.range
              ? tf(t.overview.range, {
                  a: f.time(comp.halfLife.range[0]),
                  b: f.time(comp.halfLife.range[1]),
                })
              : t.overview.popAvg
          }
        />
        <Stat
          label={t.overview.cleared}
          value={f.time(c.cleared)}
          sub={t.overview.clearedSub}
        />
      </div>

      <EffectiveLevel c={c} toxic={toxic} accent={accent} />
      {c.flipFlop && (
        <p className="text-[12px] text-[var(--muted)]">
          {tf(t.overview.flipFlop, { half: f.time(comp.halfLife.value) })}
        </p>
      )}
      <LiveExcretion c={c} />

      <details className="group rounded-xl border border-[var(--line)] open:bg-white/[0.02]">
        <summary className="cursor-pointer list-none px-4 py-3 text-[13px] font-medium marker:hidden">
          <span className="mr-2 inline-block transition group-open:rotate-90">
            ›
          </span>
          {t.overview.params}
        </summary>
        <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 px-4 pb-4 text-[12.5px]">
          {r.absorption && (
            <Param label={t.overview.F} v={r.absorption.F} kind="fraction" />
          )}
          {r.absorption?.tmax && (
            <Param label={t.overview.tmax} v={r.absorption.tmax} kind="time" />
          )}
          {!toxic && (
            <Param label={t.overview.typicalDose} v={r.dose} kind="mg" />
          )}
          {!relativeOnly && (
            <Param
              label={tf(t.overview.volume, { basis: comp.vd.basis })}
              v={comp.vd}
              kind="volume"
            />
          )}
          <Param
            label={t.overview.halfLifeParam}
            v={comp.halfLife}
            kind="time"
          />
          <Param
            label={t.overview.pb}
            v={comp.proteinBinding}
            kind="fraction"
          />
          <Param label={t.overview.fe} v={comp.fe} kind="fraction" />
          {lvl && !toxic && <Param label={lvl.label} v={lvl} kind="conc" />}
          <dt className="text-[var(--muted)]">{t.overview.metabolism}</dt>
          <dd className="text-[var(--fg-2)]">{comp.metabolism}</dd>
          {comp.measuredMoiety && (
            <>
              <dt className="text-[var(--muted)]">{t.overview.curveShows}</dt>
              <dd className="text-[var(--fg-2)]">{comp.measuredMoiety}</dd>
            </>
          )}
        </dl>
      </details>
    </section>
  );
}

function EffectiveLevel({
  c,
  toxic,
  accent,
}: {
  c: ComponentSim;
  toxic: boolean;
  accent: string;
}) {
  const { t, f } = useI18n();
  const lvl = c.component.effectiveLevel;
  if (!lvl) {
    return (
      <p className="rounded-xl border border-dashed border-[var(--line)] px-4 py-3 text-[12.5px] leading-relaxed text-[var(--fg-2)]">
        <span className="font-medium text-[var(--fg)]">
          {t.overview.noThreshold}
        </span>{" "}
        <span lang="en">{c.component.noThresholdReason}</span>
      </p>
    );
  }
  const w = c.window;
  return (
    <div className="rounded-xl border border-[var(--line)] px-4 py-3 text-[12.5px]">
      <p className="flex items-center gap-2 font-medium">
        <span
          className="h-0.5 w-4 border-t-2 border-dotted"
          style={{ borderColor: accent }}
          aria-hidden
        />
        {lvl.label}
        {!toxic && (
          <span className="font-mono text-[var(--muted)]">
            {fmtConc(lvl.value)}
          </span>
        )}
      </p>
      <p className="mt-1 text-[var(--fg-2)]">
        {w
          ? tf(t.overview.above, {
              on: f.time(w.onset),
              off: f.time(w.offset),
              dur: f.time(w.duration),
            })
          : t.overview.notReached}
      </p>
      {lvl.note && <p className="mt-1 text-[var(--muted)]">{lvl.note}</p>}
    </div>
  );
}

function LiveExcretion({ c }: { c: ComponentSim }) {
  const { t: tr } = useI18n();
  const t = useApp((s) => s.t);
  const ex = excretion(c.params, c.component.fe.value, t);
  const route = c.component.nonRenalRoute;
  const nonRenalLabel =
    route === "biliary"
      ? tr.overview.bile
      : route === "tissue-uptake"
        ? tr.overview.tissues
        : tr.overview.liver;
  return (
    <div className="space-y-1.5 text-[12px]" aria-live="off">
      <Bar
        label={tr.overview.urine}
        value={ex.urineUnchanged}
        color="#7fd6ff"
      />
      <Bar label={nonRenalLabel} value={ex.nonRenal} color="#c9b6ff" />
    </div>
  );
}

function Bar({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div>
      <div className="flex justify-between gap-3 text-[var(--muted)]">
        <span className="min-w-0">{label}</span>
        <span className="font-mono tabular-nums text-[var(--fg-2)]">
          {fmtPct(value)}
        </span>
      </div>
      <div className="mt-1 h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full"
          style={{ width: `${Math.min(100, value * 100)}%`, background: color }}
        />
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  sub,
  hidden,
}: {
  label: string;
  value: string;
  sub?: string;
  hidden?: boolean;
}) {
  return (
    <div className="rounded-xl border border-[var(--line)] bg-white/[0.02] px-3 py-2.5">
      <p className="text-[11px] leading-snug text-[var(--muted)]">{label}</p>
      <p
        className={`mt-0.5 font-mono text-[15px] tabular-nums ${hidden ? "text-[var(--muted)]" : "text-[var(--fg)]"}`}
      >
        {value}
      </p>
      {sub && !hidden && (
        <p className="mt-0.5 truncate text-[10.5px] text-[var(--muted)]">
          {sub}
        </p>
      )}
    </div>
  );
}

function Param({
  label,
  v,
  kind,
}: {
  label: string;
  v: Sourced;
  kind: Parameters<typeof fmtSourced>[1];
}) {
  const { t, f } = useI18n();
  const src = SOURCES[v.source as SourceId];
  return (
    <>
      <dt className="text-[var(--muted)]">{label}</dt>
      <dd className="text-[var(--fg-2)]">
        <span className="font-mono tabular-nums">{f.sourced(v, kind)}</span>
        {v.needsReview && (
          <span
            className="ml-2 whitespace-nowrap rounded border border-amber-300/30 px-1 py-px text-[9.5px] uppercase tracking-wide text-amber-200/80"
            title={t.overview.reviewTitle}
          >
            {t.overview.review}
          </span>
        )}
        <span className="mt-0.5 block text-[11px] text-[var(--muted)]">
          {src.url ? (
            <a
              href={src.url}
              target="_blank"
              rel="noreferrer"
              className="underline decoration-white/20 underline-offset-2 hover:text-[var(--fg)]"
            >
              {src.label}
            </a>
          ) : (
            src.label
          )}
          {v.note && ` · ${v.note}`}
        </span>
      </dd>
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={title}>
      <h3 className="eyebrow mb-2">{title}</h3>
      {children}
    </section>
  );
}

function SourceList({ sim }: { sim: Simulation }) {
  const { t } = useI18n();
  const ids = useMemo(
    () => [
      ...new Set(
        [...JSON.stringify(sim.drug).matchAll(/"source":"([^"]+)"/g)].map(
          (m) => m[1] as SourceId,
        ),
      ),
    ],
    [sim.drug],
  );
  return (
    <Section title={t.overview.sources}>
      <ol className="list-decimal space-y-1 pl-4 text-[11.5px] text-[var(--muted)]">
        {ids.map((id) => (
          <li key={id}>
            {SOURCES[id].url ? (
              <a
                href={SOURCES[id].url}
                target="_blank"
                rel="noreferrer"
                className="hover:text-[var(--fg)]"
              >
                {SOURCES[id].label}
              </a>
            ) : (
              SOURCES[id].label
            )}
          </li>
        ))}
      </ol>
    </Section>
  );
}
