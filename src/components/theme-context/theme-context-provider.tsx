import { useState, type ReactNode } from 'react';
import { ThemeContext } from './theme-context';
import type { Theme } from './theme-context';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext value={{ theme, toggleTheme }}>
      <div className="theme-root" data-theme={theme}>
        {children}
      </div>
    </ThemeContext>
  );
}
