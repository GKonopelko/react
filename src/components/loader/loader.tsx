'use client';

import { useEffect, useState } from 'react';
import styles from './styles.module.css';

export const Loader = () => {
  const [randomValue, setRandomValue] = useState('');

  useEffect(() => {
    setRandomValue(Math.random().toFixed(4));
  }, []);

  return (
    <div className={styles['spinner-container']}>
      <div className={styles.spinner}></div>
      <div className={styles['loading-text']}>
        Pokemons coming soon...{randomValue}
      </div>
    </div>
  );
};
