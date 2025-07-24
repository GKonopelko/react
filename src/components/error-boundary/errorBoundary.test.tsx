import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach, beforeEach } from 'vitest';
import { ErrorBoundary } from './errorBoundary';

const TestError = () => {
  throw new Error('test-error');
};

const WorkingComponent = () => <div>Working component</div>;

describe('errorBoundary Component', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });
  it('should render reset button', () => {
    render(
      <ErrorBoundary>
        <TestError />
      </ErrorBoundary>
    );

    const button = screen.getByRole('button', { name: /back to app/i });
    expect(button).toBeInTheDocument();

    expect(screen.getByText(/test-error/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /back to app/i }));

    render(
      <ErrorBoundary>
        <WorkingComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Working component')).toBeInTheDocument();
  });
});
