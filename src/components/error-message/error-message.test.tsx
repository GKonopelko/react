import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ErrorMessage } from './error-message';

const mockError = 'test-error';
const mockOnDismiss = vi.fn();

describe('errorMessage Component', () => {
  it('should render error button', () => {
    render(<ErrorMessage error={mockError} onDismiss={mockOnDismiss} />);

    const button = screen.getByRole('button', { name: /hide error/i });
    expect(button).toBeInTheDocument();

    expect(screen.getByText(/test-error/i)).toBeInTheDocument();
  });
});
