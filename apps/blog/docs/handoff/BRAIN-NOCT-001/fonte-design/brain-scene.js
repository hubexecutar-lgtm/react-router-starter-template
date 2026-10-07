// SHIM — não é o brain-scene.js do Claude Design. O original (cena em superfície sólida, painel de revisão e
// GLTFExporter) não foi sincronizado: só estas duas funções são usadas pelo brain-hollow.js e pelos mockups.
// Contrato igual ao original: loadBrainAssets(base, signal) → { glb, pts, attr } (ArrayBuffer);
// parseGlb(glb) → { json, bin }, com bin = cópia alinhada do chunk BIN (os accessors leem Float32/Uint32 dele).

export async function loadBrainAssets(base, signal) {
  const get = async (name) => {
    const res = await fetch(base + name, { signal });
    if (!res.ok) throw new Error(`Brain asset ${name}: ${res.status}`);
    return res.arrayBuffer();
  };
  const [glb, pts, attr] = await Promise.all([get('brain-surface.glb'), get('brain-particles.bin'), get('brain-particles-attr.bin')]);
  if (pts.byteLength % 6 || attr.byteLength * 3 !== pts.byteLength) throw new Error('Brain particles: tamanho inválido');
  return { glb, pts, attr };
}

export function parseGlb(glb) {
  const dv = new DataView(glb);
  if (dv.getUint32(0, true) !== 0x46546c67 || dv.getUint32(4, true) !== 2) throw new Error('GLB inválido');
  let p = 12, json = null, bin = null;
  while (p < glb.byteLength) {
    const len = dv.getUint32(p, true), type = dv.getUint32(p + 4, true), start = p + 8;
    if (type === 0x4e4f534a) json = JSON.parse(new TextDecoder().decode(new Uint8Array(glb, start, len)));
    else if (type === 0x004e4942) bin = glb.slice(start, start + len);
    p = start + len;
  }
  if (!json || !bin) throw new Error('GLB sem JSON ou BIN');
  return { json, bin };
}
