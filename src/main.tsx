import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom';
import './index.css';
import { App } from './App';
import { ErrorBoundary } from './components/error-boundary/errorBoundary';
import { NotFound } from './components/404-page/404-page';
import { About } from './components/about-page/about';
import { PokemonDetailsPage } from './components/details-page/details-page';
import { Layout } from './components/layout/layout';

export const ResultsWrapper = () => {
  return <Outlet />;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    errorElement: (
      <ErrorBoundary>
        <NotFound />
      </ErrorBoundary>
    ),
    children: [
      {
        path: '',
        element: <App />,
        children: [
          {
            path: 'details/:id',
            element: <PokemonDetailsPage />,
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
    <RouterProvider router={router} />
  </StrictMode>
);
