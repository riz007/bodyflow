"use client";
import { useEffect, useMemo } from "react";
import { getDrug } from "@/data";
import { simulate, type Simulation } from "@/pk/simulate";
import { SIM_HOURS_PER_SECOND_AT_1X, useApp } from "./store";

export function useSimulation(): Simulation | null {
  const drugId = useApp((s) => s.drugId);
  const regimenId = useApp((s) => s.regimenId);
  const dose = useApp((s) => s.dose);
  return useMemo(() => {
    const d = getDrug(drugId);
    return d ? simulate(d, regimenId ?? undefined, dose) : null;
  }, [drugId, regimenId, dose]);
}

export function useCompareSimulation(): Simulation | null {
  const compareId = useApp((s) => s.compareId);
  const dose = useApp((s) => s.dose);
  return useMemo(() => {
    const d = getDrug(compareId);
    return d ? simulate(d, undefined, dose) : null;
  }, [compareId, dose]);
}

/** Drives simulation time forward while playing. Stops at the end of the timeline. */
export function usePlayback(tEnd: number) {
  const playing = useApp((s) => s.playing);
  useEffect(() => {
    if (!playing) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000);
      last = now;
      const { t, speed, setT, setPlaying, introDone } = useApp.getState();
      if (!introDone) {
        raf = requestAnimationFrame(tick);
        return;
      }
      const next = t + dt * speed * SIM_HOURS_PER_SECOND_AT_1X;
      if (next >= tEnd) {
        setT(tEnd);
        setPlaying(false);
        return;
      }
      setT(next);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [playing, tEnd]);
}

export function usePrefersReducedMotion(): boolean {
  return useMemo(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    [],
  );
}
