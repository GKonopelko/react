import reactLogo from './assets/react.svg';
import './App.css';
import { Footer } from './components/footer/footer';
import { Controls } from './components/controls/controls';
import { Results } from './components/results/results';
import React from 'react';

interface AppState {
  searchResults: string[];
  loading: boolean;
  error: string | null;
}

export class App extends React.Component<object, AppState> {
  state = {
    searchResults: [] as string[],
    loading: false,
    error: null as string | null,
  };

  handleSearch = async (query: string) => {
    try {
      this.setState({ loading: true, error: null });
      const response = await fetch(
        `https://pokeapi.co/api/v2/pokemon/${query.toLowerCase()}`
      );

      if (!response.ok) {
        throw new Error('Not found');
      }
      const data = await response.json();
      this.setState({
        searchResults: [data.name],
        loading: false,
      });
    } catch (err) {
      this.setState({
        error: err instanceof Error ? err.message : 'Error',
        searchResults: [],
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
        <Results resultArray={searchResults} />
        <Footer />
      </div>
    );
  }
}
