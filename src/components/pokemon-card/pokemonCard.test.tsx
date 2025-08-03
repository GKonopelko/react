import { render, screen } from '../../../tests/test-utils';
import { createPokemonDetails } from '../../../tests/mocks';
import { PokemonCard } from './pokemonCard';

it('should render pokemon with correct details', () => {
  const mockPokemon = {
    ...createPokemonDetails(25),
    abilities: [],
    moves: [],
  };

  render(<PokemonCard pokemon={mockPokemon} />);

  const image = screen.getByAltText(mockPokemon.name);
  expect(image).toBeInTheDocument();

  expect(screen.getByText('Height: 1 m')).toBeInTheDocument();
  expect(screen.getByText('Weight: 10 kg')).toBeInTheDocument();
});
