import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DataDisplay } from './DisplayFormData';

interface FormData {
  name: string;
  age: number;
  email: string;
  gender: 'male' | 'female';
  country: string;
  agreeToTerms: boolean;
  submittedAt: Date;
  profilePicture?: string;
}

const mockEmptyFormData: FormData[] = [];

const mockFormData: FormData[] = [
  {
    name: 'John Smith',
    age: 25,
    email: 'john@example.com',
    gender: 'male',
    country: 'Russia',
    agreeToTerms: true,
    submittedAt: new Date('2023-01-01T10:00:00'),
    profilePicture: undefined,
  },
  {
    name: 'Anna Johnson',
    age: 28,
    email: 'anna@example.com',
    gender: 'female',
    country: 'Belarus',
    agreeToTerms: true,
    submittedAt: new Date('2023-01-02T12:00:00'),
    profilePicture: undefined,
  },
];

const mockFormDataWithImage: FormData[] = [
  {
    name: 'Maria Brown',
    age: 22,
    email: 'maria@example.com',
    gender: 'female',
    country: 'Russia',
    agreeToTerms: true,
    submittedAt: new Date('2023-01-04T16:00:00'),
    profilePicture: 'data:image/jpeg;base64,test-image-data',
  },
];

const mockUseFormStore = vi.fn();

vi.mock('./formStore', () => ({
  useFormStore: () => mockUseFormStore(),
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

describe('DataDisplay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseFormStore.mockReset();
  });

  it('should display empty state when no data', () => {
    mockUseFormStore.mockReturnValue(mockEmptyFormData);
    render(<DataDisplay />);
    expect(screen.getByText('No form submissions yet')).toBeInTheDocument();
  });

  it('should display form data when available', () => {
    mockUseFormStore.mockReturnValue([mockFormData[0]]);
    render(<DataDisplay />);
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('Age: 25')).toBeInTheDocument();
    expect(screen.getByText('Email: john@example.com')).toBeInTheDocument();
    expect(screen.getByText('Gender: male')).toBeInTheDocument();
    expect(screen.getByText('Country: Russia')).toBeInTheDocument();
  });

  it('should display multiple form submissions', () => {
    mockUseFormStore.mockReturnValue([mockFormData[0], mockFormData[1]]);
    render(<DataDisplay />);
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('Anna Johnson')).toBeInTheDocument();
    expect(screen.getByText('Country: Russia')).toBeInTheDocument();
    expect(screen.getByText('Country: Belarus')).toBeInTheDocument();
  });

  it('should display profile picture when available', () => {
    mockUseFormStore.mockReturnValue(mockFormDataWithImage);
    render(<DataDisplay />);
    const image = screen.getByAltText('Profile');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute(
      'src',
      'data:image/jpeg;base64,test-image-data'
    );
  });

  it('should format submission date correctly', () => {
    mockUseFormStore.mockReturnValue([mockFormData[0]]);
    render(<DataDisplay />);
    const dateText = screen.getByText(/Submitted:/);
    expect(dateText).toBeInTheDocument();
    expect(dateText.textContent).toContain('2023');
  });

  it('should not display profile picture when not available', () => {
    mockUseFormStore.mockReturnValue([mockFormData[0]]);
    render(<DataDisplay />);
    const images = screen.queryAllByAltText('Profile');
    expect(images).toHaveLength(0);
  });
});
