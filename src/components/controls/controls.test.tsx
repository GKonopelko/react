import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { Controls } from './controls';

vi.mock('./search', () => ({
  Search: () => <button>Mock Search Button</button>,
  __esModule: true,
}));

vi.mock('./styles.module.css', () => ({
  default: {
    controls: 'mocked-controls-class',
    'controls-content': 'mocked-content-class',
  },
  __esModule: true,
}));

describe('Controls Component', () => {
  it('renders without crashing', () => {
    render(<Controls />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('contains search component', () => {
    render(<Controls />);
    expect(screen.getByText('Mock Search Button')).toBeInTheDocument();
  });

  it('has correct container structure', () => {
    const { container } = render(<Controls />);
    const mainDiv = container.firstChild as HTMLElement;

    expect(mainDiv).toBeInTheDocument();
    expect(mainDiv.tagName).toBe('DIV');
    expect(mainDiv).toHaveClass('mocked-controls-class');

    const contentDiv = mainDiv.firstChild as HTMLElement;
    expect(contentDiv).toBeInTheDocument();
    expect(contentDiv).toHaveClass('mocked-content-class');
  });
});
