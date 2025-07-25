import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { App } from './App';
import { render, screen, fireEvent, waitFor } from '../tests/test-utils';

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
          json: async () => ({
            results: [{ name: 'bulbasaur', url: 'url1' }],
            next: null,
          }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: async () => ({
          name: 'pikachu',
          id: 25,
          sprites: { front_default: 'image-url' },
        }),
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

  it('should save search query to localStorage on search', async () => {
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

  it('should perform a fetch call with the search input', async () => {
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

  it('should show loading state', async () => {
    global.fetch = vi.fn().mockImplementationOnce(() => new Promise(() => {}));

    render(<App />);

    const input = screen.getByPlaceholderText('Enter pokemon name or id');
    const button = screen.getByRole('button', { name: /search pokemon/i });

    fireEvent.change(input, { target: { value: 'pikachu' } });
    fireEvent.click(button);
    expect(screen.getByText('Pokemons coming soon...')).toBeInTheDocument();
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
