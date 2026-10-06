// Alternância de tema do cabeçalho, na pele do RC-DS-CF (`ds-iconbtn`, DS-CF-001-prisma §2.7). O comportamento não
// muda: lê `localStorage.theme` ou a preferência do sistema e alterna a classe `dark` no <html>.
import { useEffect, useState } from "react";

import { Moon, Sun } from "lucide-react";

const ThemeToggle = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  useEffect(() => {
    // Get initial theme from localStorage or system preference
    const savedTheme = localStorage.getItem("theme");
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    const initialTheme = savedTheme || systemTheme;

    setTheme(initialTheme as "light" | "dark");
    document.documentElement.classList.toggle("dark", initialTheme === "dark");
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <button type="button" className="ds-iconbtn" onClick={toggleTheme}>
      <Sun className="scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" aria-hidden="true" />
      <Moon className="absolute scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" aria-hidden="true" />
      <span className="sr-only">Alternar tema claro/escuro</span>
    </button>
  );
};

export { ThemeToggle };
