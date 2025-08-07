import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../tests/test-utils';
import { DetailsCard } from './details-card';
import { createPokemonDetails } from '../../../tests/mocks';

describe('Компонент DetailsCard', () => {
  const mockOnClose = vi.fn();
  const mockPokemon = {
    ...createPokemonDetails(1),
    abilities: [],
    sprites: {
      ...createPokemonDetails(1).sprites,
      other: {
        'official-artwork': {
          front_default: 'image-1.png',
        },
      },
    },
  };

  it('should show pokemon details', () => {
    render(<DetailsCard pokemon={mockPokemon} onClose={mockOnClose} />);

    expect(screen.getByText(mockPokemon.name)).toBeInTheDocument();
    expect(screen.getByAltText(mockPokemon.name)).toBeInTheDocument();
    expect(screen.getByText('hp:')).toBeInTheDocument();
    expect(screen.getByText('55')).toBeInTheDocument();
  });

  it('should call onClose on clicking close button', () => {
    render(<DetailsCard pokemon={mockPokemon} onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('×'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('should show pokemon image', () => {
    render(<DetailsCard pokemon={mockPokemon} onClose={mockOnClose} />);

    const image = screen.getByAltText(mockPokemon.name);
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      'src',
      mockPokemon.sprites.other['official-artwork'].front_default
    );
  });
});
