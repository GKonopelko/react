import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../../tests/test-utils';
import { DetailsCard } from './details-card';
import { createPokemonDetails } from '../../../tests/mocks';
import { useLoaderData } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useLoaderData: vi.fn(),
  };
});

describe('DetailsCard Component', () => {
  const mockOnClose = vi.fn();
  const mockPokemon = {
    ...createPokemonDetails(1),
    sprites: {
      other: {
        'official-artwork': {
          front_default: 'https://example.com/pokemon.png',
        },
      },
    },
  };

  beforeEach(() => {
    vi.mocked(useLoaderData).mockReturnValue(mockPokemon);
  });

  it('should render pokemon details', () => {
    render(<DetailsCard onClose={mockOnClose} />);

    expect(screen.getByText(mockPokemon.name)).toBeInTheDocument();
    expect(screen.getByAltText(mockPokemon.name)).toBeInTheDocument();
    expect(screen.getByText('hp:')).toBeInTheDocument();
  });

  it('should show error when pokemon is not loaded', () => {
    vi.mocked(useLoaderData).mockReturnValue(undefined);

    render(<DetailsCard onClose={mockOnClose} />);

    expect(screen.getByText(/Error: Pokemon not found/)).toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    render(<DetailsCard onClose={mockOnClose} />);

    fireEvent.click(screen.getByText('×'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
