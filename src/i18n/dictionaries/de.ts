import type { Dict } from "./en";

export const de: Dict = {
  meta: {
    title: "Bodyflow – so wandern Medikamente durch deinen Körper",
    tagline:
      "Eine interaktive 3D-Visualisierung von Aufnahme, Verteilung, Abbau und Ausscheidung von Medikamenten.",
    description:
      "Wähle ein Medikament und verfolge seinen Weg durch einen 3D-Körper: Aufnahme, Wirkort, Abbau in der Leber und Ausscheidung über die Nieren – mit Halbwertszeit, Spitzenwert und Ausscheidung auf einer Zeitleiste. Über 60 gängige Medikamente. Nur zu Lernzwecken, keine medizinische Beratung.",
    drugTitle: "{name}: so wandert es durch deinen Körper",
    drugDescription:
      "Wie {name}{brands} durch deinen Körper wandert: Aufnahme, Wirkort, Abbau und Ausscheidung. Halbwertszeit etwa {half}. Interaktive 3D-Visualisierung. Zu Lernzwecken, keine medizinische Beratung.",
    medicines: "Medikamente",
    effects: "Wirkungen im Körper",
    alsoKnown: "Auch bekannt als {names}.",
    pkLine:
      "{name}: Spitzenwert etwa {tmax} nach einer üblichen Dosis; Halbwertszeit etwa {half}; nach etwa {cleared} weitgehend ausgeschieden (rund fünf Halbwertszeiten).",
  },
  units: { min: "Min.", h: "Std.", days: "Tage" },
  header: {
    home: "Bodyflow-Startseite",
    share: "Teilen",
    copied: "Link kopiert",
    language: "Sprache",
  },
  empty:
    "Wähle ein Medikament, um zu sehen, wie dein Körper es aufnimmt, verteilt, abbaut und ausscheidet.",
  picker: {
    nav: "Medikamente",
    search: "Medikamente suchen",
    placeholder: "Name oder Marke suchen…",
    filter: "Nach Kategorie filtern",
    all: "Alle",
    compare: "Vergleichen: zweites Medikament zum Überlagern wählen",
    count: "{n} Medikamente",
    none: "Kein Medikament passt zu „{q}“.",
  },
  categories: {
    Everyday: "Alltag",
    ER: "Notfall",
    Cardio: "Herz & Blut",
    CNS: "Gehirn & Nerven",
    Pain: "Schmerz",
    Antibiotic: "Antiinfektiva",
    Endocrine: "Hormone & Diabetes",
    GI: "Magen & Darm",
    Respiratory: "Atmung & Allergie",
    PEP: "HIV-PEP",
  },
  routes: {
    oral: "Oral",
    "iv-bolus": "IV-Injektion",
    "iv-infusion": "IV-Infusion",
    im: "Injektion (Muskel)",
    sc: "Injektion (unter die Haut)",
    inhaled: "Inhaliert",
    intranasal: "Nasenspray",
  },
  dose: {
    route: "Verabreichung",
    level: "Dosisstufe",
    typical: "Übliche Dosis",
    high: "Hohe Dosis",
    toxic: "Toxischer Bereich",
  },
  stage: {
    body: "Körperansicht",
    canvas:
      "3D-Körper. Mit der Organliste lassen sich Organe per Tastatur auswählen.",
    inPlasma: "Jetzt im Plasma",
    ofPeak: "{pct} % des Spitzenwerts",
    loading: "Anatomie wird geladen",
    backToBody: "Zurück zum Körper",
    viewing: "aktuell: {organ}",
    organs: "Organe",
    organList: "Organliste",
    tagline: "So wandern Medikamente durch dich",
    pick: "Medikament wählen",
  },
  phase: {
    absorbing: "Wird aufgenommen",
    infusing: "Infusion läuft",
    peak: "Spitzenwert",
    cleared: "≈ Ausgeschieden",
    below: "Unter Wirkspiegel",
    eliminating: "Wird ausgeschieden",
  },
  toxicLevel: {
    trace: "Spuren",
    within: "Im üblichen Bereich",
    above: "Über dem Üblichen",
    far: "Weit über dem Üblichen",
  },
  zoom: {
    group: "Zoom",
    in: "Vergrößern",
    out: "Verkleinern",
    reset: "Ansicht zurücksetzen",
  },
  timeline: {
    label: "Zeitleiste",
    play: "Abspielen",
    pause: "Pause",
    afterDose: "nach Einnahme",
    scrub: "Zeit seit Einnahme",
    speed: "Wiedergabegeschwindigkeit",
    help: "1× = 1 simulierte Minute pro Sekunde · Diagramm ziehen zum Navigieren · Einzeldosis, Erwachsener mit 70 kg",
  },
  chart: {
    aria: "Plasmakonzentration im Zeitverlauf für {name}",
    ariaCompare:
      "Plasmakonzentration im Zeitverlauf für {name} im Vergleich mit {other}",
    relative: "relativer Wert",
    pctPeak: "% des üblichen Spitzenwerts",
    tmax: "Tmax",
    cleared: "≈ ausgeschieden",
  },
  overview: {
    aria: "Überblick: {name}",
    pk: "Pharmakokinetik",
    dose: "Dosis",
    toxicRange: "Toxischer Bereich",
    peak: "Spitze (Tmax)",
    concHidden: "Konzentration ausgeblendet",
    halfLife: "Halbwertszeit (t½)",
    range: "Bereich {a}–{b}",
    popAvg: "Bevölkerungsdurchschnitt",
    cleared: "≈ Vollständig ausgeschieden",
    clearedSub: "~5 Halbwertszeiten nach der Spitze",
    flipFlop:
      "Hier ist die Aufnahme langsamer als die Ausscheidung: Der Abfall der Kurve folgt der Aufnahme, nicht der Halbwertszeit von {half}.",
    noThreshold: "Kein festgelegter Plasmaschwellenwert.",
    above: "Darüber von {on} bis {off} ({dur}); fällt bei {off} darunter.",
    notReached: "Diese Dosis erreicht ihn in diesem Modell nicht.",
    urine: "Unverändert im Urin ausgeschieden",
    bile: "Über die Galle ausgeschieden",
    tissues: "Vom Gewebe abgebaut",
    liver: "Verstoffwechselt (Leber)",
    params: "Parameter & Quellen",
    F: "Bioverfügbarkeit (F)",
    tmax: "Tmax",
    typicalDose: "Übliche Dosis",
    volume: "Verteilungsvolumen ({basis})",
    halfLifeParam: "Halbwertszeit",
    pb: "Proteinbindung",
    fe: "Unverändert im Urin (fe)",
    metabolism: "Stoffwechsel",
    curveShows: "Die Kurve zeigt",
    review: "prüfen",
    reviewTitle: "Zur fachlichen Prüfung markiert",
    modelNotes: "Hinweise zum Modell",
    interactions: "Wichtige Wechselwirkungen",
    didYouKnow: "Wusstest du?",
    sources: "Quellen",
    englishOnly:
      "Details zum Medikament werden auf Englisch angezeigt. Die Übersetzung medizinischer Inhalte wird noch fachlich geprüft.",
  },
  organs: {
    list: "Organe",
    presence: "{organ}: Wirkstoffmenge {level}",
    atRisk: ", Schadensrisiko",
    siteOfAction: "Wirkort",
    damage: "Schaden",
    levels: {
      none: "keine",
      low: "niedrig",
      moderate: "mittel",
      high: "hoch",
      veryHigh: "sehr hoch",
    },
    footnote:
      "Veranschaulichende Näherung aus Durchblutung, Gewebeaffinität und Ausscheidungsweg. Kein validiertes PBPK-Modell.",
    brain: {
      name: "Gehirn",
      role: "Steuert Denken, Stimmung, Atmung und Wachheit. Die Blut-Hirn-Schranke hält viele Wirkstoffe fern; fettlösliche überwinden sie leicht.",
    },
    heart: {
      name: "Herz",
      role: "Pumpt etwa 5 Liter Blut pro Minute und bringt jeden Wirkstoff im Blut in rund einer Minute zu allen Organen.",
    },
    lungs: {
      name: "Lunge",
      role: "Tauscht Sauerstoff und Kohlendioxid aus. Das gesamte vom Herzen gepumpte Blut fließt hindurch, und inhalierte Wirkstoffe wirken hier direkt.",
    },
    liver: {
      name: "Leber",
      role: "Die wichtigste chemische Fabrik des Körpers. Enzyme wie die CYP-Familie bauen Wirkstoffe ab, und Blut aus dem Darm fließt zuerst hierher (First-Pass-Effekt).",
    },
    stomach: {
      name: "Magen",
      role: "Zersetzt Nahrung mit Säure. Die meisten Tabletten lösen sich hier auf, aufgenommen wird aber kaum etwas vor dem Dünndarm.",
    },
    smallIntestine: {
      name: "Dünndarm",
      role: "Rund 6 m lang mit riesiger Oberfläche: Hier gelangen die meisten geschluckten Medikamente ins Pfortaderblut.",
    },
    largeIntestine: {
      name: "Dickdarm",
      role: "Nimmt Wasser auf und beherbergt die Darmbakterien. Über die Galle ausgeschiedene Wirkstoffe verlassen hier den Körper.",
    },
    pancreas: {
      name: "Bauchspeicheldrüse",
      role: "Bildet Verdauungsenzyme sowie die Hormone Insulin und Glukagon, die den Blutzucker steuern.",
    },
    spleen: {
      name: "Milz",
      role: "Filtert alte rote Blutkörperchen und hilft dem Immunsystem bei der Abwehr von Infektionen.",
    },
    kidneys: {
      name: "Nieren",
      role: "Filtern täglich etwa 180 Liter Plasma. Wasserlösliche Wirkstoffe und ihre Abbauprodukte verlassen über sie den Körper.",
    },
    bladder: {
      name: "Blase",
      role: "Speichert Urin. Was sich hier sammelt, hat den Blutkreislauf endgültig verlassen.",
    },
    vessels: {
      name: "Große Blutgefäße",
      role: "Aorta, Hohlvene, Pfortader und Nierenarterien. Die Plasmakonzentrationskurve beschreibt den Wirkstoff in diesem Blut.",
    },
  },
  organPanel: {
    aria: "Details: {organ}",
    backTo: "Zurück zu {name}",
    site: "Wirkort",
    organ: "Organ",
    whatDoes: "Was {name} hier bewirkt",
    sideEffects: "Nebenwirkungen:",
    noEffect:
      "Gelangt mit dem Blut hierher; für dieses Organ ist keine spezifische Wirkung beschrieben.",
    tooHigh: "Bei zu hoher Dosis",
    noToxic: "Keine organspezifische Toxizität beschrieben.",
    when: "Wann es betroffen ist",
    window:
      "Etwa von {start} bis {end} nach der Einnahme, mit dem Höchstwert um {peak}.",
    negligible: "In diesem Modell vernachlässigbare Belastung.",
    windowNote:
      "Zeitraum, in dem der modellierte Wert dieses Organs über einem Viertel seines eigenen Höchstwerts liegt. Veranschaulichend.",
  },
  toxic: {
    banner:
      "Wenn du oder jemand anderes möglicherweise zu viel von einem Medikament eingenommen hat, wende dich jetzt an deinen örtlichen Notruf oder den Giftnotruf.",
    struggling:
      "Wenn es dir nicht gut geht, findest du kostenlose, vertrauliche Unterstützung unter findahelpline.com",
    overdose: "Was bei einer Überdosis passiert",
    wrong: "Was schiefläuft",
    signs: "Warnzeichen",
    treatment: "Es gibt eine Behandlung",
    note: "Die Kurve nutzt ein veranschaulichendes Vielfaches der üblichen Dosis. Toxische Dosismengen werden nicht angezeigt.",
  },
  disclaimer: {
    button: "Medizinischer Hinweis",
    title: "Medizinischer Hinweis",
    intro:
      "Bodyflow ist eine Lernvisualisierung. Sie ist keine medizinische Beratung, keine Diagnose und kein Ersatz für die Behandlung durch qualifiziertes Fachpersonal.",
    check:
      "Sprich immer mit einer Ärztin, einem Arzt oder in der Apotheke, bevor du ein Medikament oder eine Dosis beginnst, absetzt oder änderst.",
    model:
      "Die Kurven sind vereinfachte Modelle von Bevölkerungsdurchschnitten für eine Einzeldosis bei einem Erwachsenen mit 70 kg. Dein Körper, andere Medikamente, Alter, Schwangerschaft sowie Nieren- oder Leberfunktion können alles hier Gezeigte verändern.",
    anatomy:
      "Die 3D-Anatomie stammt aus einem männlichen Referenzdatensatz, und die Kurven bilden Unterschiede zwischen Frauen und Männern nicht ab. Viele Medikamente wirken je nach Geschlecht, Körpergröße und in der Schwangerschaft unterschiedlich.",
    glow: "Das Leuchten der Organe ist eine veranschaulichende Näherung, keine Messung.",
    urgent:
      "Wenn es dir schlecht geht, du zu viel von einem Medikament eingenommen hast oder etwas nicht stimmt, geh ins Krankenhaus oder wende dich jetzt an deinen örtlichen Notruf oder den Giftnotruf.",
    struggling:
      "Wenn es dir nicht gut geht, gibt es kostenlose, vertrauliche Unterstützung unter",
    ok: "Verstanden",
    panelStrong: "Immer ärztlich abklären.",
    panelText:
      "Dies ist ein vereinfachtes Lernmodell. Sprich mit Fachärzten oder in der Apotheke über deine eigene Behandlung und geh ins Krankenhaus, wenn es dir schlecht geht.",
    footer:
      "Nur zu Lernzwecken. Keine medizinische Beratung. Werte sind ungefähre Bevölkerungsdurchschnitte. Sprich immer mit einer Ärztin, einem Arzt oder in der Apotheke und geh ins Krankenhaus, wenn es dir schlecht geht.",
  },
  callouts: {
    works: "Wirkt hier",
    side: "Nebenwirkungen",
    absorbing: "Nimmt auf",
    breakingDown: "Baut ab",
    filtering: "Filtert heraus",
    collecting: "Sammelt sich im Urin",
    bile: "Verlässt den Körper über die Galle",
    damage: "Schadensrisiko",
  },
  legend: {
    aria: "Bedeutung der Organfarben",
    works: "Wo es wirkt",
    side: "Nebenwirkungen",
    processing: "Aufnahme oder Ausscheidung",
    damage: "Schadensrisiko",
    brightness: "Heller = mehr Medikament",
  },
  cookies: {
    title: "Cookies",
    text: "Wir möchten Google-Analytics-Cookies verwenden, um zu verstehen, wie Bodyflow genutzt wird, etwa welche Medikamente angesehen werden. Sie werden nur gesetzt, wenn du zustimmst. Bodyflow funktioniert in beiden Fällen gleich, und du kannst deine Wahl jederzeit unter „Cookie-Einstellungen“ in der Fußzeile ändern.",
    reject: "Ablehnen",
    accept: "Akzeptieren",
    current: "Aktuelle Wahl: {choice}.",
    accepted: "akzeptiert",
    rejected: "abgelehnt",
    settings: "Cookie-Einstellungen",
  },
};
