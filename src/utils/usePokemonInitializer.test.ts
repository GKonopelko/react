import { renderHook } from '@testing-library/react';
import { usePokemonInitializer } from './usePokemonInitializer';
import { vi, describe, it, expect, beforeEach } from 'vitest';

describe('usePokemonInitializer', () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'getItem');
  });

  it('should load saved query from localStorage', () => {
    const mockSearch = vi.fn();
    vi.mocked(localStorage.getItem).mockReturnValue('pikachu');

    const { result } = renderHook(() => usePokemonInitializer(mockSearch));
    result.current.loadInitialData();

    expect(localStorage.getItem).toHaveBeenCalledWith(
      'poke-monReactQueryContent'
    );
    expect(mockSearch).toHaveBeenCalledWith('pikachu');
  });

  it('should not search when no saved query', () => {
    const mockSearch = vi.fn();
    vi.mocked(localStorage.getItem).mockReturnValue('');

    const { result } = renderHook(() => usePokemonInitializer(mockSearch));
    result.current.loadInitialData();

    expect(mockSearch).not.toHaveBeenCalled();
  });
});
