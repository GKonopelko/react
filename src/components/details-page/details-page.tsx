'use client';

import { DetailsCard } from '../details-card/details-card';
import styles from './styles.module.css';
import { useFetchPokemonDetails } from '../../utils/api';
import { Loader } from '../loader/loader';
import { ErrorMessage } from '../error-message/error-message';

interface PokemonDetailsPageProps {
  id: string;
  onClose: () => void;
}

export const PokemonDetailsPage = ({
  id,
  onClose,
}: PokemonDetailsPageProps) => {
  const {
    data: pokemon,
    isLoading,
    isError,
    error,
  } = useFetchPokemonDetails(id);

  if (isLoading) return <Loader />;

  if (isError) {
    return (
      <div className={styles['details-panel']}>
        <ErrorMessage
          error={error?.message || 'Failed to load Pokemon details'}
          onDismiss={onClose}
        />
      </div>
    );
  }

  if (!pokemon) {
    return (
      <div className={styles['details-panel']}>
        <ErrorMessage error="Pokemon not found" onDismiss={onClose} />
      </div>
    );
  }

  return (
    <div className={styles['details-panel']}>
      <DetailsCard pokemon={pokemon} onClose={onClose} />
    </div>
  );
};
