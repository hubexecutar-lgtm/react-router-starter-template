import { defineConfig } from "@playwright/test";

// Prerendered build served by the Worker runtime (workerd) through `vite preview`.
export default defineConfig({
  testDir: "./tests",
  // O cérebro 3D precisa de WebGL: roda à parte em `npm run test:brain` (playwright.brain.config.ts).
  testIgnore: ["**/home-brain.spec.ts"],
  snapshotPathTemplate: "{testDir}/__screenshots__/{testFilePath}/{arg}{ext}",
  // stylePath: the sticky site header would otherwise be painted over element screenshots.
  expect: { toHaveScreenshot: { maxDiffPixelRatio: 0.01, stylePath: "./tests/screenshot.css" } },
  use: { baseURL: "http://localhost:4331" },
  webServer: {
    command: "npm run build && npx vite preview --port 4331",
    url: "http://localhost:4331/",
    reuseExistingServer: !process.env.CI,
    timeout: 300_000,
  },
});
