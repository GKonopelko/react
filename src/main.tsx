import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './global.css';
import { App } from './App';
import {
  ErrorBoundary,
  RouteErrorBoundary,
} from './components/error-boundary/errorBoundary';
import { NotFound } from './components/404-page/404-page';
import { About } from './components/about-page/about';
import { PokemonDetailsPage } from './components/details-page/details-page';
import { Layout } from './components/layout/layout';
import { ThemeProvider } from './components/theme-context/theme-context-provider';
import { fetchPokemonDetails } from './components/api/api';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ErrorBoundary>
        <Layout />
      </ErrorBoundary>
    ),
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: '',
        element: <App />,
        errorElement: <RouteErrorBoundary />,
        children: [
          {
            path: 'details/:id',
            element: <PokemonDetailsPage />,
            errorElement: <RouteErrorBoundary />,
            loader: async ({ params }) => {
              return await fetchPokemonDetails(params.id || '');
            },
          },
        ],
      },
      {
        path: '/about',
        element: <About />,
      },
      {
        path: '*',
        element: <NotFound />,
      },
    ],
  },
]);

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Failed to find the root element');
}

createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <RouterProvider router={router} />
    </ThemeProvider>
  </StrictMode>
);
