import styles from './styles.module.css';
import { useSelectionStore } from '../store/pokemon-store';

export const Flyout = () => {
  const { unselectAll, getSelectedCount, selectedIds } = useSelectionStore();
  const count = getSelectedCount();

  const handleExport = () => {
    console.log('Selected IDs:', Array.from(selectedIds));
  };

  if (count === 0) return null;

  return (
    <div className={styles.flyout}>
      <div className={styles.flyoutcontent}>
        <span>{count} items selected</span>
        <button onClick={unselectAll}>Unselect all</button>
        <button onClick={handleExport}>Download</button>
      </div>
    </div>
  );
};
