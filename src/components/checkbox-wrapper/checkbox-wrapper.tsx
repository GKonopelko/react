'use client';

import { useStore } from '../../utils/store/store';
import styles from './styles.module.css';

interface CheckboxWrapperProps {
  id: string;
  name?: string;
  description?: string;
  children: React.ReactNode;
}

export const CheckboxWrapper = ({
  id,
  name,
  description = '',
  children,
}: CheckboxWrapperProps) => {
  const { toggleSelection, isSelected } = useStore();

  const handleCheckboxClick = (e: React.MouseEvent<HTMLInputElement>) => {
    e.stopPropagation();
    console.log('Checkbox clicked:', id);
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
