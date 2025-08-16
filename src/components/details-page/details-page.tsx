'use client';

import { DetailsCard } from '../details-card/details-card';
import styles from './styles.module.css';
import { useFetchPokemonDetails } from '../../utils/api';
import { Loader } from '../loader/loader';
import { ErrorMessage } from '../error-message/error-message';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

interface PokemonDetailsPageProps {
  id: string;
  onClose: () => void;
}

export const PokemonDetailsPage = ({
  id,
  onClose,
}: PokemonDetailsPageProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const {
    data: pokemon,
    isLoading,
    isError,
    error,
  } = useFetchPokemonDetails(id);

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('details');
    router.push(`${pathname}?${params.toString()}`);
    onClose();
  };

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
