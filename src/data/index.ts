import { drugSchema, type Drug, type DrugInput } from "./schema";
import { paracetamol } from "./drugs/paracetamol";
import { ibuprofen } from "./drugs/ibuprofen";
import { aspirin } from "./drugs/aspirin";
import { amoxicillin } from "./drugs/amoxicillin";
import { benzylpenicillin, phenoxymethylpenicillin } from "./drugs/penicillins";
import { ceftriaxone } from "./drugs/ceftriaxone";
import { alprazolam, diazepam } from "./drugs/benzodiazepines";
import { promethazine, chlorphenamine, cetirizine } from "./drugs/antihistamines";
import { omeprazole, metformin, ondansetron, salbutamol } from "./drugs/everyday";
import { morphine, naloxone, adrenaline } from "./drugs/emergency";
import { tld } from "./drugs/tld";
import {
  amlodipine,
  atorvastatin,
  lisinopril,
  losartan,
  metoprolol,
  propranolol,
  furosemide,
  hydrochlorothiazide,
  clopidogrel,
  warfarin,
  rivaroxaban,
  digoxin,
} from "./drugs/cardio";
import { sertraline, escitalopram, fluoxetine, duloxetine, gabapentin, pregabalin, lorazepam, zolpidem, tramadol, fentanyl } from "./drugs/neuro";
import { azithromycin, ciprofloxacin, doxycycline, cephalexin, vancomycin, fluconazole, acyclovir } from "./drugs/antimicrobials";
import { levothyroxine, insulinGlargine, gliclazide, pantoprazole, famotidine, loperamide } from "./drugs/endocrine-gi";
import { fluticasone, prednisolone, loratadine, montelukast, naproxen, diclofenac } from "./drugs/respiratory";

/** To add a medicine: create a file in ./drugs and append it here. Everything else is data-driven. */
const INPUTS: DrugInput[] = [
  paracetamol,
  ibuprofen,
  aspirin,
  amoxicillin,
  benzylpenicillin,
  phenoxymethylpenicillin,
  ceftriaxone,
  alprazolam,
  diazepam,
  promethazine,
  chlorphenamine,
  cetirizine,
  omeprazole,
  metformin,
  ondansetron,
  salbutamol,
  morphine,
  naloxone,
  adrenaline,
  tld,
  // Cardiovascular
  amlodipine,
  atorvastatin,
  lisinopril,
  losartan,
  metoprolol,
  propranolol,
  furosemide,
  hydrochlorothiazide,
  clopidogrel,
  warfarin,
  rivaroxaban,
  digoxin,
  // Neuro-psychiatric & analgesic
  sertraline,
  escitalopram,
  fluoxetine,
  duloxetine,
  gabapentin,
  pregabalin,
  lorazepam,
  zolpidem,
  tramadol,
  fentanyl,
  // Antimicrobials
  azithromycin,
  ciprofloxacin,
  doxycycline,
  cephalexin,
  vancomycin,
  fluconazole,
  acyclovir,
  // Endocrine, metabolic & GI
  levothyroxine,
  insulinGlargine,
  gliclazide,
  pantoprazole,
  famotidine,
  loperamide,
  // Respiratory, allergy & anti-inflammatory
  fluticasone,
  prednisolone,
  loratadine,
  montelukast,
  naproxen,
  diclofenac,
];

/** Validated at module load: a malformed entry fails the build and the tests, not the user. */
export const DRUGS: Drug[] = INPUTS.map((d) => {
  const parsed = drugSchema.safeParse(d);
  if (!parsed.success) throw new Error(`Invalid drug data for "${d.id}": ${parsed.error.message}`);
  return parsed.data;
});

export const DRUGS_BY_ID: Record<string, Drug> = Object.fromEntries(DRUGS.map((d) => [d.id, d]));

export const getDrug = (id: string | null | undefined): Drug | undefined => (id ? DRUGS_BY_ID[id] : undefined);

export { SOURCES } from "./sources";
export { ORGANS, ORGAN_ORDER } from "./organs";
export * from "./schema";
