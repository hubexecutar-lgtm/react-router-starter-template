import { readFile } from "node:fs/promises";
import { expect, test } from "@playwright/test";

test("intake salva campos do contrato e gera Prisma e QR local", async ({ page }) => {
  await page.goto("/ferramentas/processo-de-trabalho/");
  await page.getByRole("button", { name: "Iniciar" }).click();
  await page.getByLabel("Título (opcional)").fill("Plano de estudo");
  await page.getByRole("button", { name: "Projeto" }).click();
  await page.getByRole("button", { name: "Continuar" }).click();

  await page.getByRole("button", { name: "Personalizar" }).first().click();
  await page.getByLabel("Início").fill("09:00");
  await page.getByLabel("Fim").fill("10:00");
  await page.getByRole("button", { name: "Seg" }).click();
  await page.getByLabel("Duração estimada").selectOption("180");
  await page.getByLabel("Minutos (1 a 1440)").fill("45");
  await page.getByRole("button", { name: "Continuar" }).click();

  await page.getByLabel("O que você quer concluir?").fill("Concluir o módulo inicial");
  await page.getByLabel("Link para QR (opcional)").fill("https://example.com/plan");
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("textbox", { name: "Ação 1" }).fill("Ler o material");
  await page.getByLabel("Estado da ação 1").selectOption("accepted");
  await page.getByRole("button", { name: "Ver plano" }).click();
  await expect(page.getByRole("heading", { name: "Revise seu plano" })).toBeVisible();

  await page.getByRole("button", { name: "Prisma", exact: true }).click();
  await expect(page.locator(".miniapp-sheet.prisma img[alt='QR gerado localmente']")).toBeVisible();
  await expect(page.locator(".miniapp-sheet.prisma")).toContainText("Concluir o módulo inicial");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("button", { name: "Baixar JSON" }).click();
  const download = await downloadPromise;
  const path = await download.path();
  expect(path).toBeTruthy();
  const payload = JSON.parse(await readFile(path!, "utf8"));
  expect(payload.schema_version).toBe("1.0.0");
  expect(payload.work.type).toBe("project");
  expect(payload.routine.exact_start).toBe("09:00");
  expect(payload.routine.days).toContain("mon");
  expect(payload.routine.duration_minutes).toBe(45);
  expect(payload.actions[0].state).toBe("accepted");
  expect(payload.qr.url).toBe("https://example.com/plan");

  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".miniapp-sheet.prisma")).toBeVisible();
  await expect(page.locator("[data-print] > .miniapp-panel")).toBeHidden();
});


test("exemplo embutido carrega como demonstração e baixa o JSON pronto", async ({ page }) => {
  await page.goto("/ferramentas/processo-de-trabalho/");

  const downloadPromise = page.waitForEvent("download");
  await page.getByRole("link", { name: "Baixar JSON do exemplo" }).click();
  const download = await downloadPromise;
  expect(download.suggestedFilename()).toBe("exemplo-miniapp-plan-v1.json");
  const downloadPath = await download.path();
  const downloaded = JSON.parse(await readFile(downloadPath!, "utf8"));
  expect(downloaded.mode).toBe("demo");
  expect(downloaded.metadata.source_kind).toBe("demo_fixture");
  expect(downloaded.work.title).toBe("Implantar rotina semanal do projeto");
  expect(downloaded.actions).toHaveLength(4);

  await page.getByRole("button", { name: "Ver exemplo preenchido" }).click();
  await expect(page.locator(".miniapp-sheet header small")).toHaveText("EXECUTAR · DEMONSTRAÇÃO");
  await expect(page.locator(".miniapp-sheet")).toContainText("Concluir e revisar a primeira entrega do projeto nesta semana.");
  await expect(page.locator(".miniapp-sheet img[alt='QR gerado localmente']")).toBeVisible();
});
