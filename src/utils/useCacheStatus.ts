import { useQueryClient } from '@tanstack/react-query';

export interface CacheStatus {
  message: string;
  isFresh: boolean;
  updatedAt: string | null;
}

export const useCacheStatus = (currentQuery: string): CacheStatus => {
  const queryClient = useQueryClient();

  const getCacheStatus = (): CacheStatus => {
    if (currentQuery.trim() === '') {
      const allPokemonsState = queryClient.getQueryState(['allPokemons']);
      return {
        message: allPokemonsState
          ? `All Pokemons cached (${new Date(allPokemonsState.dataUpdatedAt).toLocaleTimeString()})`
          : 'Loading all Pokemons...',
        isFresh: !!allPokemonsState,
        updatedAt: allPokemonsState?.dataUpdatedAt
          ? new Date(allPokemonsState.dataUpdatedAt).toLocaleTimeString()
          : null,
      };
    } else {
      const pokemonState = queryClient.getQueryState(['pokemon', currentQuery]);
      return {
        message: pokemonState
          ? `${currentQuery} cached (${new Date(pokemonState.dataUpdatedAt).toLocaleTimeString()})`
          : `Searching for ${currentQuery}...`,
        isFresh: !!pokemonState,
        updatedAt: pokemonState?.dataUpdatedAt
          ? new Date(pokemonState.dataUpdatedAt).toLocaleTimeString()
          : null,
      };
    }
  };

  return getCacheStatus();
};
