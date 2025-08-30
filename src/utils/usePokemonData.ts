import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { fetchAllPokemons } from '../utils/api';
import { useErrorStore } from '../utils/store/errorStore';

export const usePokemonData = () => {
  const queryClient = useQueryClient();
  const { setMainError } = useErrorStore();
  const [currentQuery, setCurrentQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRefresh = useCallback(
    async (query: string, executeSearch: (q: string) => Promise<unknown>) => {
      try {
        setLoading(true);
        setMainError(null);

        if (query.trim() === '') {
          await queryClient.resetQueries({ queryKey: ['allPokemons'] });
          await queryClient.prefetchQuery({
            queryKey: ['allPokemons'],
            queryFn: fetchAllPokemons,
          });
        } else {
          await queryClient.resetQueries({ queryKey: ['pokemon', query] });
          await executeSearch(query);
        }
      } catch (err) {
        setMainError((err as Error).message);
      } finally {
        setLoading(false);
      }
    },
    [queryClient, setMainError]
  );

  return {
    currentQuery,
    setCurrentQuery,
    loading,
    handleRefresh,
  };
};
