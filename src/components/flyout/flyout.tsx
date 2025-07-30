import { useSelectedPokemonStore } from '../store/pokemon-store';
import styles from './styles.module.css';

export const Flyout = () => {
  const { unselectAll, getSelectedCount } = useSelectedPokemonStore();
  const count = getSelectedCount();

  if (count === 0) return null;

  return (
    <div className={styles.flyout}>
      <div className={styles.flyoutcontent}>
        <span>
          {count} {count === 1 ? 'item' : 'items'} selected
        </span>
        <button onClick={unselectAll}>Unselect all</button>
      </div>
    </div>
  );
};
