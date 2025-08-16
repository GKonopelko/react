'use client';

import { Suspense, useCallback, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Controls } from '../components/controls/controls';
import { ErrorMessage } from '../components/error-message/error-message';
import { Loader } from '../components/loader/loader';
import { Results } from '../components/results/results';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';
import { ResultsContainer } from '../components/results-container/results-container';
import { Flyout } from '../components/flyout/flyout';
import { useSearchPokemon } from '../utils/api';
import { useErrorStore } from '../utils/store/errorStore';
import { useCacheStatus } from '../utils/useCacheStatus';
import { usePokemonData } from '../utils/usePokemonData';
import { usePokemonSearch } from '../utils/usePokemonSearch';
import { usePokemonDisplayData } from '../utils/usePokemonDisplayData';
import { usePokemonInitializer } from '../utils/usePokemonInitializer';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { PokemonDetailsPage } from '../components/details-page/details-page';

const queryClient = new QueryClient();

export default function HomePage() {
  return (
    <QueryClientProvider client={queryClient}>
      <Suspense fallback={<Loader />}>
        <PokemonList />
      </Suspense>
    </QueryClientProvider>
  );
}

function PokemonList() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { mainError, dismissError } = useErrorStore();
  const { currentQuery, loading, handleRefresh } = usePokemonData();
  const { handleSearch } = usePokemonSearch();
  const { displayData, isAllPokemonsLoading } =
    usePokemonDisplayData(currentQuery);
  const { loadInitialData } = usePokemonInitializer(handleSearch);
  const { mutateAsync: executeSearch, isPending: isSearchPending } =
    useSearchPokemon();
  const cacheStatus = useCacheStatus(currentQuery);

  const pokemonId = searchParams.get('details');

  const wrappedHandleSearch = useCallback(
    async (query: string) => {
      try {
        await handleSearch(query);
      } catch (err) {
        console.error('Search error:', err);
      }
    },
    [handleSearch]
  );

  const wrappedHandleRefresh = useCallback(async () => {
    try {
      await handleRefresh(currentQuery, executeSearch);
    } catch (err) {
      console.error('Refresh error:', err);
    }
  }, [handleRefresh, currentQuery, executeSearch]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handlePokemonSelect = useCallback(
    (id: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('details', id);
      router.push(`${pathname}?${params.toString()}`);
    },
    [router, pathname, searchParams]
  );

  const handleCloseDetails = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('details');
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const isLoading = loading || isAllPokemonsLoading || isSearchPending;

  return (
    <div>
      <Header onRefresh={wrappedHandleRefresh} cacheStatus={cacheStatus} />
      <Controls onSearch={wrappedHandleSearch} />

      {isLoading && <Loader />}
      {mainError && <ErrorMessage error={mainError} onDismiss={dismissError} />}

      <ResultsContainer>
        {!isLoading && !mainError && (
          <Results
            resultPokemons={displayData}
            onPokemonSelect={handlePokemonSelect}
            currentQuery={currentQuery}
          />
        )}
        {pokemonId && (
          <PokemonDetailsPage id={pokemonId} onClose={handleCloseDetails} />
        )}
      </ResultsContainer>

      <Flyout />
      <Footer />
    </div>
  );
}
