"use client";
import { useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { Html, Line } from "@react-three/drei";
import type { OrganId } from "@/data/schema";
import { organRoles } from "@/pk/distribute";
import type { Simulation } from "@/pk/simulate";
import { useApp } from "@/state/store";
import { PROCESSING, TOXIC } from "@/ui/theme";
import { pickCallouts, type Callout, type CalloutKey } from "./callouts";
import { organRegistry } from "./registry";

/**
 * Short labels beside the organs that matter most at the current time ("Liver · Breaking it down").
 * Purely visual: the organ list is the keyboard and screen-reader path to the same information.
 */
export function OrganCallouts({
  sim,
  accent,
  names,
  labels,
}: {
  sim: Simulation | null;
  accent: string;
  names: Record<OrganId, string>;
  labels: Record<CalloutKey, string>;
}) {
  const [items, setItems] = useState<Callout[]>([]);
  const shown = useRef("");
  const frame = useRef(0);
  const narrow = useThree((s) => s.size.width < 720);

  useFrame(() => {
    if (frame.current++ % 6) return; // labels change slowly; no need to re-rank every frame
    const { t, selectedOrgan, introDone } = useApp.getState();
    const next = sim && introDone && !selectedOrgan ? pickCallouts(organRoles(sim, t), narrow ? 2 : 3) : [];
    const key = next.map((c) => c.organ + c.key).join();
    if (key !== shown.current) {
      shown.current = key;
      setItems(next);
    }
  });

  return (
    <>
      {items.map((c) => (
        <OrganCallout
          key={c.organ}
          organ={c.organ}
          name={names[c.organ]}
          text={labels[c.key]}
          narrow={narrow}
          color={c.role === "damage" ? TOXIC : c.role === "absorbing" || c.role === "clearing" ? PROCESSING : accent}
        />
      ))}
    </>
  );
}

function OrganCallout({
  organ,
  name,
  text,
  color,
  narrow,
}: {
  organ: OrganId;
  name: string;
  text: string;
  color: string;
  narrow: boolean;
}) {
  const entry = organRegistry.get(organ);
  const geo = useMemo(() => {
    if (!entry) return null;
    const { center, radius } = entry.sphere;
    // Wide screens: label on the organ's own side of the body, just outside it.
    // Phones have no room beside the body, so the label sits centred just above the organ.
    const side = narrow ? 0 : center.x >= 0 ? 1 : -1;
    const anchor = narrow
      ? new THREE.Vector3(center.x, center.y + radius * 0.7 + 0.03, center.z)
      : new THREE.Vector3(center.x + side * (radius * 0.5 + 0.16), center.y + radius * 0.15, center.z);
    return { side, points: [center.clone(), anchor] as [THREE.Vector3, THREE.Vector3], anchor };
  }, [entry, narrow]);
  const transform =
    geo?.side === 0 ? "translate(-50%,calc(-100% - 2px))" : geo?.side === 1 ? "translate(4px,-50%)" : "translate(calc(-100% - 4px),-50%)";
  if (!geo) return null;

  return (
    <group>
      <Line points={geo.points} color={color} lineWidth={1} transparent opacity={0.55} depthTest={false} renderOrder={20} />
      <Html position={geo.anchor} zIndexRange={[15, 0]} style={{ pointerEvents: "none" }}>
        <button
          type="button"
          tabIndex={-1}
          aria-hidden
          onClick={() => useApp.getState().selectOrgan(organ)}
          style={{ transform, pointerEvents: "auto" }}
          className={`flex items-center gap-2 whitespace-nowrap rounded-full border border-white/15 bg-black/65 text-white backdrop-blur hover:border-white/40 ${narrow ? "px-2.5 py-0.5 text-[11px]" : "px-3 py-1 text-[12px]"}`}
        >
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ background: color, boxShadow: `0 0 8px ${color}` }} />
          <span className="font-medium">{name}</span>
          <span className="text-white/65">{text}</span>
        </button>
      </Html>
    </group>
  );
}
