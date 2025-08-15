import { vi } from 'vitest';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: vi.fn(),
    useSearchParams: vi.fn(() => [new URLSearchParams('page=1'), vi.fn()]),
  };
});

vi.mock('../loader/loader', () => ({
  Loader: () => <div>Pokemons coming soon...</div>,
}));

vi.mock('@tanstack/react-query', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@tanstack/react-query')>();
  return {
    ...actual,
    useQuery: vi.fn(),
  };
});

import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../tests/test-utils';
import { Results } from './results';
import {
  createPokemonDetails,
  createPokemonList,
  mockQueryResult,
} from '../../../tests/mocks';
import type { PokemonDetails, PokemonListItem } from '../../pokemonTypes';
import { useNavigate, useSearchParams } from 'next/link';
import { useQuery } from '@tanstack/react-query';

const mockResponse = (data: unknown) =>
  ({
    ok: true,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  }) as Response;

describe('Results Component', () => {
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
    vi.mocked(useSearchParams).mockReturnValue([
      new URLSearchParams('page=1'),
      vi.fn(),
    ]);
  });

  it('renders single pokemon details', () => {
    vi.mocked(useQuery).mockReturnValue(
      mockQueryResult({
        data: undefined,
        isSuccess: true,
      })
    );
    render(<Results resultPokemons={mockPokemonDetails} />);
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
  });

  it('shows pagination for multiple pages', async () => {
    const mockList = Array.from({ length: 15 }, (_, i) => ({
      name: `pokemon-${i}`,
      url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
    }));

    vi.mocked(useQuery).mockReturnValue(
      mockQueryResult({
        data: mockList.slice(0, 5).map((_, i) => createPokemonDetails(i + 1)),
        isSuccess: true,
      })
    );

    render(<Results resultPokemons={mockList} cardsPerPage={5} />);

    await waitFor(() => {
      expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    });
  });

  it('navigates on pokemon click', async () => {
    const navigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(navigate);

    vi.mocked(useQuery).mockReturnValue(
      mockQueryResult({
        data: [mockPokemonDetails],
        isSuccess: true,
      })
    );

    render(<Results resultPokemons={[mockPokemonItem]} />);

    fireEvent.click(screen.getByText('bulbasaur'));
    expect(navigate).toHaveBeenCalled();
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

    vi.mocked(useQuery).mockReturnValue(
      mockQueryResult({
        data: mockList.slice(0, 5).map((_, i) => createPokemonDetails(i + 1)),
        isSuccess: true,
      })
    );

    render(<Results resultPokemons={mockList} cardsPerPage={5} />);
    fireEvent.click(screen.getByText('Next'));
    expect(setSearchParams).toHaveBeenCalledWith(new URLSearchParams('page=2'));
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

    vi.mocked(useQuery).mockReturnValue(
      mockQueryResult({
        data: mockList.slice(5, 10).map((_, i) => createPokemonDetails(i + 6)),
        isSuccess: true,
      })
    );

    render(<Results resultPokemons={mockList} cardsPerPage={5} />);

    await waitFor(() => {
      expect(screen.getByText('Page 2 of 3')).toBeInTheDocument();
    });
  });

  it('handles null resultPokemons correctly', () => {
    vi.mocked(useQuery).mockReturnValue(
      mockQueryResult({
        data: undefined,
        isSuccess: false,
      })
    );
    render(<Results resultPokemons={null} />);
    expect(screen.getByText('No Pokemons found')).toBeInTheDocument();
  });

  it('handles failed HTTP responses', async () => {
    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({ error: 'Not found' }),
    });

    vi.mocked(useQuery).mockReturnValue(
      mockQueryResult({
        data: undefined,
        isSuccess: false,
      })
    );

    render(<Results resultPokemons={[mockPokemonItem]} />);

    await waitFor(() => {
      expect(screen.queryByText('bulbasaur')).not.toBeInTheDocument();
    });
  });

  it.skip('renders "No Pokemons found" when resultPokemons is null', () => {
    render(<Results resultPokemons={null} />);
    expect(screen.getByText('No Pokemons found')).toBeInTheDocument();
  });

  it.skip('shows loading state and renders pokemon list', async () => {
    vi.mocked(useQuery).mockReturnValue(
      mockQueryResult({
        isLoading: true,
        isPending: true,
      })
    );

    render(<Results resultPokemons={[mockPokemonItem]} />);
    expect(screen.getByText('Pokemons coming soon...')).toBeInTheDocument();

    vi.mocked(useQuery).mockReturnValue(
      mockQueryResult({
        data: [mockPokemonDetails],
        isSuccess: true,
      })
    );

    await waitFor(() => {
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });
  });

  it.skip('handles fetch errors properly', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    vi.mocked(useQuery).mockReturnValue(
      mockQueryResult({
        isError: true,
        error: new Error('Fetch error'),
      })
    );

    render(<Results resultPokemons={[mockPokemonItem]} />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it.skip('loads initial data correctly', async () => {
    vi.mocked(useQuery).mockReturnValue(
      mockQueryResult({
        data: [mockPokemonDetails],
        isSuccess: true,
      })
    );

    render(<Results resultPokemons={[mockPokemonItem]} />);

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(mockPokemonItem.url);
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });
  });

  it.skip('logs error when page data loading fails', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    vi.mocked(useQuery).mockReturnValue(
      mockQueryResult({
        isError: true,
        error: new Error('Test error'),
      })
    );

    render(
      <Results
        resultPokemons={[
          { name: 'pokemon-1', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
          { name: 'pokemon-2', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
        ]}
        cardsPerPage={2}
      />
    );

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it.skip('logs error when main loading fails', async () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    vi.mocked(useQuery).mockReturnValue(
      mockQueryResult({
        isError: true,
        error: new Error('Main loading error'),
      })
    );

    render(<Results resultPokemons={[mockPokemonItem]} />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
