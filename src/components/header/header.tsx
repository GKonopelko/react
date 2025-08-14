import styles from './styles.module.css';
import reactLogo from '../../assets/icons/react.svg';
import Link from 'next/link';
import { ThemeSwitcher } from '../theme-context/button-theme-switcher';
import { CheckboxWrapper } from '../checkbox-wrapper/checkbox-wrapper';
import type { CacheStatus } from '../../utils/useCacheStatus';

interface HeaderProps {
  onRefresh?: () => void;
  cacheStatus?: CacheStatus;
}

export const Header = ({ onRefresh, cacheStatus }: HeaderProps) => {
  return (
    <header className={styles.header} data-testid="header">
      <CheckboxWrapper id="header" name="header" description="app header">
        <div className={styles.container}>
          <a href="https://react.dev" target="_blank" rel="noreferrer">
            <img src={reactLogo} className={styles.logo} alt="React logo" />
          </a>
          <h1>Poke-monReact</h1>
          <ThemeSwitcher />
        </div>
        <nav className={styles.nav}>
          <Link href="/" className={styles.link}>
            Home
          </Link>
          <Link href="/about" className={styles.link}>
            About
          </Link>
        </nav>
        <div className={styles.subcontainer}>
          {onRefresh && (
            <button onClick={onRefresh} className={styles.refreshbutton}>
              Refresh Data
            </button>
          )}
          {cacheStatus && (
            <div
              className={styles.cachestatus}
              data-fresh={cacheStatus.isFresh.toString()}
              title={cacheStatus.updatedAt || undefined}
            >
              {cacheStatus.message}
              {cacheStatus.updatedAt && ` (${cacheStatus.updatedAt})`}
            </div>
          )}
        </div>
      </CheckboxWrapper>
    </header>
  );
};
