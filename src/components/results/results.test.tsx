import { vi } from 'vitest';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: vi.fn(),
    useSearchParams: vi.fn(() => [new URLSearchParams('page=1'), vi.fn()]),
  };
});

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../tests/test-utils';
import { Results } from './results';
import { createPokemonDetails, createPokemonList } from '../../../tests/mocks';
import type { PokemonDetails, PokemonListItem } from '../../pokemonTypes';
import { useNavigate, useSearchParams } from 'react-router-dom';

const mockResponse = (data: unknown) =>
  ({
    ok: true,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  }) as Response;

describe.skip('Results Component', () => {
  const mockPokemonDetails: PokemonDetails = {
    ...createPokemonDetails(1),
    name: 'bulbasaur',
    abilities: [],
  };

  const mockPokemonItem: PokemonListItem = {
    name: 'bulbasaur',
    url: 'https://pokeapi.co/api/v2/pokemon/1/',
  };

  beforeEach(() => {
    const mockScrollTo = vi.fn();
    Element.prototype.scrollTo = mockScrollTo;

    global.fetch = vi.fn((url) => {
      const urlString = url.toString();
      return Promise.resolve(
        urlString.includes('pokemon/1')
          ? mockResponse(mockPokemonDetails)
          : mockResponse(createPokemonList(10))
      );
    });

    vi.mocked(useNavigate).mockReturnValue(vi.fn());
  });

  it('renders "No Pokemons" when resultPokemons is null', () => {
    render(<Results resultPokemons={null} />);
    expect(screen.getByText('No Pokemons :(')).toBeInTheDocument();
  });

  it('shows loading state and renders pokemon list', async () => {
    render(<Results resultPokemons={[mockPokemonItem]} />);
    expect(screen.getByText('Loading pokemon details...')).toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByText('bulbasaur')).toBeInTheDocument()
    );
  });

  it('renders single pokemon details', () => {
    render(<Results resultPokemons={mockPokemonDetails} />);
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
  });

  it('shows pagination for multiple pages', async () => {
    const mockList = Array.from({ length: 15 }, (_, i) => ({
      name: `pokemon-${i}`,
      url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
    }));
    global.fetch = vi.fn((url) => {
      const id = parseInt(url.toString().split('/').slice(-2, -1)[0]);
      return Promise.resolve(mockResponse(createPokemonDetails(id)));
    });

    render(<Results resultPokemons={mockList} cardsPerPage={5} />);

    await waitFor(() => {
      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
      expect(screen.getByText('Next')).toBeInTheDocument();
    });
  });

  it('navigates on pokemon click', async () => {
    const navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);

    render(<Results resultPokemons={[mockPokemonItem]} />);
    await waitFor(() => {
      fireEvent.click(screen.getByText('bulbasaur'));
      expect(navigate).toHaveBeenCalled();
    });
  });

  it('handles fetch errors properly', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    global.fetch = vi.fn(() => Promise.reject(new Error('Fetch error')));

    render(<Results resultPokemons={[mockPokemonItem]} />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(screen.queryByText('Loading pokemon details...')).toBeNull();
    });

    consoleErrorSpy.mockRestore();
  });

  it('changes page correctly', async () => {
    const setSearchParams = vi.fn();
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams('page=1'),
      setSearchParams,
    ]);

    const mockList = Array.from({ length: 15 }, (_, i) => ({
      name: `pokemon-${i}`,
      url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
    }));

    global.fetch = vi.fn((url) => {
      const id = parseInt(url.toString().split('/').slice(-2, -1)[0]);
      return Promise.resolve(mockResponse(createPokemonDetails(id)));
    });

    render(<Results resultPokemons={mockList} cardsPerPage={5} />);

    await waitFor(() => {
      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    });

    await waitFor(() => {
      fireEvent.click(screen.getByText('Next'));
      expect(setSearchParams).toHaveBeenCalledWith(
        new URLSearchParams('page=2')
      );
    });
  });

  it('navigates to details when pokemon card is clicked', async () => {
    const navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams('page=1'),
      vi.fn(),
    ]);

    render(<Results resultPokemons={[mockPokemonItem]} />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('bulbasaur'));
      expect(navigate).toHaveBeenCalledWith(
        expect.stringContaining('details/1?page=1')
      );
    });
  });

  it('loads initial data correctly', async () => {
    render(<Results resultPokemons={[mockPokemonItem]} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(mockPokemonItem.url);
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });
  });

  it('responds to page changes in URL', async () => {
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams('page=2'),
      vi.fn(),
    ]);

    const mockList = Array.from({ length: 15 }, (_, i) => ({
      name: `pokemon-${i}`,
      url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
    }));

    global.fetch = vi.fn((url) => {
      const id = parseInt(url.toString().split('/').slice(-2, -1)[0]);
      return Promise.resolve(mockResponse(createPokemonDetails(id)));
    });

    render(<Results resultPokemons={mockList} cardsPerPage={5} />);

    await waitFor(() => {
      expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    });
  });

  it('handles null resultPokemons correctly', () => {
    render(<Results resultPokemons={null} />);
    expect(screen.getByText('No Pokemons :(')).toBeInTheDocument();
  });

  it.skip('logs error when page data loading fails', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    global.fetch = vi.fn((url) => {
      if (url.toString().includes('pokemon/1')) {
        return Promise.reject(new Error('Test error'));
      }
      return Promise.resolve(mockResponse(createPokemonDetails(2)));
    });

    render(
      <Results
        resultPokemons={[
          { name: 'pokemon-1', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'pokemon-2', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        ]}
        cardsPerPage={2}
      />
    );

    await waitFor(
      () => {
        expect(consoleErrorSpy).toHaveBeenCalled();
        expect(
          consoleErrorSpy.mock.calls.some(
            (call) =>
              typeof call[0] === 'string' &&
              call[0].startsWith(
                'Error fetching https://pokeapi.co/api/v2/pokemon/1/'
              )
          )
        ).toBe(true);
      },
      { timeout: 5000 }
    );

    consoleErrorSpy.mockRestore();
  });

  it('logs error when main loading fails', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const testError = new Error('Main loading error');
    const originalPromiseAll = Promise.all;
    Promise.all = vi.fn().mockRejectedValue(testError);

    render(<Results resultPokemons={[mockPokemonItem]} />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Error loading page data:',
        testError
      );
    });
    Promise.all = originalPromiseAll;
    consoleErrorSpy.mockRestore();
  });

  it('handles failed HTTP responses', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'Not found' }),
    });

    render(<Results resultPokemons={[mockPokemonItem]} />);

    await waitFor(() => {
      expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();
    });
  });
});
