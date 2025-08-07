import { Header } from '../header/header';
import { Controls } from '../controls/controls';
import { Results } from '../results/results';
import { Footer } from '../footer/footer';
import { Loader } from '../loader/loader';
import { ErrorMessage } from '../error-message/error-message';
import type { PokemonDetails, PokemonListItem } from '../../pokemonTypes';
import styles from './main-logic.module.css';

interface MainProps {
  searchResults: PokemonDetails | PokemonListItem[] | null;
  loading: boolean;
  error: string | null;
  onSearch: (query: string) => Promise<void>;
  onDismissError: () => void;
}

export const Main = ({
  searchResults,
  loading,
  error,
  onSearch,
  onDismissError,
}: MainProps) => {
  return (
    <div className={styles.wrapper}>
      <Header />
      <Controls onSearch={onSearch} />
      {loading && <Loader />}
      {error && <ErrorMessage error={error} onDismiss={onDismissError} />}
      {!loading && !error && <Results resultPokemons={searchResults} />}
      <Footer />
    </div>
  );
};
