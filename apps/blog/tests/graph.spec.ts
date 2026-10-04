import { expect, test } from "@playwright/test";
import Ajv2020 from "ajv/dist/2020.js";
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { VISUAL_TYPES, edgeSemantics, evidenceLevel, neighborhood, publicMap, visualType } from "../app/lib/graph/project";
import { CANONICAL_SOURCES, graphViolations } from "../app/lib/graph/rules";
import type { CorrelationGraph } from "../app/lib/graph/types";

// LANC-001 PR-G (RQ-060…065): grafo canônico no formato CORRELATION_RECORD da Teia Única (ADR-M04),
// validado contra o schema e as 7 regras do 06-DATA-SPEC-GRAFO-CAUSAL §5.
const ROOT = process.cwd();
const read = (p: string) => readFileSync(join(ROOT, p), "utf8");
const graph: CorrelationGraph = JSON.parse(read("app/data/graph/rc-graph.json"));
const INTAKE = "../../docs/lancamento/LANC-001/intake";
const CANON = `${INTAKE}/DOCS-002/RC_EDITORIAL_PLAIN_TXT_v1.0.0`;
const TEXTS: Record<string, string> = {
  "RC-LP-001": `${CANON}/01_CANONICO/01_RC_LANDING_3_PILARES.txt`,
  "RC-ART-P1-001": `${CANON}/01_CANONICO/02_RC_ARTIGO_P1_RISCOS_COGNITIVOS.txt`,
  "RC-ART-P2-001": `${CANON}/01_CANONICO/03_RC_ARTIGO_P2_PROCESSOS_NEUROADAPTATIVOS.txt`,
  "RC-ART-P3-001": `${CANON}/01_CANONICO/04_RC_ARTIGO_P3_FERRAMENTAS_SOLUCOES.txt`,
  "RC-ART-MASTER-001": `${CANON}/01_CANONICO/05_RC_ARTIGO_MASTER_3_PILARES_1500.txt`,
  "RC-SRC-001": `${CANON}/02_REFERENCIAS/01_FONTES_WEB.txt`,
};
const norm = (s: string) => s.replace(/\s+/g, " ").trim().toLocaleLowerCase("pt-BR");
const text = (id: string) => norm(read(TEXTS[id]));
const clone = (): CorrelationGraph => JSON.parse(JSON.stringify(graph));

test.describe("canonical graph (RQ-060)", () => {
  test("the schema is the literal copy of the Teia intake", () => {
    expect(read("app/data/graph/CORRELATION_RECORD.schema.json")).toBe(read(`${INTAKE}/EXECUTAR-TEIA-UNICA-CORRELACAO-v0.1.0/CORRELATION_RECORD.schema.json`));
  });

  test("rule 1: rc-graph.json validates against CORRELATION_RECORD.schema.json", () => {
    const validate = new Ajv2020({ allErrors: true, strict: false }).compile(JSON.parse(read("app/data/graph/CORRELATION_RECORD.schema.json")));
    const ok = validate(graph);
    expect(validate.errors ?? [], "erros do schema").toEqual([]);
    expect(ok).toBe(true);
  });

  test("rules 2–7: ids, provenance, numbers, inference, sources and projection", () => {
    expect(graphViolations(graph)).toEqual([]);
  });

  test("the rules catch broken graphs", () => {
    const inferredValidated = clone();
    inferredValidated.edges.find((e) => e.epistemic.provenance_class === "E_INFERRED")!.status = "VALIDATED";
    expect(graphViolations(inferredValidated).some((v) => v.startsWith("5:"))).toBe(true);

    const number = clone();
    number.nodes[0].label = "Interrupções aumentam erros em 42%";
    expect(graphViolations(number).some((v) => v.startsWith("4:"))).toBe(true);

    const dangling = clone();
    dangling.edges[0].target = "FRC-NAO-EXISTE";
    expect(graphViolations(dangling).some((v) => v.startsWith("2:"))).toBe(true);

    const noSource = clone();
    noSource.nodes[0].source_refs = ["NOTA-SOLTA"];
    expect(graphViolations(noSource).some((v) => v.startsWith("6:"))).toBe(true);

    const profile = clone();
    profile.nodes.push({ id: "NDP-TDAH", type: "NEURODIVERGENCE_PROFILE", label: "TDAH", status: "DRAFT", source_refs: ["RC-ART-P1-001"], source_quote: "x" });
    expect(graphViolations(profile).some((v) => v.startsWith("CF-06"))).toBe(true);

    const hub = clone();
    for (let i = 0; i < 9; i++) {
      hub.nodes.push({ id: `CMP-EXTRA-${i}`, type: "COMPENSATION", label: `Extra`, status: "DRAFT", source_refs: ["RC-ART-P3-001"], source_quote: "x" });
      hub.edges.push({ id: `REL-X${i}`, type: "MITIGATES", source: `CMP-EXTRA-${i}`, target: "FRC-INTERRUPCOES", status: "PROPOSED", epistemic: { provenance_class: "E_INFERRED", claim_role: "HYPOTHESIS" }, evidence_refs: [] });
    }
    expect(neighborhood(hub, "FRC-INTERRUPCOES").nodes.length).toBe(8);
    expect(neighborhood(hub, "FRC-INTERRUPCOES").hidden).toBeGreaterThan(0);
  });
});

