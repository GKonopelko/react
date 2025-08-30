import { create } from 'zustand';
import type { PokemonCsvItem } from '../../pokemonTypes';

interface SelectionState {
  selectedItems: Map<string, Omit<PokemonCsvItem, 'id'>>;
  toggleSelection: (id: string, name?: string, description?: string) => void;
  unselectAll: () => void;
  isSelected: (id: string) => boolean;
  getSelectedCount: () => number;
  getSelectedItems: () => PokemonCsvItem[];
}

export const useStore = create<SelectionState>((set, get) => ({
  selectedItems: new Map(),
  toggleSelection: (id, name, description) => {
    set((state) => {
      const newMap = new Map(state.selectedItems);
      if (newMap.has(id)) {
        newMap.delete(id);
      } else if (name && description) {
        newMap.set(id, { name, description });
      }
      return { selectedItems: newMap };
    });
  },
  unselectAll: () => set({ selectedItems: new Map() }),
  isSelected: (id) => get().selectedItems.has(id),
  getSelectedCount: () => get().selectedItems.size,
  getSelectedItems: () =>
    Array.from(get().selectedItems.entries()).map(
      ([id, { name, description }]) =>
        ({
          id,
          name,
          description,
        }) as PokemonCsvItem
    ),
}));
