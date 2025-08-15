import { render, screen } from '@testing-library/react';
import { Header } from './header';
import { MemoryRouter } from 'next/link';
import { describe, it, expect } from 'vitest';
import { ThemeProvider } from '../theme-context/theme-context-provider';

describe('Header Component', () => {
  it('should render the header with logo', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <Header />
        </ThemeProvider>
      </MemoryRouter>
    );
    expect(screen.getByAltText('React logo')).toBeInTheDocument();
  });

  it('should have correct link attributes', () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <Header />
        </ThemeProvider>
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
