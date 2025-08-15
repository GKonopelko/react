'use client';

import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { DetailsCard } from '../details-card/details-card';
import styles from './styles.module.css';
import { useFetchPokemonDetails } from '../../utils/api';
import { Loader } from '../loader/loader';
import { ErrorMessage } from '../error-message/error-message';

export const PokemonDetailsPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    data: pokemon,
    isLoading,
    isError,
    error,
  } = useFetchPokemonDetails(id as string);

  const handleClose = () => {
    router.push(
      `/${searchParams.toString() ? `?${searchParams.toString()}` : ''}`
    );
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
