import { Suspense } from 'react';
import { Controls } from '../components/controls/controls';
import { fetchAllPokemons } from '../utils/api';
import { Loader } from '../components/loader/loader';
import { PageClient } from './page-client';

export default async function HomePage() {
  const allPokemons = await fetchAllPokemons();

  return (
    <>
      <Controls />
      <Suspense fallback={<Loader />}>
        <PageClient allPokemons={allPokemons} />
      </Suspense>
    </>
  );
}
