import React from 'react';
import styles from './styles.module.css';

export class Search extends React.Component {
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
    const targetValue = event.target.value;
    this.setState({ queryContent: targetValue });
    this.writeToLS(targetValue);
  };

  handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log(event, 'queryContent  ', this.state.queryContent);
  };

  render() {
    return (
      <form
        className={styles['search-component']}
        onSubmit={this.handleFormSubmit}
      >
        <input
          type="text"
          id="id{value}"
          placeholder="Search"
          value={this.state.queryContent}
          onChange={this.handleFormInput}
        />
        <button type="submit">Search</button>
      </form>
    );
  }
}
