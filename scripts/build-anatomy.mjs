#!/usr/bin/env node
/**
 * Builds public/models/body-{desktop,mobile}.glb from BodyParts3D (DBCLS, CC BY-SA 2.1 JP).
 *
 * Usage:
 *   node scripts/build-anatomy.mjs <partof-obj-dir> <isa-obj-dir> <partof_element_parts.txt> <isa_element_parts.txt>
 *
 * Source: https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html
 *   partof_BP3D_4.0_obj_99.zip, isa_BP3D_4.0_obj_99.zip (spleen only), and the element-parts lists.
 *
 * Per organ: merge element meshes → convert mm Z-up to metres Y-up (front = +Z) → simplify with
 * meshoptimizer to a triangle budget → smooth normals → quantise + EXT_meshopt_compression.
 */
import { readFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { Document, NodeIO } from "@gltf-transform/core";
import { EXTMeshoptCompression, KHRMeshQuantization } from "@gltf-transform/extensions";
import { meshopt, quantize, reorder } from "@gltf-transform/functions";
import { MeshoptEncoder, MeshoptSimplifier } from "meshoptimizer";

const [partofDir, isaDir, partofList, isaList] = process.argv.slice(2);
if (!isaList) {
  console.error("usage: build-anatomy.mjs <partof-obj-dir> <isa-obj-dir> <partof_element_parts.txt> <isa_element_parts.txt>");
  process.exit(1);
}

/**
 * Mesh name → FMA concepts. Mesh names are `<organId>` or `<organId>.<part>`; the app maps
 * everything before the dot to an OrganId. Budgets are triangles for [desktop, mobile].
 */
const MESHES = [
  { name: "skin", fma: [["partof", "FMA7163"]], budget: [60000, 18000] },
  { name: "brain", fma: [["partof", "FMA50801"]], budget: [16000, 5000] },
  { name: "heart", fma: [["partof", "FMA7088"]], budget: [10000, 3000] },
  // BodyParts3D 4.0 has no lung surface, only the bronchial and pulmonary vascular trees.
  // The surface is derived from those trees (see envelope()), one per lung.
  { name: "lungs", fma: [["partof", "FMA7309"], ["partof", "FMA7310"]], budget: [12000, 3500], envelope: true },
  { name: "liver", fma: [["partof", "FMA7197"]], budget: [10000, 3000] },
  { name: "stomach", fma: [["partof", "FMA7148"]], budget: [5000, 1600] },
  { name: "smallIntestine", fma: [["partof", "FMA7200"]], budget: [16000, 5000] },
  { name: "largeIntestine", fma: [["partof", "FMA7201"]], budget: [10000, 3000] },
  { name: "pancreas", fma: [["partof", "FMA7198"]], budget: [3000, 1000] },
  { name: "spleen", fma: [["isa", "FMA7196"]], budget: [2500, 800] },
  { name: "kidneys", fma: [["partof", "FMA7204"], ["partof", "FMA7205"]], budget: [5000, 1600] },
  { name: "bladder", fma: [["partof", "FMA15900"]], budget: [2500, 800] },
  { name: "vessels.aorta", fma: [["partof", "FMA3734"]], budget: [6000, 2000] },
  { name: "vessels.venaCava", fma: [["partof", "FMA10951"], ["partof", "FMA4720"]], budget: [4000, 1300] },
  { name: "vessels.portalVein", fma: [["partof", "FMA50735"]], budget: [3000, 1000] },
  { name: "vessels.renalArteries", fma: [["partof", "FMA14752"], ["partof", "FMA14753"]], budget: [1500, 500] },
  { name: "vessels.carotids", fma: [["partof", "FMA3941"], ["partof", "FMA4058"]], budget: [2000, 700] },
  { name: "vessels.iliacs", fma: [["partof", "FMA14764"]], budget: [2000, 700] },
];

function readElementList(path) {
  const map = new Map();
  for (const line of readFileSync(path, "utf8").split("\n").slice(1)) {
    const [concept, , file] = line.trim().split("\t");
    if (!concept || !file) continue;
    if (!map.has(concept)) map.set(concept, []);
    map.get(concept).push(file);
  }
  return map;
}

const lists = { partof: readElementList(partofList), isa: readElementList(isaList) };
const dirs = { partof: partofDir, isa: isaDir };

/** Parse an OBJ into positions (mm, source frame) and triangle indices. */
function parseObj(text) {
  const pos = [];
  const idx = [];
  for (const line of text.split("\n")) {
    if (line.startsWith("v ")) {
      const [, x, y, z] = line.trim().split(/\s+/);
      pos.push(+x, +y, +z);
    } else if (line.startsWith("f ")) {
      const vs = line.trim().split(/\s+/).slice(1).map((t) => parseInt(t.split("/")[0], 10) - 1);
      for (let i = 1; i + 1 < vs.length; i++) idx.push(vs[0], vs[i], vs[i + 1]);
    }
  }
  return { pos, idx };
}

function loadMesh(spec) {
  if (spec.envelope) {
    // One envelope per concept (left and right lung) so they don't bridge across the mediastinum.
    const parts = spec.fma.map(([set, concept]) => {
      const m = loadMesh({ name: spec.name, fma: [[set, concept]] });
      return { ...envelope(m.pos, m.idx), files: m.files };
    });
    return mergeParts(parts);
  }
  const pos = [];
  const idx = [];
  const files = new Set();
  for (const [set, concept] of spec.fma) {
    const ids = lists[set].get(concept);
    if (!ids) throw new Error(`${spec.name}: no element parts for ${concept}`);
    for (const id of ids) {
      const p = join(dirs[set], `${id}.obj`);
      if (!existsSync(p) || files.has(id)) continue;
      files.add(id);
      const m = parseObj(readFileSync(p, "utf8"));
      const base = pos.length / 3;
      for (const v of m.pos) pos.push(v);
      for (const i of m.idx) idx.push(i + base);
    }
  }
  if (!idx.length) throw new Error(`${spec.name}: no geometry found`);
  return { pos: new Float32Array(pos), idx: new Uint32Array(idx), files: files.size };
}

function mergeParts(parts) {
  const pos = [];
  const idx = [];
  let files = 0;
  for (const p of parts) {
    const base = pos.length / 3;
    for (const v of p.pos) pos.push(v);
    for (const i of p.idx) idx.push(i + base);
    files += p.files;
  }
  return { pos: new Float32Array(pos), idx: new Uint32Array(idx), files };
}

/**
 * Closed, smooth surface enclosing a tree-like structure (mm in, mm out):
 * voxelise vertices and triangle centroids → morphological closing (dilate then erode, via box
 * blurs) → light blur → surface-nets isosurface → Laplacian smoothing.
 */
function envelope(srcPos, srcIdx, voxel = 4, dilate = 4, erode = 3) {
  const lo = [Infinity, Infinity, Infinity];
  const hi = [-Infinity, -Infinity, -Infinity];
  for (let i = 0; i < srcPos.length; i += 3)
    for (let a = 0; a < 3; a++) {
      lo[a] = Math.min(lo[a], srcPos[i + a]);
      hi[a] = Math.max(hi[a], srcPos[i + a]);
    }
  const pad = (dilate + 3) * voxel;
  const o = lo.map((v) => v - pad);
  const n = hi.map((v, a) => Math.ceil((v + pad - o[a]) / voxel) + 1);
  const [nx, ny, nz] = n;
  const at = (x, y, z) => x + nx * (y + ny * z);
  let f = new Float32Array(nx * ny * nz);
  const mark = (x, y, z) => {
    f[at(Math.round((x - o[0]) / voxel), Math.round((y - o[1]) / voxel), Math.round((z - o[2]) / voxel))] = 1;
  };
  for (let i = 0; i < srcPos.length; i += 3) mark(srcPos[i], srcPos[i + 1], srcPos[i + 2]);
  for (let k = 0; k < srcIdx.length; k += 3) {
    const [a, b, c] = [srcIdx[k] * 3, srcIdx[k + 1] * 3, srcIdx[k + 2] * 3];
    mark((srcPos[a] + srcPos[b] + srcPos[c]) / 3, (srcPos[a + 1] + srcPos[b + 1] + srcPos[c + 1]) / 3, (srcPos[a + 2] + srcPos[b + 2] + srcPos[c + 2]) / 3);
  }
  const blur = (src, r) => {
    let a = src;
    for (let axis = 0; axis < 3; axis++) {
      const b = new Float32Array(a.length);
      const stride = axis === 0 ? 1 : axis === 1 ? nx : nx * ny;
      const len = n[axis];
      for (let z = 0; z < (axis === 2 ? 1 : nz); z++)
        for (let y = 0; y < (axis === 1 ? 1 : ny); y++)
          for (let x = 0; x < (axis === 0 ? 1 : nx); x++) {
            const start = at(x, y, z);
            for (let i = 0; i < len; i++) {
              let sum = 0;
              for (let j = -r; j <= r; j++) {
                const q = i + j;
                if (q >= 0 && q < len) sum += a[start + q * stride];
              }
              b[start + i * stride] = sum / (2 * r + 1);
            }
          }
      a = b;
    }
    return a;
  };
  // Closing: dilate (any coverage) then erode (full coverage).
  f = blur(f, dilate).map((v) => (v > 1e-4 ? 1 : 0));
  f = blur(f, erode).map((v) => (v > 0.999 ? 1 : 0));
  f = blur(f, 1);

  // Surface nets at iso 0.5.
  const iso = 0.5;
  const vid = new Int32Array(nx * ny * nz).fill(-1);
  const pos = [];
  for (let z = 0; z < nz - 1; z++)
    for (let y = 0; y < ny - 1; y++)
      for (let x = 0; x < nx - 1; x++) {
        let mask = 0;
        const vals = [];
        for (let c = 0; c < 8; c++) {
          const v = f[at(x + (c & 1), y + ((c >> 1) & 1), z + ((c >> 2) & 1))];
          vals.push(v);
          if (v > iso) mask |= 1 << c;
        }
        if (mask === 0 || mask === 255) continue;
        let sx = 0, sy = 0, sz = 0, cnt = 0;
        for (let c = 0; c < 8; c++)
          for (const d of [1, 2, 4]) {
            const c2 = c | d;
            if (c2 === c) continue;
            const a = vals[c], b = vals[c2];
            if (a > iso === b > iso) continue;
            const t = (iso - a) / (b - a);
            sx += (c & 1) + t * ((c2 & 1) - (c & 1));
            sy += ((c >> 1) & 1) + t * (((c2 >> 1) & 1) - ((c >> 1) & 1));
            sz += ((c >> 2) & 1) + t * (((c2 >> 2) & 1) - ((c >> 2) & 1));
            cnt++;
          }
        vid[at(x, y, z)] = pos.length / 3;
        pos.push(o[0] + (x + sx / cnt) * voxel, o[1] + (y + sy / cnt) * voxel, o[2] + (z + sz / cnt) * voxel);
      }
  const idx = [];
  const quad = (a, b, c, d, flip) => (flip ? idx.push(a, c, b, a, d, c) : idx.push(a, b, c, a, c, d));
  for (let z = 1; z < nz - 1; z++)
    for (let y = 1; y < ny - 1; y++)
      for (let x = 1; x < nx - 1; x++) {
        const inside = f[at(x, y, z)] > iso;
        if (inside !== f[at(x + 1, y, z)] > iso)
          quad(vid[at(x, y - 1, z - 1)], vid[at(x, y, z - 1)], vid[at(x, y, z)], vid[at(x, y - 1, z)], !inside);
        if (inside !== f[at(x, y + 1, z)] > iso)
          quad(vid[at(x - 1, y, z - 1)], vid[at(x - 1, y, z)], vid[at(x, y, z)], vid[at(x, y, z - 1)], !inside);
        if (inside !== f[at(x, y, z + 1)] > iso)
          quad(vid[at(x - 1, y - 1, z)], vid[at(x, y - 1, z)], vid[at(x, y, z)], vid[at(x - 1, y, z)], !inside);
      }
  // Laplacian smoothing.
  const P = new Float32Array(pos);
  const nb = Array.from({ length: P.length / 3 }, () => new Set());
  for (let k = 0; k < idx.length; k += 3)
    for (let e = 0; e < 3; e++) {
      nb[idx[k + e]].add(idx[k + ((e + 1) % 3)]);
      nb[idx[k + ((e + 1) % 3)]].add(idx[k + e]);
    }
  for (let it = 0; it < 4; it++) {
    const Q = P.slice();
    nb.forEach((s, i) => {
      if (!s.size) return;
      let ax = 0, ay = 0, az = 0;
      for (const j of s) {
        ax += Q[j * 3];
        ay += Q[j * 3 + 1];
        az += Q[j * 3 + 2];
      }
      P[i * 3] = Q[i * 3] * 0.5 + (ax / s.size) * 0.5;
      P[i * 3 + 1] = Q[i * 3 + 1] * 0.5 + (ay / s.size) * 0.5;
      P[i * 3 + 2] = Q[i * 3 + 2] * 0.5 + (az / s.size) * 0.5;
    });
  }
  return { pos: P, idx: new Uint32Array(idx) };
}

/** Merge vertices that share a position (element meshes are separate shells). */
function weld(pos, idx, eps = 0.01) {
  const key = (i) => `${Math.round(pos[i * 3] / eps)},${Math.round(pos[i * 3 + 1] / eps)},${Math.round(pos[i * 3 + 2] / eps)}`;
  const remap = new Uint32Array(pos.length / 3);
  const seen = new Map();
  const out = [];
  for (let i = 0; i < pos.length / 3; i++) {
    const k = key(i);
    let j = seen.get(k);
    if (j === undefined) {
      j = out.length / 3;
      seen.set(k, j);
      out.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
    }
    remap[i] = j;
  }
  return { pos: new Float32Array(out), idx: idx.map((i) => remap[i]) };
}

function compact(pos, idx) {
  const remap = new Int32Array(pos.length / 3).fill(-1);
  const out = [];
  const nidx = new Uint32Array(idx.length);
  for (let k = 0; k < idx.length; k++) {
    const i = idx[k];
    if (remap[i] < 0) {
      remap[i] = out.length / 3;
      out.push(pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2]);
    }
    nidx[k] = remap[i];
  }
  return { pos: new Float32Array(out), idx: nidx };
}

