"use client";
import {
  useCompareSimulation,
  usePlayback,
  useSimulation,
} from "@/state/hooks";
import { SIM_HOURS_PER_SECOND_AT_1X, SPEEDS, useApp } from "@/state/store";
import { UrlSync } from "@/state/UrlSync";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { CookieSettingsLink } from "./CookieConsent";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { cameraApi, ZOOM_STEP } from "@/scene/cameraApi";
import { DisclaimerButton, PanelDisclaimer } from "./Disclaimer";
import { DrugPicker } from "./DrugPicker";
import { OrganPanel } from "./OrganPanel";
import { OverviewPanel } from "./OverviewPanel";
import { Stage } from "./Stage";
import { Timeline } from "./Timeline";
import { ToxicBanner, ToxicExplainer } from "./ToxicPanel";

/** Choose the slowest speed that plays the whole timeline in about a minute or less. */
function autoSpeed(tEnd: number) {
  return (
    SPEEDS.find((s) => tEnd / (s * SIM_HOURS_PER_SECOND_AT_1X) <= 75) ??
    SPEEDS[SPEEDS.length - 1]
  );
}

export function App({ initialDrugId }: { initialDrugId?: string } = {}) {
  const { t, prefix } = useI18n();
  const sim = useSimulation();
  const compare = useCompareSimulation();
  const selectedOrgan = useApp((s) => s.selectedOrgan);
  const tEnd = sim
    ? compare
      ? Math.max(sim.tEnd, compare.tEnd)
      : sim.tEnd
    : 1;
  usePlayback(tEnd);

  const drugId = sim?.drug.id;
  useEffect(() => {
    if (sim) useApp.getState().setSpeed(autoSpeed(sim.tEnd));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drugId]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.matches("input, textarea")) return;
      const s = useApp.getState();
      if (e.key === "Escape") s.selectOrgan(null);
      if (e.metaKey || e.ctrlKey || e.altKey) return; // leave browser zoom (Cmd/Ctrl +/−) alone
      if (e.key === "+" || e.key === "=") cameraApi.zoom(ZOOM_STEP);
      if (e.key === "-" || e.key === "_") cameraApi.zoom(1 / ZOOM_STEP);
      if (e.key === "0") cameraApi.reset();
      if (e.key === " " && s.drugId && !target.matches("button, a, summary")) {
        e.preventDefault();
        s.setPlaying(!s.playing);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const [share, setShare] = useState<"idle" | "copied">("idle");
  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShare("copied");
      setTimeout(() => setShare("idle"), 1800);
    } catch {
      /* clipboard can be blocked; the URL bar still holds the link */
    }
  };

  return (
    <div className="app-grid h-dvh">
      <UrlSync initialDrugId={initialDrugId} prefix={prefix} />
      <header className="area-head flex items-center justify-between gap-3 border-b border-[var(--line)] px-4 sm:px-5">
        <Link
          href={prefix || "/"}
          onClick={() => useApp.getState().selectDrug(null)}
          aria-label={t.header.home}
          className="flex shrink-0 items-center gap-2.5 font-semibold tracking-tight"
        >
          <span className="logo-mark" aria-hidden />
          Bodyflow
        </Link>
        <div className="flex min-w-0 items-center gap-2">
          <DisclaimerButton />
          <LanguageSwitcher />
          {sim && (
            <button
              type="button"
              onClick={copyLink}
              aria-label={share === "copied" ? t.header.copied : t.header.share}
              title={t.header.share}
              className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--line)] px-3 py-1.5 text-[12.5px] hover:border-white/30"
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 16 16"
                aria-hidden
                className="shrink-0"
              >
                <path
                  d="M8 10V2.5M5 5.2 8 2.3l3 2.9M3.5 8.5v4.5h9V8.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {/* Icon-only on phones, where long translations would overflow the header. */}
              <span className="hidden sm:inline">
                {share === "copied" ? t.header.copied : t.header.share}
              </span>
            </button>
          )}
        </div>
      </header>

      <aside className="area-left min-h-0 border-r border-[var(--line)]">
        <DrugPicker />
      </aside>

      <main className="area-main min-h-0">
        <Stage sim={sim} compare={compare} />
      </main>

      <aside
        className="area-right min-h-0 overflow-y-auto border-l border-[var(--line)] p-5"
        aria-live="polite"
      >
        <AnimatePresence mode="wait">
          {sim ? (
            <motion.div
              key={`${sim.drug.id}-${selectedOrgan ?? "overview"}`}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {sim.level === "toxic" && (
                <>
                  <ToxicBanner />
                  <ToxicExplainer drug={sim.drug} />
                </>
              )}
              {selectedOrgan ? (
                <OrganPanel sim={sim} organ={selectedOrgan} />
              ) : (
                <OverviewPanel sim={sim} />
              )}
              <PanelDisclaimer />
            </motion.div>
          ) : (
            <motion.p
              key="none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm text-[var(--muted)]"
            >
              {t.empty}
            </motion.p>
          )}
        </AnimatePresence>
      </aside>

      <div className="area-time min-h-0 border-t border-[var(--line)]">
        {sim ? (
          <Timeline sim={sim} compare={compare} />
        ) : (
          <div className="h-full" />
        )}
      </div>

      <footer className="area-foot flex items-center justify-center border-t border-[var(--line)] px-4 py-2 text-center text-[11px] text-[var(--muted)]">
        <span className="max-w-5xl text-balance">
          {t.disclaimer.footer} · <CookieSettingsLink />
        </span>
      </footer>
    </div>
  );
}
