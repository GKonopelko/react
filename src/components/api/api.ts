import { useQuery } from '@tanstack/react-query';
import type { PokemonDetails, PokemonListItem } from '../../pokemonTypes';

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
///test
export const useFetchAllPokemons = () => {
  return useQuery({
    queryKey: ['allPokemons'],
    queryFn: fetchAllPokemons,
    staleTime: 5 * 60 * 1000,
  });
};

// export const useSearchPokemon = (query: string) => {
//   return useQuery({
//     queryKey: ['searchPokemon', query],
//     queryFn: () => searchPokemon(query),
//     enabled: !!query,
//   });
// };

// export const useFetchPokemonDetails = (id: string) => {
//   return useQuery({
//     queryKey: ['pokemonDetails', id],
//     queryFn: () => fetchPokemonDetails(id),
//     enabled: !!id,
//   });
// };

// export const useFetchPokemonDetailsByUrl = (url: string) => {
//   return useQuery({
//     queryKey: ['pokemonDetailsByUrl', url],
//     queryFn: () => fetchPokemonDetailsByUrl(url),
//     enabled: !!url,
//   });
// };
