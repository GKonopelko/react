import { render, screen } from '@testing-library/react';
import { MainLayout } from './main-layout';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom';

vi.mock('../flyout/flyout', () => ({
  Flyout: () => <div data-testid="flyout-component" />,
}));

vi.mock('./styles.module.css', () => ({
  default: {
    wrapper: 'wrapper-class',
  },
}));

describe('MainLayout Component', () => {
  it('renders children and Flyout component', () => {
    const testContent = <div data-testid="test-child">Test Content</div>;

    render(<MainLayout>{testContent}</MainLayout>);

    expect(screen.getByTestId('test-child')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();

    expect(screen.getByTestId('flyout-component')).toBeInTheDocument();
  });

  it('has correct wrapper class', () => {
    render(
      <MainLayout>
        <div>Test</div>
      </MainLayout>
    );

    const wrapper = screen.getByText('Test').parentElement;
    expect(wrapper).toHaveClass('wrapper-class');
  });
});
