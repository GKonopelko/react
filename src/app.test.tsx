import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

vi.mock('./ControlledForm', () => ({
  ControlledForm: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="controlled-form">
      <h3>Controlled Form</h3>
      <form>
        <div>
          <label htmlFor="name">Name *</label>
          <input id="name" name="name" type="text" />
        </div>
        <button onClick={onClose}>Close Controlled</button>
      </form>
    </div>
  ),
}));

vi.mock('./UncontrolledForm', () => ({
  UncontrolledForm: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="uncontrolled-form">
      <h3>Uncontrolled Form</h3>
      <form>
        <div>
          <label htmlFor="name">Name *</label>
          <input id="name" name="name" type="text" required />
        </div>
        <button onClick={onClose}>Close Uncontrolled</button>
      </form>
    </div>
  ),
}));

vi.mock('./DisplayFormData', () => ({
  DataDisplay: () => (
    <div data-testid="data-display">
      <div>No form submissions yet</div>
    </div>
  ),
}));

vi.mock('./Modal', () => ({
  Modal: ({
    isOpen,
    children,
    onClose,
  }: {
    isOpen: boolean;
    children: React.ReactNode;
    onClose: () => void;
  }) =>
    isOpen ? (
      <div data-testid="modal">
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={onClose} aria-label="Close modal">
              ×
            </button>
            {children}
          </div>
        </div>
      </div>
    ) : null,
}));

describe('App', () => {
  it('should render the main application', () => {
    render(<App />);

    expect(screen.getByText('Shared Modal Components')).toBeInTheDocument();
    expect(
      screen.getByText('1. Uncontrolled Components Approach Form')
    ).toBeInTheDocument();
    expect(
      screen.getByText('2. Form Created Using React Hook Form')
    ).toBeInTheDocument();
  });

  it('should open uncontrolled form modal', () => {
    render(<App />);

    fireEvent.click(screen.getByText('1. Open Uncontrolled Form'));
    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('uncontrolled-form')).toBeInTheDocument();
  });

  it('should open controlled form modal', () => {
    render(<App />);

    fireEvent.click(screen.getByText('2. Open Controlled Form'));
    expect(screen.getByTestId('modal')).toBeInTheDocument();

    expect(screen.getAllByText('Controlled Form')[0]).toBeInTheDocument();
    expect(screen.getByTestId('controlled-form')).toBeInTheDocument();
  });

  it('should display data display component', () => {
    render(<App />);

    expect(screen.getByTestId('data-display')).toBeInTheDocument();
    expect(screen.getByText('No form submissions yet')).toBeInTheDocument();
  });
});
