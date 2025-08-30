import { renderHook } from '@testing-library/react';
import { useCacheStatus } from './useCacheStatus';
import {
  QueryClient,
  useQueryClient,
  type QueryState,
} from '@tanstack/react-query';
import { vi, describe, it, expect, type Mock } from 'vitest';

const createMockQueryClient = (getQueryStateMock: Mock) => {
  return {
    getQueryState: getQueryStateMock,
    mount: vi.fn(),
    unmount: vi.fn(),
    isFetching: vi.fn(),
    getQueryData: vi.fn(),
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
}));

describe('useCacheStatus', () => {
  it('should return status for empty query', () => {
    const mockQueryState: Partial<QueryState<unknown>> = {
      dataUpdatedAt: Date.now(),
    };
    const mockQueryClient = createMockQueryClient(
      vi.fn().mockReturnValue(mockQueryState)
    );
    (useQueryClient as Mock).mockReturnValue(mockQueryClient);

    const { result } = renderHook(() => useCacheStatus(''));

    expect(result.current.message).toContain('All Pokemons cached');
    expect(result.current.isFresh).toBe(true);
    expect(result.current.updatedAt).toBeDefined();
  });

  it('should return status for search query', () => {
    const mockQueryState: Partial<QueryState<unknown>> = {
      dataUpdatedAt: Date.now(),
    };
    const mockQueryClient = createMockQueryClient(
      vi.fn().mockReturnValue(mockQueryState)
    );
    (useQueryClient as Mock).mockReturnValue(mockQueryClient);

    const { result } = renderHook(() => useCacheStatus('pikachu'));

    expect(result.current.message).toContain('pikachu cached');
    expect(result.current.isFresh).toBe(true);
  });

  it('should return loading state when no cache', () => {
    const mockQueryClient = createMockQueryClient(
      vi.fn().mockReturnValue(undefined)
    );
    (useQueryClient as Mock).mockReturnValue(mockQueryClient);

    const { result } = renderHook(() => useCacheStatus('pikachu'));

    expect(result.current.message).toContain('Searching for pikachu');
    expect(result.current.isFresh).toBe(false);
  });
});
