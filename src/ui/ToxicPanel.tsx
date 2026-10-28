"use client";
import { motion } from "motion/react";
import type { Drug } from "@/data/schema";
import { useI18n } from "@/i18n/I18nProvider";

/** Calm, unobtrusive banner shown only in the toxic range. */
export function ToxicBanner() {
  const { t } = useI18n();
  return (
    <motion.div
      role="note"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/10 bg-[#141018]/90 px-4 py-2.5 text-[12.5px] leading-snug text-[var(--fg-2)] backdrop-blur"
    >
      {t.toxic.banner}{" "}
      <a
        href="https://findahelpline.com"
        target="_blank"
        rel="noreferrer"
        className="underline decoration-white/30 underline-offset-2 hover:text-[var(--fg)]"
      >
        {t.toxic.struggling}
      </a>
    </motion.div>
  );
}

/** Plain-English explanation of what goes wrong, warning signs and that treatment exists. */
export function ToxicExplainer({ drug }: { drug: Drug }) {
  const { t: tr } = useI18n();
  const t = drug.toxicity;
  return (
    <section
      aria-label={tr.toxic.overdose}
      className="space-y-3 rounded-xl border border-[var(--toxic)]/35 bg-[var(--toxic)]/[0.05] p-4 text-[13px] leading-relaxed"
    >
      <h3 className="eyebrow text-[var(--toxic)]">{tr.toxic.wrong}</h3>
      <p lang="en" className="text-[var(--fg-2)]">
        {t.mechanism}
      </p>
      <h3 className="eyebrow pt-1 text-[var(--toxic)]">{tr.toxic.signs}</h3>
      <ul lang="en" className="space-y-1 text-[var(--fg-2)]">
        {t.warningSigns.map((s) => (
          <li key={s} className="flex gap-2">
            <span aria-hidden className="text-[var(--toxic)]">
              •
            </span>
            {s}
          </li>
        ))}
      </ul>
      <h3 className="eyebrow pt-1">{tr.toxic.treatment}</h3>
      <p lang="en" className="text-[var(--fg-2)]">
        {t.treatment}
      </p>
      <p className="text-[11px] text-[var(--muted)]">{tr.toxic.note}</p>
    </section>
  );
}
