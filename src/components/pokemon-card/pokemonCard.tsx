import styles from './styles.module.css';
import type { PokemonDetails } from '../../pokemonTypes';

interface PokemonCardProps {
  pokemon: PokemonDetails;
}

export const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  return (
    <div className={styles.card}>
      <img
        src={pokemon.sprites.front_default}
        alt={pokemon.name}
        className={styles.image}
      />
      <h3 className={styles.name}>{pokemon.name}</h3>
      <div className={styles.description}>
        <p className={styles.id}>ID: {pokemon.id}</p>
        <p className={styles.detail}>Height: {pokemon.height / 10} m</p>
        <p className={styles.detail}>Weight: {pokemon.weight / 10} kg</p>
      </div>
    </div>
  );
};
