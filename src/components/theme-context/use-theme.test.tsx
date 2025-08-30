import { renderHook, act } from '@testing-library/react';
import { ThemeProvider } from './theme-context-provider';
import { useTheme } from './use-theme';
import { expect, describe, it, vi } from 'vitest';
import { useContext } from 'react';

vi.mock('react', async () => {
  const actual = await vi.importActual('react');
  return {
    ...actual,
    useContext: vi.fn(),
  };
});

describe('useTheme', () => {
  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return default context when used outside provider', () => {
    vi.mocked(useContext).mockReturnValue(undefined);

    const { result } = renderHook(() => useTheme());

    expect(result.current).toBeUndefined();
  });

  it('should return provider context when used within provider', () => {
    vi.mocked(useContext).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ThemeProvider>{children}</ThemeProvider>
    );

    const { result } = renderHook(() => useTheme(), { wrapper });

    expect(result.current.theme).toBe('light');
    expect(result.current.toggleTheme).toBeInstanceOf(Function);

    act(() => {
      result.current.toggleTheme();
    });

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });
});
