import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import styles from './styles.module.css';
import { PokemonCard } from '../pokemon-card/pokemonCard';
import type { PokemonDetails, PokemonListItem } from '../../pokemonTypes';
import { useNavigate, useSearchParams } from 'react-router-dom';

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

  useEffect(() => {
    const pageParam = searchParams.get('page');
    if (!pageParam || isNaN(Number(pageParam)) || Number(pageParam) < 1) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set('page', '1');
      setSearchParams(newParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [allPokemonList, setAllPokemonList] = useState<PokemonListItem[]>([]);
  const resultsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (resultsContainerRef.current) {
      resultsContainerRef.current.style.overflow = 'auto';
      resultsContainerRef.current.style.height = '100vh';
      resultsContainerRef.current.scrollTo(0, 0);
    }
  }, [currentPage]);

  const handlePokemonClick = (id: string) => {
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', String(currentPage));
    navigate(`details/${id}?${newSearchParams.toString()}`);
    onPokemonSelect?.();
  };

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
  }, [loadInitialData]);

  const totalPages = Math.max(
    1,
    Math.ceil(allPokemonList.length / cardsPerPage)
  );
  useEffect(() => {
    if (currentPage < 1 || currentPage > totalPages) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.set('page', '1');
      setSearchParams(newSearchParams, { replace: true });
    }
  }, [currentPage, totalPages, searchParams, setSearchParams]);

  const handlePageChange = (page: number) => {
    if (!Array.isArray(resultPokemons)) return;

    const validatedPage = Math.max(1, Math.min(page, totalPages));
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.set('page', String(validatedPage));
    setSearchParams(newSearchParams);
  };

  if (!resultPokemons) {
    return <div className={styles.results}>No Pokemons :(</div>;
  }

  if (loading) {
    return (
      <div className={styles.results}>
        <div className={styles['spinner-container']}>
          <div className={styles.spinner}></div>
          <div className={styles['loading-text']}>
            Loading pokemon details...
          </div>
        </div>
      </div>
    );
  }

  if (!Array.isArray(resultPokemons)) {
    return (
      <div className={styles['results-list']}>
        <div
          className={styles['card-link']}
          onClick={() => {
            navigate(`details/${resultPokemons.id}?page=1`);
            onPokemonSelect?.();
          }}
        >
          <PokemonCard pokemon={resultPokemons} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={styles.wrapper}
      ref={resultsContainerRef}
      style={{ overflow: 'auto', height: '100vh' }}
    >
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            aria-label="Previous page"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}

      {pokemonDetails.length > 0 ? (
        <div className={styles['results-list']}>
          {pokemonDetails.map((pokemon) => (
            <div
              key={pokemon.id}
              className={styles['card-link']}
              onClick={() => handlePokemonClick(String(pokemon.id))}
              role="button"
              tabIndex={0}
              onKeyDown={(e) =>
                e.key === 'Enter' && handlePokemonClick(String(pokemon.id))
              }
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
