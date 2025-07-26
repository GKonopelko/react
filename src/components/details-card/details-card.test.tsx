import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '../../../tests/test-utils';
import { DetailsCard } from './details-card';
import { createPokemonDetails } from '../../../tests/mocks';

beforeEach(() => {
  global.fetch = vi.fn();
});

describe('DetailsCard Component', () => {
  const mockOnClose = vi.fn();

  it('should show loading state initially', () => {
    render(<DetailsCard pokemonId="1" onClose={mockOnClose} />);
    expect(screen.getByText('Loading details...')).toBeInTheDocument();
  });

  it('should show error state when fetch fails', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Pokemon not found'));

    render(<DetailsCard pokemonId="1" onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText(/Error: Pokemon not found/)).toBeInTheDocument();
    });
  });

  it('should render pokemon details when fetch succeeds', async () => {
    const mockPokemon = createPokemonDetails(1);
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPokemon,
    } as Response);

    render(<DetailsCard pokemonId="1" onClose={mockOnClose} />);

    await waitFor(() => {
      expect(screen.getByText(mockPokemon.name)).toBeInTheDocument();
      expect(screen.getByAltText(mockPokemon.name)).toBeInTheDocument();
      expect(screen.getByText('hp:')).toBeInTheDocument();
    });
  });

  it('should call onClose when close button is clicked', async () => {
    const mockPokemon = createPokemonDetails(1);
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockPokemon,
    } as Response);

    render(<DetailsCard pokemonId="1" onClose={mockOnClose} />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('×'));
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });
});
