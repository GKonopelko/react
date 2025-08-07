import type { UseQueryResult } from '@tanstack/react-query';

export const createPokemonList = (count: number) => ({
  results: Array(count)
    .fill(0)
    .map((_, i) => ({
      name: `pokemon-${i}`,
      url: `url-${i}`,
    })),
  next: null,
});

export const createPokemonDetails = (id: number) => ({
  id,
  name: `pokemon-${id}`,
  sprites: {
    front_default: `image-${id}.png`,
  },
  height: 10,
  weight: 100,
  types: [
    {
      type: {
        name: 'electric',
      },
    },
  ],
  stats: [
    {
      base_stat: 55,
      stat: {
        name: 'hp',
      },
    },
  ],
});

export const mockRouter = {
  useParams: vi.fn(() => ({})),
  useNavigate: vi.fn(() => vi.fn()),
  useLocation: vi.fn(() => ({
    pathname: '/',
    search: '?test=1',
    hash: '',
    state: null,
    key: 'default',
  })),
  useSearchParams: vi.fn(() => [new URLSearchParams('page=1'), vi.fn()]),
};

export const mockQueryResult = <T, E = Error>(
  overrides: Partial<UseQueryResult<T, E>> = {}
): UseQueryResult<T, E> => {
  const baseResult = {
    data: undefined,
    error: null,
    isError: false,
    isPending: false,
    isLoading: false,
    isSuccess: false,
    isFetching: false,
    isLoadingError: false,
    isRefetchError: false,
    isPaused: false,
    status: 'pending' as const,
    fetchStatus: 'idle' as const,
    failureCount: 0,
    failureReason: null,
    errorUpdateCount: 0,
    isFetched: false,
    isFetchedAfterMount: false,
    isInitialLoading: false,
    isPlaceholderData: false,
    isRefetching: false,
    isStale: false,
    refetch: vi.fn().mockResolvedValue({}),
  };

  return {
    ...baseResult,
    ...overrides,
  } as UseQueryResult<T, E>;
};
