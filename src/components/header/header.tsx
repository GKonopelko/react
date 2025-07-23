import styles from './styles.module.css';
import reactLogo from '../../assets/react.svg';

export const Header = () => {
  return (
    <header className={styles.header}>
      <a href="https://react.dev" target="_blank" rel="noreferrer">
        <img src={reactLogo} className="logo react" alt="React logo" />
      </a>
      <h1>Poke-monReact</h1>
    </header>
  );
};
