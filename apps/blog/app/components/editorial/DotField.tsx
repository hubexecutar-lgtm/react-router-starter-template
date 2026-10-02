// Halftone orgânico (ADR-12): grade de pontos cujo raio segue um ruído suave, como uma
// mancha que cresce e esvanece. Decorativo: aria-hidden, sem eventos, sem animação, sempre
// em área sem texto. Determinístico (semente fixa): o HTML do servidor e o do cliente batem.
import { useMemo } from "react";

import { cn } from "@/lib/utils";

type Fade = "left" | "right" | "up" | "down" | "none";

/** Hash inteiro → [0, 1). */
function hash(x: number, y: number, seed: number) {
  let h = (x * 374761393 + y * 668265263 + seed * 1442695041) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}
const smooth = (t: number) => t * t * (3 - 2 * t);

/** Ruído de valor 2D suavizado (bilinear com smoothstep). */
function noise(x: number, y: number, seed: number) {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const [tx, ty] = [smooth(x - xi), smooth(y - yi)];
  const a = hash(xi, yi, seed);
  const b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed);
  const d = hash(xi + 1, yi + 1, seed);
  return a + (b - a) * tx + (c - a) * ty + (a - b - c + d) * tx * ty;
}

export function dotField({ cols, rows, seed, fade }: { cols: number; rows: number; seed: number; fade: Fade }) {
  const dots: { cx: number; cy: number; r: number; faint: boolean }[] = [];
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      // two octaves: large organic blobs + small irregularity
      const n = 0.66 * noise(x / 7, y / 7, seed) + 0.34 * noise(x / 3, y / 3, seed + 7);
      const u = cols > 1 ? x / (cols - 1) : 0;
      const v = rows > 1 ? y / (rows - 1) : 0;
      const ramp = fade === "left" ? 1 - u : fade === "right" ? u : fade === "up" ? 1 - v : fade === "down" ? v : 1;
      const t = Math.max(0, Math.min(1, (n - 0.3) / 0.42));
      const level = t * t * (3 - 2 * t) * (0.15 + 0.85 * ramp);
      const r = Math.round(level * 9.6 * 100) / 100; // max radius 9.6 in a 20-unit cell
      if (r < 1.2) {
        dots.push({ cx: x * 20 + 10, cy: y * 20 + 10, r: 1.6, faint: true });
        continue;
      }
      dots.push({ cx: x * 20 + 10, cy: y * 20 + 10, r, faint: false });
    }
  }
  return dots;
}

export function DotField({
  cols = 24,
  rows = 16,
  seed = 7,
  fade = "right",
  className,
}: {
  cols?: number;
  rows?: number;
  seed?: number;
  fade?: Fade;
  className?: string;
}) {
  const dots = useMemo(() => dotField({ cols, rows, seed, fade }), [cols, rows, seed, fade]);
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      data-dot-field
      viewBox={`0 0 ${cols * 20} ${rows * 20}`}
      preserveAspectRatio="xMidYMid slice"
      className={cn("rc-dots pointer-events-none select-none", className)}
    >
      {dots.map((d, i) => (
        <circle key={i} cx={d.cx} cy={d.cy} r={d.r} className={d.faint ? "rc-dots__faint" : undefined} />
      ))}
    </svg>
  );
}
