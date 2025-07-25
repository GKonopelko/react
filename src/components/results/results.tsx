import { useState, useEffect, useCallback } from 'react';
import styles from './styles.module.css';
import { PokemonCard } from '../pokemon-card/pokemonCard';
import type { PokemonDetails, PokemonListItem } from '../../pokemonTypes';
import { Link, useSearchParams } from 'react-router-dom';

interface ResultsProps {
  resultPokemons: PokemonDetails | PokemonListItem[] | null;
  cardsPerPage?: number;
}

const CARDS_PER_PAGE = 10;

export const Results = ({
  resultPokemons,
  cardsPerPage = CARDS_PER_PAGE,
}: ResultsProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = Number(searchParams.get('page')) || 1;
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [allPokemonList, setAllPokemonList] = useState<PokemonListItem[]>([]);

  const loadPageData = useCallback(
    async (pokemonList: PokemonListItem[], page: number) => {
      setLoading(true);
      try {
        const start = (page - 1) * cardsPerPage;
        const end = start + cardsPerPage;
        const pagePokemons = pokemonList.slice(start, end);

        const details = await Promise.all(
          pagePokemons.map(async (pokemon) => {
            try {
              const response = await fetch(pokemon.url);
              if (!response.ok) return null;
              return await response.json();
            } catch (error) {
              console.error(`Error fetching ${pokemon.url}:`, error);
              return null;
            }
          })
        );

        setPokemonDetails(details.filter(Boolean));
      } catch (error) {
        console.error('Error loading page data:', error);
      } finally {
        setLoading(false);
      }
    },
    [cardsPerPage]
  );

  const loadInitialData = useCallback(() => {
    if (!resultPokemons) return;

    if (Array.isArray(resultPokemons)) {
      setAllPokemonList(resultPokemons);
      loadPageData(resultPokemons, currentPage);
    } else {
      setPokemonDetails([resultPokemons]);
      setAllPokemonList([]);
    }
  }, [resultPokemons, currentPage, loadPageData]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData, currentPage]);

  const handlePageChange = (page: number) => {
    if (!Array.isArray(resultPokemons)) return;

    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', String(page));
    setSearchParams(newSearchParams);
    window.scrollTo(0, 0);
  };

  if (!resultPokemons) {
    return <div className={styles.results}>No Pokemons :(</div>;
  }

  if (loading) {
    return <div className={styles.results}>Loading pokemon details...</div>;
  }

  if (!Array.isArray(resultPokemons)) {
    return (
      <div className={styles.results}>
        <div className={styles['results-grid']}>
          <PokemonCard pokemon={resultPokemons} />
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(allPokemonList.length / cardsPerPage);

  return (
    <div className={styles.wrapper}>
      {totalPages > 1 && (
        <div className={styles.pagination}>
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
        </div>
      )}
      <div className={styles['results-list']}>
        {pokemonDetails.map((pokemon) => (
          <Link
            to={`details/${pokemon.id}?page=${currentPage}`}
            key={pokemon.id}
            className={styles['card-link']}
          >
            <PokemonCard pokemon={pokemon} />
          </Link>
        ))}
      </div>
    </div>
  );
};
