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
    }
  }, [id, prevId]);

  const handleClose = () => {
    const searchParams = new URLSearchParams(location.search);
    searchParams.delete('details');

    navigate({
      pathname: '/',
      search: searchParams.toString(),
    });
  };

  if (!id) return <div>No Pokemon selected</div>;

  return (
    <div className={styles['details-panel']}>
      <DetailsCard pokemonId={id} onClose={handleClose} />
    </div>
  );
};
