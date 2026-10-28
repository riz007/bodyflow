import type { OrganId } from "@/data/schema";
import type { OrganRole } from "@/pk/distribute";

/** Keys into the `callouts` dictionary: what the label next to an organ says. */
export type CalloutKey = "damage" | "works" | "side" | "absorbing" | "breakingDown" | "filtering" | "collecting" | "bile";

export interface Callout {
  organ: OrganId;
  role: OrganRole;
  key: CalloutKey;
}

/** How much each role deserves a label; damage always wins. */
const WEIGHT: Record<OrganRole, number> = { damage: 3, target: 2, absorbing: 1.3, clearing: 1.2, side: 1, carried: 0 };
/** Organs below this level are not labelled, so the body isn't covered in text as the drug clears. */
export const MIN_CALLOUT_LEVEL = 0.12;

export function calloutKey(organ: OrganId, role: OrganRole): CalloutKey | null {
  switch (role) {
    case "damage":
      return "damage";
    case "target":
      return "works";
    case "side":
      return "side";
    case "absorbing":
      return "absorbing";
    case "clearing":
      if (organ === "kidneys") return "filtering";
      if (organ === "bladder") return "collecting";
      if (organ === "largeIntestine") return "bile";
      return "breakingDown";
    case "carried":
      return null;
  }
}

/** The organs worth labelling right now, most important first. */
export function pickCallouts(roles: Record<OrganId, { level: number; role: OrganRole }>, max: number): Callout[] {
  const score = (s: { level: number; role: OrganRole }) => WEIGHT[s.role] * Math.min(s.level, 2);
  return (Object.entries(roles) as [OrganId, { level: number; role: OrganRole }][])
    .filter(([o, s]) => o !== "vessels" && s.level >= MIN_CALLOUT_LEVEL && WEIGHT[s.role] > 0)
    .sort(([, a], [, b]) => score(b) - score(a))
    .slice(0, max)
    .map(([organ, s]) => ({ organ, role: s.role, key: calloutKey(organ, s.role)! }));
}
