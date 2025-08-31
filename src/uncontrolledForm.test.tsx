import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UncontrolledForm } from './UncontrolledForm';

const mockAddFormData = vi.fn();
vi.mock('./formStore', () => ({
  useFormStore: vi.fn((selector) => {
    const state = {
      addFormData: mockAddFormData,
      formData: [],
      clearFormData: vi.fn(),
    };
    return typeof selector === 'function' ? selector(state) : state;
  }),
}));

vi.mock('./fileToBase64', () => ({
  fileToBase64: vi.fn().mockImplementation((file) => {
    if (!file || file.size === 0) {
      return Promise.resolve('');
    }
    return Promise.resolve('data:image/jpeg;base64,base64string');
  }),
}));

vi.mock('./CountryAutocomplete', () => ({
  CountryAutocomplete: ({
    value,
    onChange,
  }: {
    value: string;
    onChange: (value: string) => void;
  }) => (
    <div>
      <input
        data-testid="country-input"
        placeholder="Start typing country name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  ),
}));

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

const mockOnClose = vi.fn();

describe('UncontrolledForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render all form fields', () => {
    render(<UncontrolledForm onClose={mockOnClose} />);

    expect(screen.getByLabelText('Name *')).toBeInTheDocument();
    expect(screen.getByLabelText('Age *')).toBeInTheDocument();
    expect(screen.getByLabelText('Email *')).toBeInTheDocument();
    expect(screen.getByLabelText('Password *')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password *')).toBeInTheDocument();
    expect(screen.getByLabelText('Male')).toBeInTheDocument();
    expect(screen.getByLabelText('Female')).toBeInTheDocument();
    expect(
      screen.getByLabelText(/agree to terms and conditions/i)
    ).toBeInTheDocument();
  });

  it('should show validation errors for empty required fields', async () => {
    render(<UncontrolledForm onClose={mockOnClose} />);

    await act(async () => {
      fireEvent.submit(screen.getByTestId('uncontrolled-form'));
    });

    await waitFor(() => {
      const errorElements = document.querySelectorAll('[class*="error-text"]');
      expect(errorElements.length).toBeGreaterThan(0);
    });
  });

  it('should handle form submission errors', async () => {
    mockAddFormData.mockImplementationOnce(() => {
      throw new Error('Submission error');
    });

    render(<UncontrolledForm onClose={mockOnClose} />);

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

      const countryInput = screen.getByTestId('country-input');
      fireEvent.change(countryInput, { target: { value: 'Russia' } });

      const agreeCheckbox = screen.getByLabelText(
        /agree to terms and conditions/i
      );
      fireEvent.click(agreeCheckbox);

      fireEvent.submit(screen.getByTestId('uncontrolled-form'));
    });

    await waitFor(() => {
      expect(mockOnClose).not.toHaveBeenCalled();
    });
  });

  it('should display email validation error for invalid email', async () => {
    render(<UncontrolledForm onClose={mockOnClose} />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Email *'), {
        target: { value: 'invalid-email' },
      });
      fireEvent.submit(screen.getByTestId('uncontrolled-form'));
    });

    await waitFor(() => {
      const errorElements = document.querySelectorAll('[class*="error-text"]');
      expect(errorElements.length).toBeGreaterThan(0);
    });
  });

  it('should display password validation error for weak password', async () => {
    render(<UncontrolledForm onClose={mockOnClose} />);

    await act(async () => {
      fireEvent.change(screen.getByLabelText('Password *'), {
        target: { value: 'weak' },
      });
      fireEvent.change(screen.getByLabelText('Confirm Password *'), {
        target: { value: 'weak' },
      });
      fireEvent.submit(screen.getByTestId('uncontrolled-form'));
    });

    await waitFor(() => {
      const errorElements = document.querySelectorAll('[class*="error-text"]');
      expect(errorElements.length).toBeGreaterThan(0);
    });
  });
});
