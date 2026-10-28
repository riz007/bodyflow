"use client";
import { useEffect } from "react";
import { getDrug } from "@/data";
import { DOSE_LEVEL_IDS, type DoseLevel } from "@/pk/simulate";
import { parseTimeToken, timeToken } from "@/ui/format";
import { useApp } from "./store";

/**
 * Two-way sync between the store and the URL: `/drug/alprazolam?dose=typical&t=6h&route=iv&vs=diazepam`.
 * The medicine lives in the path (one indexable page per drug); view state lives in the query.
 */
export function UrlSync({
  initialDrugId,
  prefix = "",
}: {
  initialDrugId?: string;
  prefix?: string;
}) {
  useEffect(() => {
    const q = new URLSearchParams(window.location.search);
    const drug = getDrug(initialDrugId ?? q.get("drug"));
    if (drug) {
      const dose = q.get("dose");
      const route = q.get("route");
      const vs = getDrug(q.get("vs"));
      const t = parseTimeToken(q.get("t"));
      useApp.setState({
        drugId: drug.id,
        regimenId:
          route && drug.components[0].regimens.some((r) => r.id === route)
            ? route
            : null,
        dose: DOSE_LEVEL_IDS.includes(dose as DoseLevel)
          ? (dose as DoseLevel)
          : "typical",
        compareId: vs && vs.id !== drug.id ? vs.id : null,
        t: t ?? 0,
        playing: t === null,
      });
    }

    let timer: ReturnType<typeof setTimeout> | undefined;
    const write = () => {
      const s = useApp.getState();
      const p = new URLSearchParams();
      if (s.drugId) {
        p.set("dose", s.dose);
        if (s.regimenId) p.set("route", s.regimenId);
        if (s.compareId) p.set("vs", s.compareId);
        if (s.t > 0) p.set("t", timeToken(s.t));
      }
      const qs = p.toString();
      const path = s.drugId ? `${prefix}/drug/${s.drugId}` : prefix || "/";
      const url = `${path}${qs ? `?${qs}` : ""}`;
      if (url !== window.location.pathname + window.location.search)
        window.history.replaceState(null, "", url);
    };
    const unsub = useApp.subscribe((s, prev) => {
      if (
        s.drugId === prev.drugId &&
        s.dose === prev.dose &&
        s.regimenId === prev.regimenId &&
        s.compareId === prev.compareId &&
        s.t === prev.t
      )
        return;
      clearTimeout(timer);
      timer = setTimeout(write, s.playing ? 800 : 150);
    });
    return () => {
      unsub();
      clearTimeout(timer);
    };
    // Mount-only: later navigation is driven by the store.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}
