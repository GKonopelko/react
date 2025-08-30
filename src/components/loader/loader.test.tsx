import { render, screen } from '@testing-library/react';
import { it, expect, vi } from 'vitest';
import { Loader } from './loader';

vi.mock('./styles.module.css', () => ({
  default: {
    'spinner-container': 'spinner-container-class',
    spinner: 'spinner-class',
    'loading-text': 'loading-text-class',
  },
}));

describe('Loader Component', () => {
  it('should render spinner with loading text', async () => {
    const mockRandom = vi.spyOn(Math, 'random').mockReturnValue(0.1234);

    render(<Loader />);

    const loadingText = screen.getByText(/Pokemons coming soon/);
    expect(loadingText).toBeInTheDocument();

    expect(loadingText).toHaveTextContent('Pokemons coming soon...0.1234');

    mockRandom.mockRestore();
  });

  it('should have correct classes', () => {
    render(<Loader />);

    const container = screen.getByText(/Pokemons coming soon/).parentElement;
    expect(container).toHaveClass('spinner-container-class');

    const spinner = container?.querySelector('.spinner-class');
    expect(spinner).toBeInTheDocument();
  });
});
