import { useLoaderData } from 'react-router-dom';
import styles from './styles.module.css';
import type { PokemonDetails } from '../../pokemonTypes';
import { CheckboxWrapper } from '../checkbox-wrapper/checkbox-wrapper';

interface DetailsCardProps {
  onClose: () => void;
}

export const DetailsCard = ({ onClose }: DetailsCardProps) => {
  const pokemon = useLoaderData() as PokemonDetails;

  if (!pokemon)
    return (
      <div className={styles['details-error']}>Error: Pokemon not found</div>
    );

  return (
    <div className={styles.wrapper}>
      <CheckboxWrapper
        id={`pokemon-details-${pokemon.id}`}
        name="details"
        description="pokemon details"
      >
        <div className={styles['details-card']}>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
          <h2>{pokemon.name}</h2>
          <img
            src={
              pokemon.sprites.other?.['official-artwork']?.front_default ?? ''
            }
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
    </div>
  );
};
