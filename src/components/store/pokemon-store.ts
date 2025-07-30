import { create } from 'zustand';

interface SelectionState {
  selectedIds: Set<string>;
  toggleSelection: (id: string) => void;
  unselectAll: () => void;
  isSelected: (id: string) => boolean;
  getSelectedCount: () => number;
}

export const useSelectionStore = create<SelectionState>((set, get) => ({
  selectedIds: new Set(),

  toggleSelection: (id) => {
    set((state) => {
      const newSet = new Set(state.selectedIds);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return { selectedIds: newSet };
    });
  },

  unselectAll: () => set({ selectedIds: new Set() }),

  isSelected: (id) => get().selectedIds.has(id),

  getSelectedCount: () => get().selectedIds.size,
}));
