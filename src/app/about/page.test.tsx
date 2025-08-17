import { render, screen } from '@testing-library/react';
import Page from './page';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../../components/about/about', () => ({
  About: () => <div>About Component Mock</div>,
}));

describe('About Page', () => {
  it('should render the About component', () => {
    render(<Page />);
    expect(screen.getByText('About Component Mock')).toBeInTheDocument();
  });
});
