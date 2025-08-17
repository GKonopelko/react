import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DetailsCard } from './details-card';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} />
  ),
}));

describe('DetailsCard', () => {
  const mockPokemon = {
    id: 1,
    name: 'bulbasaur',
    sprites: {
      front_default:
        'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png',
      other: {
        'official-artwork': {
          front_default:
            'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/1.png',
        },
      },
    },
    height: 7,
    weight: 69,
    types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
    stats: [
      { base_stat: 45, stat: { name: 'hp' } },
      { base_stat: 49, stat: { name: 'attack' } },
      { base_stat: 49, stat: { name: 'defense' } },
    ],
    abilities: [
      { ability: { name: 'overgrow' }, is_hidden: false },
      { ability: { name: 'chlorophyll' }, is_hidden: true },
    ],
  };

  const mockOnClose = vi.fn();

  it('renders pokemon name', () => {
    render(<DetailsCard pokemon={mockPokemon} onClose={mockOnClose} />);
    expect(screen.getByText(mockPokemon.name)).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(<DetailsCard pokemon={mockPokemon} onClose={mockOnClose} />);
    fireEvent.click(screen.getByText('×'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('renders pokemon stats', () => {
    render(<DetailsCard pokemon={mockPokemon} onClose={mockOnClose} />);
    expect(screen.getByText('hp:')).toBeInTheDocument();
    expect(screen.getByText('45')).toBeInTheDocument();
  });
});
