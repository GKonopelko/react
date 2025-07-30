import styles from './styles.module.css';
import reactLogo from '../../assets/react.svg';
import { Link } from 'react-router-dom';
import { ThemeSwitcher } from '../theme-context/button-theme-switcher';
import { CheckboxWrapper } from '../checkbox-wrapper/checkbox-wrapper';

export const Header = () => {
  return (
    <header className={styles.header} data-testid="header">
      <CheckboxWrapper id="header" name="header" description="app header">
        <div className={styles.container}>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className="logo react" alt="React logo" />
          </a>
          <h1>Poke-monReact</h1>
          <ThemeSwitcher />
        </div>
        <nav className={styles.nav}>
          <Link to="/" className={styles.link}>
            Home
          </Link>
          <Link to="/about" className={styles.link}>
            About
          </Link>
        </nav>
      </CheckboxWrapper>
    </header>
  );
};
