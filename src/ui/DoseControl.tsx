"use client";
import { DOSE_LEVEL_IDS } from "@/pk/simulate";
import { useI18n } from "@/i18n/I18nProvider";
import type { Drug } from "@/data/schema";
import { useApp } from "@/state/store";

/** Qualitative dose levels only. No milligram or tablet-count thresholds for toxic doses are shown. */
export function DoseControl({ drug }: { drug: Drug }) {
  const { t, locale } = useI18n();
  const dose = useApp((s) => s.dose);
  const regimenId = useApp((s) => s.regimenId);
  const { setDose, setRegimen } = useApp.getState();
  const regimens = drug.components[0].regimens;
  const activeRegimen = regimenId ?? regimens[0].id;

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      {regimens.length > 1 && (
        <div role="radiogroup" aria-label={t.dose.route} className="seg">
          {regimens.map((r) => (
            <button
              key={r.id}
              role="radio"
              aria-checked={activeRegimen === r.id}
              onClick={() => setRegimen(r.id)}
              className="seg-btn"
            >
              {/* Regimen labels are English data; other languages use the translated route name. */}
              {locale === "en" ? r.label : t.routes[r.route]}
            </button>
          ))}
        </div>
      )}
      <div role="radiogroup" aria-label={t.dose.level} className="seg">
        {DOSE_LEVEL_IDS.map((l) => (
          <button
            key={l}
            role="radio"
            aria-checked={dose === l}
            onClick={() => setDose(l)}
            className={`seg-btn ${l === "toxic" ? "seg-toxic" : ""}`}
          >
            {t.dose[l]}
          </button>
        ))}
      </div>
    </div>
  );
}
