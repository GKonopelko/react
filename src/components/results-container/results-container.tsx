import styles from './styles.module.css';

export const ResultsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return <main className={styles.container}>{children}</main>;
};
