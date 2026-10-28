"use client";
import { useCallback, useEffect, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { CameraControls } from "@react-three/drei";
import { useApp } from "@/state/store";
import { introProgress } from "./intro";
import { cameraApi } from "./cameraApi";
import { organRegistry } from "./registry";

const HOME_TARGET = new THREE.Vector3(0, 1.15, 0);

function homePosition(aspect: number) {
  // Pull back on narrow (portrait) screens so the torso and head stay in frame.
  const dist = aspect < 0.8 ? 3.4 : aspect < 1.2 ? 2.6 : 2.15;
  return new THREE.Vector3(0, 1.2, dist);
}

const easeInOut = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

export function CameraRig({ domElement }: { domElement: HTMLElement }) {
  const ref = useRef<CameraControls>(null);
  const aspect = useThree((s) => s.size.width / s.size.height);
  const selected = useApp((s) => s.selectedOrgan);
  const introDone = useApp((s) => s.introDone);
  const finishIntro = useApp((s) => s.finishIntro);

  // Intro: rise from the feet, swinging round to face the body.
  useFrame(() => {
    const c = ref.current;
    if (!c || introDone) return;
    const p = introProgress();
    if (p <= 0) return;
    const e = easeInOut(p);
    const home = homePosition(aspect);
    const angle = (1 - e) * -0.9;
    const dist = THREE.MathUtils.lerp(1.5, home.z, e);
    const y = THREE.MathUtils.lerp(0.25, home.y, e);
    const ty = THREE.MathUtils.lerp(0.55, HOME_TARGET.y, e);
    c.setLookAt(Math.sin(angle) * dist, y, Math.cos(angle) * dist, 0, ty, 0, false);
    if (p >= 1) finishIntro();
  });

  // Focus on the selected organ, or return home. Distance is derived from the field of view so
  // the organ fills about two thirds of the shorter screen axis, and the wheel can't dolly into it.
  const camera = useThree((s) => s.camera as THREE.PerspectiveCamera);
  const frame = useCallback(() => {
    const c = ref.current;
    if (!c) return;
    const { selectedOrgan } = useApp.getState();
    const entry = selectedOrgan ? organRegistry.get(selectedOrgan) : null;
    if (entry) {
      const { center, radius } = entry.sphere;
      const vfov = THREE.MathUtils.degToRad(camera.fov);
      const hfov = 2 * Math.atan(Math.tan(vfov / 2) * aspect);
      const dist = (radius / Math.sin(Math.min(vfov, hfov) / 2)) * 1.5;
      const dir = new THREE.Vector3(0.18, 0.1, 1).normalize();
      const pos = center.clone().addScaledVector(dir, dist);
      c.minDistance = radius * 1.4;
      c.maxDistance = Math.max(dist * 2.5, 1.5);
      c.setLookAt(pos.x, pos.y, pos.z, center.x, center.y, center.z, true);
    } else {
      const home = homePosition(aspect);
      c.minDistance = 0.35;
      c.maxDistance = 4.5;
      c.setLookAt(home.x, home.y, home.z, HOME_TARGET.x, HOME_TARGET.y, HOME_TARGET.z, true);
    }
  }, [aspect, camera]);

  useEffect(() => {
    if (introDone) frame();
  }, [selected, introDone, frame]);

  // Imperative zoom for the on-screen buttons and keyboard shortcuts (which live outside the canvas).
  useEffect(() => {
    cameraApi.zoom = (factor) => {
      const c = ref.current;
      if (!c || !useApp.getState().introDone) return;
      c.dollyTo(THREE.MathUtils.clamp(c.distance * factor, c.minDistance, c.maxDistance), true);
    };
    cameraApi.reset = () => useApp.getState().introDone && frame();
    return () => {
      cameraApi.zoom = () => {};
      cameraApi.reset = () => {};
    };
  }, [frame]);

  return (
    <CameraControls
      ref={ref}
      domElement={domElement}
      makeDefault
      enabled={introDone}
      smoothTime={0.4}
      draggingSmoothTime={0.12}
      // Faster than the default wheel zoom, towards the orbit target. (Dolly-to-cursor also moves the
      // target, which let a few quick wheel ticks carry the camera inside the body.)
      dollySpeed={1.6}
      dollyToCursor={false}
      minPolarAngle={0.15}
      maxPolarAngle={Math.PI - 0.15}
    />
  );
}
