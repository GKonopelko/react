import { render, screen } from '@testing-library/react';
import { ClientProviders } from './client-providers';
import { describe, it, expect } from 'vitest';

describe('ClientProviders', () => {
  it('should render children', () => {
    render(
      <ClientProviders>
        <div>Test Content</div>
      </ClientProviders>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should match snapshot', () => {
    const { asFragment } = render(
      <ClientProviders>
        <div>Test</div>
      </ClientProviders>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
