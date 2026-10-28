/**
 * Map an organ's illustrative level to glow intensity. Organ levels at a typical peak sit around
 * 0.5–2, so this is logarithmic: clearly visible at a typical dose and still getting brighter at
 * higher doses instead of saturating: 0.5 → 0.75, 1 → 1.19, 2 → 1.74, capped at 2.4.
 */
export const glowCurve = (v: number) => Math.min(2.4, 0.75 * Math.log2(1 + 2 * Math.max(0, v)));
