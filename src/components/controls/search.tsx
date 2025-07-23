import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import styles from './styles.module.css';

export interface SearchProps {
  onSearch: (query: string) => void;
}

export const Search = ({ onSearch }: SearchProps) => {
  const [queryContent, setQueryContent] = useState<string>(
    localStorage.getItem('poke-monReactQueryContent') || ''
  );
  console.log(queryContent);

  useEffect(() => {
    const savedQuery = localStorage.getItem('poke-monReactQueryContent');
    if (savedQuery) {
      setQueryContent(savedQuery);
    }
    console.log(savedQuery);
  }, []);

  const handleFormInput = (event: ChangeEvent<HTMLInputElement>) => {
    setQueryContent(event.target.value);
  };

  const handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();

    const trimmedQuery = queryContent.trim();
    localStorage.setItem('poke-monReactQueryContent', trimmedQuery);
    onSearch(trimmedQuery);
    console.log(trimmedQuery);
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
