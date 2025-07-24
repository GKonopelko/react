import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { App } from './App';
import { ErrorBoundary } from './components/error-boundary/errorBoundary';
import { NotFound } from './components/404-page/404-page';
import { About } from './components/about-page/about';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: (
      <ErrorBoundary>
        <NotFound />
      </ErrorBoundary>
    ),
  },
  {
    path: '/about',
    element: <About />,
  },
]);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

createRoot(rootElement).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
