import { Search } from './search';
import styles from './styles.module.css';

interface ControlsProps {
  onSearch: (query: string) => void;
}

export const Controls = ({ onSearch }: ControlsProps) => {
  return (
    <div className={styles.controls}>
      <div className={styles['controls-content']}>
        <Search onSearch={onSearch} />
      </div>
    </div>
  );
};
