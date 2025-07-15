import styles from './styles.module.css';
import rssLogo from '../../assets/rss-logo.svg';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles['footer-content']}>
        <a
          href="https://github.com/GKonopelko"
          target="_blank"
          rel="noopener noreferrer"
          className={styles['footer-link']}
        >
          Grigori Konopelko
        </a>
        <span> 2025 </span>

        <a
          href="https://rs.school/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles['footer-link']}
        >
          <img src={rssLogo} alt="RS School" className={styles['rss-logo']} />
        </a>
      </div>
    </footer>
  );
}
