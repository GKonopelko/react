'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import dynamic from 'next/dynamic';

const queryClient = new QueryClient();

const App = dynamic(() => import('../../App'), { ssr: false });

export function ClientOnly() {
  return (
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  );
}
