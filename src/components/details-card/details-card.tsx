import { useState, useEffect } from 'react';
import styles from './styles.module.css';
import type { PokemonDetails } from '../../pokemonTypes';
import { CheckboxWrapper } from '../checkbox-wrapper/checkbox-wrapper';

interface DetailsCardProps {
  pokemonId: string;
  onClose: () => void;
}

export const DetailsCard = ({ pokemonId, onClose }: DetailsCardProps) => {
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
        );
        if (!response.ok) throw new Error('Pokemon not found');
        const data = await response.json();
        setPokemon(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    fetchPokemon();
  }, [pokemonId]);

  if (loading)
    return (
      <div className={styles['details-loading']}>
        <div className={styles['details-spinner']}></div>
        <div className={styles['details-loading-text']}>Loading details...</div>
      </div>
    );

  if (error)
    return <div className={styles['details-error']}>Error: {error}</div>;
  if (!pokemon) return null;

  return (
    <CheckboxWrapper id="details" name="details" description="pokemon details">
      <div className={styles['details-card']}>
        <button className={styles.closeButton} onClick={onClose}>
          ×
        </button>
        <h2>{pokemon.name}</h2>
        <img
          src={pokemon.sprites.other?.['official-artwork']?.front_default ?? ''}
          alt={pokemon.name}
          className={styles['pokemon-big-img']}
        />
        <div className={styles.stats}>
          {pokemon.stats.map((stat) => (
            <div key={stat.stat.name}>
              <span>{stat.stat.name}:</span>
              <span>{stat.base_stat}</span>
            </div>
          ))}
        </div>
      </div>
    </CheckboxWrapper>
  );
};
