import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import styles from './styles.module.css';
import { Loader } from './loader';

describe('Loader Component', () => {
  it('should render spinner', () => {
    render(<Loader />);

    const spinner = screen.getByText('Pokemons coming soon...');
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass(styles['loading-text']);
  });
});
