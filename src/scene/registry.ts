import * as THREE from "three";
import type { OrganId } from "@/data/schema";
import { ORGAN_IDS } from "@/data/schema";
import type { OrganMaterial } from "@/shaders/materials";

/** GLB mesh name → OrganId. Vessel sub-meshes are named "vessels.aorta" etc.; GLTFLoader strips the dot. */
export function organIdFromMeshName(name: string): OrganId | "skin" | null {
  if (name === "skin") return "skin";
  if (name.startsWith("vessels")) return "vessels";
  return (ORGAN_IDS as readonly string[]).includes(name) ? (name as OrganId) : null;
}

/** Porcelain tones; deliberately no reds (reserved for toxicity). Arteries warm, veins cool. */
export function baseColorFor(meshName: string): string {
  const table: Record<string, string> = {
    brain: "#d8cfe8",
    heart: "#d6b9c9",
    lungs: "#c7dbec",
    liver: "#cdb6a3",
    stomach: "#e0d1bd",
    smallIntestine: "#e5d6c3",
    largeIntestine: "#d6c7b2",
    pancreas: "#e6d9ad",
    spleen: "#baaacd",
    kidneys: "#c8b3aa",
    bladder: "#e4dfcf",
    vesselsaorta: "#e2c9cf",
    vesselsrenalArteries: "#e2c9cf",
    vesselscarotids: "#e2c9cf",
    vesselsiliacs: "#e2c9cf",
    vesselsvenaCava: "#9db2d9",
    vesselsportalVein: "#a8b8d6",
  };
  return table[meshName.replace(/\./g, "")] ?? "#d0d4dc";
}

export interface OrganEntry {
  id: OrganId;
  meshes: THREE.Mesh<THREE.BufferGeometry, OrganMaterial>[];
  sphere: THREE.Sphere;
}

/** Filled by <Body> once the model loads; read by the camera rig and tooltip. Not React state. */
export const organRegistry = new Map<OrganId, OrganEntry>();
