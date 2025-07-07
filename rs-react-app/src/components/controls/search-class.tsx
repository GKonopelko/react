import * as React from 'react';
import styles from './styles.module.css';

export class Search extends React.Component {
  render() {
    return (
      <form
        className={styles['search-component']}
        onSubmit={(event) => {
          event.preventDefault();
          console.log(event);
        }}
      >
        <input type="text" placeholder="Search" />
        <button>Search</button>
      </form>
    );
  }
}
