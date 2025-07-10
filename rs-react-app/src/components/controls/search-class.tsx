import { Component } from 'react';
import styles from './styles.module.css';

export interface SearchProps {
  onSearch: (query: string) => void;
}

export class Search extends Component<SearchProps> {
  state = {
    queryContent: '',
  };

  writeToLS = (query: string) => {
    localStorage.setItem('queryContent', query);
  };

  readFromLS = (): string => {
    return localStorage.getItem('queryContent') || '';
  };

  componentDidMount(): void {
    const savedQuery = this.readFromLS();
    this.setState({ queryContent: savedQuery });
  }

  handleFormInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const targetValue = event.target.value.trim();
    this.setState({ queryContent: targetValue });
    this.writeToLS(targetValue);
  };

  handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    this.props.onSearch(this.state.queryContent.trim());
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
