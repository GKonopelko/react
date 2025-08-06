import { render, screen } from '@testing-library/react';
import { it, expect } from 'vitest';
import styles from './styles.module.css';
import { Loader } from './loader';

it('should render spinner with loading text', () => {
  render(<Loader />);

  const loadingText = screen.getByText(/Pokemons coming soon/);
  expect(loadingText).toBeInTheDocument();
  expect(loadingText).toHaveClass(styles['loading-text']);
});
