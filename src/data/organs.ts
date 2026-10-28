import type { OrganId } from "./schema";

export interface OrganInfo {
  id: OrganId;
  name: string;
  /** What the organ does, in plain English. */
  role: string;
  /**
   * Illustrative relative perfusion weight (blood flow per tissue mass, roughly ordered from
   * physiology textbooks). Used only to shade the glow; NOT a validated PBPK parameter.
   */
  perfusion: number;
}

export const ORGANS: Record<OrganId, OrganInfo> = {
  brain: {
    id: "brain",
    name: "Brain",
    role: "Controls thought, mood, breathing and alertness. The blood–brain barrier keeps many drugs out; fat-soluble ones cross easily.",
    perfusion: 0.6,
  },
  heart: {
    id: "heart",
    name: "Heart",
    role: "Pumps about 5 litres of blood a minute, carrying any drug in the blood to every organ within a minute or so.",
    perfusion: 0.8,
  },
  lungs: {
    id: "lungs",
    name: "Lungs",
    role: "Exchange oxygen and carbon dioxide. All of the heart's output passes through them, and inhaled drugs act here directly.",
    perfusion: 0.9,
  },
  liver: {
    id: "liver",
    name: "Liver",
    role: "The body's main chemical processing plant. Enzymes such as the CYP family break drugs down, and blood from the gut passes here first (first-pass metabolism).",
    perfusion: 0.8,
  },
  stomach: {
    id: "stomach",
    name: "Stomach",
    role: "Breaks food down with acid. Most tablets dissolve here, but little is absorbed until the small intestine.",
    perfusion: 0.5,
  },
  smallIntestine: {
    id: "smallIntestine",
    name: "Small intestine",
    role: "About 6 m long with a huge surface area: where most swallowed medicines are absorbed into the portal blood.",
    perfusion: 0.5,
  },
  largeIntestine: {
    id: "largeIntestine",
    name: "Large intestine",
    role: "Absorbs water and hosts gut bacteria. Drugs excreted in bile leave the body this way.",
    perfusion: 0.4,
  },
  pancreas: {
    id: "pancreas",
    name: "Pancreas",
    role: "Makes digestive enzymes and the hormones insulin and glucagon that control blood sugar.",
    perfusion: 0.4,
  },
  spleen: {
    id: "spleen",
    name: "Spleen",
    role: "Filters old red blood cells and helps the immune system fight infection.",
    perfusion: 0.6,
  },
  kidneys: {
    id: "kidneys",
    name: "Kidneys",
    role: "Filter about 180 litres of plasma a day. Water-soluble drugs and drug metabolites leave the body through them.",
    perfusion: 1.0,
  },
  bladder: {
    id: "bladder",
    name: "Bladder",
    role: "Stores urine. What collects here has already left the bloodstream for good.",
    perfusion: 0.2,
  },
  vessels: {
    id: "vessels",
    name: "Major blood vessels",
    role: "Aorta, vena cava, portal vein and renal arteries. The plasma concentration curve describes the drug in this blood.",
    perfusion: 1.0,
  },
};

export const ORGAN_ORDER: OrganId[] = [
  "brain",
  "lungs",
  "heart",
  "liver",
  "stomach",
  "pancreas",
  "spleen",
  "smallIntestine",
  "largeIntestine",
  "kidneys",
  "bladder",
  "vessels",
];
