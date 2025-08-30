'use client';

import { useSearchParams } from 'next/navigation';
import { Results } from '../components/results/results';
import type { PokemonListItem } from '../pokemonTypes';

interface PageClientProps {
  allPokemons: PokemonListItem[];
}

export function PageClient({ allPokemons }: PageClientProps) {
  const page = Math.max(1, Number(useSearchParams().get('page')) || 1);

  return <Results resultPokemons={allPokemons} currentPage={page} />;
}
