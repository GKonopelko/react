import { screen, fireEvent, waitFor } from '@testing-library/react';

export const commonFormTests = {
  fillValidForm: async () => {
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText(/age/i), {
      target: { value: '25' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'john@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'Password123!' },
    });
    fireEvent.click(screen.getByLabelText(/male/i));

    const countryInput = screen.getByPlaceholderText(
      /start typing country name/i
    );
    fireEvent.change(countryInput, { target: { value: 'Russia' } });

    await waitFor(() => {
      expect(screen.getByText('Russia')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Russia'));
    fireEvent.click(screen.getByLabelText(/agree to terms and conditions/i));
  },
};
