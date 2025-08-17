import { create } from 'zustand';

interface PokemonItem {
  name: string;
  description: string;
}

interface SelectionState {
  selectedItems: Map<string, PokemonItem>;
  toggleSelection: (id: string, name?: string, description?: string) => void;
  unselectAll: () => void;
  isSelected: (id: string) => boolean;
  getSelectedCount: () => number;
  getSelectedItems: () => Array<{
    id: string;
    name: string;
    description: string;
  }>;
}

export const useStore = create<SelectionState>((set, get) => ({
  selectedItems: new Map(),
  toggleSelection: (id, name, description) => {
    console.log('Toggling:', id, name, description);
    set((state) => {
      const newMap = new Map(state.selectedItems);
      if (newMap.has(id)) {
        newMap.delete(id);
      } else if (name && description) {
        newMap.set(id, { name, description });
      }
      console.log('New state:', Array.from(newMap.entries()));
      return { selectedItems: newMap };
    });
  },
  unselectAll: () => set({ selectedItems: new Map() }),
  isSelected: (id) => get().selectedItems.has(id),
  getSelectedCount: () => {
    const size = get().selectedItems.size;
    console.log('Current selected count:', size);
    return size;
  },
  getSelectedItems: () =>
    Array.from(get().selectedItems.entries()).map(
      ([id, { name, description }]) => ({
        id,
        name,
        description,
      })
    ),
}));
