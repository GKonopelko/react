'use client';

import { type ChangeEvent, type FormEvent, useState, useEffect } from 'react';
import styles from './styles.module.css';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckboxWrapper } from '../checkbox-wrapper/checkbox-wrapper';
import { useSearchPokemon } from '../../utils/api';

export const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [queryContent, setQueryContent] = useState('');
  const { mutate: searchPokemon } = useSearchPokemon();

  useEffect(() => {
    const query = searchParams.get('search') || '';
    setQueryContent(query);
  }, [searchParams]);

  const handleFormInput = (event: ChangeEvent<HTMLInputElement>) => {
    setQueryContent(event.target.value);
  };

  const handleFormSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const query = queryContent.trim();

    const newParams = new URLSearchParams(searchParams.toString());
    if (query) {
      newParams.set('search', query);
    } else {
      newParams.delete('search');
    }
    newParams.set('page', '1');
    router.push(`?${newParams.toString()}`);

    if (query) {
      searchPokemon(query);
    }
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
        {queryContent && (
          <button
            type="button"
            onClick={() => {
              setQueryContent('');
              const newParams = new URLSearchParams(searchParams.toString());
              newParams.delete('search');
              router.push(`?${newParams.toString()}`);
            }}
          >
            Clear
          </button>
        )}
      </CheckboxWrapper>
    </form>
  );
};
