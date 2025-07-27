import styles from './styles.module.css';
import reactLogo from '../../assets/react.svg';
import { Link } from 'react-router-dom';

export const Header = () => {
  return (
    <header className={styles.header}>
      <a href="https://react.dev" target="_blank" rel="noreferrer">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
      <h1>Poke-monReact</h1>
      <nav className={styles.nav}>
        <Link to="/" className={styles.link}>
          Home
        </Link>
        <Link to="/about" className={styles.link}>
          About
        </Link>
      </nav>
    </header>
  );
};
