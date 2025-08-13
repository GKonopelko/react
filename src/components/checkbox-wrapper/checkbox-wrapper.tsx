import { useStore } from '../../utils/store/store';
import styles from './styles.module.css';

export const CheckboxWrapper = ({
  id,
  name,
  description = '',
  children,
}: {
  id: string;
  name?: string;
  description?: string;
  children: React.ReactNode;
}) => {
  const { toggleSelection, isSelected } = useStore();

  const handleCheckboxClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    toggleSelection(id, name, description);
  };

  return (
    <div
      className={`${styles.wrapper} ${isSelected(id) ? styles.selected : ''}`}
    >
      <input
        type="checkbox"
        checked={isSelected(id)}
        onChange={() => {}}
        onClick={handleCheckboxClick}
        className={styles.checkbox}
        aria-label={`Select item ${id}`}
      />
      {children}
    </div>
  );
};
