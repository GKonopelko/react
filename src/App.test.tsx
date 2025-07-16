import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { App } from './App';

vi.mock('./components/main/main-logic', () => ({
  Main: ({
    error,
    onSearch,
    onMakeTestError,
  }: {
    error?: string;
    onSearch?: (query: string) => void;
    onMakeTestError?: () => void;
  }) => (
    <div>
      <div>test Main</div>
      {error && <div data-testid="error">{error}</div>}
      <button onClick={() => onSearch?.('pikachu')}>Search</button>
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

  it('should handle empty search', async () => {
    const mockPokemons = [{ name: 'pikachu', url: 'test-url' }];

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve({ results: mockPokemons, next: null }),
    } as Response);

    render(<App />);
  });

  it('should handle 404 error', async () => {
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

  it('should handle network error', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));
    render(<App />);
    await waitFor(() => {
      expect(screen.getByTestId('error')).toBeInTheDocument();
    });
  });
});
