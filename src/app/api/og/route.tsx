import { ImageResponse } from "next/og";
import { getDrug } from "@/data";
import { concentration } from "@/pk/model";
import { simulate } from "@/pk/simulate";
import { SITE } from "@/lib/site";
import { CLASS_ACCENT } from "@/ui/theme";
import { fmtTime } from "@/ui/format";

export const runtime = "nodejs";

const W = 1200;
const H = 630;

/**
 * Social preview image. With ?drug=<id> it draws that drug's typical-dose plasma curve
 * (never the toxic range) with its half-life; without it, a generic card.
 */
export async function GET(req: Request) {
  const drug = getDrug(new URL(req.url).searchParams.get("drug"));
  const accent = drug ? CLASS_ACCENT[drug.drugClass] : "#5fe1ff";

  let curves: string[] = [];
  let stats: { label: string; value: string }[] = [];
  if (drug) {
    const sim = simulate(drug, undefined, "typical");
    const n = 120;
    const cw = 620;
    const ch = 250;
    curves = sim.components.map((c) => {
      const pts = Array.from({ length: n + 1 }, (_, i) => {
        const t = (sim.tEnd * i) / n;
        const y = concentration(c.params, t) / c.peak.cmax;
        return `${((i / n) * cw).toFixed(1)},${(ch - y * ch * 0.92).toFixed(1)}`;
      });
      return `M${pts.join(" L")}`;
    });
    const c0 = sim.components[0];
    stats = [
      { label: "Half-life", value: fmtTime(c0.component.halfLife.value) },
      { label: "Peak", value: fmtTime(c0.peak.tmax) },
      { label: "Cleared in ~", value: fmtTime(c0.cleared) },
    ];
  }
  const palette = [accent, "#ffffff", "#7aa2ff"];

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "radial-gradient(circle at 78% 40%, #12203a 0%, #05060a 62%)",
          color: "#eef1f7",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 30, height: 30, borderRadius: 15, background: "linear-gradient(135deg, #5fe1ff, #9d8cff)", display: "flex" }} />
          <div style={{ fontSize: 30, fontWeight: 600, letterSpacing: -0.5 }}>{SITE.name}</div>
        </div>

        {drug ? (
          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
            <div style={{ display: "flex", flexDirection: "column", width: 500 }}>
              <div style={{ fontSize: 22, color: accent, letterSpacing: 3, textTransform: "uppercase" }}>{drug.classLabel}</div>
              <div style={{ fontSize: (drug.shortName ?? drug.name).length > 10 ? 58 : 76, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05, marginTop: 12 }}>
                {drug.shortName ?? drug.name}
              </div>
              <div style={{ fontSize: 26, color: "#9aa3b5", marginTop: 16 }}>How it moves through your body</div>
              <div style={{ display: "flex", gap: 36, marginTop: 36 }}>
                {stats.map((s) => (
                  <div key={s.label} style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ fontSize: 18, color: "#7a8396" }}>{s.label}</div>
                    <div style={{ fontSize: 34, fontWeight: 600 }}>{s.value}</div>
                  </div>
                ))}
              </div>
            </div>
            <svg width={560} height={250} viewBox="0 0 620 250">
              <line x1="0" y1="249" x2="620" y2="249" stroke="#2a3140" strokeWidth="2" />
              {curves.map((d, i) => (
                <path key={i} d={d} fill="none" stroke={palette[i % palette.length]} strokeWidth={i ? 3 : 5} strokeLinecap="round" />
              ))}
            </svg>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", maxWidth: 900 }}>
            <div style={{ fontSize: 72, fontWeight: 700, letterSpacing: -2, lineHeight: 1.05 }}>See how medicines move through your body</div>
            <div style={{ fontSize: 28, color: "#9aa3b5", marginTop: 24 }}>
              Absorption, distribution, metabolism and excretion, minute by minute, in an interactive 3D body.
            </div>
          </div>
        )}

        <div style={{ fontSize: 18, color: "#7a8396" }}>Educational visualisation only. Not medical advice.</div>
      </div>
    ),
    { width: W, height: H, headers: { "Cache-Control": "public, max-age=86400, s-maxage=604800, immutable" } },
  );
}
