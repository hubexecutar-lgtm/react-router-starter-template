// Uso: node scripts/rc-images.mjs (em apps/blog). LANC-001 RQ-030: as 6 ilustrações RC_* em WebP, retrato (9:16) e paisagem (16:9), sem cortar:
// a variante que não é a original é recomposta com margem na cor do fundo da própria ilustração.
import sharp from "sharp";
import fs from "node:fs";
import crypto from "node:crypto";
const SRC = "../../docs/lancamento/LANC-001/intake/DOCS-002/RC_IMAGENS_RENOMEADAS_v1.0.0/";
const OUT = "public/images/";
const IMAGES = [
  ["RC_Pessoa_Binoculos_Observa_Cidade_Retrato.png", "rc-binoculos-cidade"],
  ["RC_Cerebro_Urbano_Sustentado_Por_Mao_Retrato_A.png", "rc-cerebro-urbano-mao"],
  ["RC_Pista_Corrida_Tres_Pessoas_Retrato.png", "rc-pista-largada"],
  ["RC_Pessoa_Binoculos_e_Cerebro_Urbano_16x9.png", "rc-binoculos-cerebro-urbano"],
  ["RC_Pessoa_Binoculos_Observa_Mapa_Cerebral_16x9.png", "rc-binoculos-mapa-cerebral"],
  ["RC_Cerebro_Urbano_Sustentado_Por_Mao_Retrato_B.png", "rc-cerebro-urbano-mao-b"],
];
// RQ-032: a ilustração do artigo do PR #19 (cerebro-fio, só 16:9) ganha a variante retrato.
const EXTRA = [["public/images/cerebro-fio-1672.webp", "cerebro-fio", ["portrait"]]];
const MAX_BYTES = 245 * 1024;
const SIZES = { landscape: [[836, 470], [1672, 941]], portrait: [[470, 836], [941, 1672]] };
(async () => {
  const report = [];
  const jobs = [...IMAGES.map(([file, slug]) => [SRC + file, slug, ["landscape", "portrait"]]), ...EXTRA];
  for (const [input, slug, orients] of jobs) {
    const buf = fs.readFileSync(input);
    const sha = crypto.createHash("sha256").update(buf).digest("hex");
    const { data } = await sharp(input).extract({ left: 4, top: 4, width: 1, height: 1 }).raw().toBuffer({ resolveWithObject: true });
    const background = { r: data[0], g: data[1], b: data[2] };
    for (const [orient, sizes] of Object.entries(SIZES).filter(([o]) => orients.includes(o))) {
      for (const [w, h] of sizes) {
        const name = `${slug}-${orient === "landscape" ? "16x9" : "retrato"}-${w}.webp`;
        // RQ-030: cada variante com no máximo 250 KB; a qualidade desce até caber.
        for (let quality = 78; ; quality -= 4) {
          await sharp(input).resize(w, h, { fit: "contain", background }).webp({ quality, effort: 6 }).toFile(OUT + name);
          if (fs.statSync(OUT + name).size <= MAX_BYTES || quality <= 40) break;
        }
        const kb = Math.round(fs.statSync(OUT + name).size / 1024);
        report.push({ slug, name, w, h, kb, sha });
      }
    }
  }
  console.log(JSON.stringify(report, null, 1));
})();
