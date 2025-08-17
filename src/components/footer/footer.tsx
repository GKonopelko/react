'use client';

import styles from './styles.module.css';
import { CheckboxWrapper } from '../checkbox-wrapper/checkbox-wrapper';
import Image from 'next/image';
import { Flyout } from '../flyout/flyout';

export function Footer() {
  return (
    <footer className={styles.footer}>
      <Flyout />
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

          <div className={styles.logoContainer}>
            <a
              href="https://rs.school/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles['footer-link']}
            >
              <Image
                src="/assets/icons/rss-logo.svg"
                alt="RS School Logo"
                width={80}
                height={30}
                className={styles['rss-logo']}
                style={{ width: 'auto', height: 'auto' }}
                unoptimized
              />
            </a>
          </div>
        </div>
      </CheckboxWrapper>
    </footer>
  );
}
