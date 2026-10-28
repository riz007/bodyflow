/**
 * English UI strings: the source of truth for every other language. `{name}` placeholders are
 * filled by `tf()`. Medicine content (mechanisms, organ effects) lives in src/data and is English only.
 */
export const en = {
  meta: {
    title: "Bodyflow — see how medicines move through your body",
    tagline:
      "An interactive 3D visualisation of how medicines are absorbed, distributed, metabolised and excreted.",
    description:
      "Pick a medicine and watch it travel through a 3D human body: absorption, where it acts, liver metabolism and kidney excretion, with half-life, peak level and clearance on a live timeline. 60+ common medicines. Educational only, not medical advice.",
    drugTitle: "{name}: how it moves through your body",
    drugDescription:
      "How {name}{brands} moves through your body: absorption, where it acts, metabolism and excretion. Half-life about {half}. Interactive 3D visualisation. Educational, not medical advice.",
    medicines: "Medicines",
    effects: "Effects on the body",
    alsoKnown: "Also known as {names}.",
    pkLine:
      "{name}: peak level about {tmax} after a typical dose; half-life about {half}; roughly cleared after {cleared} (about five half-lives).",
  },
  units: { min: "min", h: "h", days: "days" },
  header: {
    home: "Bodyflow home",
    share: "Share",
    copied: "Link copied",
    language: "Language",
  },
  empty:
    "Choose a medicine to see how your body absorbs, distributes, metabolises and excretes it.",
  picker: {
    nav: "Medicines",
    search: "Search medicines",
    placeholder: "Search name or brand…",
    filter: "Filter by category",
    all: "All",
    compare: "Compare: pick a second medicine to overlay",
    count: "{n} medicines",
    none: "No medicines match “{q}”.",
  },
  categories: {
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
  },
  routes: {
    oral: "Oral",
    "iv-bolus": "IV injection",
    "iv-infusion": "IV infusion",
    im: "Injection (muscle)",
    sc: "Injection (under skin)",
    inhaled: "Inhaled",
    intranasal: "Nasal spray",
  },
  dose: {
    route: "Route",
    level: "Dose level",
    typical: "Typical dose",
    high: "High dose",
    toxic: "Toxic range",
  },
  stage: {
    body: "Body view",
    canvas: "3D body. Use the organ list to select organs with the keyboard.",
    inPlasma: "In plasma now",
    ofPeak: "{pct}% of peak",
    loading: "Loading anatomy",
    backToBody: "Back to body",
    viewing: "currently viewing {organ}",
    organs: "Organs",
    organList: "Organ list",
    tagline: "How medicines move through you",
    pick: "Pick a medicine",
  },
  phase: {
    absorbing: "Absorbing",
    infusing: "Infusing",
    peak: "At peak",
    cleared: "≈ Cleared",
    below: "Below effective level",
    eliminating: "Eliminating",
  },
  toxicLevel: {
    trace: "Trace",
    within: "Within typical range",
    above: "Above typical",
    far: "Far above typical",
  },
  zoom: { group: "Zoom", in: "Zoom in", out: "Zoom out", reset: "Reset view" },
  timeline: {
    label: "Timeline",
    play: "Play",
    pause: "Pause",
    afterDose: "after dose",
    scrub: "Time since dose",
    speed: "Playback speed",
    help: "1× = 1 simulated minute per second · drag the chart to scrub · single dose, 70 kg adult",
  },
  chart: {
    aria: "Plasma concentration over time for {name}",
    ariaCompare:
      "Plasma concentration over time for {name} compared with {other}",
    relative: "relative level",
    pctPeak: "% of typical peak",
    tmax: "Tmax",
    cleared: "≈ cleared",
  },
  overview: {
    aria: "{name} overview",
    pk: "Pharmacokinetics",
    dose: "Dose",
    toxicRange: "Toxic range",
    peak: "Peak (Tmax)",
    concHidden: "concentration not shown",
    halfLife: "Half-life (t½)",
    range: "range {a}–{b}",
    popAvg: "population average",
    cleared: "≈ Fully cleared",
    clearedSub: "~5 half-lives after peak",
    flipFlop:
      "Absorption here is slower than elimination, so the falling curve tracks absorption, not the {half} half-life.",
    noThreshold: "No defined plasma threshold.",
    above: "Above it from {on} to {off} ({dur}); drops below at {off}.",
    notReached: "This dose does not reach it in this model.",
    urine: "Excreted unchanged in urine",
    bile: "Excreted in bile",
    tissues: "Cleared by tissues",
    liver: "Metabolised (liver)",
    params: "Parameters & sources",
    F: "Bioavailability (F)",
    tmax: "Tmax",
    typicalDose: "Typical dose",
    volume: "Volume ({basis})",
    halfLifeParam: "Half-life",
    pb: "Protein binding",
    fe: "Unchanged in urine (fe)",
    metabolism: "Metabolism",
    curveShows: "Curve shows",
    review: "review",
    reviewTitle: "Flagged for expert review",
    modelNotes: "Model notes",
    interactions: "Key interactions",
    didYouKnow: "Did you know",
    sources: "Sources",
    englishOnly:
      "Medicine details are shown in English. Translations of medical content are pending expert review.",
  },
  organs: {
    list: "Organs",
    presence: "{organ}: {level} drug presence",
    atRisk: ", at risk of damage",
    siteOfAction: "Site of action",
    damage: "damage",
    levels: {
      none: "none",
      low: "low",
      moderate: "moderate",
      high: "high",
      veryHigh: "very high",
    },
    footnote:
      "Illustrative approximation from blood flow, tissue affinity and elimination route. Not a validated PBPK model.",
    brain: {
      name: "Brain",
      role: "Controls thought, mood, breathing and alertness. The blood–brain barrier keeps many drugs out; fat-soluble ones cross easily.",
    },
    heart: {
      name: "Heart",
      role: "Pumps about 5 litres of blood a minute, carrying any drug in the blood to every organ within a minute or so.",
    },
    lungs: {
      name: "Lungs",
      role: "Exchange oxygen and carbon dioxide. All of the heart's output passes through them, and inhaled drugs act here directly.",
    },
    liver: {
      name: "Liver",
      role: "The body's main chemical processing plant. Enzymes such as the CYP family break drugs down, and blood from the gut passes here first (first-pass metabolism).",
    },
    stomach: {
      name: "Stomach",
      role: "Breaks food down with acid. Most tablets dissolve here, but little is absorbed until the small intestine.",
    },
    smallIntestine: {
      name: "Small intestine",
      role: "About 6 m long with a huge surface area: where most swallowed medicines are absorbed into the portal blood.",
    },
    largeIntestine: {
      name: "Large intestine",
      role: "Absorbs water and hosts gut bacteria. Drugs excreted in bile leave the body this way.",
    },
    pancreas: {
      name: "Pancreas",
      role: "Makes digestive enzymes and the hormones insulin and glucagon that control blood sugar.",
    },
    spleen: {
      name: "Spleen",
      role: "Filters old red blood cells and helps the immune system fight infection.",
    },
    kidneys: {
      name: "Kidneys",
      role: "Filter about 180 litres of plasma a day. Water-soluble drugs and drug metabolites leave the body through them.",
    },
    bladder: {
      name: "Bladder",
      role: "Stores urine. What collects here has already left the bloodstream for good.",
    },
    vessels: {
      name: "Major blood vessels",
      role: "Aorta, vena cava, portal vein and renal arteries. The plasma concentration curve describes the drug in this blood.",
    },
  },
  organPanel: {
    aria: "{organ} details",
    backTo: "Back to {name}",
    site: "Site of action",
    organ: "Organ",
    whatDoes: "What {name} does here",
    sideEffects: "Side effects:",
    noEffect:
      "Carried here in the blood; no specific effect is described for this organ.",
    tooHigh: "At too high a dose",
    noToxic: "No organ-specific toxicity is described.",
    when: "When it is affected",
    window: "From about {start} to {end} after the dose, peaking near {peak}.",
    negligible: "Negligible exposure in this model.",
    windowNote:
      "Window where this organ's modelled level is above a quarter of its own peak. Illustrative.",
  },
  toxic: {
    banner:
      "If you or someone else may have taken too much of a medicine, contact your local emergency number or poison control now.",
    struggling:
      "If you're struggling, you can find free, confidential support at findahelpline.com",
    overdose: "What happens in overdose",
    wrong: "What goes wrong",
    signs: "Warning signs",
    treatment: "Treatment exists",
    note: "The curve uses an illustrative multiple of the typical dose. No toxic dose amounts are shown.",
  },
  disclaimer: {
    button: "Medical disclaimer",
    title: "Medical disclaimer",
    intro:
      "Bodyflow is an educational visualisation. It is not medical advice, a diagnosis, or a substitute for care from a qualified health professional.",
    check:
      "Always check with a doctor, specialist or pharmacist before starting, stopping or changing any medicine or dose.",
    model:
      "Curves are simplified models of population averages for a single dose in a 70 kg adult. Your body, other medicines, age, pregnancy, kidney or liver function can change everything shown here.",
    anatomy:
      "The 3D anatomy comes from a male reference dataset, and the curves don't model differences between women and men. Many medicines behave differently by sex, body size and in pregnancy.",
    glow: "Organ glow is an illustrative approximation, not a measurement.",
    urgent:
      "If you feel unwell, have taken too much of a medicine, or think something is wrong, go to hospital or contact your local emergency number or poison control now.",
    struggling:
      "If you're struggling, free and confidential support is available at",
    ok: "I understand",
    panelStrong: "Always cross-check with a doctor.",
    panelText:
      "This is a simplified educational model. Talk to a specialist or pharmacist about your own treatment, and go to hospital if you feel unwell.",
    footer:
      "Educational visualisation only. Not medical advice. Values are approximate population averages. Always check with a doctor or pharmacist, and go to hospital if you feel unwell.",
  },
  cookies: {
    title: "Cookies",
    text: "We'd like to use Google Analytics cookies to understand how Bodyflow is used, such as which medicines people explore. They are only set if you accept. Bodyflow works the same either way, and you can change your choice any time under “Cookie settings” in the footer.",
    reject: "Reject",
    accept: "Accept",
    current: "Current choice: {choice}.",
    accepted: "accepted",
    rejected: "rejected",
    settings: "Cookie settings",
  },
};

type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };
export type Dict = Widen<typeof en>;

/** Fill `{key}` placeholders. */
export function tf(
  template: string,
  vars: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (m, k: string) =>
    k in vars ? String(vars[k]) : m,
  );
}
