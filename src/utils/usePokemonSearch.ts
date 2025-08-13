import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useSearchPokemon } from '../utils/api';
import { useErrorStore } from '../utils/store/errorStore';

export const usePokemonSearch = () => {
  const queryClient = useQueryClient();
  const { mutateAsync: executeSearch } = useSearchPokemon();
  const { setMainError } = useErrorStore();

  const handleSearch = useCallback(
    async (query: string) => {
      try {
        setMainError(null);

        if (query.trim() === '') {
          queryClient.removeQueries({ queryKey: ['pokemon'] });
          return;
        }

        const cachedData = queryClient.getQueryData(['pokemon', query]);
        if (cachedData) return;

        await executeSearch(query);
      } catch (err) {
        setMainError((err as Error).message);
        throw err;
      }
    },
    [executeSearch, queryClient, setMainError]
  );

  return { handleSearch };
};
