"use client";
import { Suspense, useEffect, useState } from "react";
import { Canvas, events as createPointerEvents, type RootState } from "@react-three/fiber";
import type { UseBoundStore, StoreApi } from "zustand";
import { Html, PerformanceMonitor } from "@react-three/drei";
import { Bloom, EffectComposer, N8AO, ToneMapping, Vignette } from "@react-three/postprocessing";
import { ToneMappingMode } from "postprocessing";
import { ORGANS } from "@/data/organs";
import type { Simulation } from "@/pk/simulate";
import { usePrefersReducedMotion } from "@/state/hooks";
import { useApp } from "@/state/store";
import { Body, MODEL_URL } from "./Body";
import { CameraRig } from "./CameraRig";
import { skipIntro, startIntro } from "./intro";
import { organRegistry } from "./registry";

/**
 * R3F's default pointer maths uses event.offsetX, which is relative to whatever element is under
 * the cursor and is wrong under CSS scaling. Measuring against the canvas rect keeps raycasts
 * (and so hover and click) on the organ actually under the pointer.
 */
const canvasEvents = (store: UseBoundStore<StoreApi<RootState>>) => ({
  ...createPointerEvents(store),
  compute(event: { clientX: number; clientY: number }, state: RootState) {
    const r = state.gl.domElement.getBoundingClientRect();
    state.pointer.set(((event.clientX - r.left) / r.width) * 2 - 1, -((event.clientY - r.top) / r.height) * 2 + 1);
    state.raycaster.setFromCamera(state.pointer, state.camera);
  },
});

function useModelTier(): keyof typeof MODEL_URL {
  const [tier] = useState<keyof typeof MODEL_URL>(() =>
    typeof window !== "undefined" && (window.matchMedia("(max-width: 720px)").matches || navigator.hardwareConcurrency <= 4)
      ? "mobile"
      : "desktop",
  );
  return tier;
}

export default function BodyCanvas({ sim, compare }: { sim: Simulation | null; compare: Simulation | null }) {
  const tier = useModelTier();
  const quality = useApp((s) => s.quality);
  const setQuality = useApp((s) => s.setQuality);
  const [dpr, setDpr] = useState(1.5);
  const high = quality === "high" && tier === "desktop";
  // Orbit controls listen on this outer wrapper so R3F (on the canvas's own parent) sees pointer
  // events first; camera-controls stops pointerdown propagation, which would swallow organ clicks.
  const [controlsEl, setControlsEl] = useState<HTMLDivElement | null>(null);

  return (
    <div ref={setControlsEl} className="h-full w-full touch-none">
    <Canvas
      flat
      events={canvasEvents}
      dpr={dpr}
      camera={{ fov: 35, near: 0.02, far: 50, position: [0, 0.3, 1.5] }}
      gl={{ antialias: false, powerPreference: "high-performance", alpha: false }}
      aria-label="3D body. Use the organ list to select organs with the keyboard."
      onPointerMissed={() => useApp.getState().hoverOrgan(null)}
    >
      <color attach="background" args={["#05060a"]} />
      <PerformanceMonitor
        onIncline={() => setDpr(Math.min(2, window.devicePixelRatio))}
        onDecline={() => {
          setDpr(1);
          setQuality("low");
        }}
        flipflops={3}
      />
      <Suspense fallback={null}>
        <Body url={MODEL_URL[tier]} sim={sim} compare={compare} />
        <IntroStarter />
        <OrganTooltip />
      </Suspense>
      {controlsEl && <CameraRig domElement={controlsEl} />}
      <EffectComposer multisampling={high ? 4 : 0} enableNormalPass={false}>
        <>{high && <N8AO aoRadius={0.06} distanceFalloff={0.5} intensity={1.6} halfRes quality="performance" />}</>
        <Bloom mipmapBlur luminanceThreshold={0.7} luminanceSmoothing={0.3} intensity={high ? 1.25 : 0.9} radius={0.75} />
        <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        <Vignette offset={0.28} darkness={0.72} />
      </EffectComposer>
    </Canvas>
    </div>
  );
}

/** Starts the intro once the model is ready, or skips it for reduced motion. */
function IntroStarter() {
  const reduced = usePrefersReducedMotion();
  const finishIntro = useApp((s) => s.finishIntro);
  useEffect(() => {
    if (reduced) {
      skipIntro();
      finishIntro();
    } else startIntro();
  }, [reduced, finishIntro]);
  return null;
}

function OrganTooltip() {
  const hovered = useApp((s) => s.hoveredOrgan);
  const selected = useApp((s) => s.selectedOrgan);
  const entry = hovered && hovered !== selected ? organRegistry.get(hovered) : null;
  if (!entry) return null;
  const { center, radius } = entry.sphere;
  return (
    <Html position={[center.x, center.y + radius * 0.6, center.z]} center zIndexRange={[20, 0]} style={{ pointerEvents: "none" }}>
      <div className="whitespace-nowrap rounded-full border border-white/15 bg-black/70 px-3 py-1 text-[12px] text-white backdrop-blur">
        {ORGANS[entry.id].name}
      </div>
    </Html>
  );
}
