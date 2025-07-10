import React from 'react';
import styles from './styles.module.css';
import type { PokemonDetails, PokemonListItem } from '../../pokemonTypes';

interface ResultsProps {
  resultPokemons: PokemonDetails | PokemonListItem[] | null;
}

export class Results extends React.Component<ResultsProps> {
  render() {
    const { resultPokemons } = this.props;

    if (!resultPokemons) {
      return <div className={styles.results}>No Pokemons :(</div>;
    }

    if (Array.isArray(resultPokemons)) {
      return (
        <div className={styles.results}>
          <div className={styles['results-content']}>
            <ul>
              {resultPokemons.map((item, index) => (
                <li key={index}>{item.name}</li>
              ))}
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div className={styles.results}>
        <div className={styles['results-content']}>
          <img
            src={resultPokemons.sprites.front_default}
            alt={resultPokemons.name}
          />
          <p>{resultPokemons.name}</p>
          <p>ID: {resultPokemons.id}</p>
          <p>Height: {resultPokemons.height}</p>
          <p>Weight: {resultPokemons.weight}</p>
        </div>
      </div>
    );
  }
}
