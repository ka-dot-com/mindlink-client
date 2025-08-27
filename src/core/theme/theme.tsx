import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { Appearance, ColorSchemeName } from 'react-native';
import { loadJSON, saveJSON } from '../storage/async';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  colorScheme: ColorSchemeName;
  isDark: boolean;
}

const THEME_KEY = 'theme_mode_v1';
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<ThemeMode>('system');
  const [systemScheme, setSystemScheme] = useState<ColorSchemeName>(Appearance.getColorScheme());

  useEffect(() => {
    (async () => {
      const saved = await loadJSON<ThemeMode | null>(THEME_KEY, null);
      if (saved) setModeState(saved);
    })();
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      setSystemScheme(colorScheme);
    });
    return () => listener.remove();
  }, []);

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    saveJSON(THEME_KEY, m);
  };

  const colorScheme = mode === 'system' ? systemScheme : mode;
  const isDark = colorScheme === 'dark';

  return (
    <ThemeContext.Provider value={{ mode, setMode, colorScheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export function useThemeMode() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used inside ThemeProvider');
  return ctx;
}