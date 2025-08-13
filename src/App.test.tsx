import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { App } from './App';
import { render, screen, fireEvent, waitFor } from '../tests/test-utils';
import { createPokemonList, createPokemonDetails } from '../tests/mocks';
import { act } from '@testing-library/react';

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

describe.skip('App Component', () => {
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
    localStorage.clear();
  });

  it('should render without errors', async () => {
    await act(async () => {
      render(<App />);
    });
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
        .mockImplementationOnce(() =>
          Promise.resolve({
            ok: true,
            json: async () => createPokemonList(1),
          })
        )
        .mockImplementationOnce(
          () =>
            new Promise((resolve) => {
              setTimeout(() => {
                resolve({
                  ok: true,
                  json: async () => createPokemonDetails(25),
                });
              }, 100);
            })
        );

      render(<App />);

      const input = screen.getByPlaceholderText('Enter pokemon name or id');
      const button = screen.getByRole('button', { name: /search pokemon/i });

      fireEvent.change(input, { target: { value: 'pikachu' } });
      fireEvent.click(button);

      expect(screen.getByText('Pokemons coming soon...')).toBeInTheDocument();

      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 200));
      });
    });
  });

  describe('Initial data loading', () => {
    it('should make initial API call when no saved query', async () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('');

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ results: [], next: null }),
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

      expect(global.fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?limit=500'
      );
      expect(global.fetch).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon?offset=20'
      );
    });
  });

  describe('Results display', () => {
    it.skip('should display pokemon list when search is empty', async () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue('');

      global.fetch = vi.fn().mockImplementation((url) => {
        if (url.includes('pokemon?limit=500')) {
          return Promise.resolve({
            ok: true,
            json: async () => createPokemonList(2),
          });
        }

        return Promise.resolve({
          ok: true,
          json: async () => createPokemonDetails(1),
        });
      });

      render(<App />);

      await waitFor(() => {
        expect(
          screen.queryByText('Pokemons coming soon...')
        ).not.toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Results component')).toBeInTheDocument();
      });
      expect(screen.queryByTestId('error')).not.toBeInTheDocument();
    });
    it('should display single pokemon result', async () => {
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => createPokemonList(1),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => createPokemonDetails(25),
        });

      render(<App />);

      await waitFor(() => {
        expect(screen.queryByTestId('error')).not.toBeInTheDocument();
      });
    });
  });

  describe('Error handling', () => {
    it.skip('should show 404 error for non-existent pokemon', async () => {
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

      const input = screen.getByPlaceholderText('Enter pokemon name or id');
      const button = screen.getByRole('button', { name: /search pokemon/i });

      fireEvent.change(input, { target: { value: 'missingno' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(screen.getByTestId('error')).toHaveTextContent(
          'Pokemon "missingno" not found'
        );
      });
    });

    it('should maintain search input after error', async () => {
      global.fetch = vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: async () => createPokemonList(1),
        })
        .mockRejectedValueOnce(new Error('Test error'));

      render(<App />);

      const input = screen.getByPlaceholderText('Enter pokemon name or id');
      const button = screen.getByRole('button', { name: /search pokemon/i });

      fireEvent.change(input, { target: { value: 'pikachu' } });
      fireEvent.click(button);

      await waitFor(() => {
        expect(input).toHaveValue('pikachu');
      });
    });
  });
});
