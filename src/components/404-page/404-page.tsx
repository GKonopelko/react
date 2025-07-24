import styles from './styles.module.css';
import { Link } from 'react-router-dom';

export const NotFound = () => {
  return (
    <div className={styles.notfound}>
      <h2>404 - Page Not Found</h2>
      <p>The page you are looking for does not exist.</p>
      <Link to="/" className={styles.link}>
        Go back to Pokemons
      </Link>
    </div>
  );
};
