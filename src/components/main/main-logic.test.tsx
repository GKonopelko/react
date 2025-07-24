import { render, screen } from '@testing-library/react';
import { Main } from './main-logic';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';

describe('Main Component', () => {
  const renderMain = (props = {}) => {
    const defaultProps = {
      searchResults: null,
      loading: false,
      error: null,
      onSearch: () => {},
      onDismissError: () => {},
    };
    return render(
      <MemoryRouter>
        <Main {...defaultProps} {...props} />
      </MemoryRouter>
    );
  };

  it('should render layout', () => {
    renderMain();
    expect(screen.getByAltText(/RS School/i)).toBeInTheDocument();
  });

  it('should render Loader', () => {
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
