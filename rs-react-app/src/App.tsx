import './App.css';
import { Component } from 'react';
import type { PokemonDetails, PokemonListItem } from './pokemonTypes';
import { Main } from './components/main/main-logic';

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
      this.setState({ loading: true, error: null, hasError: false });
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

  componentDidMount() {
    const savedQuery = localStorage.getItem('poke-monReactQueryContent') || '';
    this.handleSearch(savedQuery);
  }

  makeTestError = () => {
    this.setState({
      hasError: true,
      error: "You broke the app! Don't do it again!",
    });
  };

  handleDismissError = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.hasError) {
      throw new Error(this.state.error || 'Something went wrong!');
    }

    return (
      <Main
        searchResults={this.state.searchResults}
        loading={this.state.loading}
        error={this.state.error}
        onSearch={this.handleSearch}
        onMakeTestError={this.makeTestError}
        onDismissError={this.handleDismissError}
      />
    );
  }
}
