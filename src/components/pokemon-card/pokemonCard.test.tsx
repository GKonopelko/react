import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { PokemonCard } from './pokemonCard';

const mockPokemon = {
  id: 1,
  name: 'bulbasaur',
  height: 7,
  weight: 69,
  sprites: {
    front_default:
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
  },
  types: [],
  abilities: [],
  stats: [],
};

describe('PokemonCard Component', () => {
  it('should render bulbasaur', () => {
    render(<PokemonCard pokemon={mockPokemon} />);

    const image = screen.getByAltText(mockPokemon.name);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockPokemon.sprites.front_default);

    expect(screen.getByText(mockPokemon.name)).toBeInTheDocument();

    expect(screen.getByText(`ID: ${mockPokemon.id}`)).toBeInTheDocument();

    expect(screen.getByText('Height: 0.7 m')).toBeInTheDocument();

    expect(screen.getByText('Weight: 6.9 kg')).toBeInTheDocument();
  });
});
