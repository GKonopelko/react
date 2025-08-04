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
import { fetchAllPokemons, searchPokemon } from './components/api/api';

interface AppState {
  searchResults: PokemonDetails | PokemonListItem[] | null;
  loading: boolean;
  error: string | null;
}

export const App = () => {
  const [state, setState] = useState<AppState>({
    searchResults: null,
    loading: false,
    error: null,
  });

  const handleSearch = useCallback(async (query: string) => {
    try {
      setDetailsOpen(false);
      setState((prev) => ({
        ...prev,
        loading: true,
        error: null,
        searchResults: null,
      }));

      if (query.trim() === '') {
        const allPokemons = await fetchAllPokemons();
        setState((prev) => ({
          ...prev,
          searchResults: allPokemons,
          loading: false,
        }));
        return;
      }

      const data = await searchPokemon(query);
      setState((prev) => ({
        ...prev,
        searchResults: data,
        loading: false,
      }));
    } catch (err) {
      setState((prev) => ({
        ...prev,
        error: err instanceof Error ? err.message : 'Unknown error',
        searchResults: null,
        loading: false,
      }));
    }
  }, []);

  const loadInitialData = useCallback(async () => {
    const savedQuery = localStorage.getItem('poke-monReactQueryContent') || '';
    if (savedQuery.trim() === '') {
      setState((prev) => ({ ...prev, loading: true }));
      const allPokemons = await fetchAllPokemons();
      setState((prev) => ({
        ...prev,
        searchResults: allPokemons,
        loading: false,
      }));
    } else {
      await handleSearch(savedQuery);
    }
  }, [handleSearch]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleDismissError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const [detailsOpen, setDetailsOpen] = useState(false);
  const handlePokemonSelect = useCallback(() => {
    setDetailsOpen(true);
  }, []);

  return (
    <div className={styles.appwrapper}>
      <Header />
      <Controls onSearch={handleSearch} />
      {state.loading && <Loader />}
      {state.error && (
        <ErrorMessage error={state.error} onDismiss={handleDismissError} />
      )}
      <ResultsContainer>
        {!state.loading && !state.error && (
          <Results
            resultPokemons={state.searchResults}
            onPokemonSelect={handlePokemonSelect}
          />
        )}
        {detailsOpen && <Outlet />}
      </ResultsContainer>
      <Flyout />
      <Footer />
    </div>
  );
};
