// HOME-BRAIN-001: o gate do cérebro 3D. Mesma base do playwright.config.ts, com WebGL por software (SwiftShader) só
// no Chromium de teste, um worker e build próprio na porta 4332 (não disputa o servidor do `npm test`).
import { defineConfig } from "@playwright/test";

import base from "./playwright.config";

export default defineConfig({
	...base,
	testIgnore: [],
	testMatch: ["**/home-brain.spec.ts"],
	workers: 1,
	timeout: 90_000,
	use: {
		...base.use,
		baseURL: "http://127.0.0.1:4332",
		launchOptions: { args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] },
	},
	webServer: {
		command: "npm run build && npx vite preview --host 127.0.0.1 --port 4332 --strictPort",
		url: "http://127.0.0.1:4332/",
		reuseExistingServer: !process.env.CI,
		timeout: 300_000,
	},
});
