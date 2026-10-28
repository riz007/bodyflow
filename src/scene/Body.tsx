"use client";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, type ThreeEvent } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import type { OrganId } from "@/data/schema";
import { organLevels, organRoles, type OrganRole } from "@/pk/distribute";
import type { Simulation } from "@/pk/simulate";
import { useApp } from "@/state/store";
import { CLASS_ACCENT, COMPARE_ACCENT, PROCESSING } from "@/ui/theme";
import { createOrganMaterial, createSkinMaterial, type OrganMaterial } from "@/shaders/materials";
import { baseColorFor, organIdFromMeshName, organRegistry, type OrganEntry } from "./registry";
import { glowCurve } from "./glow";
import { introProgress } from "./intro";

export const MODEL_URL = { desktop: "/models/body-desktop.glb", mobile: "/models/body-mobile.glb" } as const;

/** Shader pattern per role: solid where it works, stripes for side effects, moving bands for absorbing/clearing. */
const ROLE_LOOK: Record<OrganRole, { glow: number; dim: number; stripe: number; flow: number; white: number }> = {
  damage: { glow: 1, dim: 0, stripe: 0, flow: 0, white: 0 },
  target: { glow: 1.25, dim: 0, stripe: 0, flow: 0, white: 0 },
  side: { glow: 1, dim: 0, stripe: 1, flow: 0, white: 0 },
  absorbing: { glow: 1, dim: 0, stripe: 0, flow: 1, white: 0.75 },
  clearing: { glow: 1, dim: 0, stripe: 0, flow: 1, white: 0.75 },
  carried: { glow: 0.12, dim: 1, stripe: 0, flow: 0, white: 0 },
};
/** Vessels carry the plasma curve itself, so they never fade out. */
const VESSELS_LOOK = { glow: 0.8, dim: 0, stripe: 0, flow: 0, white: 0 };
const WHITE = new THREE.Color(PROCESSING);

type OrganMesh = THREE.Mesh<THREE.BufferGeometry, OrganMaterial>;
interface Prepared {
  organs: { mesh: OrganMesh; id: OrganId }[];
  skin: THREE.Mesh | null;
  skinMat: ReturnType<typeof createSkinMaterial>;
  height: number;
  entries: OrganEntry[];
}

/**
 * Assign materials and measure organs once per loaded model. Cached on the GLTF scene because
 * <primitive> re-parents the meshes, so walking the scene a second time would find nothing.
 * Bounds are taken in world space: the GLB is quantised, so geometry-space bounds are not metres.
 */
function prepare(scene: THREE.Group): Prepared {
  if (scene.userData.prepared) return scene.userData.prepared as Prepared;
  const skinMat = createSkinMaterial();
  scene.updateMatrixWorld(true);
  const organs: Prepared["organs"] = [];
  const byId = new Map<OrganId, OrganEntry>();
  let skin: THREE.Mesh | null = null;
  scene.traverse((o) => {
    if (!(o as THREE.Mesh).isMesh) return;
    const mesh = o as THREE.Mesh;
    const id = organIdFromMeshName(mesh.name);
    if (id === "skin") {
      mesh.material = skinMat;
      mesh.renderOrder = 10;
      mesh.raycast = () => {}; // clicks pass through the shell to organs
      skin = mesh;
      return;
    }
    if (!id) return;
    mesh.material = createOrganMaterial(baseColorFor(mesh.name));
    mesh.userData.organ = id;
    const box = new THREE.Box3().setFromObject(mesh);
    mesh.userData.centerY = (box.min.y + box.max.y) / 2;
    organs.push({ mesh: mesh as OrganMesh, id });
    const entry = byId.get(id) ?? { id, meshes: [], sphere: new THREE.Sphere() };
    entry.meshes.push(mesh as OrganMesh);
    byId.set(id, entry);
  });
  for (const e of byId.values()) {
    const box = new THREE.Box3();
    e.meshes.forEach((m) => box.expandByObject(m));
    box.getBoundingSphere(e.sphere);
  }
  const height = new THREE.Box3().setFromObject(scene).max.y;
  const prepared: Prepared = { organs, skin, skinMat, height, entries: [...byId.values()] };
  scene.userData.prepared = prepared;
  return prepared;
}

