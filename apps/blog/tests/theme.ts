import { expect, type Page } from "@playwright/test";

/**
 * Sets the site theme the way the app does (localStorage "theme", read by the bootstrap
 * script in app/root.tsx). Adding the `dark` class by hand is racy: the hydrated ThemeToggle
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

// Resolves any CSS colour (oklch included) to sRGB through a canvas and returns
// the WCAG contrast ratio between two computed colours.
export async function contrast(page: Page, fg: string, bg: string) {
  return page.evaluate(
    ([a, b]) => {
      const ctx = document.createElement("canvas").getContext("2d")!;
      const rgb = (c: string) => {
        ctx.clearRect(0, 0, 1, 1);
        ctx.fillStyle = c;
        ctx.fillRect(0, 0, 1, 1);
        return Array.from(ctx.getImageData(0, 0, 1, 1).data.slice(0, 3)).map((v) => {
          const s = v / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        });
      };
      const lum = (c: string) => {
        const [r, g, bl] = rgb(c);
        return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
      };
      const [x, y] = [lum(a), lum(b)];
      return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
    },
    [fg, bg],
  );
}

