import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { DetailsCard } from '../details-card/details-card';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';

export const PokemonDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [prevId, setPrevId] = useState<string | null>(null);

  useEffect(() => {
    if (id && id !== prevId) {
      setPrevId(id);
    } else if (!id && prevId) {
      setPrevId(null);
    }
  }, [id, prevId]);

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
