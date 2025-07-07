import { Search } from './search-class';
import styles from './styles.module.css';

export function Controls() {
  return (
    <div className={styles.controls}>
      <div className={styles['controls-content']}>
        <Search />
      </div>
    </div>
  );
}
