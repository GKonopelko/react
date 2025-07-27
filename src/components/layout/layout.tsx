import { Outlet } from 'react-router-dom';
import styles from './styles.module.css';

export const Layout = () => {
  return (
    <div className={styles.wrapper}>
      <Outlet />
    </div>
  );
};
