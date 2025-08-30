import { render, screen } from '@testing-library/react';
import NotFound from './not-found';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../components/404-page/404-page', () => ({
  NotFound: () => (
    <div>
      <h1>404 Not Found</h1>
      <p>The page you&apos;re looking for doesn&apos;t exist</p>
      <a href="/">Go to Home</a>
    </div>
  ),
}));

describe('NotFound Page', () => {
  it('should render 404 page with correct content', () => {
    render(<NotFound />);

    expect(
      screen.getByRole('heading', { name: '404 Not Found' })
    ).toBeInTheDocument();
    expect(
      screen.getByText(/The page you're looking for doesn't exist/i)
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Go to Home/i })).toHaveAttribute(
      'href',
      '/'
    );
  });
});
