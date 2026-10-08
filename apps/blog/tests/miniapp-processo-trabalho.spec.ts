import { expect, test } from "@playwright/test";

test("mini app renders process and generates a local QR", async ({ page }) => {
  await page.goto("/ferramentas/processo-de-trabalho/");
  await page.getByRole("button", { name: "Criar plano" }).click();
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Continuar" }).click();
  await page.getByRole("button", { name: "Ver plano" }).click();
  await expect(page.getByRole("heading", { name: "Revise seu plano" })).toBeVisible();

  await page.getByRole("button", { name: "Prisma", exact: true }).click();
  await page.getByLabel("URL para QR (opcional)").fill("https://example.com/plan");
  await expect(page.locator(".miniapp-sheet.prisma img[alt='QR gerado localmente']")).toBeVisible();

  await page.emulateMedia({ media: "print" });
  await expect(page.locator(".miniapp-sheet")).toBeVisible();
  await expect(page.locator("[data-print] > .miniapp-panel")).toBeHidden();
});
