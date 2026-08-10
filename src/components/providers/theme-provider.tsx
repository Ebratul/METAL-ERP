"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useStoredValue } from "@/lib/hooks/use-stored-state";

export type Theme = "dark" | "light";

const STORAGE_KEY = "smart-erp-theme";

/** The app is dark-first; this is what SSR renders. */
const DEFAULT_THEME: Theme = "dark";

function isTheme(value: string): value is Theme {
  return value === "dark" || value === "light";
}

interface ThemeContextValue {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Storage is read during render via useSyncExternalStore, not in an effect —
  // so there is no second render pass and no setState-in-effect.
  const [theme, setStoredTheme] = useStoredValue<Theme>(
    STORAGE_KEY,
    DEFAULT_THEME,
    isTheme,
  );

  // Stamping the DOM *is* the effect's job: synchronising React state out to an
  // external system. `<html data-theme>` is what the token layer reads.
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const setTheme = useCallback(
    (next: Theme) => {
      setStoredTheme(next);
    },
    [setStoredTheme],
  );

  const toggleTheme = useCallback(() => {
    setStoredTheme(theme === "dark" ? "light" : "dark");
  }, [theme, setStoredTheme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggleTheme }),
    [theme, setTheme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside <ThemeProvider>");
  }
  return context;
}
