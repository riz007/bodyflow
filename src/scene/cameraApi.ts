/**
 * Imperative camera controls for DOM UI outside the canvas (zoom buttons, keyboard shortcuts).
 * Kept free of three.js imports so the main bundle doesn't pull in the lazily loaded 3D scene.
 * <CameraRig> fills these in; they are no-ops until the scene is ready.
 */
export const cameraApi: { zoom: (factor: number) => void; reset: () => void } = { zoom: () => {}, reset: () => {} };

/** Zoom step per click or keypress. */
export const ZOOM_STEP = 0.7;
