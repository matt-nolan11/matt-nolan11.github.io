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
  
  if (controllers.length === 0) {
    console.warn("No theme controllers found");
    return;
  }

  // Helper to apply a theme and keep all checkboxes in sync.
  const applyTheme = (theme: string): void => {
    document.documentElement.setAttribute("data-theme", theme);
    controllers.forEach(cb => {
      cb.checked = cb.value === theme;
    });
  };

  // Initialise from localStorage (or fall back to "business").
  let savedTheme: string;
  try {
    savedTheme = localStorage.getItem("theme") ?? "business";
  } catch (error) {
    console.warn("localStorage not available, using default theme");
    savedTheme = "business";
  }
  
  applyTheme(savedTheme);

  // Listen for user changes.
  controllers.forEach(cb => {
    cb.addEventListener("change", () => {
      const newTheme = cb.checked ? cb.value : "business";
      try {
        localStorage.setItem("theme", newTheme);
      } catch (error) {
        console.warn("Could not save theme to localStorage");
      }
      applyTheme(newTheme);
    });
  });
}

/* ------------------------------------------------------------------ */
/*  Auto‑run when this module is executed in the browser environment. */
/* ------------------------------------------------------------------ */
if (typeof window !== "undefined") {
  // Try multiple times if DOM isn't ready yet
  const trySetup = () => {
    if (document.querySelector(".theme-controller")) {
      setupThemeController();
    } else {
      // Retry after a short delay if elements aren't found
      setTimeout(trySetup, 100);
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", trySetup);
  } else {
    trySetup();
  }
}