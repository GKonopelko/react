import styles from './styles.module.css';
import RssLogo from '../../assets/icons/rss-logo.svg';
import { CheckboxWrapper } from '../checkbox-wrapper/checkbox-wrapper';

const RsLogo = (props: React.SVGProps<SVGSVGElement>) => <RssLogo {...props} />;

export function Footer() {
  return (
    <footer className={styles.footer}>
      <CheckboxWrapper
        id="pagination"
        name="pagination"
        description="pages pagination"
      >
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
            <RsLogo className={styles['rss-logo']} />
          </a>
        </div>
      </CheckboxWrapper>
    </footer>
  );
}
