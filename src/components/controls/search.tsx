import { type ChangeEvent, type FormEvent } from 'react';
import styles from './styles.module.css';
import { useLocalStorage } from '../ls-hook/ls-hook';

export interface SearchProps {
  onSearch: (query: string) => void;
}

export const Search = ({ onSearch }: SearchProps) => {
  const [queryContent, setQueryContent] = useLocalStorage(
    'poke-monReactQueryContent',
    ''
  );

  const handleFormInput = (event: ChangeEvent<HTMLInputElement>) => {
    setQueryContent(event.target.value);
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSearch(queryContent.trim());
  };

  return (
    <form className={styles['search-component']} onSubmit={handleFormSubmit}>
      <input
        type="text"
        id="search-input"
        placeholder="Enter pokemon name or id"
        value={queryContent}
        onChange={handleFormInput}
      />
      <button type="submit">Search pokemon</button>
    </form>
  );
};
