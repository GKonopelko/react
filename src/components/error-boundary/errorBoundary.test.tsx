import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '../../../tests/test-utils';
import { ErrorBoundary } from './errorBoundary';

const TestError = () => {
  throw new Error('test-error');
};

const WorkingComponent = () => <div>Working component</div>;

describe('ErrorBoundary Component', () => {
  beforeEach(() => {
    vi.spyOn(console, 'error').mockImplementation(() => {});
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

  it('should recover after reset button is clicked', async () => {
    let shouldThrow = true;

    const ToggleComponent = () => {
      if (shouldThrow) throw new Error('test-error');
      return <div>Working component</div>;
    };

    render(
      <ErrorBoundary>
        <ToggleComponent />
      </ErrorBoundary>
    );
    expect(screen.getByText(/test-error/i)).toBeInTheDocument();

    shouldThrow = false;
    fireEvent.click(screen.getByRole('button', { name: /back to app/i }));

    await vi.waitFor(() => {
      expect(screen.getByText('Working component')).toBeInTheDocument();
      expect(screen.queryByText(/test-error/i)).not.toBeInTheDocument();
    });
  });
});