function normals(pos, idx) {
  const n = new Float32Array(pos.length);
  for (let k = 0; k < idx.length; k += 3) {
    const [a, b, c] = [idx[k] * 3, idx[k + 1] * 3, idx[k + 2] * 3];
    const ux = pos[b] - pos[a], uy = pos[b + 1] - pos[a + 1], uz = pos[b + 2] - pos[a + 2];
    const vx = pos[c] - pos[a], vy = pos[c + 1] - pos[a + 1], vz = pos[c + 2] - pos[a + 2];
    const nx = uy * vz - uz * vy, ny = uz * vx - ux * vz, nz = ux * vy - uy * vx; // area-weighted
    for (const v of [a, b, c]) {
      n[v] += nx;
      n[v + 1] += ny;
      n[v + 2] += nz;
    }
  }
  for (let i = 0; i < n.length; i += 3) {
    const l = Math.hypot(n[i], n[i + 1], n[i + 2]) || 1;
    n[i] /= l;
    n[i + 1] /= l;
    n[i + 2] /= l;
  }
  return n;
}

await MeshoptSimplifier.ready;
await MeshoptEncoder.ready;

// Load everything once, in source millimetres.
const raw = MESHES.map((spec) => {
  const m = loadMesh(spec);
  const w = weld(m.pos, m.idx);
  console.log(`${spec.name.padEnd(24)} ${String(m.files).padStart(4)} files ${String(m.idx.length / 3).padStart(8)} tris`);
  return { spec, ...w };
});

