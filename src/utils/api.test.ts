import { vi, describe, it, expect, beforeEach } from 'vitest';
import {
  searchPokemon,
  fetchPokemonDetails,
  fetchPokemonDetailsByUrl,
  useSearchPokemon,
  useFetchAllPokemons,
  useFetchPokemonDetails,
  useFetchPokemonDetailsByUrl,
} from './api';
import {
  act,
  renderHook,
  waitFor,
  mockFetchResponse,
  mockFetchError,
  mockFetchNetworkError,
} from '../../tests/test-utils';
import { useErrorStore } from './store/errorStore';
import { createPokemonDetails, createPokemonList } from '../../tests/mocks';
import { BASE_URL, createWrapper } from '../../tests/test-utils';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('API Functions', () => {
  beforeEach(() => {
    mockFetch.mockClear();
    useErrorStore.setState({
      mainError: null,
      setMainError: vi.fn(),
      dismissError: vi.fn(),
    });
  });

  describe('useFetchAllPokemons', () => {
    it('should handle error', async () => {
      mockFetch.mockImplementationOnce(() =>
        mockFetchError(new Error('Failed to fetch pokemons'))
      );

      renderHook(() => useFetchAllPokemons(), {
        wrapper: createWrapper(),
      });

      await waitFor(() => {
        expect(useErrorStore.getState().setMainError).toHaveBeenCalledWith(
          'Failed to fetch pokemons'
        );
      });
    });
  });

  describe('searchPokemon', () => {
    it('should fetch pokemon by name', async () => {
      const mockPokemon = createPokemonDetails(1);
      mockFetch.mockResolvedValueOnce(mockFetchResponse(mockPokemon));

      const result = await searchPokemon('pikachu');
      expect(result).toEqual(mockPokemon);
      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/pikachu`);
    });

    it('should throw not found error', async () => {
      mockFetch.mockResolvedValueOnce(mockFetchNetworkError(404));

      await expect(searchPokemon('unknown')).rejects.toThrow(
        'Pokemon "unknown" not found'
      );
    });

    it('should throw server error', async () => {
      mockFetch.mockResolvedValueOnce(mockFetchNetworkError(500));

      await expect(searchPokemon('pikachu')).rejects.toThrow('Server error');
    });

    it('should throw auth error', async () => {
      mockFetch.mockResolvedValueOnce(mockFetchNetworkError(401));

      await expect(searchPokemon('pikachu')).rejects.toThrow(
        'Authentication required'
      );
    });
  });

  describe('fetchPokemonDetails', () => {
    it('should fetch pokemon details by id', async () => {
      const mockPokemon = createPokemonDetails(1);
      mockFetch.mockResolvedValueOnce(mockFetchResponse(mockPokemon));

      const result = await fetchPokemonDetails('1');
      expect(result).toEqual(mockPokemon);
      expect(mockFetch).toHaveBeenCalledWith(`${BASE_URL}/1`);
    });

    it('should throw error for invalid id', async () => {
      await expect(fetchPokemonDetails('invalid')).rejects.toThrow(
        'Invalid Pokemon ID'
      );
    });

    it('should throw error when pokemon not found', async () => {
      mockFetch.mockResolvedValueOnce(mockFetchNetworkError(404));

      await expect(fetchPokemonDetails('999')).rejects.toThrow(
        'Pokemon not found'
      );
    });
  });

  describe('fetchPokemonDetailsByUrl', () => {
    it('should fetch pokemon details by url', async () => {
      const mockPokemon = createPokemonDetails(1);
      mockFetch.mockResolvedValueOnce(mockFetchResponse(mockPokemon));

      const result = await fetchPokemonDetailsByUrl(`${BASE_URL}/1`);
      expect(result).toEqual(mockPokemon);
    });

    it('should return null when fetch fails', async () => {
      mockFetch.mockResolvedValueOnce(mockFetchNetworkError(404));

      const result = await fetchPokemonDetailsByUrl(`${BASE_URL}/999`);
      expect(result).toBeNull();
    });
  });

  describe('API Hooks', () => {
    beforeEach(() => {
      useErrorStore.setState({
        mainError: null,
        setMainError: vi.fn(),
        dismissError: vi.fn(),
      });
    });

    describe('useSearchPokemon', () => {
      it('should call searchPokemon and set query data on success', async () => {
        const mockPokemon = createPokemonDetails(1);
        mockFetch.mockResolvedValueOnce(mockFetchResponse(mockPokemon));

        const { result } = renderHook(() => useSearchPokemon(), {
          wrapper: createWrapper(),
        });

        await act(async () => {
          await result.current.mutateAsync('pikachu');
        });

        await waitFor(() => {
          expect(result.current.data).toEqual(mockPokemon);
        });
      });

      it('should call setMainError on failure', async () => {
        mockFetch.mockResolvedValueOnce(mockFetchNetworkError(404));

        const { result } = renderHook(() => useSearchPokemon(), {
          wrapper: createWrapper(),
        });

        try {
          await result.current.mutateAsync('unknown');
        } catch {
          expect(useErrorStore.getState().setMainError).toHaveBeenCalledWith(
            'Pokemon "unknown" not found'
          );
        }
      });
    });

    describe('useFetchAllPokemons', () => {
      it('should fetch all pokemons', async () => {
        const mockPokemons = createPokemonList(1).results;
        mockFetch.mockResolvedValueOnce(
          mockFetchResponse({ results: mockPokemons, next: null })
        );

        const { result } = renderHook(() => useFetchAllPokemons(), {
          wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockPokemons);
      });

      it('should handle error', async () => {
        mockFetch.mockImplementationOnce(() =>
          mockFetchError(new Error('Failed to fetch pokemons'))
        );

        renderHook(() => useFetchAllPokemons(), {
          wrapper: createWrapper(),
        });

        await waitFor(() => {
          expect(useErrorStore.getState().setMainError).toHaveBeenCalledWith(
            'Failed to fetch pokemons'
          );
        });
      });
    });

    describe('useFetchPokemonDetails', () => {
      it('should fetch pokemon details when enabled', async () => {
        const mockPokemon = createPokemonDetails(1);
        mockFetch.mockResolvedValueOnce(mockFetchResponse(mockPokemon));

        const { result } = renderHook(() => useFetchPokemonDetails('1'), {
          wrapper: createWrapper(),
        });

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockPokemon);
      });

      it('should not fetch when id is empty', async () => {
        const { result } = renderHook(() => useFetchPokemonDetails(''), {
          wrapper: createWrapper(),
        });

        expect(result.current.isFetching).toBe(false);
      });
    });

    describe('useFetchPokemonDetailsByUrl', () => {
      it('should fetch pokemon details by url when enabled', async () => {
        const mockPokemon = createPokemonDetails(1);
        mockFetch.mockResolvedValueOnce(mockFetchResponse(mockPokemon));

        const { result } = renderHook(
          () => useFetchPokemonDetailsByUrl(`${BASE_URL}/1`),
          { wrapper: createWrapper() }
        );

        await waitFor(() => expect(result.current.isSuccess).toBe(true));

        expect(result.current.data).toEqual(mockPokemon);
      });

      it('should not fetch when url is empty', async () => {
        const { result } = renderHook(() => useFetchPokemonDetailsByUrl(''), {
          wrapper: createWrapper(),
        });

        expect(result.current.isFetching).toBe(false);
      });
    });
  });
});
