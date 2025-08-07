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
import {
  useSearchPokemon,
  useFetchAllPokemons,
  fetchAllPokemons,
} from './components/api/api';
import { useQueryClient } from '@tanstack/react-query';
import { useCacheStatus } from './components/hooks/useCacheStatus';
import { useErrorStore } from './components/store/errorStore';

interface AppState {
  loading: boolean;
}

export const App = () => {
  const queryClient = useQueryClient();
  const { data: allPokemons, isLoading: isAllPokemonsLoading } =
    useFetchAllPokemons();

  const { mutateAsync: executeSearch, isPending: isSearchPending } =
    useSearchPokemon();

  const { mainError, setMainError, dismissError } = useErrorStore();

  const [state, setState] = useState<AppState>({
    loading: false,
  });

  const [detailsOpen, setDetailsOpen] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');

  const handleSearch = useCallback(
    async (query: string) => {
      try {
        setCurrentQuery(query);
        setDetailsOpen(false);
        setState((prev) => ({ ...prev, loading: true }));
        setMainError(null);

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
        setMainError((err as Error).message);
        setState((prev) => ({ ...prev, loading: false }));
      } finally {
        setState((prev) => ({ ...prev, loading: false }));
      }
    },
    [executeSearch, queryClient, setMainError]
  );

  const loadInitialData = useCallback(() => {
    const savedQuery = localStorage.getItem('poke-monReactQueryContent') || '';
    if (savedQuery.trim() === '') {
      setState({
        loading: isAllPokemonsLoading,
      });
    } else {
      handleSearch(savedQuery);
    }
  }, [handleSearch, isAllPokemonsLoading]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handlePokemonSelect = useCallback(() => {
    setDetailsOpen(true);
  }, []);

  const handleRefresh = useCallback(async () => {
    try {
      setState((prev) => ({ ...prev, loading: true }));
      setMainError(null);

      if (currentQuery.trim() === '') {
        await queryClient.resetQueries({ queryKey: ['allPokemons'] });
        await queryClient.prefetchQuery({
          queryKey: ['allPokemons'],
          queryFn: fetchAllPokemons,
        });
      } else {
        await queryClient.resetQueries({ queryKey: ['pokemon', currentQuery] });
        await executeSearch(currentQuery);
      }
    } catch (err) {
      setMainError((err as Error).message);
    } finally {
      setState((prev) => ({ ...prev, loading: false }));
    }
  }, [currentQuery, executeSearch, queryClient, setMainError]);

  const isLoading = state.loading || isAllPokemonsLoading || isSearchPending;
  const error = mainError;

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
      {error && <ErrorMessage error={error} onDismiss={dismissError} />}
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
