import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ErrorBoundary } from './errorBoundary';

vi.mock('./styles.module.css', () => ({
  default: {
    'error-window': 'error-window-class',
    'back-button': 'back-button-class',
  },
}));

const TestError = () => {
  throw new Error('test-error');
};

const WorkingComponent = () => <div>Working component</div>;

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render error message and reset button when child throws error', () => {
    render(
      <ErrorBoundary>
        <TestError />
      </ErrorBoundary>
    );

    expect(screen.getByText(/test-error/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /back to app/i })
    ).toBeInTheDocument();
  });

  it('should render children when no error occurs', () => {
    render(
      <ErrorBoundary>
        <WorkingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Working component')).toBeInTheDocument();
  });
});
