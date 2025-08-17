'use client';

import { useMemo } from 'react';
import styles from './styles.module.css';
import type { PokemonListItem } from '../../pokemonTypes';
import { useSearchParams } from 'next/navigation';
import { CheckboxWrapper } from '../checkbox-wrapper/checkbox-wrapper';
import Image from 'next/image';

interface ResultsProps {
  resultPokemons: PokemonListItem[];
  currentPage: number;
  cardsPerPage?: number;
}

const CARDS_PER_PAGE = 10;

export const Results = ({
  resultPokemons,
  currentPage = 1,
  cardsPerPage = CARDS_PER_PAGE,
}: ResultsProps) => {
  const searchParams = useSearchParams();
  const query = searchParams.get('search') || '';

  const displayData = useMemo(() => {
    if (!query) return resultPokemons;

    const filtered = resultPokemons.filter(
      (pokemon) =>
        pokemon.name.toLowerCase().includes(query.toLowerCase()) ||
        pokemon.url.split('/').slice(-2, -1)[0] === query
    );

    return filtered.length > 0 ? filtered : resultPokemons;
  }, [resultPokemons, query]);

  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    return displayData.slice(start, end);
  }, [displayData, currentPage, cardsPerPage]);

  const totalPages = Math.max(1, Math.ceil(displayData.length / cardsPerPage));

  const handlePageChange = (page: number) => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', String(page));
    window.history.pushState(null, '', `?${newSearchParams.toString()}`);
  };

  if (query && displayData.length === 0) {
    return (
      <div className={styles.noResults}>
        <p>No pokemons found for &quot;{query}&quot;</p>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <CheckboxWrapper
            id="pagination"
            name="pagination"
            description="pages pagination"
          >
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
            <span>
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </CheckboxWrapper>
        </div>
      )}

      <div className={styles['results-list']}>
        {paginatedResults.map((pokemon) => {
          const pokemonId = pokemon.url.split('/').slice(-2, -1)[0];

          return (
            <CheckboxWrapper
              key={pokemon.name}
              id={pokemon.name}
              name={pokemon.name}
              description={`Pokemon ${pokemon.name}`}
            >
              <div className={styles['pokemon-item']}>
                <div className={styles.imageContainer}>
                  <Image
                    src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                    alt={pokemon.name}
                    width={96}
                    height={96}
                    className={styles.image}
                  />
                </div>
                <h3>{pokemon.name}</h3>
                <p>ID: {pokemonId}</p>
              </div>
            </CheckboxWrapper>
          );
        })}
      </div>
    </div>
  );
};
