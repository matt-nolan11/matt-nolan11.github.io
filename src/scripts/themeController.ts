/**
 * Theme controller logic for DaisyUI theme switching (TypeScript version).
 * Syncs all .theme-controller checkboxes and persists theme selection in localStorage.
 *
 * This file is intended to be imported by Astro components. The function
 * auto‑runs when loaded so you only need:
 *
 *   <script>
 *     import "../scripts/themeController.ts";
 *   </script>
 */

export function setupThemeController(): void {
  // Collect every checkbox that controls the theme.
  const controllers = document.querySelectorAll<HTMLInputElement>(".theme-controller");

  // Helper to apply a theme and keep all checkboxes in sync.
  const applyTheme = (theme: string): void => {
    // Add a brief moment for smooth transitions
    requestAnimationFrame(() => {
      document.documentElement.setAttribute("data-theme", theme);
      controllers.forEach(cb => {
        cb.checked = cb.value === theme;
      });
    });
  };

  // Initialise from localStorage (or fall back to "business" for dark mode default).
  let savedTheme: string;
  try {
    savedTheme = localStorage.getItem("theme") ?? "business";
  } catch (error) {
    savedTheme = "business";
  }
  
  applyTheme(savedTheme);

  // Listen for user changes.
  controllers.forEach(cb => {
    cb.addEventListener("change", () => {
      const newTheme = cb.checked ? cb.value : "corporate";
      try {
        localStorage.setItem("theme", newTheme);
      } catch (error) {
        // Silently fail if localStorage is not available
      }
      applyTheme(newTheme);
    });
  });
}

/* ------------------------------------------------------------------ */
/*  Auto‑run when this module is executed in the browser environment. */
/* ------------------------------------------------------------------ */
if (typeof window !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setupThemeController);
  } else {
    setupThemeController();
  }
}