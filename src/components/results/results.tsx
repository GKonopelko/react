import { useMemo } from 'react';
import styles from './styles.module.css';
import { PokemonCard } from '../pokemon-card/pokemonCard';
import type { PokemonDetails, PokemonListItem } from '../../pokemonTypes';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckboxWrapper } from '../checkbox-wrapper/checkbox-wrapper';
import { useQuery } from '@tanstack/react-query';
import { fetchPokemonDetailsByUrl } from '../api/api';
import { Loader } from '../loader/loader';

interface ResultsProps {
  resultPokemons: PokemonDetails | PokemonListItem[] | null;
  cardsPerPage?: number;
  onPokemonSelect?: () => void;
}

const CARDS_PER_PAGE = 10;

export const Results = ({
  resultPokemons,
  cardsPerPage = CARDS_PER_PAGE,
  onPokemonSelect,
}: ResultsProps) => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = useMemo(() => {
    const page = Number(searchParams.get('page'));
    return isNaN(page) || page < 1 ? 1 : page;
  }, [searchParams]);

  const isPaginated = Array.isArray(resultPokemons);

  const { data: pokemonDetails, isLoading } = useQuery({
    queryKey: ['pokemonDetails', currentPage, resultPokemons],
    queryFn: async () => {
      if (!isPaginated || !resultPokemons) return [];

      const start = (currentPage - 1) * cardsPerPage;
      const end = start + cardsPerPage;
      const pagePokemons = resultPokemons.slice(start, end);

      const details = await Promise.all(
        pagePokemons.map((pokemon) => fetchPokemonDetailsByUrl(pokemon.url))
      );

      return details.filter(Boolean) as PokemonDetails[];
    },
    enabled: isPaginated,
    staleTime: 5 * 60 * 1000,
  });

  const totalPages = useMemo(() => {
    return isPaginated && resultPokemons
      ? Math.max(1, Math.ceil(resultPokemons.length / cardsPerPage))
      : 1;
  }, [resultPokemons, isPaginated, cardsPerPage]);

  const handlePokemonClick = (id: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', String(currentPage));
    navigate(`details/${id}?${newSearchParams.toString()}`);
    onPokemonSelect?.();
  };

  const handlePageChange = (page: number) => {
    if (!isPaginated) return;

    const validatedPage = Math.max(1, Math.min(page, totalPages));
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', String(validatedPage));
    setSearchParams(newSearchParams);
  };

  if (!resultPokemons) {
    return <div className={styles.results}>No Pokemons found</div>;
  }

  if (isLoading) {
    return (
      <div className={styles.results}>
        <Loader />
      </div>
    );
  }

  if (!isPaginated) {
    return (
      <div className={styles['results-list']}>
        <div
          className={styles['card-link']}
          onClick={() => handlePokemonClick(resultPokemons.id.toString())}
        >
          <PokemonCard pokemon={resultPokemons} />
        </div>
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
      <div className={styles.timestamp}>
        Results last updated: {new Date().toLocaleTimeString()}
      </div>
      {pokemonDetails?.length ? (
        <div className={styles['results-list']}>
          {pokemonDetails.map((pokemon) => (
            <div
              key={pokemon.id}
              className={styles['card-link']}
              onClick={() => handlePokemonClick(pokemon.id.toString())}
            >
              <PokemonCard pokemon={pokemon} />
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.results}>No pokemons on this page</div>
      )}
    </div>
  );
};
