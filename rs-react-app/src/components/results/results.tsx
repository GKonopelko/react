import { Component } from 'react';
import styles from './styles.module.css';
import type { PokemonDetails, PokemonListItem } from '../../pokemonTypes';
import { PokemonCard } from '../pokemon-card/pokemonCard';

interface ResultsProps {
  resultPokemons: PokemonDetails | PokemonListItem[] | null;
}

interface ResultsState {
  pokemonDetails: PokemonDetails[];
  loading: boolean;
}

export class Results extends Component<ResultsProps, ResultsState> {
  state: ResultsState = {
    pokemonDetails: [],
    loading: false,
  };

  componentDidMount() {
    this.loadInitialData();
  }

  componentDidUpdate(prevProps: ResultsProps) {
    if (this.props.resultPokemons !== prevProps.resultPokemons) {
      this.loadInitialData();
    }
  }

  loadInitialData = () => {
    if (Array.isArray(this.props.resultPokemons)) {
      this.loadPokemonDetails(this.props.resultPokemons.slice(0, 100));
    }
  };

  loadPokemonDetails = async (pokemonList: PokemonListItem[]) => {
    this.setState({ loading: true });

    try {
      const details = await Promise.all(
        pokemonList.map(async (pokemon) => {
          const response = await fetch(pokemon.url);
          return await response.json();
        })
      );

      this.setState({ pokemonDetails: details });
    } catch (error) {
      console.error('Error loading pokemon details:', error);
    } finally {
      this.setState({ loading: false });
    }
  };

  render() {
    const { resultPokemons } = this.props;
    const { pokemonDetails, loading } = this.state;

    if (!resultPokemons) {
      return <div className={styles.results}>No Pokemons :(</div>;
    }

    if (loading) {
      return <div className={styles.results}>Loading pokemon details...</div>;
    }

    if (Array.isArray(resultPokemons)) {
      return (
        <div className={styles.results}>
          <div className={styles['results-grid']}>
            {pokemonDetails.map((pokemon) => (
              <PokemonCard key={pokemon.id} pokemon={pokemon} />
            ))}
          </div>
        </div>
      );
    }

    return (
      <div className={styles.results}>
        <div className={styles['results-content']}>
          <PokemonCard pokemon={resultPokemons} />
        </div>
      </div>
    );
  }
}
