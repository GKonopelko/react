import { useSelectionStore } from '../store/pokemon-store';
import styles from './styles.module.css';

export const CheckboxWrapper = ({
  id,
  name,
  children,
}: {
  id: string;
  name?: string;
  children: React.ReactNode;
}) => {
  const { toggleSelection, isSelected } = useSelectionStore();

  const handleCheckboxClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    toggleSelection(id, name);
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
