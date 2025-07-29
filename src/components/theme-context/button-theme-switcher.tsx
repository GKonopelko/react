import styles from './styles.module.css';
import { useTheme } from './use-theme';

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className={styles['theme-switcher']}>
      <button onClick={toggleTheme} aria-label="Toggle theme">
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  );
}
