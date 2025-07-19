import { Component } from 'react';
import styles from './styles.module.css';
import reactLogo from '../../assets/react.svg';

export class Header extends Component {
  render() {
    return (
      <header className={styles.header}>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <h1>Poke-monReact</h1>
      </header>
    );
  }
}
