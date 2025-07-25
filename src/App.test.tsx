import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { App } from './App';
import { render, screen, fireEvent, waitFor } from '../tests/test-utils';
import { createPokemonList, createPokemonDetails } from '../tests/mocks';

vi.mock('./components/loader/loader', () => ({
  Loader: () => <div>Pokemons coming soon...</div>,
}));

vi.mock('./components/error-message/error-message', () => ({
  ErrorMessage: ({ error }: { error: string }) => (
    <div data-testid="error">{error}</div>
  ),
}));

vi.mock('./components/results/results', () => ({
  Results: () => <div>Results component</div>,
}));

describe('App Component', () => {
  beforeEach(() => {
    global.fetch = vi.fn().mockImplementation((url) => {
      if (url.includes('pokemon?limit=500')) {
        return Promise.resolve({
          ok: true,
          json: async () => createPokemonList(1),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => createPokemonDetails(25),
      });
    });
    vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('pikachu');
  });

  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('should render without errors', () => {
    render(<App />);
    expect(screen.getByText('Poke-monReact')).toBeInTheDocument();
  });

  describe('Search functionality', () => {
    it('should save search query to localStorage', async () => {
      const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');
      render(<App />);

      const input = screen.getByPlaceholderText('Enter pokemon name or id');
      const button = screen.getByRole('button', { name: /search pokemon/i });

      fireEvent.change(input, { target: { value: 'pikachu' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(setItemSpy).toHaveBeenCalledWith(
          'poke-monReactQueryContent',
          'pikachu'
        );
      });
    });

    it('should perform API call with search input', async () => {
      render(<App />);

      const input = screen.getByPlaceholderText('Enter pokemon name or id');
      const button = screen.getByRole('button', { name: /search pokemon/i });

      fireEvent.change(input, { target: { value: 'pikachu' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'https://pokeapi.co/api/v2/pokemon/pikachu'
        );
      });
    });

    it('should show loading state during search', async () => {
      global.fetch = vi
        .fn()
        .mockImplementationOnce(() => new Promise(() => {}));
      render(<App />);

      const input = screen.getByPlaceholderText('Enter pokemon name or id');
      const button = screen.getByRole('button', { name: /search pokemon/i });

      fireEvent.change(input, { target: { value: 'pikachu' } });
      fireEvent.click(button);

      expect(screen.getByText('Pokemons coming soon...')).toBeInTheDocument();
    });
  });

  describe('Initial data loading', () => {
    it('should load all pokemons when no saved query', async () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('');
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => createPokemonList(10),
      });

      render(<App />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledWith(
          'https://pokeapi.co/api/v2/pokemon?limit=500'
        );
      });
    });

    it('should handle pagination when loading all pokemons', async () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('');

      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            ...createPokemonList(20),
            next: 'https://pokeapi.co/api/v2/pokemon?offset=20',
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => createPokemonList(10),
        });

      render(<App />);

      await waitFor(() => {
        expect(global.fetch).toHaveBeenCalledTimes(2);
      });
    });
  });

  describe('Results display', () => {
    it('should display single pokemon result', async () => {
      render(<App />);

      const input = screen.getByPlaceholderText('Enter pokemon name or id');
      const button = screen.getByRole('button', { name: /search pokemon/i });

      fireEvent.change(input, { target: { value: 'pikachu' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByText('Results component')).toBeInTheDocument();
      });
    });

    it('should display pokemon list when search is empty', async () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('');
      global.fetch = vi.fn().mockResolvedValueOnce({
        ok: true,
        json: async () => createPokemonList(5),
      });

      render(<App />);

      await waitFor(() => {
        expect(screen.getByText('Results component')).toBeInTheDocument();
      });
    });
  });

  describe('Error handling', () => {
    it('should show 404 error for non-existent pokemon', async () => {
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => createPokemonList(1),
        })
        .mockResolvedValueOnce({
          ok: false,
          status: 404,
          json: async () => ({}),
        });

      render(<App />);

      fireEvent.change(
        screen.getByPlaceholderText('Enter pokemon name or id'),
        { target: { value: 'missingno' } }
      );
      fireEvent.click(screen.getByRole('button', { name: /search pokemon/i }));

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent(
          'Pokemon "missingno" not found'
        );
      });
    });

    it('should maintain search input after error', async () => {
      global.fetch = vi.fn().mockRejectedValueOnce(new Error('Test error'));
      render(<App />);

      const input = screen.getByPlaceholderText('Enter pokemon name or id');
      fireEvent.change(input, { target: { value: 'pikachu' } });
      fireEvent.click(screen.getByRole('button', { name: /search pokemon/i }));

      await waitFor(() => {
        expect(input).toHaveValue('pikachu');
      });
    });
  });
});