// Frame: centre X/Y on the skin, feet at 0. Source is X = patient left, Y = posterior(+)/anterior(−), Z = up.
const skin = raw.find((r) => r.spec.name === "skin");
const bounds = [Infinity, Infinity, Infinity, -Infinity, -Infinity, -Infinity];
for (let i = 0; i < skin.pos.length; i += 3)
  for (let a = 0; a < 3; a++) {
    bounds[a] = Math.min(bounds[a], skin.pos[i + a]);
    bounds[a + 3] = Math.max(bounds[a + 3], skin.pos[i + a]);
  }
const cx = (bounds[0] + bounds[3]) / 2;
const cy = (bounds[1] + bounds[4]) / 2;
const z0 = bounds[2];
const toThree = (pos) => {
  const out = new Float32Array(pos.length);
  for (let i = 0; i < pos.length; i += 3) {
    out[i] = (pos[i] - cx) / 1000;
    out[i + 1] = (pos[i + 2] - z0) / 1000;
    out[i + 2] = -(pos[i + 1] - cy) / 1000;
  }
  return out;
};
console.log(`body height ${((bounds[5] - bounds[2]) / 1000).toFixed(2)} m`);

const io = new NodeIO().registerExtensions([EXTMeshoptCompression, KHRMeshQuantization]).registerDependencies({
  "meshopt.encoder": MeshoptEncoder,
});

