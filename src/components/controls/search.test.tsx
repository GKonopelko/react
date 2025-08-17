import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Search } from './search';
import '@testing-library/jest-dom';

const mockPush = vi.fn();
const mockGet = vi.fn().mockReturnValue('');
const mockToString = vi.fn().mockReturnValue('');

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: mockGet,
    toString: mockToString,
  }),
}));

vi.mock('../../utils/api', () => ({
  useSearchPokemon: () => ({
    mutate: vi.fn(),
  }),
}));

vi.mock('../checkbox-wrapper/checkbox-wrapper', () => ({
  CheckboxWrapper: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('Search Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGet.mockReturnValue('');
  });

  it('renders input and search button', () => {
    render(<Search />);

    expect(
      screen.getByPlaceholderText('Enter pokemon name or id')
    ).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: 'Search pokemon' })
    ).toBeInTheDocument();
  });

  it('initializes with value from URL params', () => {
    mockGet.mockImplementation((key: string) =>
      key === 'search' ? 'bulbasaur' : ''
    );

    render(<Search />);
    expect(screen.getByPlaceholderText('Enter pokemon name or id')).toHaveValue(
      'bulbasaur'
    );
  });
});