test.describe("initial graph from the canonical articles (RQ-061, RQ-062)", () => {
  test("every node cites a canonical document and quotes it literally", () => {
    for (const n of graph.nodes) {
      const refs = n.source_refs.filter((r) => CANONICAL_SOURCES.includes(r));
      expect(refs.length, n.id).toBeGreaterThan(0);
      expect(
        refs.some((r) => text(r).includes(norm(n.source_quote!))),
        `${n.id}: "${n.source_quote}" não está em ${refs.join(", ")}`,
      ).toBe(true);
    }
  });

  test("explicit relations quote their source; inferred ones are never evidence", () => {
    for (const e of graph.edges) {
      if (e.epistemic.provenance_class === "E_INFERRED") {
        expect(e.status, e.id).toBe("PROPOSED");
        expect(e.type, e.id).not.toBe("SUPPORTED_BY");
        expect(evidenceLevel(e), e.id).toBe("hypothesis");
        expect(e.limitations?.length, `${e.id} explica por que é inferida`).toBeGreaterThan(0);
      } else {
        for (const line of e.source_quote!.split("\n")) {
          expect(text(e.source_ref!), `${e.id}: "${line}" não está em ${e.source_ref}`).toContain(norm(line));
        }
      }
    }
  });

  test("the P1/P3 vocabulary is present", () => {
    const labels = graph.nodes.map((n) => n.label);
    for (const l of ["Interrupções", "Tarefa ambígua", "Sobrecarga", "Perda de contexto", "Retrabalho", "Erro", "Atenção", "Memória", "Planejamento", "Tomada de decisão", "Externalização", "Redução", "Explicitação", "Automação", "Checkpoint", "Checklist", "Runbook"]) {
      expect(labels, l).toContain(l);
    }
    expect(graph.nodes.filter((n) => n.type === "EVIDENCE").length).toBe(11);
    for (const n of graph.nodes.filter((n) => n.type === "EVIDENCE")) expect(text("RC-SRC-001"), n.id).toContain(norm(String(n.url)));
  });

  test("the projection covers the causal chain with the 9 visual types (RQ-061)", () => {
    expect(VISUAL_TYPES).toEqual(["context", "demand", "capacity", "vulnerability", "risk", "event", "impact", "compensation", "evidence"]);
    const used = new Set(publicMap(graph).nodes.map((n) => visualType(n)));
    for (const t of ["demand", "capacity", "event", "impact", "compensation", "evidence"]) expect(used, t).toContain(t);
    // CF-16: evento operacional via tag, sem mudar o schema.
    for (const n of graph.nodes.filter((n) => n.type === "OPERATIONAL_IMPACT")) {
      expect(n.tags?.filter((t) => t === "stage:event" || t === "stage:impact").length, n.id).toBe(1);
    }
  });

  test("map edges carry semantics; inferred ones are dashed and labelled", () => {
    const { edges } = publicMap(graph);
    expect(edges.length).toBeGreaterThan(0);
    for (const e of edges) {
      const s = edgeSemantics(e)!;
      expect(s, e.id).not.toBeNull();
      if (e.epistemic.provenance_class === "E_INFERRED") expect(s, e.id).toMatchObject({ dashed: true, label: expect.stringMatching(/\(inferido\)$/) });
    }
    expect(graph.edges.filter((e) => e.type === "SUPPORTED_BY").every((e) => edgeSemantics(e) === null)).toBe(true);
  });
});

test.describe("where the graph lives (RQ-063…065)", () => {
  test("no Supabase dependency", () => {
    const pkg = JSON.parse(read("package.json"));
    const deps = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
    expect(deps.filter((d) => d.startsWith("@supabase/"))).toEqual([]);
  });
});
