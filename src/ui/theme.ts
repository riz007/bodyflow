import type { Category, DrugClass } from "@/data/schema";

/** One accent per drug class. Red is reserved for toxicity and never used here. */
export const CLASS_ACCENT: Record<DrugClass, string> = {
  analgesic: "#f3b35c",
  nsaid: "#e9d26c",
  penicillin: "#5fd39a",
  cephalosporin: "#38c7b0",
  benzodiazepine: "#9d8cff",
  antihistamine: "#c995ff",
  ppi: "#6cc7ff",
  biguanide: "#86e3d8",
  antiemetic: "#8fb0ff",
  bronchodilator: "#5fe1ff",
  opioid: "#b9a7ff",
  "opioid-antagonist": "#e6eeff",
  catecholamine: "#ffbf73",
  antiretroviral: "#4fe3bf",
  "calcium-channel-blocker": "#7fb8ff",
  statin: "#f0c27a",
  "ace-inhibitor": "#6fd0c8",
  arb: "#5fbfd9",
  "beta-blocker": "#a3b6ff",
  diuretic: "#62d6ff",
  antiplatelet: "#ffd38a",
  anticoagulant: "#ffb38a",
  "cardiac-glycoside": "#c4e37a",
  ssri: "#b49cff",
  snri: "#a58cf0",
  gabapentinoid: "#d3a6ff",
  hypnotic: "#8f9dff",
  macrolide: "#7ee0a8",
  fluoroquinolone: "#9be57a",
  tetracycline: "#d9e27a",
  glycopeptide: "#4fd3b0",
  antifungal: "#e0c9ff",
  antiviral: "#5fe8d2",
  "thyroid-hormone": "#ffcf6b",
  insulin: "#7fe0ff",
  sulfonylurea: "#8fe3c9",
  "h2-blocker": "#8fc8ff",
  antidiarrheal: "#e7cf9f",
  corticosteroid: "#f5d98a",
  "leukotriene-antagonist": "#7fd9ff",
};

export const TOXIC = "#ff4d5e";

export const CATEGORY_LABEL: Record<Category, string> = {
  Everyday: "Everyday",
  ER: "Emergency",
  Cardio: "Heart & blood",
  CNS: "Brain & nerves",
  Pain: "Pain",
  Antibiotic: "Anti-infectives",
  Endocrine: "Hormones & diabetes",
  GI: "Stomach & gut",
  Respiratory: "Breathing & allergy",
  PEP: "HIV PEP",
};

/** Second colour for compare mode and further combination components (colour-blind-friendly blue/orange split). */
export const COMPONENT_SHADES = (accent: string) => [accent, "#ffffff", "#7aa2ff"];
export const COMPARE_ACCENT = "#ff9f43";
