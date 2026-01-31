// theme.js - Theme and color logic
(function () {
  "use strict";
  const THEME_KEY = "theme";
  const html = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = document.getElementById("theme-icon");

  function applyTheme(theme) {
    if (theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    if (themeIcon)
      themeIcon.textContent = theme === "dark" ? "light_mode" : "dark_mode";
    if (themeToggle) themeToggle.setAttribute("aria-pressed", theme === "dark");
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta)
      meta.setAttribute("content", theme === "dark" ? "#101622" : "#ffffff");
  }

  function getSystemPrefersDark() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }

  function initTheme() {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "dark" || saved === "light") {
      applyTheme(saved);
    } else {
      applyTheme(getSystemPrefersDark() ? "dark" : "light");
    }
  }

  initTheme();

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const current = html.classList.contains("dark") ? "dark" : "light";
      const next = current === "dark" ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  if (window.matchMedia) {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", (e) => {
      if (!localStorage.getItem(THEME_KEY)) {
        applyTheme(e.matches ? "dark" : "light");
      }
    });
  }

  window.applyTheme = applyTheme;
})();
