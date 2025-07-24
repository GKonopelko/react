import { useState, useEffect, useCallback } from 'react';
import './App.css';
import type { PokemonDetails, PokemonListItem } from './pokemonTypes';
import { Main } from './components/main/main-logic';

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

  const fetchAllPokemons = useCallback(async (): Promise<PokemonListItem[]> => {
    let allPokemons: PokemonListItem[] = [];
    let nextUrl: string | null = 'https://pokeapi.co/api/v2/pokemon?limit=500';

    while (nextUrl) {
      const response = await fetch(nextUrl);
      if (!response.ok) throw new Error('Failed to fetch pokemons');
      const data: { results: PokemonListItem[]; next: string | null } =
        await response.json();
      allPokemons = [...allPokemons, ...data.results];
      nextUrl = data.next;
    }
    return allPokemons;
  }, []);

  const handleSearch = useCallback(
    async (query: string) => {
      try {
        setState((prev) => ({
          ...prev,
          loading: true,
          error: null,
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

        const response: Response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase().trim()}`
        );

        if (!response.ok) {
          let errorMessage = 'Error';
          if (response.status === 404) {
            errorMessage = `Pokemon "${query}" not found`;
          } else if (response.status >= 500) {
            errorMessage = 'Server error';
          } else if (response.status === 401) {
            errorMessage = 'Authentication required';
          } else {
            errorMessage = `Request failed ${response.status}`;
          }
          throw new Error(errorMessage);
        }

        const data: PokemonDetails = await response.json();
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
    },
    [fetchAllPokemons]
  );

  useEffect(() => {
    const savedQuery = localStorage.getItem('poke-monReactQueryContent') || '';
    handleSearch(savedQuery);
  }, [handleSearch]);

  const handleDismissError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return (
    <Main
      searchResults={state.searchResults}
      loading={state.loading}
      error={state.error}
      onSearch={handleSearch}
      onDismissError={handleDismissError}
    />
  );
};
