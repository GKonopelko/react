import { render, screen } from '@testing-library/react';
import { Main } from './main-logic';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../header/header', () => ({
  Header: () => <div>Header</div>,
}));

vi.mock('../controls/controls', () => ({
  Controls: () => <div>Controls</div>,
}));

vi.mock('../results/results', () => ({
  Results: () => <div>Results</div>,
}));

vi.mock('../footer/footer', () => ({
  Footer: () => <div>Footer</div>,
}));

vi.mock('../loader/loader', () => ({
  Loader: () => <div>Loading...</div>,
}));

vi.mock('../error-message/error-message', () => ({
  ErrorMessage: () => <div>Error Message</div>,
}));

describe('Main Component', () => {
  const defaultProps = {
    searchResults: null,
    loading: false,
    error: null,
    onSearch: vi.fn(),
    onDismissError: vi.fn(),
  };

  it('renders basic layout', () => {
    render(<Main {...defaultProps} />);

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Controls')).toBeInTheDocument();
    expect(screen.getByText('Results')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });

  it('shows loader when loading', () => {
    render(<Main {...defaultProps} loading={true} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
    expect(screen.queryByText('Results')).not.toBeInTheDocument();
  });

  it('shows error when error exists', () => {
    render(<Main {...defaultProps} error="Test error" />);
    expect(screen.getByText('Error Message')).toBeInTheDocument();
    expect(screen.queryByText('Results')).not.toBeInTheDocument();
  });

  it('shows results when not loading and no error', () => {
    render(<Main {...defaultProps} />);
    expect(screen.getByText('Results')).toBeInTheDocument();
    expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    expect(screen.queryByText('Error Message')).not.toBeInTheDocument();
  });
});
