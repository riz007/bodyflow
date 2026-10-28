"use client";
import { ORGAN_ORDER } from "@/data/organs";
import { useI18n } from "@/i18n/I18nProvider";
import { tf, type Dict } from "@/i18n/dictionaries/en";
import { organLevels } from "@/pk/distribute";
import type { Simulation } from "@/pk/simulate";
import { useApp } from "@/state/store";
import { CLASS_ACCENT, TOXIC } from "./theme";

/** Words paired with intensity so the scale never relies on colour alone. */
export function levelWord(v: number): keyof Dict["organs"]["levels"] {
  if (v < 0.05) return "none";
  if (v < 0.25) return "low";
  if (v < 0.6) return "moderate";
  if (v < 1.2) return "high";
  return "veryHigh";
}

/**
 * Keyboard-accessible list of organs with live relative drug presence.
 * The same selection model as clicking organs in 3D.
 */
export function OrganList({
  sim,
  compact = false,
}: {
  sim: Simulation;
  compact?: boolean;
}) {
  const { t: tr } = useI18n();
  const t = useApp((s) => s.t);
  const selected = useApp((s) => s.selectedOrgan);
  const hovered = useApp((s) => s.hoveredOrgan);
  const { selectOrgan, hoverOrgan } = useApp.getState();
  const levels = organLevels(sim, t);
  const toxic = sim.level === "toxic";
  const accent = CLASS_ACCENT[sim.drug.drugClass];

  return (
    <div>
      <ul aria-label={tr.organs.list} className="grid grid-cols-1 gap-1">
        {ORGAN_ORDER.map((id) => {
          const v = levels[id];
          const damaged =
            toxic && sim.drug.toxicity.organs.includes(id) && v > 0.25;
          const color = damaged ? TOXIC : accent;
          const target = sim.drug.organs[id]?.target;
          return (
            <li key={id}>
              <button
                type="button"
                onClick={() => selectOrgan(selected === id ? null : id)}
                onMouseEnter={() => hoverOrgan(id)}
                onMouseLeave={() => hoverOrgan(null)}
                onFocus={() => hoverOrgan(id)}
                onBlur={() => hoverOrgan(null)}
                aria-pressed={selected === id}
                aria-label={`${tf(tr.organs.presence, { organ: tr.organs[id].name, level: tr.organs.levels[levelWord(v)] })}${damaged ? tr.organs.atRisk : ""}${target ? `, ${tr.organs.siteOfAction}` : ""}`}
                className={`grid w-full items-center rounded-lg px-2.5 text-left transition ${compact ? "grid-cols-[112px_1fr_64px] gap-2 py-1 text-[12px]" : "grid-cols-[120px_1fr_76px] gap-3 py-1.5 text-[12.5px]"} ${
                  selected === id
                    ? "bg-white/[0.08]"
                    : hovered === id
                      ? "bg-white/[0.04]"
                      : ""
                }`}
              >
                <span className="flex min-w-0 items-center gap-1.5 text-[var(--fg-2)]">
                  <span className="truncate" title={tr.organs[id].name}>
                    {tr.organs[id].name}
                  </span>
                  {target && (
                    <span
                      className="h-1 w-1 shrink-0 rounded-full"
                      style={{ background: accent }}
                      title={tr.organs.siteOfAction}
                    />
                  )}
                </span>
                <span className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
                  <span
                    className="block h-full rounded-full transition-[width] duration-150"
                    style={{
                      width: `${Math.min(100, (v / 1.5) * 100)}%`,
                      background: color,
                      boxShadow: `0 0 ${6 + v * 10}px ${color}`,
                    }}
                  />
                </span>
                <span
                  className={`truncate text-right text-[10.5px] ${damaged ? "text-[var(--toxic)]" : "text-[var(--muted)]"}`}
                >
                  {damaged ? tr.organs.damage : tr.organs.levels[levelWord(v)]}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 px-2.5 text-[10.5px] leading-snug text-[var(--muted)]">
        {tr.organs.footnote}
      </p>
    </div>
  );
}
