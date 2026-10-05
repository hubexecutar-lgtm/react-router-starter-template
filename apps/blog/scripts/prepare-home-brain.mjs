// HOME-BRAIN-001: gera a nuvem de pontos do cérebro da home direto das superfícies FreeSurfer do OpenNeuro
// ds006128 (sub-01, snapshot 1.0.11, CC0-1.0). Sem dependências: lê a superfície triangular, o mapa de sulcos e o aseg.mgz.
//
//   node scripts/prepare-home-brain.mjs <dir com lh/rh.pial.T1, lh/rh.sulc e aseg.mgz>
//
// Os arquivos de origem são conferidos pelo SHA-256 antes de qualquer uso; a amostragem é determinística (semente fixa),
// então rodar de novo reproduz byte a byte o brain-points.bin e o manifest.json.
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { gunzipSync } from "node:zlib";

const BASE = "https://s3.amazonaws.com/openneuro.org/ds006128/derivatives/FreeSurfer/sub-01";
const SOURCES = {
	"lh.pial.T1": { url: `${BASE}/surf/lh.pial.T1`, sha256: "2aac780dd856e8be55362cec46663bd0eb14c03d3cac7ac3969f2083a7bf09f8" },
	"rh.pial.T1": { url: `${BASE}/surf/rh.pial.T1`, sha256: "655690359a5cf3c4cd498b31594a22014d7ad4b85620248ae60ed82b25ce3d31" },
	"lh.sulc": { url: `${BASE}/surf/lh.sulc`, sha256: "0aad26d4ab724eacdb337321fcf2ecae6ba3b1f2530a65729c55501875d5a9ac" },
	"rh.sulc": { url: `${BASE}/surf/rh.sulc`, sha256: "cb83fcb0fd4e7cffef77636819a2faf69fe98c36e38d3d634b45899654c68e83" },
	"aseg.mgz": { url: `${BASE}/mri/aseg.mgz`, sha256: "d2c386e1aaa05074042b07c8c9c53e999e6172053586562227c97e77a1a41a96" },
};
const SEED = 41005;
const COUNTS = { cortex: 36000, cerebellum: 5000, brainstem: 1000 };
/** Peso da amostragem por profundidade do sulco: cristas dos giros (sulc < 0) cheias, vales quase vazios. É o que
 * desenha os sulcos com pontos, como a retícula do globo da referência. */
const SULC_WEIGHT = (sulc) => (sulc < -1 ? 1 : sulc < 2 ? 0.3 : 0.04); // sulc em mm (mediana ≈ −0,5)
/** Rótulos FreeSurfer (FreeSurferColorLUT): córtex e substância branca do cerebelo, e tronco encefálico. */
const LABELS = { cerebellum: [7, 8, 46, 47], brainstem: [16] };
const EXTENT = 3.8;

const sha = (buf) => createHash("sha256").update(buf).digest("hex");

/** mulberry32: PRNG de 32 bits, determinístico e portátil. */
function rng(seed) {
	let a = seed >>> 0;
	return () => {
		a = (a + 0x6d2b79f5) >>> 0;
		let t = a;
		t = Math.imul(t ^ (t >>> 15), t | 1);
		t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
		return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
	};
}

/** Superfície triangular FreeSurfer (big-endian): magic 0xFFFFFE, duas linhas de texto, nº de vértices e faces. */
function readSurface(buf) {
	if (buf.readUIntBE(0, 3) !== 0xfffffe) throw new Error("não é uma superfície triangular FreeSurfer");
	let o = 3;
	while (!(buf[o] === 0x0a && buf[o + 1] === 0x0a)) o++;
	o += 2;
	const nv = buf.readInt32BE(o);
	const nf = buf.readInt32BE(o + 4);
	o += 8;
	const v = new Float64Array(nv * 3);
	for (let i = 0; i < nv * 3; i++) v[i] = buf.readFloatBE(o + i * 4);
	o += nv * 12;
	const f = new Uint32Array(nf * 3);
	for (let i = 0; i < nf * 3; i++) f[i] = buf.readInt32BE(o + i * 4);
	return { v, f };
}

