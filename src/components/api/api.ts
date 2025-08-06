import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { PokemonDetails, PokemonListItem } from '../../pokemonTypes';
import { useErrorStore } from '../store/errorStore';

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

export const fetchAllPokemons = async (): Promise<PokemonListItem[]> => {
  let allPokemons: PokemonListItem[] = [];
  let nextUrl: string | null = `${BASE_URL}?limit=500`;

  while (nextUrl) {
    const response = await fetch(nextUrl);
    if (!response.ok) throw new Error('Failed to fetch pokemons');

    const data: { results: PokemonListItem[]; next: string | null } =
      await response.json();
    allPokemons = [...allPokemons, ...data.results];
    nextUrl = data.next;
  }

  return allPokemons;
};

export const searchPokemon = async (query: string): Promise<PokemonDetails> => {
  const response: Response = await fetch(
    `${BASE_URL}/${query.toLowerCase().trim()}`
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

  return await response.json();
};

export const fetchPokemonDetails = async (
  id: string
): Promise<PokemonDetails> => {
  if (!id || !/^\d+$/.test(id)) {
    throw new Error('Invalid Pokemon ID');
  }

  const response = await fetch(`${BASE_URL}/${id}`);

  if (!response.ok) {
    throw new Error('Pokemon not found');
  }

  return await response.json();
};

export const fetchPokemonDetailsByUrl = async (
  url: string
): Promise<PokemonDetails | null> => {
  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${url}:`, error);
    return null;
  }
};

export const useSearchPokemon = () => {
  const { setMainError } = useErrorStore();
  const queryClient = useQueryClient();

  return useMutation<PokemonDetails, Error, string>({
    mutationFn: (query: string) => searchPokemon(query),
    onError: (error: Error) => {
      setMainError(error.message);
    },
    onSuccess: (data, query) => {
      queryClient.setQueryData(['pokemon', query], data);
    },
  });
};

export const useFetchAllPokemons = () => {
  const { setMainError } = useErrorStore();

  return useQuery<PokemonListItem[], Error>({
    queryKey: ['allPokemons'],
    queryFn: async () => {
      try {
        return await fetchAllPokemons();
      } catch (error) {
        setMainError(error instanceof Error ? error.message : 'Unknown error');
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
  });
};

export const useGetCachedPokemon = (name: string) => {
  return useQuery({
    queryKey: ['pokemonSearch', name],
    queryFn: () => null,
    enabled: false,
    staleTime: Infinity,
  });
};

export const useFetchPokemonDetails = (id: string) => {
  return useQuery({
    queryKey: ['pokemonDetails', id],
    queryFn: () => fetchPokemonDetails(id),
    enabled: !!id,
  });
};

export const useFetchPokemonDetailsByUrl = (url: string) => {
  return useQuery({
    queryKey: ['pokemonDetailsByUrl', url],
    queryFn: () => fetchPokemonDetailsByUrl(url),
    enabled: !!url,
  });
};
