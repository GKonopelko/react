import { useState, useRef } from 'react';
import { countries } from './countries';
import styles from './uncontrolledForm.module.css';

interface CountryAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export const CountryAutocomplete = ({
  value,
  onChange,
  error,
}: CountryAutocompleteProps) => {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.length > 0) {
      const filteredCountries = countries.filter((country) =>
        country.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filteredCountries);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className={styles['form-group']}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
        onFocus={() => value.length > 0 && setShowSuggestions(true)}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        className={error ? styles.error : ''}
        placeholder="Start typing country name..."
      />
      {showSuggestions && suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((suggestion) => (
            <li
              key={suggestion}
              onMouseDown={() => handleSuggestionClick(suggestion)}
              className={styles['suggestion-item']}
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
      {error && <span className={styles['error-text']}>{error}</span>}
    </div>
  );
};
