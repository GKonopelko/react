import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';
import styles from './styles.module.css';
import { useRouteError } from 'react-router-dom';
import { NotFound } from '../404-page/404-page';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Error Boundary caught:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className={styles['error-window']}>
          <h2>{this.state.error?.toString()}</h2>
          <p>{this.state.errorInfo?.componentStack}</p>
          <button
            type="button"
            onClick={this.handleReset}
            className={styles['back-button']}
          >
            Back to app
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export function RouteErrorBoundary() {
  const error = useRouteError();
  console.error('Route error:', error);
  return <NotFound />;
}
