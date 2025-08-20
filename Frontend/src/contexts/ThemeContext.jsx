import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

// Initialize theme immediately to prevent flash of incorrect theme
const initializeTheme = () => {
  const savedTheme = localStorage.getItem("theme") || "system";
  const html = document.querySelector("html");

  if (savedTheme === "system") {
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    html.setAttribute("data-theme", systemPrefersDark ? "dark" : "light");
  } else {
    html.setAttribute("data-theme", savedTheme);
  }

  return savedTheme;
};

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
    // Initialize theme from localStorage or default to "system"
    return initializeTheme();
  });

  // Apply theme to document
  useEffect(() => {
    const applyTheme = () => {
      const html = document.querySelector("html");

      if (theme === "system") {
        const systemPrefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        html.setAttribute("data-theme", systemPrefersDark ? "dark" : "light");
      } else {
        html.setAttribute("data-theme", theme);
      }
    };

    applyTheme();

    // Listen for system theme changes if theme is set to system
    if (theme === "system") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      mediaQuery.addEventListener("change", applyTheme);
      return () => mediaQuery.removeEventListener("change", applyTheme);
    }
  }, [theme]);

  // Change theme function
  const changeTheme = (newTheme) => {
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const value = {
    theme,
    changeTheme,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