mkdirSync("public/models", { recursive: true });

for (const [tier, b] of [["desktop", 0], ["mobile", 1]]) {
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene("body");
  let total = 0;
  for (const r of raw) {
    const target = Math.min(r.idx.length, r.spec.budget[b] * 3);
    const [simplified] = MeshoptSimplifier.simplify(r.idx, r.pos, 3, target, 0.02, ["LockBorder"]);
    let { pos, idx } = compact(r.pos, simplified);
    pos = toThree(pos);
    total += idx.length / 3;
    const prim = doc
      .createPrimitive()
      .setAttribute("POSITION", doc.createAccessor().setType("VEC3").setArray(pos).setBuffer(buffer))
      .setAttribute("NORMAL", doc.createAccessor().setType("VEC3").setArray(normals(pos, idx)).setBuffer(buffer))
      .setIndices(doc.createAccessor().setType("SCALAR").setArray(idx).setBuffer(buffer));
    const mesh = doc.createMesh(r.spec.name).addPrimitive(prim);
    scene.addChild(doc.createNode(r.spec.name).setMesh(mesh));
  }
  doc.getRoot().getAsset().copyright = "BodyParts3D, (c) The Database Center for Life Science, CC BY-SA 2.1 JP";
  await doc.transform(reorder({ encoder: MeshoptEncoder }), quantize(), meshopt({ encoder: MeshoptEncoder, level: "medium" }));
  const out = `public/models/body-${tier}.glb`;
  const bin = await io.writeBinary(doc);
  writeFileSync(out, bin);
  console.log(`${out}: ${total} tris, ${(bin.byteLength / 1024).toFixed(0)} KB`);
}
