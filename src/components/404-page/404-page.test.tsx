import { describe, it, expect } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import { NotFound } from './404-page';

describe('NotFound Component', () => {
  it('should render 404 message', () => {
    render(<NotFound />);

    expect(screen.getByText('404 - Page Not Found')).toBeInTheDocument();
    expect(
      screen.getByText('The page you are looking for does not exist.')
    ).toBeInTheDocument();
  });

  it('should render link to home page', () => {
    render(<NotFound />);

    const link = screen.getByText('Go back to Pokemons');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/');
  });

  it('should match snapshot', () => {
    const { container } = render(<NotFound />);

    expect(container).toMatchSnapshot();
  });
});
