import React from 'react';
import { Search, type SearchProps } from './search-class';
import styles from './styles.module.css';

export class Controls extends React.Component<SearchProps> {
  render() {
    return (
      <div className={styles.controls}>
        <div className={styles['controls-content']}>
          <Search onSearch={this.props.onSearch} />
        </div>
      </div>
    );
  }
}
