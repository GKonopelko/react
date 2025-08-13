import { useCallback } from 'react';

export const usePokemonInitializer = (
  handleSearch: (query: string) => Promise<void>
) => {
  const loadInitialData = useCallback(() => {
    const savedQuery = localStorage.getItem('poke-monReactQueryContent') || '';
    if (savedQuery.trim() === '') return;
    handleSearch(savedQuery);
  }, [handleSearch]);

  return { loadInitialData };
};
