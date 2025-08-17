import { render, screen } from '@testing-library/react';
import { PokemonCard } from './pokemonCard';
import { it, expect, vi } from 'vitest';
import type { PokemonDetails } from '../../pokemonTypes';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} />
  ),
}));

vi.mock('../checkbox-wrapper/checkbox-wrapper', () => ({
  CheckboxWrapper: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('./styles.module.css', () => ({
  default: {
    wrapper: 'wrapper-class',
    image: 'image-class',
    name: 'name-class',
    description: 'description-class',
    id: 'id-class',
    detail: 'detail-class',
  },
}));

const createTestPokemon = (id: number): PokemonDetails => ({
  id,
  name: `pokemon-${id}`,
  sprites: {
    front_default: `image-${id}.png`,
  },
  height: 10,
  weight: 100,
  types: [
    {
      type: {
        name: 'electric',
      },
    },
  ],
  stats: [
    {
      base_stat: 55,
      stat: {
        name: 'hp',
      },
    },
  ],
  abilities: [],
});

describe('PokemonCard Component', () => {
  it('should render pokemon with correct details', () => {
    const testPokemon = createTestPokemon(25);

    render(<PokemonCard pokemon={testPokemon} />);

    const image = screen.getByAltText(`${testPokemon.name} sprite`);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', testPokemon.sprites.front_default);

    expect(screen.getByText(`ID: ${testPokemon.id}`)).toBeInTheDocument();
    expect(
      screen.getByText(`Height: ${testPokemon.height / 10} m`)
    ).toBeInTheDocument();
    expect(
      screen.getByText(`Weight: ${testPokemon.weight / 10} kg`)
    ).toBeInTheDocument();
    expect(screen.getByText(testPokemon.name)).toBeInTheDocument();
  });
});
