import styles from './styles.module.css';
import reactLogo from '../../assets/react.svg';
import { Link } from 'react-router-dom';
import { ThemeSwitcher } from '../theme-context/button-theme-switcher';
import { useTheme } from '../theme-context/use-theme';

export const Header = () => {
  const { theme } = useTheme();

  return (
    <header
      className={`${styles.header} ${styles[`header-${theme}`]}`}
      data-testid="header"
      data-theme={theme}
    >
      <div className={styles.container}>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
        <h1>Poke-monReact</h1>
        <ThemeSwitcher />
      </div>
      <nav className={styles.nav}>
        <Link to="/" className={`${styles.link} ${styles[`link-${theme}`]}`}>
          Home
        </Link>
        <Link
          to="/about"
          className={`${styles.link} ${styles[`link-${theme}`]}`}
        >
          About
        </Link>
      </nav>
    </header>
  );
};
