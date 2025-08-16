import { CheckboxWrapper } from '../checkbox-wrapper/checkbox-wrapper';
import styles from './styles.module.css';
import type { PokemonDetails } from '../../pokemonTypes';
import Image from 'next/image';

interface PokemonCardProps {
  pokemon: PokemonDetails;
}

export const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  const description = `Pokemon ID: ${pokemon.id}, Height: ${pokemon.height / 10}m, Weight: ${pokemon.weight / 10}kg`;
  return (
    <CheckboxWrapper
      id={pokemon.id.toString()}
      name={pokemon.name}
      description={description}
    >
      <div className={styles.wrapper}>
        <Image
          src={pokemon.sprites.front_default}
          alt={`${pokemon.name} sprite`}
          width={96}
          height={96}
          className={styles.image}
          priority={false}
        />
        <h3 className={styles.name}>{pokemon.name}</h3>
        <div className={styles.description}>
          <p className={styles.id}>ID: {pokemon.id}</p>
          <p className={styles.detail}>Height: {pokemon.height / 10} m</p>
          <p className={styles.detail}>Weight: {pokemon.weight / 10} kg</p>
        </div>
      </div>
    </CheckboxWrapper>
  );
};
