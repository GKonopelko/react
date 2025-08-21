import { render, fireEvent, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CountryAutocomplete } from './CountryAutocomplete';

describe('CountryAutocomplete', () => {
  const mockOnChange = vi.fn();

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('should call onChange with input value', () => {
    render(<CountryAutocomplete value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Start typing country name...');
    fireEvent.change(input, { target: { value: 'Rus' } });

    expect(mockOnChange).toHaveBeenCalledWith('Rus');
  });

  it('should handle different input values', () => {
    render(<CountryAutocomplete value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Start typing country name...');

    fireEvent.change(input, { target: { value: 'Bel' } });
    expect(mockOnChange).toHaveBeenCalledWith('Bel');

    fireEvent.change(input, { target: { value: 'Ger' } });
    expect(mockOnChange).toHaveBeenCalledWith('Ger');
  });
});
