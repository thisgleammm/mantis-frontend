import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  isDark: boolean;
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * ThemeProvider component that manages the application's theme state globally.
 * Defaults to 'light' mode and persists preference to localStorage.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");

  const applyThemeToDocument = useCallback((t: Theme) => {
    if (typeof document !== "undefined") {
      document.documentElement.classList.remove("light", "dark");
      document.documentElement.classList.add(t);
      document.documentElement.setAttribute("data-theme", t);
    }
  }, []);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    applyThemeToDocument(newTheme);
    window.dispatchEvent(new Event("themechange"));
  }, [applyThemeToDocument]);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "light" ? "dark" : "light");
  }, [theme, setTheme]);

  // Initial sync with localStorage or system preference on mount
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    let initialTheme: Theme = "light";

    if (savedTheme) {
      initialTheme = savedTheme;
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      initialTheme = "dark";
    }

    setThemeState(initialTheme);
    applyThemeToDocument(initialTheme);
  }, [applyThemeToDocument]);

  // Synchronize theme across different tabs and instances
  useEffect(() => {
    const syncTheme = () => {
      const current = (localStorage.getItem("theme") as Theme) || "light";
      if (current !== theme) {
        setThemeState(current);
        applyThemeToDocument(current);
      }
    };

    window.addEventListener("themechange", syncTheme);
    window.addEventListener("storage", syncTheme);
    
    return () => {
      window.removeEventListener("themechange", syncTheme);
      window.removeEventListener("storage", syncTheme);
    };
  }, [theme, applyThemeToDocument]);

  const value = React.useMemo(() => ({
    isDark: theme === "dark",
    theme,
    toggleTheme,
    setTheme,
  }), [theme, toggleTheme, setTheme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * Hook to access the theme context.
 * Provides isDark, theme, toggleTheme, and setTheme.
 */
export function useTheme() {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    // Fallback default for components rendered outside Provider (e.g. during early hydration)
    return {
      isDark: false,
      theme: "light" as Theme,
      toggleTheme: () => {},
      setTheme: () => {},
    };
  }
  
  return context;
}
