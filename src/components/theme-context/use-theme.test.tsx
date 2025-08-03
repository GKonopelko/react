import { renderHook, act } from '@testing-library/react';
import { ThemeProvider } from './theme-context-provider';
import { useTheme } from './use-theme';
import { expect, describe, it } from 'vitest';

describe('useTheme', () => {
  it('should return default context when used outside provider', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('light');
    expect(result.current.toggleTheme).toBeInstanceOf(Function);
  });

  it('should return provider context when used within provider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('light');
    expect(result.current.toggleTheme).toBeInstanceOf(Function);

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).toBe('dark');

    act(() => {
      result.current.toggleTheme();
    });
    expect(result.current.theme).toBe('light');
  });
});
