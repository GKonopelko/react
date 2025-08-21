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

vi.mock('./fileToBase64', () => ({
  fileToBase64: vi.fn().mockResolvedValue('base64string'),
}));

const mockOnClose = vi.fn();

const fillValidForm = async () => {
  fireEvent.change(screen.getByLabelText('Name *'), {
    target: { value: 'John Doe' },
  });
  fireEvent.change(screen.getByLabelText('Age *'), {
    target: { value: '25' },
  });
  fireEvent.change(screen.getByLabelText('Email *'), {
    target: { value: 'john@example.com' },
  });

  const passwordInput = screen.getByLabelText('Password *');
  const confirmPasswordInput = screen.getByLabelText('Confirm Password *');

  fireEvent.change(passwordInput, {
    target: { value: 'Password123!' },
  });
  fireEvent.change(confirmPasswordInput, {
    target: { value: 'Password123!' },
  });

  const maleRadio = screen.getByLabelText('Male');
  fireEvent.click(maleRadio);

  const countryInput = screen.getByPlaceholderText(
    /start typing country name/i
  );
  fireEvent.change(countryInput, { target: { value: 'Russia' } });

  await waitFor(() => {
    expect(screen.getByText('Russia')).toBeInTheDocument();
  });

  const russiaOption = screen.getByText('Russia');
  fireEvent.click(russiaOption);

  const agreeCheckbox = screen.getByLabelText(/agree to terms and conditions/i);
  fireEvent.click(agreeCheckbox);
};

describe.skip('UncontrolledForm', () => {
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
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    });

    await waitFor(
      () => {
        expect(
          screen.getByRole('button', { name: /submit/i })
        ).toBeInTheDocument();

        const hasValidationErrors =
          screen.queryByText(/at least two symbols/i) ||
          screen.queryByText(/submit valid email/i) ||
          screen.queryByText(/min 8 symbols in password/i) ||
          screen.queryByText(/select country/i) ||
          screen.queryByText(/will you study well/i);

        expect(hasValidationErrors).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });

  it('should submit valid form data', async () => {
    render(<UncontrolledForm onClose={mockOnClose} />);

    await act(async () => {
      await fillValidForm();
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    });

    await waitFor(
      () => {
        expect(mockAddFormData).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
      },
      { timeout: 3000 }
    );
  });

  it('should handle form submission errors', async () => {
    mockAddFormData.mockImplementation(() => {
      throw new Error('Submission error');
    });

    render(<UncontrolledForm onClose={mockOnClose} />);

    await act(async () => {
      await fillValidForm();
    });

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    });

    await waitFor(
      () => {
        expect(mockOnClose).not.toHaveBeenCalled();

        expect(
          screen.getByRole('button', { name: /submit/i })
        ).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
