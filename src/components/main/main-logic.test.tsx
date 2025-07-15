import { render, screen } from '@testing-library/react';
import { Main } from './main-logic';
import { describe, it, expect } from 'vitest';

describe('Main Component', () => {
  const renderMain = (props = {}) => {
    const defaultProps = {
      searchResults: null,
      loading: false,
      error: null,
      onSearch: () => {},
      onMakeTestError: () => {},
      onDismissError: () => {},
    };
    return render(<Main {...defaultProps} {...props} />);
  };

  it('should render layout', () => {
    renderMain();

    expect(
      screen.getByRole('button', { name: /don't press the red button/i })
    ).toBeInTheDocument();

    expect(screen.getByAltText(/RS School/i)).toBeInTheDocument();
  });
  it('should render Loader ', () => {
    renderMain({ loading: true });
    expect(screen.getByText(/Pokemons coming soon.../i)).toBeInTheDocument();
  });

  it('should render ErrorMessage', () => {
    const testError = 'Test error message';
    renderMain({ error: testError });
    expect(screen.getByText(testError)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /hide error/i })
    ).toBeInTheDocument();
  });
});
