/**
 * Citable sources. Links go to the official search/landing page for the document so the
 * current version can be checked; the citation names the specific document.
 */
const dm = (label: string, query: string) => ({
  label: `FDA label: ${label}, DailyMed`,
  url: `https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=${encodeURIComponent(query)}`,
});
const emc = (label: string, query: string) => ({
  label: `UK SmPC: ${label} (EMC)`,
  url: `https://www.medicines.org.uk/emc/search?q=${encodeURIComponent(query)}`,
});

export const SOURCES = {
  "gg-appendix": {
    label: "Goodman & Gilman's The Pharmacological Basis of Therapeutics, 14th ed., Appendix II (PK data)",
    url: "https://accessmedicine.mhmedical.com/book.aspx?bookid=3191",
  },
  "dailymed-acetaminophen-iv": {
    label: "FDA label: Ofirmev (acetaminophen injection), DailyMed",
    url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=ofirmev",
  },
  "statpearls-acetaminophen": {
    label: "StatPearls: Acetaminophen (NCBI Bookshelf)",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK482369/",
  },
  "statpearls-acetaminophen-tox": {
    label: "StatPearls: Acetaminophen Toxicity (NCBI Bookshelf)",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK441917/",
  },
  "dailymed-ibuprofen": {
    label: "FDA label: Motrin (ibuprofen tablets), DailyMed",
    url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=motrin+ibuprofen",
  },
  "statpearls-salicylate-tox": {
    label: "StatPearls: Salicylate Toxicity (NCBI Bookshelf)",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK499879/",
  },
  "needs-source": {
    label: "No firm source located — value flagged for expert review",
    url: "",
  },
  "dailymed-amoxicillin": {
    label: "FDA label: Amoxicillin capsules/tablets, DailyMed",
    url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=amoxicillin",
  },
  "eucast-breakpoints": {
    label: "EUCAST Clinical Breakpoint Tables (current version)",
    url: "https://www.eucast.org/clinical_breakpoints",
  },
  "smpc-benzylpenicillin": {
    label: "UK SmPC: Benzylpenicillin sodium powder for solution for injection (EMC)",
    url: "https://www.medicines.org.uk/emc/search?q=benzylpenicillin",
  },
  "smpc-phenoxymethylpenicillin": {
    label: "UK SmPC: Phenoxymethylpenicillin tablets (EMC)",
    url: "https://www.medicines.org.uk/emc/search?q=phenoxymethylpenicillin",
  },
  "dailymed-ceftriaxone": {
    label: "FDA label: Ceftriaxone for injection, DailyMed",
    url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=ceftriaxone",
  },
  "dailymed-alprazolam": {
    label: "FDA label: Xanax (alprazolam), DailyMed",
    url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=xanax",
  },
  "dailymed-diazepam": {
    label: "FDA label: Valium (diazepam tablets), DailyMed",
    url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=valium",
  },
  "dailymed-promethazine": {
    label: "FDA label: Promethazine HCl tablets / injection, DailyMed",
    url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=promethazine",
  },
  "statpearls-chlorpheniramine": {
    label: "StatPearls: Chlorpheniramine (NCBI Bookshelf)",
    url: "https://www.ncbi.nlm.nih.gov/books/NBK541124/",
  },
  "dailymed-cetirizine": {
    label: "FDA label: Zyrtec (cetirizine HCl), DailyMed",
    url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=cetirizine",
  },
  "dailymed-omeprazole": {
    label: "FDA label: Prilosec (omeprazole delayed-release), DailyMed",
    url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=prilosec",
  },
  "dailymed-metformin": {
    label: "FDA label: Glucophage (metformin HCl), DailyMed",
    url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=glucophage",
  },
  "dailymed-ondansetron": {
    label: "FDA label: Zofran (ondansetron), DailyMed",
    url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=zofran",
  },
  "dailymed-albuterol-oral": {
    label: "FDA label: Albuterol sulfate tablets, DailyMed",
    url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=albuterol+tablets",
  },
  "dailymed-morphine-iv": {
    label: "FDA label: Morphine sulfate injection, DailyMed",
    url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=morphine+sulfate+injection",
  },
  "dailymed-naloxone": {
    label: "FDA label: Naloxone HCl injection, DailyMed",
    url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=naloxone+injection",
  },
  "dailymed-epinephrine": {
    label: "FDA label: Epinephrine injection (1 mg/mL), DailyMed",
    url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=epinephrine+injection",
  },
  "dailymed-viread": {
    label: "FDA label: Viread (tenofovir disoproxil fumarate), DailyMed",
    url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=viread",
  },
  "dailymed-epivir": {
    label: "FDA label: Epivir (lamivudine), DailyMed",
    url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=epivir",
  },
  "dailymed-tivicay": {
    label: "FDA label: Tivicay (dolutegravir), DailyMed",
    url: "https://dailymed.nlm.nih.gov/dailymed/search.cfm?query=tivicay",
  },
  "who-pep-2024": {
    label: "WHO Guidelines for HIV post-exposure prophylaxis (2024)",
    url: "https://www.who.int/publications/i/item/9789240095137",
  },
  // Cardiovascular
  "dailymed-amlodipine": dm("Norvasc (amlodipine besylate)", "norvasc"),
  "dailymed-atorvastatin": dm("Lipitor (atorvastatin calcium)", "lipitor"),
  "dailymed-lisinopril": dm("Zestril / Prinivil (lisinopril)", "zestril"),
  "dailymed-losartan": dm("Cozaar (losartan potassium)", "cozaar"),
  "dailymed-metoprolol": dm("Lopressor (metoprolol tartrate)", "lopressor"),
  "dailymed-propranolol": dm("Propranolol HCl tablets", "propranolol tablets"),
  "dailymed-furosemide": dm("Lasix (furosemide)", "lasix"),
  "dailymed-hctz": dm("Hydrochlorothiazide tablets", "hydrochlorothiazide tablets"),
  "dailymed-clopidogrel": dm("Plavix (clopidogrel bisulfate)", "plavix"),
  "dailymed-warfarin": dm("Coumadin / Jantoven (warfarin sodium)", "warfarin sodium tablets"),
  "dailymed-rivaroxaban": dm("Xarelto (rivaroxaban)", "xarelto"),
  "dailymed-digoxin": dm("Lanoxin (digoxin)", "lanoxin"),
  // Neuro-psychiatric & analgesic
  "dailymed-sertraline": dm("Zoloft (sertraline HCl)", "zoloft"),
  "dailymed-escitalopram": dm("Lexapro (escitalopram oxalate)", "lexapro"),
  "dailymed-fluoxetine": dm("Prozac (fluoxetine HCl)", "prozac"),
  "dailymed-duloxetine": dm("Cymbalta (duloxetine HCl)", "cymbalta"),
  "dailymed-gabapentin": dm("Neurontin (gabapentin)", "neurontin"),
  "dailymed-pregabalin": dm("Lyrica (pregabalin)", "lyrica"),
  "dailymed-lorazepam": dm("Ativan (lorazepam)", "lorazepam tablets"),
  "dailymed-zolpidem": dm("Ambien (zolpidem tartrate)", "ambien"),
  "dailymed-tramadol": dm("Ultram (tramadol HCl)", "ultram"),
  "dailymed-fentanyl-iv": dm("Fentanyl citrate injection", "fentanyl citrate injection"),
  // Antimicrobials
  "dailymed-azithromycin": dm("Zithromax (azithromycin)", "zithromax"),
  "dailymed-ciprofloxacin": dm("Cipro (ciprofloxacin HCl)", "cipro"),
  "dailymed-doxycycline": dm("Vibramycin / doxycycline hyclate", "doxycycline hyclate"),
  "dailymed-cephalexin": dm("Keflex (cephalexin)", "keflex"),
  "dailymed-vancomycin": dm("Vancomycin HCl for injection", "vancomycin injection"),
  "dailymed-fluconazole": dm("Diflucan (fluconazole)", "diflucan"),
  "dailymed-acyclovir": dm("Zovirax (acyclovir)", "acyclovir tablets"),
  // Endocrine, metabolic & GI
  "dailymed-levothyroxine": dm("Synthroid (levothyroxine sodium)", "synthroid"),
  "dailymed-glargine": dm("Lantus (insulin glargine)", "lantus"),
  "smpc-gliclazide": emc("Gliclazide 80 mg tablets", "gliclazide"),
  "dailymed-pantoprazole": dm("Protonix (pantoprazole sodium)", "protonix"),
  "dailymed-famotidine": dm("Pepcid (famotidine)", "pepcid"),
  "dailymed-loperamide": dm("Imodium (loperamide HCl)", "loperamide"),
  // Respiratory, allergy & anti-inflammatory
  "dailymed-fluticasone": dm("Flovent (fluticasone propionate inhalation)", "flovent"),
  "dailymed-prednisolone": dm("Prednisolone / prednisone tablets", "prednisone tablets"),
  "dailymed-loratadine": dm("Claritin (loratadine)", "loratadine"),
  "dailymed-montelukast": dm("Singulair (montelukast sodium)", "singulair"),
  "dailymed-naproxen": dm("Naprosyn (naproxen)", "naprosyn"),
  "dailymed-diclofenac": dm("Voltaren / Cataflam (diclofenac)", "diclofenac potassium tablets"),
};

export type SourceId = keyof typeof SOURCES;
export const SOURCE_IDS = Object.keys(SOURCES) as [SourceId, ...SourceId[]];
