import { type ChangeEvent, type FormEvent } from 'react';
import styles from './styles.module.css';
import { useSearchParams } from 'react-router-dom';
import { CheckboxWrapper } from '../checkbox-wrapper/checkbox-wrapper';
import { useLocalStorage } from '../../utils/ls-hook';

export interface SearchProps {
  onSearch: (query: string) => Promise<void>;
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

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const query = queryContent.trim();

    if (!query) {
      await onSearch('');
      return;
    }

    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', '1');
    setSearchParams(newParams);

    await onSearch(query);
  };

  return (
    <form className={styles['search-component']} onSubmit={handleFormSubmit}>
      <CheckboxWrapper id="controls" name="controls" description="app controls">
        <input
          type="text"
          id="search-input"
          placeholder="Enter pokemon name or id"
          value={queryContent}
          onChange={handleFormInput}
        />
        <button type="submit">Search pokemon</button>
      </CheckboxWrapper>
    </form>
  );
};
