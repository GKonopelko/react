export const createPokemonList = (count: number) => ({
  results: Array(count)
    .fill(0)
    .map((_, i) => ({
      name: `pokemon-${i}`,
      url: `url-${i}`,
    })),
  next: null,
});

export const createPokemonDetails = (id: number) => ({
  id,
  name: `pokemon-${id}`,
  sprites: {
    front_default: `image-${id}.png`,
  },
  height: 10,
  weight: 100,
  types: [
    {
      type: {
        name: 'electric',
      },
    },
  ],
  stats: [
    {
      base_stat: 55,
      stat: {
        name: 'hp',
      },
    },
  ],
});
