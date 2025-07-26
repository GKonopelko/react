import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PokemonDetailsPage } from './details-page';
import { render, screen, fireEvent, waitFor } from '../../../tests/test-utils';
import { useParams, useLocation } from 'react-router-dom';

vi.mock('../details-card/details-card', () => ({
  DetailsCard: ({
    pokemonId,
    onClose,
  }: {
    pokemonId: string;
    onClose: () => void;
  }) => (
    <div data-testid="details-card-mock">
      Mock DetailsCard: {pokemonId}
      <button onClick={onClose}>Close</button>
    </div>
  ),
}));

const mockNavigate = vi.fn();
const mockLocation = {
  pathname: '/',
  search: '',
  hash: '',
  state: null,
  key: 'default',
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...(actual as object),
    useParams: vi.fn(() => ({})),
    useNavigate: vi.fn(() => mockNavigate),
    useLocation: vi.fn(() => mockLocation),
  };
});

describe('PokemonDetailsPage Component', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    vi.mocked(useParams).mockReturnValue({});
    vi.mocked(useLocation).mockReturnValue(mockLocation);
  });

  it('should render nothing when id is not provided', () => {
    const { container } = render(<PokemonDetailsPage />);
    expect(container.firstChild).toBeNull();
  });

  it('should render DetailsCard with correct pokemonId', async () => {
    vi.mocked(useParams).mockReturnValue({ id: '25' });

    render(<PokemonDetailsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('details-card-mock')).toHaveTextContent(
        'Mock DetailsCard: 25'
      );
    });
  });

  it('should navigate to home when DetailsCard calls onClose', async () => {
    vi.mocked(useParams).mockReturnValue({ id: '25' });

    render(<PokemonDetailsPage />);

    await waitFor(() => {
      fireEvent.click(screen.getByText('Close'));
      expect(mockNavigate).toHaveBeenCalledWith({
        pathname: '/',
        search: '',
      });
    });
  });

  it('should update when pokemonId changes', async () => {
    const { rerender } = render(<PokemonDetailsPage />);

    vi.mocked(useParams).mockReturnValue({ id: '150' });
    rerender(<PokemonDetailsPage />);

    await waitFor(() => {
      expect(screen.getByTestId('details-card-mock')).toHaveTextContent(
        'Mock DetailsCard: 150'
      );
    });
  });
});
