import { render, screen } from '@testing-library/react';
import { Header } from './header';
import { describe, it, expect } from 'vitest';

describe('Header Component', () => {
  it('should render the header with logo', () => {
    render(<Header />);

    const logo = screen.getByRole('img', { name: /react logo/i });
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src');

    const title = screen.getByRole('heading', {
      name: /poke-monreact/i,
    });
    expect(title).toBeInTheDocument();
  });

  it('should have correct link attributes', () => {
    render(<Header />);

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'https://react.dev');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noreferrer');
  });
});
