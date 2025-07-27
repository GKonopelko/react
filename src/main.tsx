import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css';
import { App } from './App';
import {
  ErrorBoundary,
  RouteErrorBoundary,
} from './components/error-boundary/errorBoundary';
import { NotFound } from './components/404-page/404-page';
import { About } from './components/about-page/about';
import { PokemonDetailsPage } from './components/details-page/details-page';
import { Layout } from './components/layout/layout';
import type { PokemonDetails } from './pokemonTypes';

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
              if (!params.id || !/^\d+$/.test(params.id)) {
                throw new Response('Invalid Pokemon ID', { status: 404 });
              }

              const response = await fetch(
                `https://pokeapi.co/api/v2/pokemon/${params.id}`
              );

              if (!response.ok) {
                throw new Response('Pokémon not found', { status: 404 });
              }

              return (await response.json()) as PokemonDetails;
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
    <RouterProvider router={router} />
  </StrictMode>
);
