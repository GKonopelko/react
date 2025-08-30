'use client';

import { Search } from './search';
import styles from './styles.module.css';

export const Controls = () => {
  return (
    <div className={styles.controls}>
      <div className={styles['controls-content']}>
        <Search />
      </div>
    </div>
  );
};
