import { useParams, useNavigate } from 'react-router-dom';
import { DetailsCard } from '../details-card/details-card';
import styles from './styles.module.css';
import { useState, useEffect } from 'react';

export const PokemonDetailsPage = () => {
  const { id } = useParams();
  const [prevId, setPrevId] = useState(id);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) setPrevId(id);
  }, [id]);

  if (!id) return <div>No Pokemon selected</div>;

  return (
    <div className={styles['details-panel']}>
      <DetailsCard pokemonId={prevId || id} onClose={() => navigate(-1)} />
    </div>
  );
};
