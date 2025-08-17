import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { useFetchPokemonDetails } from '../../utils/api';
import { createPokemonDetails, mockQueryResult } from '../../../tests/mocks';
import { PokemonDetailsPage } from './details-page';
import type { PokemonDetails } from '../../pokemonTypes';

vi.mock('../details-card/details-card', () => ({
  DetailsCard: vi.fn(
    ({
      pokemon,
      onClose,
    }: {
      pokemon: PokemonDetails;
      onClose: () => void;
    }) => (
      <div data-testid="details-card-mock">
        Mock DetailsCard: {pokemon.name}
        <button onClick={onClose}>Close</button>
      </div>
    )
  ),
}));

vi.mock('../loader/loader', () => ({
  Loader: vi.fn(() => <div data-testid="loader-mock">Loading...</div>),
}));

vi.mock('../error-message/error-message', () => ({
  ErrorMessage: vi.fn(
    ({ error, onDismiss }: { error: string; onDismiss: () => void }) => (
      <div data-testid="error-message-mock">
        {error}
        <button onClick={onDismiss}>Dismiss</button>
      </div>
    )
  ),
}));

vi.mock('../../utils/api', () => ({
  useFetchPokemonDetails: vi.fn(() => mockQueryResult<PokemonDetails>()),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
  useParams: vi.fn(() => ({ id: '' })),
}));

describe('PokemonDetailsPage Component', () => {
  const mockUseFetchPokemonDetails = vi.mocked(useFetchPokemonDetails);

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFetchPokemonDetails.mockReturnValue(
      mockQueryResult<PokemonDetails>()
    );
  });

  it('should render loader when loading', () => {
    mockUseFetchPokemonDetails.mockReturnValue(
      mockQueryResult<PokemonDetails>({
        isPending: true,
        isLoading: true,
        status: 'pending',
        fetchStatus: 'fetching',
      })
    );

    render(<PokemonDetailsPage id="25" onClose={vi.fn()} />);
    expect(screen.getByTestId('loader-mock')).toBeInTheDocument();
  });

  it('should render error message when error occurs', () => {
    mockUseFetchPokemonDetails.mockReturnValue(
      mockQueryResult<PokemonDetails>({
        isError: true,
        error: new Error('Test error'),
        status: 'error',
      })
    );

    render(<PokemonDetailsPage id="25" onClose={vi.fn()} />);
    expect(screen.getByTestId('error-message-mock')).toHaveTextContent(
      'Test error'
    );
  });

  it('should render DetailsCard with pokemon data when loaded', () => {
    const mockPokemon = {
      ...createPokemonDetails(25),
      abilities: [{ ability: { name: 'static' } }],
    };

    mockUseFetchPokemonDetails.mockReturnValue(
      mockQueryResult<PokemonDetails>({
        data: mockPokemon,
        isSuccess: true,
        status: 'success',
      })
    );

    render(<PokemonDetailsPage id="25" onClose={vi.fn()} />);
    expect(screen.getByTestId('details-card-mock')).toHaveTextContent(
      `Mock DetailsCard: ${mockPokemon.name}`
    );
  });

  it('should call onClose when DetailsCard calls onClose', () => {
    const mockOnClose = vi.fn();
    const mockPokemon = {
      ...createPokemonDetails(25),
      abilities: [{ ability: { name: 'static' } }],
    };

    mockUseFetchPokemonDetails.mockReturnValue(
      mockQueryResult<PokemonDetails>({
        data: mockPokemon,
        isSuccess: true,
        status: 'success',
      })
    );

    render(<PokemonDetailsPage id="25" onClose={mockOnClose} />);
    fireEvent.click(screen.getByText('Close'));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('should render not found message when no pokemon data', () => {
    mockUseFetchPokemonDetails.mockReturnValue(
      mockQueryResult<PokemonDetails>({
        data: undefined,
        isSuccess: true,
        status: 'success',
      })
    );

    render(<PokemonDetailsPage id="25" onClose={vi.fn()} />);
    expect(screen.getByTestId('error-message-mock')).toHaveTextContent(
      'Pokemon not found'
    );
  });
});
