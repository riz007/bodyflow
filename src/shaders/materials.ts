import * as THREE from "three";

/**
 * Hand-written GLSL materials. Kept as plain ShaderMaterials (WebGL2) so they run on every phone.
 */

const commonVertex = /* glsl */ `
  varying vec3 vNormalW;
  varying vec3 vPosW;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vPosW = world.xyz;
    vNormalW = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

/** Frosted X-ray skin: fresnel rim, faint body, subtle horizontal scan shimmer. */
export function createSkinMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: new THREE.Color("#9fc6ff") },
      uRim: { value: new THREE.Color("#d8ecff") },
      uOpacity: { value: 1 },
      uTime: { value: 0 },
      uReveal: { value: 1 }, // intro sweep: fraction of body height revealed
      uHeight: { value: 1.72 },
    },
    vertexShader: commonVertex,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor;
      uniform vec3 uRim;
      uniform float uOpacity;
      uniform float uTime;
      uniform float uReveal;
      uniform float uHeight;
      varying vec3 vNormalW;
      varying vec3 vPosW;
      void main() {
        vec3 V = normalize(cameraPosition - vPosW);
        float ndv = abs(dot(normalize(vNormalW), V));
        float fres = pow(1.0 - ndv, 2.6);
        float scan = 0.5 + 0.5 * sin(vPosW.y * 220.0 - uTime * 1.5);
        float band = smoothstep(0.0, 0.03, uReveal * uHeight - vPosW.y);
        float edge = (1.0 - smoothstep(0.0, 0.06, abs(uReveal * uHeight - vPosW.y))) * step(uReveal, 0.999);
        vec3 col = mix(uColor * 0.35, uRim, fres) + uRim * edge * 1.5;
        float a = (0.025 + fres * 0.55 + scan * 0.012) * band + edge * 0.6;
        gl_FragColor = vec4(col, a * uOpacity);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
    blending: THREE.AdditiveBlending,
  });
}

/**
 * Organ material: wrapped diffuse + fake subsurface back-scatter + fresnel rim,
 * plus an emissive "drug presence" glow and a toxic damage state.
 */
export function createOrganMaterial(base: string) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uBase: { value: new THREE.Color(base) },
      uGlowColor: { value: new THREE.Color("#5fe1ff") },
      uGlow: { value: 0 },
      uGlowColor2: { value: new THREE.Color("#ff9f43") },
      uGlow2: { value: 0 },
      uToxic: { value: 0 },
      uHover: { value: 0 },
      uOpacity: { value: 1 },
      uIntro: { value: 1 },
      uTime: { value: 0 },
    },
    vertexShader: commonVertex,
    fragmentShader: /* glsl */ `
      uniform vec3 uBase;
      uniform vec3 uGlowColor;
      uniform float uGlow;
      uniform vec3 uGlowColor2;
      uniform float uGlow2;
      uniform float uToxic;
      uniform float uHover;
      uniform float uOpacity;
      uniform float uIntro;
      uniform float uTime;
      varying vec3 vNormalW;
      varying vec3 vPosW;

      void main() {
        vec3 N = normalize(vNormalW);
        vec3 V = normalize(cameraPosition - vPosW);
        if (!gl_FrontFacing) N = -N;
        vec3 L = normalize(vec3(0.4, 0.8, 0.9));
        vec3 L2 = normalize(vec3(-0.6, 0.2, -0.8));
        float wrap = 0.45;
        float diff = clamp((dot(N, L) + wrap) / (1.0 + wrap), 0.0, 1.0);
        float back = pow(clamp(dot(V, -L2), 0.0, 1.0), 2.0) * 0.35 + clamp(dot(N, L2) * 0.5 + 0.5, 0.0, 1.0) * 0.15;
        float ndv = clamp(dot(N, V), 0.0, 1.0);
        float fres = pow(1.0 - ndv, 3.0);
        vec3 H = normalize(L + V);
        float spec = pow(max(dot(N, H), 0.0), 48.0) * 0.35;

        // Dark, glossy "product render" base so only rim light and drug glow reach the bloom threshold.
        vec3 base = uBase * (0.06 + 0.42 * diff) + uBase * back * 0.5 + spec * 0.6;
        base += vec3(0.62, 0.8, 1.0) * fres * 0.55;

        // Drug presence: emissive glow, brighter at grazing angles so shape stays readable.
        float pulse = 0.92 + 0.08 * sin(uTime * 2.2);
        vec3 glow = uGlowColor * uGlow * (0.3 + 1.1 * fres) * pulse
                  + uGlowColor2 * uGlow2 * (0.3 + 1.1 * fres) * pulse;

        // Toxic damage: desaturate, darken and push to red with a slow throb.
        vec3 toxicCol = vec3(1.0, 0.18, 0.24);
        float throb = 0.75 + 0.25 * sin(uTime * 3.4);
        vec3 col = mix(base + glow, mix(vec3(dot(base, vec3(0.33))) * 0.5, toxicCol, 0.55) + toxicCol * throb * (0.4 + fres), uToxic);

        col += vec3(0.9, 0.97, 1.0) * uHover * (0.12 + fres * 0.6);
        col *= uIntro;
        gl_FragColor = vec4(col, uOpacity);
      }
    `,
    transparent: false,
    side: THREE.DoubleSide,
  });
}

export type OrganMaterial = ReturnType<typeof createOrganMaterial>;
