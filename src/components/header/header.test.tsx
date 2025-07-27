import { render, screen } from '@testing-library/react';
import { Header } from './header';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

describe('Header Component', () => {
  it('should render the header with logo', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
    expect(screen.getByAltText('React logo')).toBeInTheDocument();
  });

  it('should have correct link attributes', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const externalLinks = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('href')?.startsWith('http'));

    externalLinks.forEach((link) => {
      expect(link).toHaveAttribute(
        'rel',
        expect.stringMatching(/noreferrer|noopener/)
      );
    });
  });
});
