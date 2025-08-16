import styles from './styles.module.css';
import { useTheme } from './use-theme';
import Sun from '../../assets/icons/sun.svg';
import Moon from '../../assets/icons/moon.svg';

const SunIcon = (props: React.SVGProps<SVGSVGElement>) => <Sun {...props} />;
const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => <Moon {...props} />;

export function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className={styles.button}
    >
      {theme === 'light' ? (
        <MoonIcon className={styles.icon} />
      ) : (
        <SunIcon className={styles.icon} />
      )}
    </button>
  );
}
