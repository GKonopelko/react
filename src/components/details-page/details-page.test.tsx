import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../../tests/test-utils';
import { useParams } from 'react-router-dom';
import { useFetchPokemonDetails } from '../api/api';
import { createPokemonDetails } from '../../../tests/mocks';
import { PokemonDetailsPage } from './details-page';
import type { UseQueryResult } from '@tanstack/react-query';
import type { PokemonDetails } from '../../pokemonTypes';

vi.mock('../details-card/details-card', () => ({
  DetailsCard: ({
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
  ),
}));

vi.mock('../loader/loader', () => ({
  Loader: () => <div data-testid="loader-mock">Loading...</div>,
}));

vi.mock('../error-message/error-message', () => ({
  ErrorMessage: ({
    error,
    onDismiss,
  }: {
    error: string;
    onDismiss: () => void;
  }) => (
    <div data-testid="error-message-mock">
      {error}
      <button onClick={onDismiss}>Dismiss</button>
    </div>
  ),
}));

const mockNavigate = vi.fn();
const mockLocation = {
  pathname: '/',
  search: '?test=1',
  hash: '',
  state: null,
  key: 'default',
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(() => ({})),
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
  };
});

const createMockQueryResult = <T, E = Error>(
  overrides: Partial<UseQueryResult<T, E>> = {}
): UseQueryResult<T, E> =>
  ({
    data: undefined,
    error: null,
    isError: false,
    isPending: false,
    isLoading: false,
    isSuccess: false,
    isFetching: false,
    isLoadingError: false,
    isRefetchError: false,
    isPaused: false,
    status: 'pending',
    fetchStatus: 'idle',
    failureCount: 0,
    failureReason: null,
    errorUpdateCount: 0,
    isFetched: false,
    isFetchedAfterMount: false,
    isInitialLoading: false,
    isPlaceholderData: false,
    isRefetching: false,
    isStale: false,
    refetch: vi.fn().mockResolvedValue({}),
    ...overrides,
  }) as UseQueryResult<T, E>;

vi.mock('../api/api', () => ({
  useFetchPokemonDetails: vi.fn(() => createMockQueryResult<PokemonDetails>()),
}));

describe('PokemonDetailsPage Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.mocked(useParams).mockReturnValue({});
    vi.mocked(useFetchPokemonDetails).mockReturnValue(
      createMockQueryResult<PokemonDetails>()
    );
  });

  it('should render nothing when id is not provided', () => {
    const { container } = render(<PokemonDetailsPage />);
    expect(container.firstChild).toBeNull();
  });

  it('should render loader when loading', () => {
    vi.mocked(useParams).mockReturnValue({ id: '25' });
    vi.mocked(useFetchPokemonDetails).mockReturnValue(
      createMockQueryResult<PokemonDetails>({
        isPending: true,
        isLoading: true,
        status: 'pending',
      })
    );

    render(<PokemonDetailsPage />);
    expect(screen.getByTestId('loader-mock')).toBeInTheDocument();
  });

  it('should render error message when error occurs', () => {
    vi.mocked(useParams).mockReturnValue({ id: '25' });
    vi.mocked(useFetchPokemonDetails).mockReturnValue(
      createMockQueryResult<PokemonDetails>({
        isError: true,
        error: new Error('Test error'),
        status: 'error',
      })
    );

    render(<PokemonDetailsPage />);
    expect(screen.getByTestId('error-message-mock')).toHaveTextContent(
      'Test error'
    );
  });

  it('should render DetailsCard with pokemon data when loaded', () => {
    const mockPokemon = {
      ...createPokemonDetails(25),
      abilities: [{ ability: { name: 'static' } }],
    };
    vi.mocked(useParams).mockReturnValue({ id: '25' });
    vi.mocked(useFetchPokemonDetails).mockReturnValue(
      createMockQueryResult<PokemonDetails>({
        data: mockPokemon,
        isSuccess: true,
        status: 'success',
      })
    );

    render(<PokemonDetailsPage />);
    expect(screen.getByTestId('details-card-mock')).toHaveTextContent(
      `Mock DetailsCard: ${mockPokemon.name}`
    );
  });

  it('should navigate to home with search params when DetailsCard calls onClose', () => {
    const mockPokemon = {
      ...createPokemonDetails(25),
      abilities: [{ ability: { name: 'static' } }],
    };
    vi.mocked(useParams).mockReturnValue({ id: '25' });
    vi.mocked(useFetchPokemonDetails).mockReturnValue(
      createMockQueryResult<PokemonDetails>({
        data: mockPokemon,
        isSuccess: true,
        status: 'success',
      })
    );

    render(<PokemonDetailsPage />);
    fireEvent.click(screen.getByText('Close'));

    expect(mockNavigate).toHaveBeenCalledWith({
      pathname: '/',
      search: '?test=1',
    });
  });

  it('should update when pokemonId changes', () => {
    const { rerender } = render(<PokemonDetailsPage />);

    expect(screen.queryByTestId('details-card-mock')).not.toBeInTheDocument();

    vi.mocked(useParams).mockReturnValue({ id: '25' });
    vi.mocked(useFetchPokemonDetails).mockReturnValue(
      createMockQueryResult<PokemonDetails>({
        data: {
          ...createPokemonDetails(25),
          abilities: [{ ability: { name: 'static' } }],
        },
        isSuccess: true,
        status: 'success',
      })
    );
    rerender(<PokemonDetailsPage />);
    expect(screen.getByTestId('details-card-mock')).toHaveTextContent(
      'Mock DetailsCard: pokemon-25'
    );

    vi.mocked(useParams).mockReturnValue({ id: '150' });
    vi.mocked(useFetchPokemonDetails).mockReturnValue(
      createMockQueryResult<PokemonDetails>({
        data: {
          ...createPokemonDetails(150),
          abilities: [{ ability: { name: 'pressure' } }],
        },
        isSuccess: true,
        status: 'success',
      })
    );
    rerender(<PokemonDetailsPage />);
    expect(screen.getByTestId('details-card-mock')).toHaveTextContent(
      'Mock DetailsCard: pokemon-150'
    );
  });
});
