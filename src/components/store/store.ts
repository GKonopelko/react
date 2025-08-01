import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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

export const useStore = create<SelectionState>()(
  persist(
    (set, get) => ({
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
          ([id, { name, description }]) => ({
            id,
            name,
            description,
          })
        ),
    }),
    {
      name: 'pokemon-selection-storage',
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;
          const parsed = JSON.parse(str);
          return {
            ...parsed,
            state: {
              ...parsed.state,
              selectedItems: new Map(parsed.state.selectedItems),
            },
          };
        },
        setItem: (name, value) => {
          const state = {
            ...value,
            state: {
              ...value.state,
              selectedItems: Array.from(value.state.selectedItems.entries()),
            },
          };
          localStorage.setItem(name, JSON.stringify(state));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);
