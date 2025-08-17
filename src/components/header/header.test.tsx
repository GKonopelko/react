import { render, screen } from '@testing-library/react';
import { Header } from './header';
import { describe, it, expect, vi } from 'vitest';

vi.mock('next/image', () => ({
  __esModule: true,
  default: () => <div>Mocked Image</div>,
}));

vi.mock('../theme-context/theme-context-provider', () => ({
  ThemeProvider: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('../theme-context/button-theme-switcher', () => ({
  ThemeSwitcher: () => <button>Theme Switcher</button>,
}));

vi.mock('../checkbox-wrapper/checkbox-wrapper', () => ({
  CheckboxWrapper: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe('Header Component', () => {
  it('renders without crashing', () => {
    render(<Header />);
    expect(screen.getByText('Poke-monReact')).toBeInTheDocument();
  });

  it('contains navigation links', () => {
    render(<Header />);
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('About')).toBeInTheDocument();
  });

  it('shows refresh button when onRefresh prop is provided', () => {
    render(<Header onRefresh={() => {}} />);
    expect(screen.getByText('Refresh Data')).toBeInTheDocument();
  });

  it('does not show refresh button when onRefresh is not provided', () => {
    render(<Header />);
    expect(screen.queryByText('Refresh Data')).not.toBeInTheDocument();
  });
});
