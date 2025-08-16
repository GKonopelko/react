import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../../../tests/test-utils';
import { Layout } from './main-layout';

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    Outlet: () => <div data-testid="outlet-mock">Mock Outlet</div>,
  };
});

vi.mock('./styles.module.css', () => ({
  default: {
    wrapper: 'wrapper-class',
  },
}));

describe('Layout Component', () => {
  it('should render Outlet inside wrapper div', () => {
    render(<Layout />);

    const wrapper = screen.getByTestId('outlet-mock').parentElement;
    expect(wrapper).toHaveClass('wrapper-class');
    expect(screen.getByTestId('outlet-mock')).toBeInTheDocument();
    expect(screen.getByText('Mock Outlet')).toBeInTheDocument();
  });
});
