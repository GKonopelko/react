'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PokemonDetailsPage } from '../../../components/details-page/details-page';

const queryClient = new QueryClient();

export default function DetailsPage() {
  return (
    <QueryClientProvider client={queryClient}>
      <PokemonDetailsPage />
    </QueryClientProvider>
  );
}
