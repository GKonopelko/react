'use client';

import { useMemo } from 'react';
import styles from './styles.module.css';
import type { PokemonListItem } from '../../pokemonTypes';
import { useRouter, useSearchParams } from 'next/navigation';
import { CheckboxWrapper } from '../checkbox-wrapper/checkbox-wrapper';

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
  const router = useRouter();
  const searchParams = useSearchParams();

  const paginatedResults = useMemo(() => {
    const start = (currentPage - 1) * cardsPerPage;
    const end = start + cardsPerPage;
    return resultPokemons.slice(start, end);
  }, [resultPokemons, currentPage, cardsPerPage]);

  const totalPages = Math.max(
    1,
    Math.ceil(resultPokemons.length / cardsPerPage)
  );

  const handlePageChange = (page: number) => {
    const validatedPage = Math.max(1, Math.min(page, totalPages));
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('page', String(validatedPage));
    router.push(`?${newSearchParams.toString()}`);
  };

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
        {paginatedResults.map((pokemon) => (
          <div key={pokemon.name} className={styles['pokemon-item']}>
            <h3>{pokemon.name}</h3>
            <p>URL: {pokemon.url}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
