import type { Dict } from "./en";

export const es: Dict = {
  meta: {
    title: "Bodyflow — mira cómo se mueven los medicamentos por tu cuerpo",
    tagline:
      "Una visualización 3D interactiva de cómo se absorben, distribuyen, metabolizan y eliminan los medicamentos.",
    description:
      "Elige un medicamento y míralo recorrer un cuerpo humano en 3D: absorción, dónde actúa, metabolismo en el hígado y eliminación por los riñones, con vida media, nivel máximo y eliminación en una línea de tiempo. Más de 60 medicamentos comunes. Solo educativo, no es consejo médico.",
    drugTitle: "{name}: cómo se mueve por tu cuerpo",
    drugDescription:
      "Cómo {name}{brands} se mueve por tu cuerpo: absorción, dónde actúa, metabolismo y eliminación. Vida media de unas {half}. Visualización 3D interactiva. Educativo, no es consejo médico.",
    medicines: "Medicamentos",
    effects: "Efectos en el cuerpo",
    alsoKnown: "También conocido como {names}.",
    pkLine:
      "{name}: nivel máximo hacia las {tmax} tras una dosis típica; vida media de unas {half}; eliminado casi por completo tras {cleared} (unas cinco vidas medias).",
  },
  units: { min: "min", h: "h", days: "días" },
  header: {
    home: "Inicio de Bodyflow",
    share: "Compartir",
    copied: "Enlace copiado",
    language: "Idioma",
  },
  empty:
    "Elige un medicamento para ver cómo tu cuerpo lo absorbe, lo distribuye, lo metaboliza y lo elimina.",
  picker: {
    nav: "Medicamentos",
    search: "Buscar medicamentos",
    placeholder: "Buscar nombre o marca…",
    filter: "Filtrar por categoría",
    all: "Todos",
    compare: "Comparar: elige un segundo medicamento para superponer",
    count: "{n} medicamentos",
    none: "Ningún medicamento coincide con «{q}».",
  },
  categories: {
    Everyday: "Uso diario",
    ER: "Urgencias",
    Cardio: "Corazón y sangre",
    CNS: "Cerebro y nervios",
    Pain: "Dolor",
    Antibiotic: "Antiinfecciosos",
    Endocrine: "Hormonas y diabetes",
    GI: "Estómago e intestino",
    Respiratory: "Respiración y alergia",
    PEP: "PPE del VIH",
  },
  routes: {
    oral: "Oral",
    "iv-bolus": "Inyección IV",
    "iv-infusion": "Infusión IV",
    im: "Inyección (músculo)",
    sc: "Inyección (bajo la piel)",
    inhaled: "Inhalado",
    intranasal: "Espray nasal",
  },
  dose: {
    route: "Vía",
    level: "Nivel de dosis",
    typical: "Dosis típica",
    high: "Dosis alta",
    toxic: "Rango tóxico",
  },
  stage: {
    body: "Vista del cuerpo",
    canvas:
      "Cuerpo 3D. Usa la lista de órganos para seleccionarlos con el teclado.",
    inPlasma: "En plasma ahora",
    ofPeak: "{pct}% del máximo",
    loading: "Cargando anatomía",
    backToBody: "Volver al cuerpo",
    viewing: "viendo {organ}",
    organs: "Órganos",
    organList: "Lista de órganos",
    tagline: "Cómo se mueven los medicamentos por tu cuerpo",
    pick: "Elige un medicamento",
  },
  phase: {
    absorbing: "Absorbiéndose",
    infusing: "En infusión",
    peak: "En el máximo",
    cleared: "≈ Eliminado",
    below: "Bajo el nivel eficaz",
    eliminating: "Eliminándose",
  },
  toxicLevel: {
    trace: "Trazas",
    within: "Dentro de lo típico",
    above: "Por encima de lo típico",
    far: "Muy por encima de lo típico",
  },
  zoom: {
    group: "Zoom",
    in: "Acercar",
    out: "Alejar",
    reset: "Restablecer vista",
  },
  timeline: {
    label: "Línea de tiempo",
    play: "Reproducir",
    pause: "Pausa",
    afterDose: "tras la dosis",
    scrub: "Tiempo desde la dosis",
    speed: "Velocidad de reproducción",
    help: "1× = 1 minuto simulado por segundo · arrastra el gráfico para desplazarte · dosis única, adulto de 70 kg",
  },
  chart: {
    aria: "Concentración en plasma a lo largo del tiempo de {name}",
    ariaCompare:
      "Concentración en plasma a lo largo del tiempo de {name} comparado con {other}",
    relative: "nivel relativo",
    pctPeak: "% del máximo típico",
    tmax: "Tmáx",
    cleared: "≈ eliminado",
  },
  overview: {
    aria: "Resumen de {name}",
    pk: "Farmacocinética",
    dose: "Dosis",
    toxicRange: "Rango tóxico",
    peak: "Máximo (Tmáx)",
    concHidden: "concentración no mostrada",
    halfLife: "Vida media (t½)",
    range: "rango {a}–{b}",
    popAvg: "promedio poblacional",
    cleared: "≈ Eliminado del todo",
    clearedSub: "~5 vidas medias tras el máximo",
    flipFlop:
      "Aquí la absorción es más lenta que la eliminación, así que la caída de la curva refleja la absorción, no la vida media de {half}.",
    noThreshold: "Sin umbral plasmático definido.",
    above:
      "Por encima desde {on} hasta {off} ({dur}); baja por debajo a las {off}.",
    notReached: "Esta dosis no lo alcanza en este modelo.",
    urine: "Eliminado sin cambios en la orina",
    bile: "Eliminado por la bilis",
    tissues: "Eliminado por los tejidos",
    liver: "Metabolizado (hígado)",
    params: "Parámetros y fuentes",
    F: "Biodisponibilidad (F)",
    tmax: "Tmáx",
    typicalDose: "Dosis típica",
    volume: "Volumen ({basis})",
    halfLifeParam: "Vida media",
    pb: "Unión a proteínas",
    fe: "Sin cambios en orina (fe)",
    metabolism: "Metabolismo",
    curveShows: "La curva muestra",
    review: "revisar",
    reviewTitle: "Pendiente de revisión experta",
    modelNotes: "Notas del modelo",
    interactions: "Interacciones clave",
    didYouKnow: "¿Sabías que…?",
    sources: "Fuentes",
    englishOnly:
      "Los detalles del medicamento se muestran en inglés. La traducción del contenido médico está pendiente de revisión experta.",
  },
  organs: {
    list: "Órganos",
    presence: "{organ}: presencia de fármaco {level}",
    atRisk: ", en riesgo de daño",
    siteOfAction: "Lugar de acción",
    damage: "daño",
    levels: {
      none: "nula",
      low: "baja",
      moderate: "moderada",
      high: "alta",
      veryHigh: "muy alta",
    },
    footnote:
      "Aproximación ilustrativa basada en el flujo sanguíneo, la afinidad tisular y la vía de eliminación. No es un modelo PBPK validado.",
    brain: {
      name: "Cerebro",
      role: "Controla el pensamiento, el ánimo, la respiración y la alerta. La barrera hematoencefálica impide el paso de muchos fármacos; los liposolubles la cruzan con facilidad.",
    },
    heart: {
      name: "Corazón",
      role: "Bombea unos 5 litros de sangre por minuto y lleva cualquier fármaco de la sangre a todos los órganos en un minuto aproximadamente.",
    },
    lungs: {
      name: "Pulmones",
      role: "Intercambian oxígeno y dióxido de carbono. Toda la sangre que bombea el corazón pasa por ellos, y los fármacos inhalados actúan aquí directamente.",
    },
    liver: {
      name: "Hígado",
      role: "La principal planta de procesamiento químico del cuerpo. Enzimas como la familia CYP descomponen los fármacos, y la sangre del intestino pasa primero por aquí (metabolismo de primer paso).",
    },
    stomach: {
      name: "Estómago",
      role: "Descompone los alimentos con ácido. La mayoría de las pastillas se disuelven aquí, pero casi nada se absorbe hasta el intestino delgado.",
    },
    smallIntestine: {
      name: "Intestino delgado",
      role: "Mide unos 6 m y tiene una enorme superficie: aquí se absorbe la mayoría de los medicamentos tragados hacia la sangre portal.",
    },
    largeIntestine: {
      name: "Intestino grueso",
      role: "Absorbe agua y alberga las bacterias intestinales. Los fármacos eliminados por la bilis salen del cuerpo por aquí.",
    },
    pancreas: {
      name: "Páncreas",
      role: "Produce enzimas digestivas y las hormonas insulina y glucagón, que controlan el azúcar en sangre.",
    },
    spleen: {
      name: "Bazo",
      role: "Filtra los glóbulos rojos viejos y ayuda al sistema inmunitario a combatir infecciones.",
    },
    kidneys: {
      name: "Riñones",
      role: "Filtran unos 180 litros de plasma al día. Los fármacos hidrosolubles y sus metabolitos salen del cuerpo a través de ellos.",
    },
    bladder: {
      name: "Vejiga",
      role: "Almacena la orina. Lo que se acumula aquí ya ha salido de la sangre definitivamente.",
    },
    vessels: {
      name: "Grandes vasos sanguíneos",
      role: "Aorta, vena cava, vena porta y arterias renales. La curva de concentración en plasma describe el fármaco en esta sangre.",
    },
  },
  organPanel: {
    aria: "Detalles de {organ}",
    backTo: "Volver a {name}",
    site: "Lugar de acción",
    organ: "Órgano",
    whatDoes: "Qué hace {name} aquí",
    sideEffects: "Efectos secundarios:",
    noEffect:
      "Llega aquí con la sangre; no se describe ningún efecto específico en este órgano.",
    tooHigh: "Con una dosis demasiado alta",
    noToxic: "No se describe toxicidad específica para este órgano.",
    when: "Cuándo se ve afectado",
    window:
      "Desde aproximadamente {start} hasta {end} tras la dosis, con el máximo hacia {peak}.",
    negligible: "Exposición insignificante en este modelo.",
    windowNote:
      "Intervalo en que el nivel modelado de este órgano supera una cuarta parte de su propio máximo. Ilustrativo.",
  },
  toxic: {
    banner:
      "Si crees que tú u otra persona ha tomado demasiado de un medicamento, contacta ahora con tu número local de emergencias o con el centro de toxicología.",
    struggling:
      "Si estás pasando por un momento difícil, puedes encontrar apoyo gratuito y confidencial en findahelpline.com",
    overdose: "Qué ocurre en una sobredosis",
    wrong: "Qué falla",
    signs: "Señales de alarma",
    treatment: "Existe tratamiento",
    note: "La curva usa un múltiplo ilustrativo de la dosis típica. No se muestran cantidades de dosis tóxicas.",
  },
  disclaimer: {
    button: "Aviso médico",
    title: "Aviso médico",
    intro:
      "Bodyflow es una visualización educativa. No es consejo médico, ni un diagnóstico, ni sustituye la atención de un profesional sanitario cualificado.",
    check:
      "Consulta siempre a un médico, especialista o farmacéutico antes de empezar, dejar o cambiar cualquier medicamento o dosis.",
    model:
      "Las curvas son modelos simplificados de promedios poblacionales para una sola dosis en un adulto de 70 kg. Tu cuerpo, otros medicamentos, la edad, el embarazo o la función renal o hepática pueden cambiar todo lo que se muestra aquí.",
    anatomy:
      "La anatomía 3D procede de un conjunto de datos de referencia masculino, y las curvas no modelan las diferencias entre mujeres y hombres. Muchos medicamentos actúan de forma distinta según el sexo, el tamaño corporal y durante el embarazo.",
    glow: "El brillo de los órganos es una aproximación ilustrativa, no una medición.",
    urgent:
      "Si te encuentras mal, has tomado demasiado de un medicamento o crees que algo va mal, ve al hospital o contacta ahora con tu número local de emergencias o con el centro de toxicología.",
    struggling:
      "Si estás pasando por un momento difícil, hay apoyo gratuito y confidencial en",
    ok: "Entendido",
    panelStrong: "Consulta siempre con un médico.",
    panelText:
      "Este es un modelo educativo simplificado. Habla con un especialista o farmacéutico sobre tu propio tratamiento y ve al hospital si te encuentras mal.",
    footer:
      "Solo visualización educativa. No es consejo médico. Los valores son promedios poblacionales aproximados. Consulta siempre a un médico o farmacéutico y ve al hospital si te encuentras mal.",
  },
  callouts: {
    works: "Actúa aquí",
    side: "Efectos secundarios",
    absorbing: "Absorbiendo",
    breakingDown: "Descomponiéndolo",
    filtering: "Filtrándolo",
    collecting: "Acumulándose en la orina",
    bile: "Saliendo por la bilis",
    damage: "Riesgo de daño",
  },
  legend: {
    aria: "Qué significan los colores de los órganos",
    works: "Dónde actúa",
    side: "Efectos secundarios",
    processing: "Absorbiendo o eliminando",
    damage: "Riesgo de daño",
    brightness: "Más brillo = más medicamento",
  },
  cookies: {
    title: "Cookies",
    text: "Nos gustaría usar cookies de Google Analytics para entender cómo se usa Bodyflow, por ejemplo qué medicamentos se consultan. Solo se instalan si aceptas. Bodyflow funciona igual en ambos casos y puedes cambiar tu elección cuando quieras en «Configuración de cookies», en el pie de página.",
    reject: "Rechazar",
    accept: "Aceptar",
    current: "Elección actual: {choice}.",
    accepted: "aceptadas",
    rejected: "rechazadas",
    settings: "Configuración de cookies",
  },
};
