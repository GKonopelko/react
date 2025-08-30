import { create } from 'zustand';

interface ErrorState {
  mainError: string | null;
  setMainError: (error: string | null) => void;
  dismissError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  mainError: null,
  setMainError: (error) => set({ mainError: error }),
  dismissError: () => set({ mainError: null }),
}));
