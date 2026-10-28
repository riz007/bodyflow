import type { DrugClass } from "@/data/schema";

/** Small line glyphs, one per drug class. 18×18, currentColor. */
export function ClassIcon({ cls }: { cls: DrugClass }) {
  const p = { fill: "none", stroke: "currentColor", strokeWidth: 1.5, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const glyph = (() => {
    switch (cls) {
      case "analgesic":
      case "nsaid":
        return (
          <>
            <circle cx="9" cy="9" r="6.5" {...p} />
            <path d="M5 9h8" {...p} />
          </>
        );
      case "penicillin":
      case "cephalosporin":
        return (
          <>
            <rect x="2.5" y="6" width="13" height="6" rx="3" transform="rotate(-35 9 9)" {...p} />
            <path d="M7.2 5.4 10.8 12.6" {...p} />
          </>
        );
      case "benzodiazepine":
      case "opioid":
        return <path d="M9 2.5a6.5 6.5 0 1 0 6.5 7.6A5 5 0 0 1 9 2.5Z" {...p} />;
      case "antihistamine":
        return (
          <>
            <path d="M9 2.5v13M3.4 5.8l11.2 6.4M3.4 12.2l11.2-6.4" {...p} />
          </>
        );
      case "ppi":
        return <path d="M9 2.5c3 4 4.5 6.3 4.5 8.3a4.5 4.5 0 0 1-9 0c0-2 1.5-4.3 4.5-8.3Z" {...p} />;
      case "biguanide":
        return (
          <>
            <path d="M9 2.5 15 6v6l-6 3.5L3 12V6Z" {...p} />
            <circle cx="9" cy="9" r="1.6" {...p} />
          </>
        );
      case "antiemetic":
        return <path d="M3 6c2-2 4 2 6 0s4 2 6 0M3 12c2-2 4 2 6 0s4 2 6 0" {...p} />;
      case "bronchodilator":
        return <path d="M9 2.5v6M9 8.5c-1 2-4 2-5 6M9 8.5c1 2 4 2 5 6" {...p} />;
      case "opioid-antagonist":
        return (
          <>
            <circle cx="9" cy="9" r="6.5" {...p} />
            <path d="M4.4 13.6 13.6 4.4" {...p} />
          </>
        );
      case "catecholamine":
        return <path d="M10 2 4.5 10H9l-1 6 5.5-8H9Z" {...p} />;
      case "calcium-channel-blocker":
      case "ace-inhibitor":
      case "arb":
      case "beta-blocker":
      case "cardiac-glycoside":
        return <path d="M9 15.5S2.5 11.3 2.5 6.8A3.3 3.3 0 0 1 9 5.3a3.3 3.3 0 0 1 6.5 1.5c0 4.5-6.5 8.7-6.5 8.7Z" {...p} />;
      case "statin":
      case "antiplatelet":
      case "anticoagulant":
        return (
          <>
            <path d="M9 2.5c3 4 4.5 6.3 4.5 8.3a4.5 4.5 0 0 1-9 0c0-2 1.5-4.3 4.5-8.3Z" {...p} />
            <path d="M6.5 11h5" {...p} />
          </>
        );
      case "diuretic":
        return <path d="M5 3.5h8M6 3.5v4a3 3 0 0 0 6 0v-4M9 10.5v5M6.5 15.5h5" {...p} />;
      case "ssri":
      case "snri":
      case "gabapentinoid":
      case "hypnotic":
        return (
          <>
            <path d="M9 2.5a6.5 6.5 0 1 0 6.5 7.6A5 5 0 0 1 9 2.5Z" {...p} />
            <circle cx="12.5" cy="5" r="1" {...p} />
          </>
        );
      case "macrolide":
      case "fluoroquinolone":
      case "tetracycline":
      case "glycopeptide":
      case "antifungal":
      case "antiviral":
        return (
          <>
            <circle cx="9" cy="9" r="4" {...p} />
            <path d="M9 2.5V5M9 13v2.5M2.5 9H5M13 9h2.5" {...p} />
          </>
        );
      case "thyroid-hormone":
      case "insulin":
      case "sulfonylurea":
        return (
          <>
            <path d="M4 14 12.5 5.5M11 4l3 3M13 2.5l2.5 2.5" {...p} />
            <path d="M3 15l1-1" {...p} />
          </>
        );
      case "h2-blocker":
      case "antidiarrheal":
        return <path d="M6 2.5v4c0 2 3 2 3 4.5S6 13 6 15.5M12 2.5v13" {...p} />;
      case "corticosteroid":
      case "leukotriene-antagonist":
        return <path d="M9 2.5v6M9 8.5c-1 2-4 2-5 6M9 8.5c1 2 4 2 5 6M6 4.5h6" {...p} />;
      case "antiretroviral":
        return (
          <>
            <circle cx="9" cy="9" r="3.2" {...p} />
            <path d="M9 2.5v3.3M9 12.2v3.3M2.5 9h3.3M12.2 9h3.3M4.4 4.4l2.3 2.3M11.3 11.3l2.3 2.3M4.4 13.6l2.3-2.3M11.3 6.7l2.3-2.3" {...p} />
          </>
        );
    }
  })();
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden>
      {glyph}
    </svg>
  );
}
