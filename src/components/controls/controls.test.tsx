import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Controls } from './controls';
import { MemoryRouter } from 'react-router-dom';

describe('Controls Component', () => {
  it('should render', () => {
    const mockSearch = vi.fn();
    render(
      <MemoryRouter>
        <Controls onSearch={mockSearch} />
      </MemoryRouter>
    );

    const { container } = render(
      <MemoryRouter>
        <Controls onSearch={mockSearch} />
      </MemoryRouter>
    );
    expect(container.firstChild).toBeInTheDocument();
    expect(container.querySelector('div')).toBeInTheDocument();
  });
});
