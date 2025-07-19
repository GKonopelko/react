import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Search } from './search-class';

describe('Search Component', () => {
  const mockSearch = vi.fn();
  it('should render input and button', () => {
    const { container } = render(<Search onSearch={mockSearch} />);

    const form = container.querySelector('form');
    expect(form).not.toBeNull();
    if (!form) return;
    expect(form).toBeInTheDocument();

    const input = screen.getByPlaceholderText('Enter pokemon name or id');
    expect(input).toBeInTheDocument();

    const button = screen.getByText('Search pokemon');
    expect(button).toBeInTheDocument();

    fireEvent.change(input, { target: { value: ' test ' } });
    fireEvent.submit(form);
    expect(mockSearch).toHaveBeenCalledWith('test');
  });
  it('shoult write and read to/from localStorage', () => {
    localStorage.setItem('poke-monReactQueryContent', 'test');
    expect(localStorage.getItem('poke-monReactQueryContent')).toBe('test');
  });

  it('shoult write and read to/from state', () => {
    localStorage.setItem('poke-monReactQueryContent', 'test state');

    render(<Search onSearch={() => {}} />);

    expect(screen.getByDisplayValue('test state')).toBeInTheDocument();
  });
});
