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

vi.mock('./UncontrolledForm.module.css', () => ({
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
  },
}));

describe.skip('ControlledForm', () => {
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

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('At least two symbols')).toBeInTheDocument();
      expect(
        screen.getByText('Invalid input: expected number, received undefined')
      ).toBeInTheDocument();
      expect(screen.getByText('Submit valid email')).toBeInTheDocument();
      expect(screen.getByText('Min 8 symbols in password')).toBeInTheDocument();
      expect(screen.getByText('Select country')).toBeInTheDocument();
      expect(screen.getByText('Will you study well?')).toBeInTheDocument();
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
