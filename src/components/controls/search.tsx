import { type ChangeEvent, type FormEvent } from 'react';
import styles from './styles.module.css';
import { useLocalStorage } from '../ls-hook/ls-hook';
import { useSearchParams } from 'react-router-dom';

export interface SearchProps {
  onSearch: (query: string) => void;
}

export const Search = ({ onSearch }: SearchProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [queryContent, setQueryContent] = useLocalStorage(
    'poke-monReactQueryContent',
    ''
  );

  const handleFormInput = (event: ChangeEvent<HTMLInputElement>) => {
    setQueryContent(event.target.value);
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');
    setSearchParams(searchParams);
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
