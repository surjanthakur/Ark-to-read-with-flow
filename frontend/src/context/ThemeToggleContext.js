import { createContext, createElement, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [themeMode, setThemeMode] = useState(() => {
    try {
      return localStorage.getItem('lily_theme') === 'dark' ? 'dark' : 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', themeMode === 'dark');
    document.documentElement.style.colorScheme = themeMode;

    try {
      localStorage.setItem('lily_theme', themeMode);
    } catch {
      // Theme still works for this session when storage is unavailable.
    }
  }, [themeMode]);

  const value = {
    themeMode,
    lightTheme: () => setThemeMode('light'),
    darkTheme: () => setThemeMode('dark'),
  };

  return createElement(ThemeContext.Provider, { value }, children);
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
