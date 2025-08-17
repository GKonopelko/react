'use client';

import { useSearchParams } from 'next/navigation';
import { Results } from '../components/results/results';
import type { PokemonListItem } from '../pokemonTypes';

export function PageClient({
  allPokemons,
}: {
  allPokemons: PokemonListItem[];
}) {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get('page');
  const page = pageParam ? Math.max(1, parseInt(pageParam) || 1) : 1;

  return <Results resultPokemons={allPokemons} currentPage={page} />;
}
