/** Shared clock for the 6-second cinematic intro, read every frame by the body and camera. */
export const INTRO_SECONDS = 6;

let start: number | null = null;
let skipped = false;

export function startIntro(now = performance.now()) {
  start = now;
}

export function skipIntro() {
  skipped = true;
}

/** 0 → 1 over the intro; 1 when finished, skipped or never started. */
export function introProgress(now = performance.now()): number {
  if (skipped) return 1;
  if (start === null) return 0;
  return Math.min(1, (now - start) / (INTRO_SECONDS * 1000));
}
