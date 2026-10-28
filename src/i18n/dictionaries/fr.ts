import type { Dict } from "./en";

export const fr: Dict = {
  meta: {
    title:
      "Bodyflow — voyez comment les médicaments circulent dans votre corps",
    tagline:
      "Une visualisation 3D interactive de l'absorption, de la distribution, du métabolisme et de l'élimination des médicaments.",
    description:
      "Choisissez un médicament et suivez son parcours dans un corps humain en 3D : absorption, lieu d'action, métabolisme hépatique et élimination rénale, avec demi-vie, pic et élimination sur une frise chronologique. Plus de 60 médicaments courants. À but éducatif uniquement, pas un avis médical.",
    drugTitle: "{name} : son parcours dans votre corps",
    drugDescription:
      "Comment {name}{brands} circule dans votre corps : absorption, lieu d'action, métabolisme et élimination. Demi-vie d'environ {half}. Visualisation 3D interactive. À but éducatif, pas un avis médical.",
    medicines: "Médicaments",
    effects: "Effets sur le corps",
    alsoKnown: "Aussi appelé {names}.",
    pkLine:
      "{name} : pic vers {tmax} après une dose habituelle ; demi-vie d'environ {half} ; presque entièrement éliminé après {cleared} (environ cinq demi-vies).",
  },
  units: { min: "min", h: "h", days: "jours" },
  header: {
    home: "Accueil Bodyflow",
    share: "Partager",
    copied: "Lien copié",
    language: "Langue",
  },
  empty:
    "Choisissez un médicament pour voir comment votre corps l'absorbe, le distribue, le métabolise et l'élimine.",
  picker: {
    nav: "Médicaments",
    search: "Rechercher des médicaments",
    placeholder: "Nom ou marque…",
    filter: "Filtrer par catégorie",
    all: "Tous",
    compare: "Comparer : choisissez un second médicament à superposer",
    count: "{n} médicaments",
    none: "Aucun médicament ne correspond à « {q} ».",
  },
  categories: {
    Everyday: "Courants",
    ER: "Urgences",
    Cardio: "Cœur et sang",
    CNS: "Cerveau et nerfs",
    Pain: "Douleur",
    Antibiotic: "Anti-infectieux",
    Endocrine: "Hormones et diabète",
    GI: "Estomac et intestin",
    Respiratory: "Respiration et allergie",
    PEP: "TPE du VIH",
  },
  routes: {
    oral: "Voie orale",
    "iv-bolus": "Injection IV",
    "iv-infusion": "Perfusion IV",
    im: "Injection (muscle)",
    sc: "Injection (sous la peau)",
    inhaled: "Inhalé",
    intranasal: "Spray nasal",
  },
  dose: {
    route: "Voie",
    level: "Niveau de dose",
    typical: "Dose habituelle",
    high: "Dose élevée",
    toxic: "Zone toxique",
  },
  stage: {
    body: "Vue du corps",
    canvas:
      "Corps en 3D. Utilisez la liste des organes pour les sélectionner au clavier.",
    inPlasma: "Dans le plasma",
    ofPeak: "{pct} % du pic",
    loading: "Chargement de l'anatomie",
    backToBody: "Retour au corps",
    viewing: "vue actuelle : {organ}",
    organs: "Organes",
    organList: "Liste des organes",
    tagline: "Le parcours des médicaments dans votre corps",
    pick: "Choisissez un médicament",
  },
  phase: {
    absorbing: "Absorption",
    infusing: "Perfusion",
    peak: "Au pic",
    cleared: "≈ Éliminé",
    below: "Sous le seuil efficace",
    eliminating: "Élimination",
  },
  toxicLevel: {
    trace: "Traces",
    within: "Dans la normale",
    above: "Au-dessus de la normale",
    far: "Très au-dessus de la normale",
  },
  zoom: {
    group: "Zoom",
    in: "Zoom avant",
    out: "Zoom arrière",
    reset: "Réinitialiser la vue",
  },
  timeline: {
    label: "Chronologie",
    play: "Lecture",
    pause: "Pause",
    afterDose: "après la prise",
    scrub: "Temps depuis la prise",
    speed: "Vitesse de lecture",
    help: "1× = 1 minute simulée par seconde · faites glisser le graphique pour naviguer · dose unique, adulte de 70 kg",
  },
  chart: {
    aria: "Concentration plasmatique au cours du temps pour {name}",
    ariaCompare:
      "Concentration plasmatique au cours du temps pour {name} comparé à {other}",
    relative: "niveau relatif",
    pctPeak: "% du pic habituel",
    tmax: "Tmax",
    cleared: "≈ éliminé",
  },
  overview: {
    aria: "Aperçu de {name}",
    pk: "Pharmacocinétique",
    dose: "Dose",
    toxicRange: "Zone toxique",
    peak: "Pic (Tmax)",
    concHidden: "concentration non affichée",
    halfLife: "Demi-vie (t½)",
    range: "plage {a}–{b}",
    popAvg: "moyenne de la population",
    cleared: "≈ Entièrement éliminé",
    clearedSub: "~5 demi-vies après le pic",
    flipFlop:
      "Ici, l'absorption est plus lente que l'élimination : la descente de la courbe reflète l'absorption, et non la demi-vie de {half}.",
    noThreshold: "Pas de seuil plasmatique défini.",
    above: "Au-dessus de {on} à {off} ({dur}) ; repasse en dessous à {off}.",
    notReached: "Cette dose ne l'atteint pas dans ce modèle.",
    urine: "Éliminé inchangé dans l'urine",
    bile: "Éliminé dans la bile",
    tissues: "Éliminé par les tissus",
    liver: "Métabolisé (foie)",
    params: "Paramètres et sources",
    F: "Biodisponibilité (F)",
    tmax: "Tmax",
    typicalDose: "Dose habituelle",
    volume: "Volume ({basis})",
    halfLifeParam: "Demi-vie",
    pb: "Liaison aux protéines",
    fe: "Inchangé dans l'urine (fe)",
    metabolism: "Métabolisme",
    curveShows: "La courbe montre",
    review: "à vérifier",
    reviewTitle: "Signalé pour vérification par un expert",
    modelNotes: "Notes sur le modèle",
    interactions: "Interactions principales",
    didYouKnow: "Le saviez-vous ?",
    sources: "Sources",
    englishOnly:
      "Les détails du médicament sont affichés en anglais. La traduction du contenu médical attend la vérification d'un expert.",
  },
  organs: {
    list: "Organes",
    presence: "{organ} : présence du médicament {level}",
    atRisk: ", risque de lésion",
    siteOfAction: "Site d'action",
    damage: "lésion",
    levels: {
      none: "nulle",
      low: "faible",
      moderate: "modérée",
      high: "élevée",
      veryHigh: "très élevée",
    },
    footnote:
      "Approximation illustrative fondée sur le débit sanguin, l'affinité tissulaire et la voie d'élimination. Pas un modèle PBPK validé.",
    brain: {
      name: "Cerveau",
      role: "Contrôle la pensée, l'humeur, la respiration et la vigilance. La barrière hémato-encéphalique bloque de nombreux médicaments ; les liposolubles la traversent facilement.",
    },
    heart: {
      name: "Cœur",
      role: "Pompe environ 5 litres de sang par minute et transporte tout médicament présent dans le sang vers chaque organe en une minute environ.",
    },
    lungs: {
      name: "Poumons",
      role: "Échangent l'oxygène et le dioxyde de carbone. Tout le sang pompé par le cœur les traverse, et les médicaments inhalés y agissent directement.",
    },
    liver: {
      name: "Foie",
      role: "Principale usine chimique du corps. Des enzymes comme la famille CYP dégradent les médicaments, et le sang venant de l'intestin y passe en premier (effet de premier passage).",
    },
    stomach: {
      name: "Estomac",
      role: "Digère les aliments grâce à l'acide. La plupart des comprimés s'y dissolvent, mais peu de choses sont absorbées avant l'intestin grêle.",
    },
    smallIntestine: {
      name: "Intestin grêle",
      role: "Long d'environ 6 m, avec une immense surface : c'est là que la plupart des médicaments avalés passent dans le sang portal.",
    },
    largeIntestine: {
      name: "Gros intestin",
      role: "Absorbe l'eau et abrite les bactéries intestinales. Les médicaments éliminés dans la bile quittent le corps par là.",
    },
    pancreas: {
      name: "Pancréas",
      role: "Produit des enzymes digestives ainsi que l'insuline et le glucagon, qui régulent la glycémie.",
    },
    spleen: {
      name: "Rate",
      role: "Filtre les vieux globules rouges et aide le système immunitaire à combattre les infections.",
    },
    kidneys: {
      name: "Reins",
      role: "Filtrent environ 180 litres de plasma par jour. Les médicaments hydrosolubles et leurs métabolites quittent le corps par cette voie.",
    },
    bladder: {
      name: "Vessie",
      role: "Stocke l'urine. Ce qui s'y accumule a définitivement quitté la circulation sanguine.",
    },
    vessels: {
      name: "Gros vaisseaux sanguins",
      role: "Aorte, veine cave, veine porte et artères rénales. La courbe de concentration plasmatique décrit le médicament dans ce sang.",
    },
  },
  organPanel: {
    aria: "Détails : {organ}",
    backTo: "Retour à {name}",
    site: "Site d'action",
    organ: "Organe",
    whatDoes: "Ce que fait {name} ici",
    sideEffects: "Effets indésirables :",
    noEffect:
      "Apporté ici par le sang ; aucun effet spécifique n'est décrit pour cet organe.",
    tooHigh: "À dose trop élevée",
    noToxic: "Aucune toxicité spécifique à cet organe n'est décrite.",
    when: "Quand il est concerné",
    window:
      "D'environ {start} à {end} après la prise, avec un pic vers {peak}.",
    negligible: "Exposition négligeable dans ce modèle.",
    windowNote:
      "Période pendant laquelle le niveau modélisé de cet organe dépasse le quart de son propre pic. Illustratif.",
  },
  toxic: {
    banner:
      "Si vous ou quelqu'un d'autre avez peut-être pris trop d'un médicament, contactez dès maintenant votre numéro d'urgence local ou un centre antipoison.",
    struggling:
      "Si vous traversez une période difficile, vous trouverez un soutien gratuit et confidentiel sur findahelpline.com",
    overdose: "Que se passe-t-il en cas de surdosage",
    wrong: "Ce qui se dérègle",
    signs: "Signes d'alerte",
    treatment: "Un traitement existe",
    note: "La courbe utilise un multiple illustratif de la dose habituelle. Aucune quantité toxique n'est affichée.",
  },
  disclaimer: {
    button: "Avertissement médical",
    title: "Avertissement médical",
    intro:
      "Bodyflow est une visualisation éducative. Ce n'est ni un avis médical, ni un diagnostic, ni un substitut aux soins d'un professionnel de santé qualifié.",
    check:
      "Consultez toujours un médecin, un spécialiste ou un pharmacien avant de commencer, d'arrêter ou de modifier un médicament ou une dose.",
    model:
      "Les courbes sont des modèles simplifiés de moyennes de population pour une dose unique chez un adulte de 70 kg. Votre corps, d'autres médicaments, l'âge, une grossesse ou la fonction rénale ou hépatique peuvent tout changer.",
    anatomy:
      "L'anatomie 3D provient d'un jeu de données de référence masculin, et les courbes ne modélisent pas les différences entre femmes et hommes. De nombreux médicaments agissent différemment selon le sexe, la corpulence et pendant la grossesse.",
    glow: "La lueur des organes est une approximation illustrative, pas une mesure.",
    urgent:
      "Si vous vous sentez mal, avez pris trop d'un médicament ou pensez que quelque chose ne va pas, rendez-vous à l'hôpital ou contactez dès maintenant votre numéro d'urgence local ou un centre antipoison.",
    struggling:
      "Si vous traversez une période difficile, un soutien gratuit et confidentiel est disponible sur",
    ok: "J'ai compris",
    panelStrong: "Vérifiez toujours auprès d'un médecin.",
    panelText:
      "Ceci est un modèle éducatif simplifié. Parlez de votre traitement à un spécialiste ou à un pharmacien, et rendez-vous à l'hôpital si vous vous sentez mal.",
    footer:
      "Visualisation éducative uniquement. Pas un avis médical. Les valeurs sont des moyennes de population approximatives. Consultez toujours un médecin ou un pharmacien, et rendez-vous à l'hôpital si vous vous sentez mal.",
  },
  callouts: {
    works: "Agit ici",
    side: "Effets indésirables",
    absorbing: "Absorption",
    breakingDown: "Dégradation",
    filtering: "Filtration",
    collecting: "Accumulation dans l'urine",
    bile: "Élimination par la bile",
    damage: "Risque de lésion",
  },
  legend: {
    aria: "Signification des couleurs des organes",
    works: "Là où il agit",
    side: "Effets indésirables",
    processing: "Absorption ou élimination",
    damage: "Risque de lésion",
    brightness: "Plus lumineux = plus de médicament",
  },
  cookies: {
    title: "Cookies",
    text: "Nous aimerions utiliser des cookies Google Analytics pour comprendre comment Bodyflow est utilisé, par exemple quels médicaments sont consultés. Ils ne sont déposés que si vous acceptez. Bodyflow fonctionne de la même façon dans les deux cas, et vous pouvez modifier votre choix à tout moment via « Paramètres des cookies » en bas de page.",
    reject: "Refuser",
    accept: "Accepter",
    current: "Choix actuel : {choice}.",
    accepted: "acceptés",
    rejected: "refusés",
    settings: "Paramètres des cookies",
  },
};
