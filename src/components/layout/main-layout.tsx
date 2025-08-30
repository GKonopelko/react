import { Flyout } from '../flyout/flyout';
import styles from './styles.module.css';

export const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={styles.wrapper}>
      {children}
      <Flyout />
    </div>
  );
};
