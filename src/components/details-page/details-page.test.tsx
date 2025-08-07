import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../../tests/test-utils';
import { useFetchPokemonDetails } from '../api/api';
import { createPokemonDetails, mockQueryResult } from '../../../tests/mocks';
import { PokemonDetailsPage } from './details-page';
import type { PokemonDetails } from '../../pokemonTypes';
import { useNavigate, useParams } from 'react-router-dom';

vi.mock('../details-card/details-card', async (importOriginal) => {
  const mod =
    await importOriginal<typeof import('../details-card/details-card')>();
  return {
    ...mod,
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
  };
});

vi.mock('../loader/loader', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../loader/loader')>();
  return {
    ...mod,
    Loader: vi.fn(() => <div data-testid="loader-mock">Loading...</div>),
  };
});

vi.mock('../error-message/error-message', async (importOriginal) => {
  const mod =
    await importOriginal<typeof import('../error-message/error-message')>();
  return {
    ...mod,
    ErrorMessage: vi.fn(
      ({ error, onDismiss }: { error: string; onDismiss: () => void }) => (
        <div data-testid="error-message-mock">
          {error}
          <button onClick={onDismiss}>Dismiss</button>
        </div>
      )
    ),
  };
});

vi.mock('../api/api', async (importOriginal) => {
  const mod = await importOriginal<typeof import('../api/api')>();
  return {
    ...mod,
    useFetchPokemonDetails: vi.fn(() => mockQueryResult<PokemonDetails>()),
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useParams: vi.fn(() => ({})),
    useNavigate: vi.fn(() => vi.fn()),
    useLocation: vi.fn(() => ({
      pathname: '/',
      search: '?test=1',
      hash: '',
      state: null,
      key: 'default',
    })),
  };
});

describe('PokemonDetailsPage Component', () => {
  const mockUseFetchPokemonDetails = vi.mocked(useFetchPokemonDetails);
  const mockUseNavigate = vi.mocked(useNavigate);
  const mockUseParams = vi.mocked(useParams);

  beforeEach(() => {
    mockUseParams.mockReturnValue({});
    mockUseNavigate.mockImplementation(() => vi.fn());
    mockUseFetchPokemonDetails.mockReturnValue(
      mockQueryResult<PokemonDetails>()
    );
  });
  it('should render nothing when id is not provided', () => {
    const { container } = render(<PokemonDetailsPage />);
    expect(container.firstChild).toBeNull();
  });

  it('should render loader when loading', () => {
    mockUseParams.mockReturnValue({ id: '25' });
    mockUseFetchPokemonDetails.mockReturnValue(
      mockQueryResult<PokemonDetails>({
        isPending: true,
        isLoading: true,
        status: 'pending',
        fetchStatus: 'fetching',
      })
    );

    render(<PokemonDetailsPage />);
    expect(screen.getByTestId('loader-mock')).toBeInTheDocument();
  });

  it('should render error message when error occurs', () => {
    mockUseParams.mockReturnValue({ id: '25' });
    mockUseFetchPokemonDetails.mockReturnValue(
      mockQueryResult<PokemonDetails>({
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

    mockUseParams.mockReturnValue({ id: '25' });
    mockUseFetchPokemonDetails.mockReturnValue(
      mockQueryResult<PokemonDetails>({
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

  it('should navigate to home when DetailsCard calls onClose', () => {
    const navigateMock = vi.fn();
    mockUseNavigate.mockImplementation(() => navigateMock);

    const mockPokemon = {
      ...createPokemonDetails(25),
      abilities: [{ ability: { name: 'static' } }],
    };

    mockUseParams.mockReturnValue({ id: '25' });
    mockUseFetchPokemonDetails.mockReturnValue(
      mockQueryResult<PokemonDetails>({
        data: mockPokemon,
        isSuccess: true,
        status: 'success',
      })
    );

    render(<PokemonDetailsPage />);
    fireEvent.click(screen.getByText('Close'));

    expect(navigateMock).toHaveBeenCalledWith({
      pathname: '/',
      search: '?test=1',
    });
  });
});
