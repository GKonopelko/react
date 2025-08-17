import { render, screen } from '@testing-library/react';
import { Footer } from './footer';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} />
  ),
}));

vi.mock('../checkbox-wrapper/checkbox-wrapper', () => ({
  CheckboxWrapper: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('../flyout/flyout', () => ({
  Flyout: () => <div />,
}));

vi.mock('./styles.module.css', () => ({
  default: {
    footer: 'footer-class',
    'footer-link': 'footer-link-class',
    'rss-logo': 'rss-logo-class',
    'footer-content': 'footer-content-class',
    logoContainer: 'logo-container-class',
  },
}));

describe('Footer Component', () => {
  it('should render basic footer content', () => {
    render(<Footer />);

    expect(screen.getByText('Grigori Konopelko')).toBeInTheDocument();
    expect(screen.getByText('2025')).toBeInTheDocument();
    expect(screen.getByAltText('RS School Logo')).toBeInTheDocument();
  });

  it('should have correct links', () => {
    render(<Footer />);

    const githubLink = screen.getByText('Grigori Konopelko');
    expect(githubLink).toHaveAttribute('href', 'https://github.com/GKonopelko');
    expect(githubLink).toHaveAttribute('target', '_blank');
    expect(githubLink).toHaveAttribute('rel', 'noopener noreferrer');

    const rssLink = screen.getByRole('link', { name: 'RS School Logo' });
    expect(rssLink).toHaveAttribute('href', 'https://rs.school/');
  });
});
