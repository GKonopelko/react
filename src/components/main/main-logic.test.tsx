import { render, screen } from '../../../tests/test-utils';
import { Main } from './main-logic';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../loader/loader', () => ({
  Loader: () => <div data-testid="loader">Pokemons coming soon...</div>,
}));

vi.mock('../error-message/error-message', () => ({
  ErrorMessage: ({
    error,
    onDismiss,
  }: {
    error: string;
    onDismiss: () => void;
  }) => (
    <div data-testid="error-message">
      {error}
      <button onClick={onDismiss}>Hide error</button>
    </div>
  ),
}));

vi.mock('../header/header', () => ({
  Header: () => <header data-testid="header">Header</header>,
}));

vi.mock('../controls/controls', () => ({
  Controls: ({ onSearch }: { onSearch: () => Promise<void> }) => (
    <div data-testid="controls">
      <button onClick={() => onSearch()}>Search</button>
    </div>
  ),
}));

vi.mock('../results/results', () => ({
  Results: () => <div data-testid="results">Results</div>,
}));

vi.mock('../footer/footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

describe('Main Component', () => {
  const renderMain = (props = {}) => {
    const defaultProps = {
      searchResults: null,
      loading: false,
      error: null,
      onSearch: vi.fn().mockResolvedValue(undefined),
      onDismissError: vi.fn(),
    };
    return render(<Main {...defaultProps} {...props} />);
  };

  it('should render layout', () => {
    renderMain();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('controls')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should render Loader when loading is true', () => {
    renderMain({ loading: true });
    expect(screen.getByTestId('loader')).toBeInTheDocument();
    expect(screen.getByText('Pokemons coming soon...')).toBeInTheDocument();
  });

  it('should render ErrorMessage when error exists', () => {
    const testError = 'Test error message';
    renderMain({ error: testError });

    const errorMessage = screen.getByTestId('error-message');
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveTextContent(testError);
    expect(
      screen.getByRole('button', { name: 'Hide error' })
    ).toBeInTheDocument();
  });

  it('should render Results when not loading and no error', () => {
    renderMain();
    expect(screen.getByTestId('results')).toBeInTheDocument();
  });
});
