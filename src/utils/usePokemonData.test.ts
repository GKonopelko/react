import { renderHook } from '@testing-library/react';
import { usePokemonDisplayData } from './usePokemonDisplayData';
import { QueryClient, useQueryClient } from '@tanstack/react-query';
import { vi, describe, it, expect, type Mock } from 'vitest';
import type { PokemonDetails } from '../pokemonTypes';

const createMockQueryClient = (getQueryDataMock: Mock) => {
  return {
    getQueryData: getQueryDataMock,
    mount: vi.fn(),
    unmount: vi.fn(),
    isFetching: vi.fn(),
    getQueryState: vi.fn(),
    getQueriesData: vi.fn(),
    setQueryData: vi.fn(),
    setQueriesData: vi.fn(),
    invalidateQueries: vi.fn(),
    cancelQueries: vi.fn(),
    removeQueries: vi.fn(),
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
  useQuery: vi.fn().mockReturnValue({ data: [], isLoading: false }),
}));

describe('usePokemonDisplayData', () => {
  it('should return all pokemons for empty query', () => {
    const mockQueryClient = createMockQueryClient(vi.fn());
    (useQueryClient as Mock).mockReturnValue(mockQueryClient);

    const { result } = renderHook(() => usePokemonDisplayData(''));

    expect(result.current.displayData).toEqual([]);
  });

  it('should return single pokemon for search query', () => {
    const mockPokemon: PokemonDetails = {
      id: 1,
      name: 'pikachu',
      sprites: { front_default: '' },
      height: 0,
      weight: 0,
      types: [],
      stats: [],
      abilities: [],
    };
    const mockQueryClient = createMockQueryClient(
      vi.fn().mockReturnValue(mockPokemon)
    );
    (useQueryClient as Mock).mockReturnValue(mockQueryClient);

    const { result } = renderHook(() => usePokemonDisplayData('pikachu'));

    expect(result.current.displayData).toEqual(mockPokemon);
  });
});
