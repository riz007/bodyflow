"use client";
import { DOSE_LEVELS, DOSE_LEVEL_IDS } from "@/pk/simulate";
import type { Drug } from "@/data/schema";
import { useApp } from "@/state/store";

/** Qualitative dose levels only. No milligram or tablet-count thresholds for toxic doses are shown. */
export function DoseControl({ drug }: { drug: Drug }) {
  const dose = useApp((s) => s.dose);
  const regimenId = useApp((s) => s.regimenId);
  const { setDose, setRegimen } = useApp.getState();
  const regimens = drug.components[0].regimens;
  const activeRegimen = regimenId ?? regimens[0].id;

  return (
    <div className="flex flex-wrap items-center gap-2">
      {regimens.length > 1 && (
        <div role="radiogroup" aria-label="Route" className="seg">
          {regimens.map((r) => (
            <button key={r.id} role="radio" aria-checked={activeRegimen === r.id} onClick={() => setRegimen(r.id)} className="seg-btn">
              {r.label}
            </button>
          ))}
        </div>
      )}
      <div role="radiogroup" aria-label="Dose level" className="seg">
        {DOSE_LEVEL_IDS.map((l) => (
          <button
            key={l}
            role="radio"
            aria-checked={dose === l}
            onClick={() => setDose(l)}
            className={`seg-btn ${l === "toxic" ? "seg-toxic" : ""}`}
          >
            {DOSE_LEVELS[l].label}
          </button>
        ))}
      </div>
    </div>
  );
}
