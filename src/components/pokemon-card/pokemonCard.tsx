import styles from './styles.module.css';
import type { PokemonDetails } from '../../pokemonTypes';
import { useSelectedPokemonStore } from '../store/pokemon-store';

interface PokemonCardProps {
  pokemon: PokemonDetails;
}

export const PokemonCard = ({ pokemon }: PokemonCardProps) => {
  const { togglePokemon, selectedPokemons } = useSelectedPokemonStore();

  const isSelected = !!selectedPokemons[pokemon.id.toString()];

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation();
    togglePokemon({
      id: pokemon.id.toString(),
      name: pokemon.name,
      url: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`,
      detailsUrl: `https://pokeapi.co/api/v2/pokemon/${pokemon.id}`,
    });
  };

  return (
    <div className={styles.card}>
      <input
        type="checkbox"
        checked={isSelected}
        onChange={handleCheckboxChange}
        onClick={(e) => e.stopPropagation()}
        className={styles.checkbox}
      />
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
