import reactLogo from './assets/react.svg';
import './App.css';
import { Footer } from './components/footer/footer';
import { Controls } from './components/controls/controls';
import { Results } from './components/results/results';
import React from 'react';
import type {
  PokemonDetails,
  PokemonListItem,
  PokemonListResponse,
} from './pokemonTypes';

interface AppState {
  searchResults: PokemonDetails | PokemonListItem[] | null;
  loading: boolean;
  error: string | null;
}

export class App extends React.Component<object, AppState> {
  state: AppState = {
    searchResults: null,
    loading: false,
    error: null,
  };

  handleSearch = async (query: string) => {
    try {
      this.setState({ loading: true, error: null });

      if (query === '') {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon');
        const data: PokemonListResponse = await response.json();
        this.setState({
          searchResults: data.results,
          loading: false,
        });
      } else {
        const response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
        );
        const data: PokemonDetails = await response.json();
        this.setState({
          searchResults: data,
          loading: false,
        });
      }
    } catch (err) {
      this.setState({
        error: err instanceof Error ? err.message : 'Error',
        searchResults: null,
        loading: false,
      });
    }
  };

  render() {
    const { searchResults, loading, error } = this.state;
    return (
      <div className="wrapper">
        <header className="header">
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
          <h1>Poke-monReact</h1>
        </header>
        <Controls onSearch={this.handleSearch} />
        {loading && <div>Loading...</div>}
        {error && <div>Error: {error}</div>}
        <Results resultPokemons={searchResults} />
        <Footer />
      </div>
    );
  }
}
