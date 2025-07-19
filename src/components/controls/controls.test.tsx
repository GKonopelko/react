import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Controls } from './controls';

describe('Controls Component', () => {
  it('should render', () => {
    const mockSearch = vi.fn();
    render(<Controls onSearch={mockSearch} />);

    const { container } = render(<Controls onSearch={mockSearch} />);
    expect(container.firstChild).toBeInTheDocument();
    expect(container.querySelector('div')).toBeInTheDocument();
  });
});
