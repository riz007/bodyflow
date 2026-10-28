import { create } from "zustand";
import type { OrganId } from "@/data/schema";
import type { DoseLevel } from "@/pk/simulate";

export const SPEEDS = [1, 10, 100] as const;
export type Speed = (typeof SPEEDS)[number];
/** At 1× the simulation advances one minute per real second. */
export const SIM_HOURS_PER_SECOND_AT_1X = 1 / 60;

export interface AppState {
  drugId: string | null;
  regimenId: string | null;
  dose: DoseLevel;
  compareId: string | null;
  /** Simulation time, hours since dose. */
  t: number;
  playing: boolean;
  speed: Speed;
  selectedOrgan: OrganId | null;
  hoveredOrgan: OrganId | null;
  /** Rendering tier; drops to "low" when the performance monitor sees sustained frame drops. */
  quality: "high" | "low";
  introDone: boolean;

  selectDrug: (id: string | null) => void;
  setRegimen: (id: string) => void;
  setDose: (d: DoseLevel) => void;
  setCompare: (id: string | null) => void;
  setT: (t: number) => void;
  setPlaying: (p: boolean) => void;
  setSpeed: (s: Speed) => void;
  selectOrgan: (o: OrganId | null) => void;
  hoverOrgan: (o: OrganId | null) => void;
  setQuality: (q: "high" | "low") => void;
  finishIntro: () => void;
}

export const useApp = create<AppState>()((set) => ({
  drugId: null,
  regimenId: null,
  dose: "typical",
  compareId: null,
  t: 0,
  playing: false,
  speed: 10,
  selectedOrgan: null,
  hoveredOrgan: null,
  quality: "high",
  introDone: false,

  selectDrug: (id) => set({ drugId: id, regimenId: null, t: 0, playing: !!id, selectedOrgan: null, compareId: null }),
  setRegimen: (id) => set({ regimenId: id, t: 0 }),
  setDose: (dose) => set({ dose }),
  setCompare: (compareId) => set({ compareId }),
  setT: (t) => set({ t: Math.max(0, t) }),
  setPlaying: (playing) => set({ playing }),
  setSpeed: (speed) => set({ speed }),
  selectOrgan: (selectedOrgan) => set({ selectedOrgan }),
  hoverOrgan: (hoveredOrgan) => set({ hoveredOrgan }),
  setQuality: (quality) => set({ quality }),
  finishIntro: () => set({ introDone: true }),
}));
