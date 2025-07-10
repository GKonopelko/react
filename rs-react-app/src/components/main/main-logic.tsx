// components/main/main-logic.tsx
import { Component } from 'react';
import { Header } from '../header/header';
import { Controls } from '../controls/controls';
import { Results } from '../results/results';
import { Footer } from '../footer/footer';
import { Loader } from '../loader/loader';
import { ErrorMessage } from '../error-message/error-message';
import type { PokemonDetails, PokemonListItem } from '../../pokemonTypes';

interface MainProps {
  searchResults: PokemonDetails | PokemonListItem[] | null;
  loading: boolean;
  error: string | null;
  onSearch: (query: string) => void;
  onMakeTestError: () => void;
  onDismissError: () => void;
}

export class Main extends Component<MainProps> {
  render() {
    const {
      searchResults,
      loading,
      error,
      onSearch,
      onMakeTestError,
      onDismissError,
    } = this.props;

    return (
      <div className="wrapper">
        <Header />
        <Controls onSearch={onSearch} />
        {loading && <Loader />}
        {error && <ErrorMessage error={error} onDismiss={onDismissError} />}
        <Results resultPokemons={searchResults} />
        <button onClick={onMakeTestError} className="global-button">
          Don&apos;t press the red button
        </button>
        <Footer />
      </div>
    );
  }
}
