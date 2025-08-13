import { useState, useEffect, useCallback } from 'react';
import styles from './App.module.css';
import type { PokemonDetails, PokemonListItem } from './pokemonTypes';
import { Controls } from './components/controls/controls';
import { ErrorMessage } from './components/error-message/error-message';
import { Loader } from './components/loader/loader';
import { Results } from './components/results/results';
import { Outlet } from 'react-router-dom';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';
import { ResultsContainer } from './components/results-container/results-container';
import { Flyout } from './components/flyout/flyout';
import { useQueryClient } from '@tanstack/react-query';
import { useFetchAllPokemons, useSearchPokemon } from './utils/api';
import { useErrorStore } from './utils/store/errorStore';
import { useCacheStatus } from './utils/useCacheStatus';
import { usePokemonData } from './utils/usePokemonData';
import { usePokemonSearch } from './utils/usePokemonSearch';

export const App = () => {
  const queryClient = useQueryClient();
  const { data: allPokemons, isLoading: isAllPokemonsLoading } =
    useFetchAllPokemons();
  const { mutateAsync: executeSearch, isPending: isSearchPending } =
    useSearchPokemon();
  const { mainError, dismissError } = useErrorStore();
  const [detailsOpen, setDetailsOpen] = useState(false);

  const { currentQuery, setCurrentQuery, loading, handleRefresh } =
    usePokemonData();
  const { handleSearch } = usePokemonSearch();

  const wrappedHandleSearch = useCallback(
    async (query: string) => {
      try {
        setCurrentQuery(query);
        setDetailsOpen(false);
        await handleSearch(query);
      } catch (err) {
        console.error('Search error:', err);
      }
    },
    [handleSearch, setCurrentQuery]
  );

  const wrappedHandleRefresh = useCallback(async () => {
    try {
      await handleRefresh(currentQuery, executeSearch);
    } catch (err) {
      console.error('Refresh error:', err);
    }
  }, [handleRefresh, currentQuery, executeSearch]);

  const loadInitialData = useCallback(() => {
    const savedQuery = localStorage.getItem('poke-monReactQueryContent') || '';
    if (savedQuery.trim() === '') return;
    wrappedHandleSearch(savedQuery);
  }, [wrappedHandleSearch]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handlePokemonSelect = useCallback(() => {
    setDetailsOpen(true);
  }, []);

  const isLoading = loading || isAllPokemonsLoading || isSearchPending;
  const displayData =
    currentQuery.trim() === ''
      ? allPokemons || []
      : queryClient.getQueryData<PokemonDetails>(['pokemon', currentQuery]) ||
        null;
  const cacheStatus = useCacheStatus(currentQuery);

  return (
    <div className={styles.appwrapper}>
      <Header onRefresh={wrappedHandleRefresh} cacheStatus={cacheStatus} />
      <Controls onSearch={wrappedHandleSearch} />

      {isLoading && <Loader />}
      {mainError && <ErrorMessage error={mainError} onDismiss={dismissError} />}

      <ResultsContainer>
        {!isLoading && !mainError && (
          <Results
            resultPokemons={
              displayData as PokemonListItem[] | PokemonDetails | null
            }
            onPokemonSelect={handlePokemonSelect}
            currentQuery={currentQuery}
          />
        )}
        {detailsOpen && <Outlet />}
      </ResultsContainer>

      <Flyout />
      <Footer />
    </div>
  );
};
