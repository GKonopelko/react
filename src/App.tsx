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
import { useSearchPokemon, useFetchAllPokemons } from './components/api/api';
import { useQueryClient } from '@tanstack/react-query';
import { useCacheStatus } from './components/hooks/useCacheStatus';

interface AppState {
  loading: boolean;
  error: string | null;
}

export const App = () => {
  const queryClient = useQueryClient();
  const {
    data: allPokemons,
    isLoading: isAllPokemonsLoading,
    error: allPokemonsError,
  } = useFetchAllPokemons();

  const {
    mutateAsync: executeSearch,
    isPending: isSearchPending,
    error: searchError,
  } = useSearchPokemon();

  const [state, setState] = useState<AppState>({
    loading: false,
    error: null,
  });

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');

  const handleSearch = useCallback(
    async (query: string) => {
      try {
        setCurrentQuery(query);
        setDetailsOpen(false);
        setState((prev) => ({ ...prev, loading: true, error: null }));

        if (query.trim() === '') {
          setState((prev) => ({ ...prev, loading: false }));
          return;
        }

        const cachedData = queryClient.getQueryData<PokemonDetails>([
          'pokemon',
          query,
        ]);
        if (cachedData) {
          setState((prev) => ({ ...prev, loading: false }));
          return;
        }

        await executeSearch(query);
      } catch (err) {
        setState({
          loading: false,
          error: (err as Error).message,
        });
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [executeSearch, queryClient]
  );

  const loadInitialData = useCallback(() => {
    const savedQuery = localStorage.getItem('poke-monReactQueryContent') || '';
    if (savedQuery.trim() === '') {
      setState({
        loading: isAllPokemonsLoading,
        error: allPokemonsError?.message || null,
      });
    } else {
      handleSearch(savedQuery);
    }
  }, [allPokemonsError?.message, handleSearch, isAllPokemonsLoading]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleDismissError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const handlePokemonSelect = useCallback(() => {
    setDetailsOpen(true);
  }, []);

  const handleRefresh = useCallback(() => {
    if (currentQuery.trim() === '') {
      queryClient.invalidateQueries({ queryKey: ['allPokemons'] });
    } else {
      queryClient.invalidateQueries({ queryKey: ['pokemon', currentQuery] });
    }
    handleSearch(currentQuery);
  }, [currentQuery, handleSearch, queryClient]);

  const isLoading = state.loading || isAllPokemonsLoading || isSearchPending;
  const error =
    state.error || searchError?.message || allPokemonsError?.message;

  const displayData =
    currentQuery.trim() === ''
      ? allPokemons || []
      : queryClient.getQueryData<PokemonDetails>(['pokemon', currentQuery]) ||
        null;

  const cacheStatus = useCacheStatus(currentQuery);

  return (
    <div className={styles.appwrapper}>
      <Header onRefresh={handleRefresh} cacheStatus={cacheStatus} />
      <Controls onSearch={handleSearch} />
      {isLoading && <Loader />}
      {error && <ErrorMessage error={error} onDismiss={handleDismissError} />}
      <ResultsContainer>
        {!isLoading && !error && (
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
