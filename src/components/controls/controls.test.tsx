import { it, expect, vi } from 'vitest';
import { Controls } from './controls';
import { render, screen } from '../../../tests/test-utils';

it('should render', () => {
  const mockSearch = vi.fn();
  const { container } = render(<Controls onSearch={mockSearch} />);
  expect(container.querySelector('div')).toBeInTheDocument();
});

it('should render', () => {
  const mockSearch = vi.fn();
  render(<Controls onSearch={mockSearch} />);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
