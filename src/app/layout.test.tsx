import { render, screen } from '@testing-library/react';
import RootLayout from './layout';
import { vi } from 'vitest';

vi.mock('./client-providers', () => ({
  ClientProviders: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="client-providers">{children}</div>
  ),
}));

vi.mock('../components/header/header', () => ({
  Header: () => <header data-testid="header">Header</header>,
}));

vi.mock('../components/footer/footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

describe('RootLayout', () => {
  it('renders the client providers and main content structure', () => {
    render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    expect(screen.getByTestId('client-providers')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders children content correctly', () => {
    const testContent = 'Test Child Content';
    render(
      <RootLayout>
        <div>{testContent}</div>
      </RootLayout>
    );

    expect(screen.getByText(testContent)).toBeInTheDocument();
  });

  it('wraps content in theme-root div', () => {
    const { container } = render(
      <RootLayout>
        <div>Test Content</div>
      </RootLayout>
    );

    expect(container.querySelector('.theme-root')).toBeInTheDocument();
  });
});
