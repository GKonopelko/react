import { create } from 'zustand';
import type { FormValues } from './formSchema';

export interface FormData extends Omit<FormValues, 'profilePicture'> {
  profilePicture?: string;
  agreeToTerms: boolean;
  submittedAt: Date;
}

interface FormStore {
  formData: FormData[];
  addFormData: (data: Omit<FormData, 'submittedAt'>) => void;
  clearFormData: () => void;
}

export const useFormStore = create<FormStore>((set) => ({
  formData: [],
  addFormData: (data) =>
    set((state) => ({
      formData: [...state.formData, { ...data, submittedAt: new Date() }],
    })),
  clearFormData: () => set({ formData: [] }),
}));
