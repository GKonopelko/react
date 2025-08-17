import { renderHook } from '@testing-library/react';
import { usePokemonSearch } from './usePokemonSearch';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { vi, describe, it, expect } from 'vitest';

const createMockQueryClient = () => {
  return {
    removeQueries: vi.fn(),
    getQueryData: vi.fn(),
    mount: vi.fn(),
    unmount: vi.fn(),
    isFetching: vi.fn(),
    getQueryState: vi.fn(),
    getQueriesData: vi.fn(),
    setQueryData: vi.fn(),
    setQueriesData: vi.fn(),
    invalidateQueries: vi.fn(),
    cancelQueries: vi.fn(),
    resetQueries: vi.fn(),
    fetchQuery: vi.fn(),
    prefetchQuery: vi.fn(),
    executeQuery: vi.fn(),
    ensureQueryData: vi.fn(),
    getDefaultOptions: vi.fn(),
    getQueryCache: vi.fn(),
    getMutationCache: vi.fn(),
    clear: vi.fn(),
    resumePausedMutations: vi.fn(),
  } as unknown as QueryClient;
};

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: vi.fn(),
}));

vi.mock('../utils/api', () => ({
  useSearchPokemon: () => ({
    mutateAsync: vi.fn(),
  }),
}));

vi.mock('../utils/store/errorStore', () => ({
  useErrorStore: () => ({
    setMainError: vi.fn(),
  }),
}));

describe('usePokemonSearch', () => {
  it('should clear search for empty query', async () => {
    const mockQueryClient = createMockQueryClient();
    vi.mocked(useQueryClient).mockReturnValue(mockQueryClient);

    const { result } = renderHook(() => usePokemonSearch());
    await result.current.handleSearch('');

    expect(mockQueryClient.removeQueries).toHaveBeenCalledWith({
      queryKey: ['pokemon'],
    });
  });

  it('should use cached data when available', async () => {
    const mockQueryClient = createMockQueryClient();
    vi.mocked(useQueryClient).mockReturnValue(mockQueryClient);
    vi.mocked(mockQueryClient.getQueryData).mockReturnValue({});

    const { result } = renderHook(() => usePokemonSearch());
    await result.current.handleSearch('pikachu');

    expect(mockQueryClient.getQueryData).toHaveBeenCalledWith([
      'pokemon',
      'pikachu',
    ]);
  });
});
