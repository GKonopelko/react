import styles from './styles.module.css';

export const Loader = () => {
  return (
    <div className={styles['spinner-container']}>
      <div className={styles.spinner}></div>
      <div className={styles['loading-text']}>
        Pokemons coming soon...{Math.random().toFixed(4)}
      </div>
    </div>
  );
};
