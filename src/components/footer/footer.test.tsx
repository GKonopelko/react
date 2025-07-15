import { render, screen } from '@testing-library/react';
import { Footer } from './footer';
import { describe, it, expect } from 'vitest';
import styles from './styles.module.css';

describe('Footer Component', () => {
  it('should render the footer with logo and year', () => {
    render(<Footer />);

    const githubLink = screen.getByText('Grigori Konopelko');
    expect(githubLink).toBeInTheDocument();
    expect(githubLink).toHaveAttribute('href', 'https://github.com/GKonopelko');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(githubLink).toHaveClass(styles['footer-link']);

    const year = screen.getByText('2025');
    expect(year).toBeInTheDocument();

    const rssLogo = screen.getByAltText('RS School');
    expect(rssLogo).toBeInTheDocument();
    expect(rssLogo).toHaveAttribute('src');
    expect(rssLogo).toHaveClass(styles['rss-logo']);

    const rssLink = screen.getByRole('link', { name: 'RS School' });
    expect(rssLink).toBeInTheDocument();
    expect(rssLink).toHaveClass(styles['footer-link']);
    expect(rssLink).toHaveAttribute('target', '_blank');
    expect(rssLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(rssLink).toHaveAttribute('href', 'https://rs.school/');
  });
});
