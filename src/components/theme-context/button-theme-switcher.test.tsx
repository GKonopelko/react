import { render, screen, fireEvent } from '../../../tests/test-utils';
import { ThemeSwitcher } from './button-theme-switcher';
import { vi } from 'vitest';
import { useTheme } from './use-theme';

vi.mock('./use-theme', () => ({
  useTheme: vi.fn(() => ({
    theme: 'light',
    toggleTheme: vi.fn(),
  })),
}));

vi.mock('../../assets/icons/sun.svg', () => ({
  default: '/sun-icon.svg',
}));

vi.mock('../../assets/icons/moon.svg', () => ({
  default: '/moon-icon.svg',
}));

describe('ThemeSwitcher Component', () => {
  const mockToggleTheme = vi.fn();

  beforeEach(() => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'light',
      toggleTheme: mockToggleTheme,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with light theme', () => {
    render(<ThemeSwitcher />);

    const button = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(button).toBeInTheDocument();

    const icon = screen.getByAltText('Theme icon');
    expect(icon).toHaveAttribute('src', '/moon-icon.svg');
  });

  it('renders correctly with dark theme', () => {
    vi.mocked(useTheme).mockReturnValue({
      theme: 'dark',
      toggleTheme: mockToggleTheme,
    });

    render(<ThemeSwitcher />);

    const button = screen.getByRole('button', {
      name: /switch to light mode/i,
    });
    expect(button).toBeInTheDocument();

    const icon = screen.getByAltText('Theme icon');
    expect(icon).toHaveAttribute('src', '/sun-icon.svg');
  });

  it('calls toggleTheme when clicked', () => {
    render(<ThemeSwitcher />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockToggleTheme).toHaveBeenCalledTimes(1);
  });

  it('has correct accessibility attributes', () => {
    render(<ThemeSwitcher />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
  });
});