/** Mapa por vértice FreeSurfer ("new curv", big-endian): magic 0xFFFFFF, vértices, faces, valores por vértice. */
function readMorph(buf) {
	if (buf.readUIntBE(0, 3) !== 0xffffff) throw new Error("não é um mapa morfométrico FreeSurfer");
	const nv = buf.readInt32BE(3);
	const out = new Float64Array(nv);
	for (let i = 0; i < nv; i++) out[i] = buf.readFloatBE(15 + i * 4);
	return out;
}

/** Volume MGH comprimido; devolve rótulos e a matriz voxel → surface RAS (tkr), a mesma das superfícies. */
function readMgz(gz) {
	const b = gunzipSync(gz);
	const [w, h, d] = [b.readInt32BE(4), b.readInt32BE(8), b.readInt32BE(12)];
	const type = b.readInt32BE(20);
	const [xs, ys, zs] = [b.readFloatBE(30), b.readFloatBE(34), b.readFloatBE(38)];
	const size = { 0: 1, 1: 4, 3: 4, 4: 2 }[type];
	const read = { 0: (o) => b[o], 1: (o) => b.readInt32BE(o), 3: (o) => b.readFloatBE(o), 4: (o) => b.readInt16BE(o) }[type];
	const labels = new Int32Array(w * h * d);
	for (let i = 0; i < labels.length; i++) labels[i] = read(284 + i * size);
	// tkr vox2ras do FreeSurfer: [-xs 0 0 xs·w/2; 0 0 zs −zs·d/2; 0 −ys 0 ys·h/2]
	const toRas = (c, r, s) => [-xs * c + (xs * w) / 2, zs * s - (zs * d) / 2, -ys * r + (ys * h) / 2];
	return { w, h, d, labels, toRas };
}

/** Pontos sobre a malha, por área × peso do sulco. */
function sampleSurface(surfaces, n, rand) {
	const tris = [];
	let total = 0;
	for (const { v, f, sulc } of surfaces) {
		for (let i = 0; i < f.length; i += 3) {
			const [a, b, c] = [f[i] * 3, f[i + 1] * 3, f[i + 2] * 3];
			const ux = v[b] - v[a], uy = v[b + 1] - v[a + 1], uz = v[b + 2] - v[a + 2];
			const wx = v[c] - v[a], wy = v[c + 1] - v[a + 1], wz = v[c + 2] - v[a + 2];
			const depth = (sulc[f[i]] + sulc[f[i + 1]] + sulc[f[i + 2]]) / 3;
			const area = (Math.hypot(uy * wz - uz * wy, uz * wx - ux * wz, ux * wy - uy * wx) / 2) * SULC_WEIGHT(depth);
			total += area;
			tris.push({ v, a, b, c, cum: total });
		}
	}
	const out = [];
	for (let k = 0; k < n; k++) {
		const target = rand() * total;
		let lo = 0, hi = tris.length - 1;
		while (lo < hi) {
			const mid = (lo + hi) >> 1;
			if (tris[mid].cum < target) lo = mid + 1;
			else hi = mid;
		}
		const { v, a, b, c } = tris[lo];
		let u = rand(), t = rand();
		if (u + t > 1) [u, t] = [1 - u, 1 - t];
		out.push([0, 1, 2].map((j) => v[a + j] + u * (v[b + j] - v[a + j]) + t * (v[c + j] - v[a + j])));
	}
	return out;
}

