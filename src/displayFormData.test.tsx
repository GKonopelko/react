import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { DataDisplay } from './DisplayFormData';
import { useFormStore } from './formStore';

vi.mock('../../src/formStore', () => ({
  useFormStore: vi.fn(),
}));

vi.mock('./display.module.css', () => ({
  default: {
    empty: 'empty',
    container: 'container',
    grid: 'grid',
    card: 'card',
    new: 'new',
    image: 'image',
  },
}));

describe.skip('DataDisplay', () => {
  const mockFormData = [
    {
      name: 'John Doe',
      age: 25,
      email: 'john@example.com',
      gender: 'male' as const,
      country: 'Russia',
      agreeToTerms: true,
      profilePicture: 'data:image/jpeg;base64,test',
      submittedAt: new Date('2024-01-01T00:00:00Z').getTime(),
    },
    {
      name: 'Jane Smith',
      age: 30,
      email: 'jane@example.com',
      gender: 'female' as const,
      country: 'Belarus',
      agreeToTerms: true,
      profilePicture: undefined,
      submittedAt: new Date('2024-01-02T00:00:00Z').getTime(),
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should display empty state when no data', () => {
    (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      formData: [],
    });

    render(<DataDisplay />);
    expect(screen.getByText(/no form submissions yet/i)).toBeInTheDocument();
  });

  it('should display form data cards', () => {
    (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      formData: mockFormData,
    });

    render(<DataDisplay />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Age: 25')).toBeInTheDocument();
    expect(screen.getByText('Age: 30')).toBeInTheDocument();
    expect(screen.getByText('Email: john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Gender: male')).toBeInTheDocument();
    expect(screen.getByText('Gender: female')).toBeInTheDocument();
    expect(screen.getByText('Country: Russia')).toBeInTheDocument();
    expect(screen.getByText('Country: Belarus')).toBeInTheDocument();
  });

  it('should display profile pictures when available', () => {
    (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      formData: [mockFormData[0]],
    });

    render(<DataDisplay />);

    const image = screen.getByAltText('Profile');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'data:image/jpeg;base64,test');
  });

  it('should not display profile picture when not available', () => {
    (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      formData: [mockFormData[1]],
    });

    render(<DataDisplay />);

    expect(screen.queryByAltText('Profile')).not.toBeInTheDocument();
  });

  it('should apply new class to the latest item and remove it after 5 seconds', () => {
    (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      formData: [mockFormData[0]],
    });

    const { rerender } = render(<DataDisplay />);

    const card = screen.getByText('John Doe').closest('div');
    expect(card).not.toHaveClass('new');

    const newFormData = [
      ...mockFormData,
      {
        name: 'New User',
        age: 35,
        email: 'new@example.com',
        gender: 'male' as const,
        country: 'Kazakhstan',
        agreeToTerms: true,
        profilePicture: undefined,
        submittedAt: new Date('2024-01-03T00:00:00Z').getTime(),
      },
    ];

    (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      formData: newFormData,
    });

    rerender(<DataDisplay />);

    const newCard = screen.getByText('New User').closest('div');
    expect(newCard).toHaveClass('new');

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(newCard).not.toHaveClass('new');
  });

  it('should display submitted time in correct format', () => {
    (useFormStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      formData: [mockFormData[0]],
    });

    render(<DataDisplay />);
    const dateText = screen.getByText(/Submitted:/);
    expect(dateText).toBeInTheDocument();
    expect(dateText.textContent).toContain('Submitted:');
  });
});
