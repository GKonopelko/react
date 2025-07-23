import styles from './styles.module.css';
import { PokemonCard } from '../pokemon-card/pokemonCard';
import { useEffect, useState, useCallback } from 'react';
import type { PokemonDetails, PokemonListItem } from '../../pokemonTypes';

interface ResultsProps {
  resultPokemons: PokemonDetails | PokemonListItem[] | null;
}

export const Results = ({ resultPokemons }: ResultsProps) => {
  const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const loadPokemonDetails = useCallback(
    async (pokemonList: PokemonListItem[]) => {
      setLoading(true);

      try {
        const details = await Promise.all(
          pokemonList.map(async (pokemon) => {
            const response = await fetch(pokemon.url);
            return await response.json();
          })
        );

        setPokemonDetails(details);
      } catch (error) {
        console.error('Error loading pokemon details:', error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const loadInitialData = useCallback(() => {
    if (!resultPokemons) return;

    if (Array.isArray(resultPokemons)) {
      loadPokemonDetails(resultPokemons.slice(0, 100));
    } else {
      setPokemonDetails([resultPokemons]);
    }
  }, [resultPokemons, loadPokemonDetails]);

  useEffect(() => {
    if (resultPokemons) {
      loadInitialData();
    }
  }, [resultPokemons, loadInitialData]);

  if (!resultPokemons) {
    return <div className={styles.results}>No Pokemons :(</div>;
  }

  if (loading) {
    return <div className={styles.results}>Loading pokemon details...</div>;
  }

  return (
    <div className={styles.results}>
      <div className={styles['results-grid']}>
        {pokemonDetails.map((pokemon) => (
          <PokemonCard key={pokemon.id} pokemon={pokemon} />
        ))}
      </div>
    </div>
  );
};
