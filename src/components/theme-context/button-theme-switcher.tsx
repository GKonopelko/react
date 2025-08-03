import styles from './styles.module.css';
import { useTheme } from './use-theme';
import sun from '../../assets/icons/sun.svg';
import moon from '../../assets/icons/moon.svg';

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className={styles.button}
    >
      <img
        src={theme === 'light' ? moon : sun}
        className={styles.icon}
        alt="Theme icon"
      />
    </button>
  );
}
