import { useQueryClient } from '@tanstack/react-query';
import { useFetchAllPokemons } from './api';
import type { PokemonDetails } from '../pokemonTypes';

export const usePokemonDisplayData = (currentQuery: string) => {
  const queryClient = useQueryClient();
  const { data: allPokemons, isLoading: isAllPokemonsLoading } =
    useFetchAllPokemons();

  const displayData =
    currentQuery.trim() === ''
      ? allPokemons || []
      : queryClient.getQueryData<PokemonDetails>(['pokemon', currentQuery]) ||
        null;

  return {
    displayData,
    isAllPokemonsLoading,
  };
};
