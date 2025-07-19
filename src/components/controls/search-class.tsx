import { Component, type ChangeEvent, type FormEvent } from 'react';
import styles from './styles.module.css';

export interface SearchProps {
  onSearch: (query: string) => void;
}

interface SearchState {
  queryContent: string;
}

export class Search extends Component<SearchProps, SearchState> {
  writeToLS = (query: string) => {
    localStorage.setItem('poke-monReactQueryContent', query);
  };

  readFromLS = (): string => {
    return localStorage.getItem('poke-monReactQueryContent') || '';
  };

  state: SearchState = {
    queryContent: this.readFromLS() || '',
  };

  componentDidMount(): void {
    const savedQuery = this.readFromLS();
    if (savedQuery) {
      this.setState({ queryContent: savedQuery });
    }
  }

  handleFormInput = (event: ChangeEvent<HTMLInputElement>) => {
    const targetValue = event.target.value;
    this.setState({ queryContent: targetValue });
  };

  handleFormSubmit = (event: FormEvent) => {
    event.preventDefault();
    const trimmedQuery = this.state.queryContent.trim();
    this.writeToLS(trimmedQuery);
    this.props.onSearch(trimmedQuery);
  };

  render() {
    return (
      <form
        className={styles['search-component']}
        onSubmit={this.handleFormSubmit}
      >
        <input
          type="text"
          id="search-input"
          placeholder="Enter pokemon name or id"
          value={this.state.queryContent}
          onChange={this.handleFormInput}
        />
        <button type="submit">Search pokemon</button>
      </form>
    );
  }
}
