import { act, render, screen, waitFor } from '@testing-library/react';
import {
  describe,
  it,
  expect,
  vi,
  afterAll,
  afterEach,
  beforeAll,
} from 'vitest';
import { Results } from './results';
import type { PokemonDetails, PokemonListItem } from '../../pokemonTypes';

const mockPokemonDetails: PokemonDetails = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  sprites: { front_default: 'test-url' },
  types: [],
  abilities: [],
  stats: [],
};

const mockPokemonItem: PokemonListItem = {
  name: 'bulbasaur',
  url: 'https://pokeapi.co/api/v2/pokemon/1/',
};

describe('Results Component', () => {
  let consoleSpy: ReturnType<typeof vi.spyOn>;

  let resolveFetch: (value: {
    ok: boolean;
    json: () => Promise<PokemonDetails>;
  }) => void;
  let rejectFetch: (reason?: unknown) => void;

  beforeAll(() => {
    consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal(
      'fetch',
      vi.fn(
        () =>
          new Promise((resolve, reject) => {
            resolveFetch = resolve;
            rejectFetch = reject;
          })
      )
    );
  });

  afterAll(() => {
    consoleSpy.mockRestore();
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render "No Pokemons"', () => {
    render(<Results resultPokemons={null} />);
    expect(screen.getByText('No Pokemons :(')).toBeInTheDocument();
  });

  it('should show loading state and then render pokemon', async () => {
    render(<Results resultPokemons={[mockPokemonItem]} />);

    expect(screen.getByText('Loading pokemon details...')).toBeInTheDocument();

    await act(async () => {
      resolveFetch({
        ok: true,
        json: () => Promise.resolve(mockPokemonDetails),
      });
    });

    await waitFor(() => {
      expect(screen.queryByText('Loading pokemon details...')).toBeNull();
      expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    });
  });

  it('should render pokemon details directly', async () => {
    render(<Results resultPokemons={mockPokemonDetails} />);

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.queryByText('Loading pokemon details...')).toBeNull();
  });

  it('should handle errors', async () => {
    render(<Results resultPokemons={[mockPokemonItem]} />);

    expect(screen.getByText('Loading pokemon details...')).toBeInTheDocument();

    await act(async () => {
      rejectFetch(new Error('Network error'));
    });

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error loading pokemon details:',
        expect.any(Error)
      );
      expect(screen.queryByText('Loading pokemon details...')).toBeNull();
    });
  });
});
