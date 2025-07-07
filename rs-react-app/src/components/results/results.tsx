import styles from './styles.module.css';

export function Results() {
  return (
    <div className={styles.results}>
      <div className={styles['results-content']}>
        <div>Name</div>
        <div>Description</div>
      </div>
    </div>
  );
}
