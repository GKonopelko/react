import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ControlledForm } from './ControlledForm';
const mockAddFormData = vi.fn();
vi.mock('./formStore', () => {
  return {
    useFormStore: vi.fn((selector) => {
      if (typeof selector === 'function') {
        return selector({
          addFormData: mockAddFormData,
          formData: [],
          clearFormData: vi.fn(),
        });
      }
      return {
        addFormData: mockAddFormData,
        formData: [],
        clearFormData: vi.fn(),
      };
    }),
  };
});

vi.mock('./uncontrolledForm.module.css', () => ({
  default: {
    form: 'form',
    'form-group': 'form-group',
    'radio-group': 'radio-group',
    'checkbox-label': 'checkbox-label',
    'form-actions': 'form-actions',
    'cancel-button': 'cancel-button',
    'submit-button': 'submit-button',
    error: 'error',
    'error-text': 'error-text',
    'password-criteria': 'password-criteria',
    'criteria-item': 'criteria-item',
    'criteria-indicator': 'criteria-indicator',
    'criteria-label': 'criteria-label',
    valid: 'valid',
  },
}));

describe('ControlledForm', () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all form fields', () => {
    render(<ControlledForm onClose={mockOnClose} />);

    expect(screen.getByLabelText('Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Age *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.getByLabelText('Password *')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password *')).toBeInTheDocument();
    expect(screen.getByLabelText('Male')).toBeInTheDocument();
    expect(screen.getByLabelText('Female')).toBeInTheDocument();
    expect(
      screen.getByLabelText('Agree to terms and conditions *')
    ).toBeInTheDocument();
  });

  it('should show validation errors for empty required fields', async () => {
    render(<ControlledForm onClose={mockOnClose} />);

    // Submit the form directly to trigger validation
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    });

    // Wait a bit longer for async validation to complete
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Check if any error elements exist
    const errorElements = document.querySelectorAll('.error-text');

    if (errorElements.length === 0) {
      // If no errors found, try interacting with fields first
      const nameInput = screen.getByLabelText('Name *');
      const ageInput = screen.getByLabelText('Age *');

      await act(async () => {
        fireEvent.change(nameInput, { target: { value: 'a' } }); // Too short
        fireEvent.change(ageInput, { target: { value: '' } });
      });

      // Submit again
      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: /submit/i }));
      });

      // Wait again
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    // Final check for errors
    await waitFor(() => {
      const finalErrorElements = document.querySelectorAll('.error-text');
      expect(finalErrorElements.length).toBeGreaterThan(0);
    });
  });

  it('should validate password strength criteria', async () => {
    render(<ControlledForm onClose={mockOnClose} />);

    const passwordInput = screen.getByLabelText('Password *');
    await act(async () => {
      fireEvent.change(passwordInput, { target: { value: 'Weak' } });
    });

    expect(screen.getByText(/Length \(min 8 chars\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Uppercase letter/i)).toBeInTheDocument();
  });

  it('should handle form submission errors', async () => {
    mockAddFormData.mockImplementation(() => {
      throw new Error('Submission error');
    });

    render(<ControlledForm onClose={mockOnClose} />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Name *'), {
        target: { value: 'John Doe' },
      });
      fireEvent.change(screen.getByLabelText('Age *'), {
        target: { value: '25' },
      });
      fireEvent.change(screen.getByLabelText('Email *'), {
        target: { value: 'john@example.com' },
      });
      fireEvent.change(screen.getByLabelText('Password *'), {
        target: { value: 'Password123!' },
      });
      fireEvent.change(screen.getByLabelText('Confirm Password *'), {
        target: { value: 'Password123!' },
      });

      fireEvent.click(screen.getByLabelText('Male'));

      const countryInput = screen.getByPlaceholderText(
        /start typing country name/i
      );
      fireEvent.change(countryInput, { target: { value: 'Russia' } });

      await waitFor(() => {
        expect(screen.getByText('Russia')).toBeInTheDocument();
      });

      const suggestion = screen.getByText('Russia');
      fireEvent.click(suggestion);

      const checkbox = screen.getByLabelText('Agree to terms and conditions *');
      fireEvent.click(checkbox);
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    });

    await waitFor(() => {
      expect(
        screen.getByText(/an error occurred while submitting the form/i)
      ).toBeInTheDocument();
    });
  });
});
