import React from 'react';
import styles from './styles.module.css';
import type { PokemonTypes } from '../../pokemonTypes';

interface ResultsProps {
  resultPokemons: PokemonTypes | null;
}

export class Results extends React.Component<ResultsProps> {
  render() {
    const { resultPokemons } = this.props;
    if (!resultPokemons) {
      return <div className={styles.results}>No Pokemons :(</div>;
    }
    return (
      <div className={styles.results}>
        <div className={styles['results-content']}>
          <img
            src="resultPokemons.sprites.front_default"
            alt="{resultPokemons.name}"
          />
          <p>{resultPokemons.name}</p>
          <p>{resultPokemons.id}</p>
          <p>{resultPokemons.height}</p>
          <p>{resultPokemons.weight}</p>

          {/* <ul>
            {resultPokemons.stats.map((item, index) => (
              <li key={index}>
                {item.stat.name}: {item.base_stat}
              </li>
            ))}
          </ul> */}
        </div>
      </div>
    );
  }
}
