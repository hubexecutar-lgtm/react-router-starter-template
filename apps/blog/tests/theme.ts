import { expect, type Page } from "@playwright/test";

/**
 * Sets the site theme the way the app does (localStorage "theme", read by the bootstrap
 * script in BaseHead). Adding the `dark` class by hand is racy: the hydrated ThemeToggle
 * re-syncs the class to the saved theme and removes it. Call BEFORE page.goto().
 */
export async function useTheme(page: Page, theme: "light" | "dark") {
  await page.addInitScript((t) => localStorage.setItem("theme", t), theme);
}

/** Waits until the theme is applied AND stable (survives the toggle's hydration). */
export async function expectTheme(page: Page, theme: "light" | "dark") {
  const html = page.locator("html");
  await page.waitForLoadState("networkidle");
  if (theme === "dark") await expect(html).toHaveClass(/(^|\s)dark(\s|$)/);
  else await expect(html).not.toHaveClass(/(^|\s)dark(\s|$)/);
}