export function Body({ url, sim, compare }: { url: string; sim: Simulation | null; compare: Simulation | null }) {
  const { scene } = useGLTF(url, false, true);
  const simRef = useRef(sim);
  const compareRef = useRef(compare);
  simRef.current = sim;
  compareRef.current = compare;

  const { organs, skin, skinMat, height, entries } = useMemo(() => prepare(scene), [scene]);

  useEffect(() => {
    organRegistry.clear();
    for (const e of entries) organRegistry.set(e.id, e);
  }, [entries]);

  useEffect(() => {
    skinMat.uniforms.uHeight.value = height;
  }, [height, skinMat]);

  const accent = new THREE.Color();
  const accent2 = new THREE.Color(COMPARE_ACCENT);

  useFrame((state, dt) => {
    const { t, hoveredOrgan, selectedOrgan } = useApp.getState();
    const time = state.clock.elapsedTime;
    const k = 1 - Math.exp(-dt * 6); // frame-rate independent easing
    const intro = introProgress();
    const s = simRef.current;
    const c = compareRef.current;
    // Roles only in single-drug view: compare mode keeps its two-colour overlay.
    const roles = s && !c ? organRoles(s, t) : null;
    const levels = s ? (roles ? null : organLevels(s, t)) : null;
    const levels2 = c ? organLevels(c, t) : null;
    const toxic = s?.level === "toxic";
    if (s) accent.set(CLASS_ACCENT[s.drug.drugClass]);

    skinMat.uniforms.uTime.value = time;
    skinMat.uniforms.uReveal.value = intro;
    const skinTarget = selectedOrgan ? 0.25 : 1;
    skinMat.uniforms.uOpacity.value += (skinTarget - skinMat.uniforms.uOpacity.value) * k;

    for (const { mesh, id } of organs) {
      const u = mesh.material.uniforms;
      u.uTime.value = time;
      const state = roles?.[id];
      const look = !state ? null : id === "vessels" && state.role === "carried" ? VESSELS_LOOK : ROLE_LOOK[state.role];
      const level = state ? state.level : (levels?.[id] ?? 0);
      u.uGlowColor.value.copy(accent).lerp(WHITE, look?.white ?? 0);
      u.uGlowColor2.value.copy(accent2);
      u.uGlow.value += ((s ? glowCurve(level) * (look?.glow ?? 1) : 0) - u.uGlow.value) * k;
      u.uGlow2.value += ((levels2 ? glowCurve(levels2[id]) : 0) - u.uGlow2.value) * k;
      u.uDim.value += ((look?.dim ?? 0) - u.uDim.value) * k;
      u.uStripe.value += ((look?.stripe ?? 0) - u.uStripe.value) * k;
      u.uFlow.value += ((look?.flow ?? 0) - u.uFlow.value) * k;
      const damaged = roles ? state!.role === "damage" : toxic && s!.drug.toxicity.organs.includes(id) && level > 0.25;
      u.uToxic.value += ((damaged ? 1 : 0) - u.uToxic.value) * k * 0.5;
      u.uHover.value += ((hoveredOrgan === id ? 1 : 0) - u.uHover.value) * k * 1.5;
      const opacity = selectedOrgan && selectedOrgan !== id ? 0.07 : 1;
      u.uOpacity.value += (opacity - u.uOpacity.value) * k;
      // Opaque unless fading: transparent organs re-sort every frame and flicker where they overlap.
      const fading = u.uOpacity.value < 0.995;
      mesh.material.transparent = fading;
      mesh.material.depthWrite = u.uOpacity.value > 0.6;
      // Intro: organs light up as the scan line passes their centre.
      const cy = mesh.userData.centerY / height;
      u.uIntro.value = THREE.MathUtils.smoothstep(intro, cy - 0.05, cy + 0.08);
    }
  });

  const onOver = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    useApp.getState().hoverOrgan(e.object.userData.organ ?? null);
    document.body.style.cursor = "pointer";
  };
  const onOut = (e: ThreeEvent<PointerEvent>) => {
    // Only clear our own hover: moving onto an overlapping organ fires its "over" before our "out".
    const s = useApp.getState();
    if (s.hoveredOrgan === e.object.userData.organ) {
      s.hoverOrgan(null);
      document.body.style.cursor = "";
    }
  };
  // Click = pointer down on an organ, then pointer up within a few pixels. The up is caught on
  // window: the orbit controls capture the pointer at pointerdown, so R3F never sees the up event.
  const onDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    const id = e.object.userData.organ as OrganId | undefined;
    // Ignore clicks during the intro: the camera is scripted then and can't fly to the organ.
    if (!id || e.nativeEvent.button !== 0 || !useApp.getState().introDone) return;
    const { clientX: x, clientY: y } = e.nativeEvent;
    window.addEventListener(
      "pointerup",
      (up) => {
        if (Math.hypot(up.clientX - x, up.clientY - y) <= 6) useApp.getState().selectOrgan(id);
      },
      { once: true },
    );
  };

  return (
    <group>
      {organs.map(({ mesh }) => (
        <primitive key={mesh.uuid} object={mesh} onPointerOver={onOver} onPointerOut={onOut} onPointerDown={onDown} />
      ))}
      {skin && <primitive object={skin} />}
    </group>
  );
}
