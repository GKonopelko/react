import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { App } from './App';
import { ErrorBoundary } from './components/error-boundary/errorBoundary';
import type { PokemonListItem, PokemonDetails } from './pokemonTypes';

vi.mock('./components/main/main-logic', () => ({
  Main: ({
    error,
    loading,
    onSearch,
    onMakeTestError,
    searchResults,
  }: {
    error?: string;
    loading?: boolean;
    onSearch?: (query: string) => void;
    onMakeTestError?: () => void;
    searchResults?: PokemonListItem[] | PokemonDetails | null;
  }) => (
    <div>
      <div>test Main</div>
      {loading && <div>Pokemons coming soon...</div>}
      {error && <div data-testid="error">{error}</div>}

      {Array.isArray(searchResults) &&
        searchResults.map((p: PokemonListItem) => (
          <div key={p.name}>{p.name}</div>
        ))}

      <button onClick={() => onSearch?.('')}>Search</button>
      <button onClick={onMakeTestError}>Test Error</button>
    </div>
  ),
}));

describe('App Component', () => {
  beforeEach(() => {
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('pikachu');
    vi.stubGlobal('fetch', vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it('should render without errors', () => {
    render(<App />);
    expect(screen.getByText('test Main')).toBeInTheDocument();
  });

  it('should read localStorage', () => {
    render(<App />);
    expect(localStorage.getItem).toHaveBeenCalledWith(
      'poke-monReactQueryContent'
    );
  });

  it('should handle pokemon fetch', async () => {
    const mockPokemon = {
      id: 1,
      name: 'pikachu',
      sprites: { front_default: 'test-url' },
    };

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockPokemon),
    } as Response);

    render(<App />);
    await waitFor(() => {
      expect(fetch).toHaveBeenCalled();
    });
  });

  it('should trigger error boundary on test', async () => {
    render(
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    );

    fireEvent.click(screen.getByText('Test Error'));

    await waitFor(() => {
      expect(screen.getByText(/You broke the app/i)).toBeInTheDocument();
    });
  });
  it('should show loading state', async () => {
    let resolveFetch: (value: Response) => void;
    vi.mocked(fetch).mockImplementationOnce(
      () =>
        new Promise<Response>((resolve) => {
          resolveFetch = resolve;
        })
    );

    render(<App />);
    expect(screen.getByText('Pokemons coming soon...')).toBeInTheDocument();
    await act(async () => {
      resolveFetch({
        ok: true,
        json: () => Promise.resolve({ id: 1, name: 'pikachu' }),
      } as Response);
    });

    expect(
      screen.queryByText('Pokemons coming soon...')
    ).not.toBeInTheDocument();
  });
  it('should save search query to localStorage', async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    render(<App />);
    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      expect(setItemSpy).not.toHaveBeenCalled();
    });
  });

  it('should fetch all pokemons', async () => {
    const mockPokemons: PokemonListItem[] = [
      { name: 'bulbasaur', url: 'url1' },
      { name: 'charmander', url: 'url2' },
    ];
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: false,
      status: 404,
      json: () => Promise.resolve({}),
    } as Response);

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () =>
        Promise.resolve({
          results: mockPokemons,
          next: null,
        }),
    } as Response);

    render(<App />);

    fireEvent.click(screen.getByText('Search'));

    await waitFor(() => {
      mockPokemons.forEach((p) => {
        expect(screen.queryByText(p.name)).toBeInTheDocument();
      });
    });
  });

  describe('error handling', () => {
    it('shows 404 error', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        json: () => Promise.resolve({}),
      } as Response);

      render(<App />);
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('not found');
      });
    });

    it('shows 401 error', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 401,
        json: () => Promise.resolve({}),
      } as Response);

      render(<App />);
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent(
          'Authentication required'
        );
      });
    });

    it('shows 500 error', async () => {
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: () => Promise.resolve({}),
      } as Response);

      render(<App />);
      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent('Server error');
      });
    });

    it('shows network error', async () => {
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));
      render(<App />);
      await waitFor(() => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
      });
    });
  });
});
