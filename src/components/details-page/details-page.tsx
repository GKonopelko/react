import { useParams } from 'react-router-dom';
import { DetailsCard } from '../details-card/details-card';

export const PokemonDetailsPage = () => {
  const { id } = useParams();

  if (!id) return <div>No Pokemon selected</div>;

  return (
    <div className="pokemon-details-page">
      <DetailsCard pokemonId={id} />
    </div>
  );
};
