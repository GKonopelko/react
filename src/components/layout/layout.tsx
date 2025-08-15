import { Outlet } from 'next/link';
import styles from './styles.module.css';

export const Layout = () => {
  return (
    <div className={styles.wrapper}>
      <Outlet />
    </div>
  );
};
