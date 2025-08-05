import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { DetailsCard } from '../details-card/details-card';
import styles from './styles.module.css';

export const PokemonDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = () => {
    navigate({
      pathname: '/',
      search: location.search,
    });
  };

  if (!id) return null;

  return (
    <div className={styles['details-panel']}>
      <DetailsCard pokemonId={id} onClose={handleClose} />
    </div>
  );
};
