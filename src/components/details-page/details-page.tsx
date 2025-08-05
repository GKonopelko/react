import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { DetailsCard } from '../details-card/details-card';
import styles from './styles.module.css';
import { useFetchPokemonDetails } from '../api/api';
import { Loader } from '../loader/loader';
import { ErrorMessage } from '../error-message/error-message';

export const PokemonDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    data: pokemon,
    isLoading,
    isError,
    error,
  } = useFetchPokemonDetails(id || '');

  const handleClose = () => {
    navigate({
      pathname: '/',
      search: location.search,
    });
  };

  if (!id) return null;

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className={styles['details-panel']}>
        <ErrorMessage
          error={error?.message || 'Failed to load Pokemon details'}
          onDismiss={handleClose}
        />
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className={styles['details-panel']}>
        <ErrorMessage error="Pokemon not found" onDismiss={handleClose} />
      </div>
    );
  }

  return (
    <div className={styles['details-panel']}>
      <DetailsCard pokemon={pokemon} onClose={handleClose} />
    </div>
  );
};
