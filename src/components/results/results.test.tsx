import { render, screen, waitFor } from '@testing-library/react';
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
  beforeAll(() => {
    vi.stubGlobal('fetch', vi.fn());
  });

  afterAll(() => {
    vi.unstubAllGlobals();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should render "No Pokemons"', () => {
    render(<Results resultPokemons={null} />);
    expect(screen.getByText('No Pokemons :(')).toBeInTheDocument();
  });

  it('should render "loading"', () => {
    render(<Results resultPokemons={[mockPokemonItem]} />);
    expect(screen.getByText('Loading pokemon details...')).toBeInTheDocument();
  });

  it('should render pokemon', () => {
    render(<Results resultPokemons={mockPokemonDetails} />);

    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('ID: 1')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).toBeNull();
  });

  it('should handle errors', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    render(<Results resultPokemons={[mockPokemonItem]} />);

    await waitFor(() => {
      expect(screen.queryByText('Loading...')).toBeNull();
    });
  });
});
