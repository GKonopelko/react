import styles from './styles.module.css';
import { CheckboxWrapper } from '../checkbox-wrapper/checkbox-wrapper';
import type { PokemonDetails } from '../../pokemonTypes';
import Image from 'next/image';

interface DetailsCardProps {
  pokemon: PokemonDetails;
  onClose: () => void;
}

export const DetailsCard = ({ pokemon, onClose }: DetailsCardProps) => {
  const artworkUrl = pokemon.sprites.other?.['official-artwork']?.front_default;
  const fallbackUrl = pokemon.sprites.front_default;

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

          {artworkUrl || fallbackUrl ? (
            <Image
              src={artworkUrl || fallbackUrl || ''}
              alt={`Official artwork of ${pokemon.name}`}
              width={200}
              height={200}
              className={styles.artwork}
              priority={true}
            />
          ) : (
            <div className={styles.placeholder}>No image available</div>
          )}

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
