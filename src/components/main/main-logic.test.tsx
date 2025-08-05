import { render, screen } from '../../../tests/test-utils';
import { Main } from './main-logic';
import { describe, it, expect } from 'vitest';

describe('Main Component', () => {
  const renderMain = (props = {}) => {
    const defaultProps = {
      searchResults: null,
      loading: false,
      error: null,
      onSearch: () => {},
      onDismissError: () => {},
    };
    return render(<Main {...defaultProps} {...props} />);
  };

  it.skip('should render layout', () => {
    renderMain();
    expect(screen.getByAltText('RS School')).toBeInTheDocument();
  });

  it('should render Loader', () => {
    renderMain({ loading: true });
    expect(screen.getByText('Pokemons coming soon...')).toBeInTheDocument();
  });

  it('should render ErrorMessage', () => {
    const testError = 'Test error message';
    renderMain({ error: testError });
    expect(screen.getByText(testError)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Hide error' })
    ).toBeInTheDocument();
  });
});
