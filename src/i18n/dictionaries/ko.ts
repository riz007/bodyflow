import type { Dict } from "./en";

export const ko: Dict = {
  meta: {
    title: "Bodyflow — 약이 몸속에서 어떻게 움직이는지 보기",
    tagline:
      "약의 흡수, 분포, 대사, 배설을 보여 주는 인터랙티브 3D 시각화입니다.",
    description:
      "약을 고르면 3D 인체 속에서 약이 이동하는 모습을 볼 수 있습니다. 흡수, 작용 부위, 간 대사, 신장 배설을 반감기·최고 농도·제거 시간과 함께 타임라인으로 보여 줍니다. 60가지 이상의 흔한 약 수록. 학습용이며 의학적 조언이 아닙니다.",
    drugTitle: "{name}: 몸속에서 어떻게 움직이나",
    drugDescription:
      "{name}{brands}이(가) 몸속에서 어떻게 움직이는지: 흡수, 작용 부위, 대사, 배설. 반감기 약 {half}. 인터랙티브 3D 시각화. 학습용이며 의학적 조언이 아닙니다.",
    medicines: "약",
    effects: "몸에 미치는 영향",
    alsoKnown: "다른 이름: {names}.",
    pkLine:
      "{name}: 일반 용량 복용 후 약 {tmax}에 최고 농도; 반감기 약 {half}; 약 {cleared} 후 대부분 제거(반감기의 약 5배).",
  },
  units: { min: "분", h: "시간", days: "일" },
  header: {
    home: "Bodyflow 홈",
    share: "공유",
    copied: "링크 복사됨",
    language: "언어",
  },
  empty:
    "약을 선택하면 몸이 그 약을 어떻게 흡수하고, 분포시키고, 대사하고, 배설하는지 볼 수 있습니다.",
  picker: {
    nav: "약",
    search: "약 검색",
    placeholder: "약 이름이나 상표로 검색…",
    filter: "분류별 보기",
    all: "전체",
    compare: "비교: 겹쳐 볼 두 번째 약 선택",
    count: "약 {n}개",
    none: "“{q}”와(과) 일치하는 약이 없습니다.",
  },
  categories: {
    Everyday: "일상 약",
    ER: "응급",
    Cardio: "심장과 혈액",
    CNS: "뇌와 신경",
    Pain: "통증",
    Antibiotic: "항감염제",
    Endocrine: "호르몬과 당뇨",
    GI: "위장",
    Respiratory: "호흡과 알레르기",
    PEP: "HIV 노출 후 예방",
  },
  routes: {
    oral: "경구",
    "iv-bolus": "정맥 주사",
    "iv-infusion": "정맥 점적",
    im: "근육 주사",
    sc: "피하 주사",
    inhaled: "흡입",
    intranasal: "비강 스프레이",
  },
  dose: {
    route: "투여 경로",
    level: "용량 수준",
    typical: "일반 용량",
    high: "고용량",
    toxic: "독성 범위",
  },
  stage: {
    body: "인체 보기",
    canvas: "3D 인체. 장기 목록을 사용해 키보드로 장기를 선택할 수 있습니다.",
    inPlasma: "현재 혈장 농도",
    ofPeak: "최고치의 {pct}%",
    loading: "해부 모델 불러오는 중",
    backToBody: "전신으로 돌아가기",
    viewing: "현재 보기: {organ}",
    organs: "장기",
    organList: "장기 목록",
    tagline: "약이 몸속에서 움직이는 방식",
    pick: "약을 선택하세요",
  },
  phase: {
    absorbing: "흡수 중",
    infusing: "점적 중",
    peak: "최고 농도",
    cleared: "≈ 제거됨",
    below: "유효 농도 미만",
    eliminating: "제거 중",
  },
  toxicLevel: {
    trace: "미량",
    within: "일반 범위 이내",
    above: "일반보다 높음",
    far: "일반보다 훨씬 높음",
  },
  zoom: { group: "확대/축소", in: "확대", out: "축소", reset: "보기 초기화" },
  timeline: {
    label: "타임라인",
    play: "재생",
    pause: "일시정지",
    afterDose: "복용 후",
    scrub: "복용 후 경과 시간",
    speed: "재생 속도",
    help: "1× = 초당 1분 시뮬레이션 · 그래프를 끌어서 이동 · 1회 복용, 체중 70kg 성인 기준",
  },
  chart: {
    aria: "{name}의 시간에 따른 혈장 농도",
    ariaCompare: "{name}와(과) {other}의 시간에 따른 혈장 농도 비교",
    relative: "상대 수준",
    pctPeak: "일반 최고치 대비 %",
    tmax: "Tmax",
    cleared: "≈ 제거",
  },
  overview: {
    aria: "{name} 개요",
    pk: "약동학",
    dose: "용량",
    toxicRange: "독성 범위",
    peak: "최고 농도 도달 (Tmax)",
    concHidden: "농도 표시 안 함",
    halfLife: "반감기 (t½)",
    range: "범위 {a}–{b}",
    popAvg: "집단 평균",
    cleared: "≈ 거의 제거",
    clearedSub: "최고치 후 반감기 약 5배",
    flipFlop:
      "여기서는 흡수가 제거보다 느려서, 곡선이 내려가는 모양은 {half}의 반감기가 아니라 흡수를 반영합니다.",
    noThreshold: "정해진 혈장 기준치가 없습니다.",
    above:
      "{on}부터 {off}까지 기준 이상({dur}); {off}에 기준 아래로 내려갑니다.",
    notReached: "이 모델에서는 이 용량으로 도달하지 않습니다.",
    urine: "변화 없이 소변으로 배설",
    bile: "담즙으로 배설",
    tissues: "조직에서 제거",
    liver: "대사(간)",
    params: "매개변수와 출처",
    F: "생체이용률 (F)",
    tmax: "Tmax",
    typicalDose: "일반 용량",
    volume: "분포 용적({basis})",
    halfLifeParam: "반감기",
    pb: "단백 결합률",
    fe: "소변 중 미변화체 비율 (fe)",
    metabolism: "대사",
    curveShows: "곡선이 나타내는 것",
    review: "검토 필요",
    reviewTitle: "전문가 검토 대기 중",
    modelNotes: "모델 참고 사항",
    interactions: "주요 상호작용",
    didYouKnow: "알고 계셨나요?",
    sources: "출처",
    englishOnly:
      "약 상세 정보는 영어로 표시됩니다. 의학 내용 번역은 전문가 검토를 기다리고 있습니다.",
  },
  organs: {
    list: "장기",
    presence: "{organ}: 약물 수준 {level}",
    atRisk: ", 손상 위험",
    siteOfAction: "작용 부위",
    damage: "손상",
    levels: {
      none: "없음",
      low: "낮음",
      moderate: "보통",
      high: "높음",
      veryHigh: "매우 높음",
    },
    footnote:
      "혈류량, 조직 친화도, 제거 경로를 바탕으로 한 설명용 근사치이며, 검증된 PBPK 모델이 아닙니다.",
    brain: {
      name: "뇌",
      role: "생각, 기분, 호흡, 각성을 조절합니다. 혈액뇌장벽이 많은 약을 막지만, 지용성 약은 쉽게 통과합니다.",
    },
    heart: {
      name: "심장",
      role: "1분에 약 5리터의 혈액을 내보내, 혈액 속 약을 1분 남짓 만에 모든 장기로 보냅니다.",
    },
    lungs: {
      name: "폐",
      role: "산소와 이산화탄소를 교환합니다. 심장이 내보내는 모든 혈액이 폐를 거치며, 흡입약은 여기서 바로 작용합니다.",
    },
    liver: {
      name: "간",
      role: "몸의 주요 화학 공장입니다. CYP 계열 같은 효소가 약을 분해하고, 장에서 온 혈액은 먼저 이곳을 지납니다(초회 통과 대사).",
    },
    stomach: {
      name: "위",
      role: "위산으로 음식을 분해합니다. 대부분의 알약은 여기서 녹지만, 소장에 이르기 전까지는 거의 흡수되지 않습니다.",
    },
    smallIntestine: {
      name: "소장",
      role: "길이 약 6m에 표면적이 매우 넓어, 삼킨 약 대부분이 여기서 문맥 혈액으로 흡수됩니다.",
    },
    largeIntestine: {
      name: "대장",
      role: "물을 흡수하고 장내 세균이 사는 곳입니다. 담즙으로 배설된 약은 이 길로 몸 밖으로 나갑니다.",
    },
    pancreas: {
      name: "췌장",
      role: "소화 효소와 혈당을 조절하는 호르몬인 인슐린과 글루카곤을 만듭니다.",
    },
    spleen: {
      name: "비장",
      role: "오래된 적혈구를 걸러 내고 면역계가 감염과 싸우도록 돕습니다.",
    },
    kidneys: {
      name: "신장",
      role: "하루에 약 180리터의 혈장을 거릅니다. 수용성 약과 그 대사물은 신장을 통해 몸 밖으로 나갑니다.",
    },
    bladder: {
      name: "방광",
      role: "소변을 저장합니다. 여기에 모인 것은 이미 혈류를 완전히 떠난 것입니다.",
    },
    vessels: {
      name: "주요 혈관",
      role: "대동맥, 대정맥, 문맥, 신장 동맥. 혈장 농도 곡선은 이 혈액 속의 약을 나타냅니다.",
    },
  },
  organPanel: {
    aria: "{organ} 상세 정보",
    backTo: "{name}(으)로 돌아가기",
    site: "작용 부위",
    organ: "장기",
    whatDoes: "{name}이(가) 여기서 하는 일",
    sideEffects: "부작용:",
    noEffect:
      "혈액을 따라 이곳에 도달합니다. 이 장기에 대한 특정 작용은 기술되어 있지 않습니다.",
    tooHigh: "용량이 너무 많을 때",
    noToxic: "이 장기에 특정한 독성은 기술되어 있지 않습니다.",
    when: "영향을 받는 시기",
    window: "복용 후 약 {start}부터 {end}까지, {peak} 무렵에 가장 높습니다.",
    negligible: "이 모델에서는 노출이 미미합니다.",
    windowNote:
      "이 장기의 모델 수치가 자신의 최고치의 4분의 1을 넘는 기간입니다. 설명용입니다.",
  },
  toxic: {
    banner:
      "본인이나 다른 사람이 약을 너무 많이 먹었을 수 있다면, 지금 바로 지역 응급 번호나 중독 상담 센터에 연락하세요.",
    struggling:
      "힘든 시간을 보내고 있다면 findahelpline.com에서 무료로 비밀이 보장되는 도움을 찾을 수 있습니다",
    overdose: "과다 복용 시 일어나는 일",
    wrong: "무엇이 잘못되나",
    signs: "경고 증상",
    treatment: "치료법이 있습니다",
    note: "곡선은 일반 용량의 설명용 배수를 사용합니다. 독성 용량 수치는 표시하지 않습니다.",
  },
  disclaimer: {
    button: "의료 면책 고지",
    title: "의료 면책 고지",
    intro:
      "Bodyflow는 학습용 시각화 도구입니다. 의학적 조언이나 진단이 아니며, 자격을 갖춘 의료 전문가의 진료를 대신하지 않습니다.",
    check:
      "약이나 용량을 시작, 중단, 변경하기 전에 반드시 의사, 전문의 또는 약사와 상의하세요.",
    model:
      "곡선은 체중 70kg 성인이 1회 복용했을 때의 집단 평균을 단순화한 모델입니다. 개인의 몸 상태, 다른 약, 나이, 임신, 신장이나 간 기능에 따라 여기 보이는 모든 것이 달라질 수 있습니다.",
    anatomy:
      "3D 해부 모델은 남성 기준 데이터에서 가져왔으며, 곡선은 여성과 남성의 차이를 반영하지 않습니다. 많은 약은 성별, 체격, 임신 여부에 따라 다르게 작용합니다.",
    glow: "장기의 빛은 설명용 근사이며 측정값이 아닙니다.",
    urgent:
      "몸이 좋지 않거나, 약을 너무 많이 먹었거나, 무언가 잘못되었다고 느끼면 병원에 가거나 지금 바로 지역 응급 번호나 중독 상담 센터에 연락하세요.",
    struggling:
      "힘든 시간을 보내고 있다면 무료로 비밀이 보장되는 도움을 여기서 찾을 수 있습니다:",
    ok: "이해했습니다",
    panelStrong: "반드시 의사와 확인하세요.",
    panelText:
      "이것은 단순화한 학습용 모델입니다. 본인의 치료는 전문의나 약사와 상의하고, 몸이 좋지 않으면 병원에 가세요.",
    footer:
      "학습용 시각화일 뿐 의학적 조언이 아닙니다. 수치는 대략적인 집단 평균입니다. 반드시 의사나 약사와 상의하고, 몸이 좋지 않으면 병원에 가세요.",
  },
  cookies: {
    title: "쿠키",
    text: "Bodyflow가 어떻게 사용되는지(예: 사람들이 어떤 약을 살펴보는지) 이해하기 위해 Google Analytics 쿠키를 사용하고자 합니다. 동의하는 경우에만 설정됩니다. 어느 쪽을 선택해도 Bodyflow는 똑같이 작동하며, 바닥글의 ‘쿠키 설정’에서 언제든 선택을 바꿀 수 있습니다.",
    reject: "거부",
    accept: "동의",
    current: "현재 선택: {choice}.",
    accepted: "동의함",
    rejected: "거부함",
    settings: "쿠키 설정",
  },
};
