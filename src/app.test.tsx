import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import App from './App';

vi.mock('../../src/ControlledForm', () => ({
  ControlledForm: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="controlled-form">
      <button onClick={onClose}>Close Controlled</button>
    </div>
  ),
}));

vi.mock('../../src/UncontrolledForm', () => ({
  UncontrolledForm: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="uncontrolled-form">
      <button onClick={onClose}>Close Uncontrolled</button>
    </div>
  ),
}));

vi.mock('../../src/DisplayFormData', () => ({
  DataDisplay: () => <div data-testid="data-display">Data Display</div>,
}));

vi.mock('../../src/Modal', () => ({
  Modal: ({
    isOpen,
    children,
  }: {
    isOpen: boolean;
    children: React.ReactNode;
  }) => (isOpen ? <div data-testid="modal">{children}</div> : null),
}));

describe.skip('App', () => {
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
    expect(screen.getByTestId('controlled-form')).toBeInTheDocument();
  });

  it('should display data display component', () => {
    render(<App />);

    expect(screen.getByTestId('data-display')).toBeInTheDocument();
  });
});
