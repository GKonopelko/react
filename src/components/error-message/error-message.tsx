import styles from './styles.module.css';

interface ErrorMessageProps {
  error: string;
  onDismiss: () => void;
}

export const ErrorMessage = ({ error, onDismiss }: ErrorMessageProps) => {
  return (
    <div className={styles['error-message']}>
      {error}
      <button onClick={onDismiss}>Hide error</button>
    </div>
  );
};
