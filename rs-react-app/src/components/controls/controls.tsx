import React from 'react';
import { Search } from './search-class';
import styles from './styles.module.css';

interface ControlsProps {
  onSearch: (query: string) => void;
}

export class Controls extends React.Component<ControlsProps> {
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
