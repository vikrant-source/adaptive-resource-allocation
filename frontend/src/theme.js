// Theme management system
const THEME_KEY = "adaptive-scheduler-theme";

export const setTheme = (theme) => {
  if (theme === "light" || theme === "dark") {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_KEY, theme);
  }
};

export const getTheme = () => {
  const stored = localStorage.getItem(THEME_KEY);
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  return stored || (prefersDark ? "dark" : "light");
};

export const initTheme = () => {
  const theme = getTheme();
  setTheme(theme);
  return theme;
};

