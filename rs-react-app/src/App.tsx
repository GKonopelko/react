import reactLogo from './assets/react.svg';
import './App.css';
import { Footer } from './components/footer/footer';
import { Controls } from './components/controls/controls';
import { Results } from './components/results/results';
import { Component } from 'react';
import type { PokemonDetails, PokemonListItem } from './pokemonTypes';

interface AppState {
  searchResults: PokemonDetails | PokemonListItem[] | null;
  loading: boolean;
  error: string | null;
  hasError: boolean;
}

export class App extends Component<object, AppState> {
  state: AppState = {
    searchResults: null,
    loading: false,
    error: null,
    hasError: false,
  };

  fetchAllPokemons = async () => {
    let allPokemons: PokemonListItem[] = [];
    let nextUrl: string | null = 'https://pokeapi.co/api/v2/pokemon?limit=500';

    while (nextUrl) {
      const response = await fetch(nextUrl);
      if (!response.ok) throw new Error('Failed to fetch pokemons');
      const data = await response.json();
      allPokemons = [...allPokemons, ...data.results];
      nextUrl = data.next;
    }
    return allPokemons;
  };

  handleSearch = async (query: string) => {
    try {
      this.setState({ loading: true, error: null });
      let response;

      if (query.trim() === '') {
        const allPokemons = await this.fetchAllPokemons();
        this.setState({
          searchResults: allPokemons,
          loading: false,
        });
        return;
      } else {
        response = await fetch(
          `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase().trim()}`
        );
      }

      if (!response.ok) {
        let errorMessage = 'Error';
        if (response.status === 404) {
          errorMessage = `Pokemon "${query}" not found`;
        } else if (response.status >= 500) {
          errorMessage = 'Server error';
        } else if (response.status === 401) {
          errorMessage = 'Authentication required';
        } else {
          errorMessage = `Request failed ${response.status}`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();

      this.setState({
        searchResults: data,
        loading: false,
      });
    } catch (err) {
      this.setState({
        error: err instanceof Error ? err.message : 'Unknown error',
        searchResults: null,
        loading: false,
      });
    }
  };

  makeTestError = () => {
    this.setState({ hasError: true });
  };

  render() {
    if (this.state.hasError) {
      throw new Error("You broke the app! Don't do it again!");
    }
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
        {loading && (
          <div className="spinner-container">
            <div className="spinner"></div>
            <div className="loading-text">Pokemons coming soon...</div>
          </div>
        )}
        {error && (
          <div className="error-message">
            {error}
            <button onClick={() => this.setState({ error: null })}>
              Hide error
            </button>
          </div>
        )}
        <Results resultPokemons={searchResults} />

        <button onClick={this.makeTestError} className="global-button">
          Don&apos;t press the red button
        </button>
        <Footer />
      </div>
    );
  }
}