/** Pontos na casca de um rótulo do aseg: voxels do rótulo com algum vizinho fora dele, com jitter dentro do voxel. */
function sampleShell(vol, labels, n, rand) {
	const { w, h, d } = vol;
	const set = new Set(labels);
	const inside = (c, r, s) => c >= 0 && r >= 0 && s >= 0 && c < w && r < h && s < d && set.has(vol.labels[c + r * w + s * w * h]);
	const shell = [];
	for (let s = 0; s < d; s++)
		for (let r = 0; r < h; r++)
			for (let c = 0; c < w; c++)
				if (inside(c, r, s) && [[1, 0, 0], [-1, 0, 0], [0, 1, 0], [0, -1, 0], [0, 0, 1], [0, 0, -1]].some(([dc, dr, ds]) => !inside(c + dc, r + dr, s + ds)))
					shell.push([c, r, s]);
	const out = [];
	for (let k = 0; k < n; k++) {
		const [c, r, s] = shell[Math.floor(rand() * shell.length)];
		out.push(vol.toRas(c + rand() - 0.5, r + rand() - 0.5, s + rand() - 0.5));
	}
	return out;
}

const dir = process.argv[2];
if (!dir) throw new Error("uso: node scripts/prepare-home-brain.mjs <dir com lh/rh.pial.T1, lh/rh.sulc e aseg.mgz>");
const files = {};
for (const [name, src] of Object.entries(SOURCES)) {
	files[name] = readFileSync(join(dir, name));
	if (sha(files[name]) !== src.sha256) throw new Error(`${name}: SHA-256 diferente do snapshot 1.0.11`);
}

const rand = rng(SEED);
const ras = [
	...sampleSurface(
		["lh", "rh"].map((h) => ({ ...readSurface(files[`${h}.pial.T1`]), sulc: readMorph(files[`${h}.sulc`]) })),
		COUNTS.cortex,
		rand,
	),
	...(() => {
		const vol = readMgz(files["aseg.mgz"]);
		return [...sampleShell(vol, LABELS.cerebellum, COUNTS.cerebellum, rand), ...sampleShell(vol, LABELS.brainstem, COUNTS.brainstem, rand)];
	})(),
];

// RAS → Three.js (rotação própria, sem espelhar): anterior → +x, superior → +y, direita → +z (vista lateral direita).
const pts = ras.map(([R, A, S]) => [A, S, R]);
const min = [0, 1, 2].map((j) => Math.min(...pts.map((p) => p[j])));
const max = [0, 1, 2].map((j) => Math.max(...pts.map((p) => p[j])));
const center = min.map((m, j) => (m + max[j]) / 2);
const scale = EXTENT / Math.max(...max.map((m, j) => m - min[j]));
// Int16 por eixo (6 bytes por ponto): x = v / 32767 · 2. A maior extensão é 3,8, então |x| ≤ 1,9 < 2.
const data = new Int16Array(pts.length * 3);
pts.forEach((p, i) => p.forEach((x, j) => (data[i * 3 + j] = Math.round(((x - center[j]) * scale * 32767) / 2))));
const bin = Buffer.from(data.buffer);

const out = join(dirname(fileURLToPath(import.meta.url)), "../public/models/home-brain");
mkdirSync(out, { recursive: true });
writeFileSync(join(out, "brain-points.bin"), bin);
const manifest = {
	id: "HOME-BRAIN-ASSET-001",
	version: "1.1.0",
	encoding: "int16 little-endian x,y,z per point; value = int16 / 32767 * 2 (Three.js units)",
	license: "CC0-1.0",
	source_dataset: "OpenNeuro ds006128, sub-01, snapshot 1.0.11",
	source_doi: "https://doi.org/10.18112/openneuro.ds006128.v1.0.11",
	sources: SOURCES,
	changes: `Area × sulcal-depth weighted points on the left/right pial surfaces (${COUNTS.cortex}; gyral crowns kept, sulcal fundi thinned) plus shell points of aseg cerebellum (${COUNTS.cerebellum}) and brain stem (${COUNTS.brainstem}); centered, uniformly scaled to ${EXTENT}; deterministic seed ${SEED}. No anatomy-to-function localization.`,
	generator: "apps/blog/scripts/prepare-home-brain.mjs",
	points: pts.length,
	files: { "brain-points.bin": { bytes: bin.length, sha256: sha(bin) } },
};
writeFileSync(join(out, "manifest.json"), JSON.stringify(manifest, null, 2) + "\n");
console.log(JSON.stringify(manifest.files));
