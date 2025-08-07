import { describe, it, expect, vi } from 'vitest';
import { Search } from './search';
import '@testing-library/jest-dom';
import { fireEvent, render, screen, waitFor } from '../../../tests/test-utils';

describe('Search Component', () => {
  const mockSearch = vi.fn().mockResolvedValue(undefined);

  it('should render input and button', async () => {
    const { container } = render(<Search onSearch={mockSearch} />);

    const form = container.querySelector('form');
    expect(form).toBeInTheDocument();

    const input = screen.getByPlaceholderText('Enter pokemon name or id');
    expect(input).toBeInTheDocument();

    const button = screen.getByText('Search pokemon');
    expect(button).toBeInTheDocument();

    fireEvent.change(input, { target: { value: ' test ' } });
    if (!form) throw new Error('Form not found');
    fireEvent.submit(form);

    await waitFor(() => expect(mockSearch).toHaveBeenCalledWith('test'));
  });

  it('should write and read to/from localStorage', () => {
    localStorage.setItem('poke-monReactQueryContent', 'test');
    expect(localStorage.getItem('poke-monReactQueryContent')).toBe('test');
  });

  it('should write and read to/from state', () => {
    localStorage.setItem('poke-monReactQueryContent', 'test state');

    render(<Search onSearch={mockSearch} />);

    expect(screen.getByDisplayValue('test state')).toBeInTheDocument();
  });
});
