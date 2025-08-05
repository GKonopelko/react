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

interface AppState {
  searchResults: PokemonDetails | PokemonListItem[] | null;
  loading: boolean;
  error: string | null;
}

export const App = () => {
  const {
    data: allPokemons,
    isLoading: isAllPokemonsLoading,
    error: allPokemonsError,
  } = useFetchAllPokemons();

  const [searchQuery, setSearchQuery] = useState('');
  const {
    isLoading: isSearchLoading,
    error: searchError,
    refetch: executeSearch,
  } = useSearchPokemon(searchQuery);

  const [state, setState] = useState<AppState>({
    searchResults: null,
    loading: false,
    error: null,
  });

  const [detailsOpen, setDetailsOpen] = useState(false);

  const handleSearch = useCallback(
    async (query: string) => {
      try {
        setDetailsOpen(false);
        setState((prev) => ({ ...prev, loading: true, error: null }));

        if (query.trim() === '') {
          setState({
            searchResults: allPokemons || [],
            loading: isAllPokemonsLoading,
            error: allPokemonsError?.message || null,
          });
          return;
        }

        setSearchQuery(query);
        const { data } = await executeSearch();

        setState({
          searchResults: data || null,
          loading: false,
          error: null,
        });
      } catch (err) {
        setState({
          searchResults: null,
          loading: false,
          error: (err as Error).message,
        });
      }
    },
    [allPokemons, isAllPokemonsLoading, allPokemonsError, executeSearch]
  );

  const loadInitialData = useCallback(() => {
    const savedQuery = localStorage.getItem('poke-monReactQueryContent') || '';
    if (savedQuery.trim() === '') {
      setState({
        searchResults: allPokemons || [],
        loading: isAllPokemonsLoading,
        error: allPokemonsError?.message || null,
      });
    } else {
      handleSearch(savedQuery);
    }
  }, [allPokemons, isAllPokemonsLoading, allPokemonsError, handleSearch]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const handleDismissError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  const handlePokemonSelect = useCallback(() => {
    setDetailsOpen(true);
  }, []);

  const isLoading = state.loading || isAllPokemonsLoading || isSearchLoading;
  const error =
    state.error || searchError?.message || allPokemonsError?.message;

  return (
    <div className={styles.appwrapper}>
      <Header />
      <Controls onSearch={handleSearch} />
      {isLoading && <Loader />}
      {error && <ErrorMessage error={error} onDismiss={handleDismissError} />}
      <ResultsContainer>
        {!isLoading && !error && (
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
