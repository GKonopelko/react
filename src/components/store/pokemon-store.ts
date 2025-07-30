import { create } from 'zustand';

interface SelectionState {
  selectedIds: Set<string>;
  selectedItems: Map<string, { name: string }>;
  toggleSelection: (id: string, name?: string) => void;
  unselectAll: () => void;
  isSelected: (id: string) => boolean;
  getSelectedCount: () => number;
  getSelectedItems: () => Array<{ id: string; name: string }>;
}

export const useSelectionStore = create<SelectionState>((set, get) => ({
  selectedIds: new Set(),
  selectedItems: new Map(),

  toggleSelection: (id, name) => {
    set((state) => {
      const newSet = new Set(state.selectedIds);
      const newMap = new Map(state.selectedItems);

      if (newSet.has(id)) {
        newSet.delete(id);
        newMap.delete(id);
      } else {
        newSet.add(id);
        if (name) newMap.set(id, { name });
      }

      return { selectedIds: newSet, selectedItems: newMap };
    });
  },

  unselectAll: () => set({ selectedIds: new Set(), selectedItems: new Map() }),

  isSelected: (id) => get().selectedIds.has(id),

  getSelectedCount: () => get().selectedIds.size,

  getSelectedItems: () =>
    Array.from(get().selectedItems.entries()).map(([id, { name }]) => ({
      id,
      name,
    })),
}));
