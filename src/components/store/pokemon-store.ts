import { create } from 'zustand';

interface SelectedPokemon {
  id: string;
  name: string;
  url: string;
  detailsUrl: string;
}

interface SelectedPokemonState {
  selectedPokemons: Record<string, SelectedPokemon>;
  togglePokemon: (pokemon: SelectedPokemon) => void;
  unselectAll: () => void;
  getSelectedCount: () => number;
}

export const useSelectedPokemonStore = create<SelectedPokemonState>(
  (set, get) => ({
    selectedPokemons: {},

    togglePokemon: (pokemon) =>
      set((state) => {
        const { id } = pokemon;
        return state.selectedPokemons[id]
          ? {
              selectedPokemons: Object.fromEntries(
                Object.entries(state.selectedPokemons).filter(
                  ([key]) => key !== id
                )
              ),
            }
          : {
              selectedPokemons: { ...state.selectedPokemons, [id]: pokemon },
            };
      }),

    unselectAll: () => set({ selectedPokemons: {} }),

    getSelectedCount: () => Object.keys(get().selectedPokemons).length,
  })
);
