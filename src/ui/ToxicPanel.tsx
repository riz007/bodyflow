"use client";
import { motion } from "motion/react";
import type { Drug } from "@/data/schema";

/** Calm, unobtrusive banner shown only in the toxic range. */
export function ToxicBanner() {
  return (
    <motion.div
      role="note"
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-white/10 bg-[#141018]/90 px-4 py-2.5 text-[12.5px] leading-snug text-[var(--fg-2)] backdrop-blur"
    >
      If you or someone else may have taken too much of a medicine, contact your local emergency number or poison control now.{" "}
      <a href="https://findahelpline.com" target="_blank" rel="noreferrer" className="underline decoration-white/30 underline-offset-2 hover:text-[var(--fg)]">
        If you&apos;re struggling, you can find free, confidential support at findahelpline.com
      </a>
      .
    </motion.div>
  );
}

/** Plain-English explanation of what goes wrong, warning signs and that treatment exists. */
export function ToxicExplainer({ drug }: { drug: Drug }) {
  const t = drug.toxicity;
  return (
    <section aria-label="What happens in overdose" className="space-y-3 rounded-xl border border-[var(--toxic)]/35 bg-[var(--toxic)]/[0.05] p-4 text-[13px] leading-relaxed">
      <h3 className="eyebrow text-[var(--toxic)]">What goes wrong</h3>
      <p className="text-[var(--fg-2)]">{t.mechanism}</p>
      <h3 className="eyebrow pt-1 text-[var(--toxic)]">Warning signs</h3>
      <ul className="space-y-1 text-[var(--fg-2)]">
        {t.warningSigns.map((s) => (
          <li key={s} className="flex gap-2">
            <span aria-hidden className="text-[var(--toxic)]">•</span>
            {s}
          </li>
        ))}
      </ul>
      <h3 className="eyebrow pt-1">Treatment exists</h3>
      <p className="text-[var(--fg-2)]">{t.treatment}</p>
      <p className="text-[11px] text-[var(--muted)]">The curve uses an illustrative multiple of the typical dose. No toxic dose amounts are shown.</p>
    </section>
  );
}
