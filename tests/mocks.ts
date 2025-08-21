import { type FormData } from '../src/formStore';
import { vi } from 'vitest';

export const mockFormData: FormData[] = [
  {
    name: 'John Smith',
    age: 25,
    email: 'john@example.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    gender: 'male' as const,
    country: 'Russia',
    agreeToTerms: true,
    submittedAt: new Date('2023-01-01T10:00:00'),
    profilePicture: undefined,
  },
  {
    name: 'Anna Johnson',
    age: 28,
    email: 'anna@example.com',
    password: 'SecurePass456!',
    confirmPassword: 'SecurePass456!',
    gender: 'female' as const,
    country: 'Belarus',
    agreeToTerms: true,
    submittedAt: new Date('2023-01-02T12:00:00'),
    profilePicture: undefined,
  },
  {
    name: 'Peter Wilson',
    age: 35,
    email: 'peter@example.com',
    password: 'StrongPass789!',
    confirmPassword: 'StrongPass789!',
    gender: 'male' as const,
    country: 'Other',
    agreeToTerms: true,
    submittedAt: new Date('2023-01-03T14:00:00'),
    profilePicture: undefined,
  },
];

export const mockFormDataWithImage: FormData[] = [
  {
    name: 'Maria Brown',
    age: 22,
    email: 'maria@example.com',
    password: 'ImagePass123!',
    confirmPassword: 'ImagePass123!',
    gender: 'female' as const,
    country: 'Russia',
    agreeToTerms: true,
    submittedAt: new Date('2023-01-04T16:00:00'),
    profilePicture: 'data:image/jpeg;base64,test-image-data',
  },
];

export const mockEmptyFormData: FormData[] = [];

export const mockAddFormData = vi.fn();
export const mockClearFormData = vi.fn();
export const mockOnClose = vi.fn();
export const mockOnChange = vi.fn();

export const commonCssMocks = {
  uncontrolledForm: {
    default: {
      form: 'form',
      'form-group': 'form-group',
      'radio-group': 'radio-group',
      'checkbox-label': 'checkbox-label',
      'form-actions': 'form-actions',
      'cancel-button': 'cancel-button',
      'submit-button': 'submit-button',
      error: 'error',
      'error-text': 'error-text',
      'password-criteria': 'password-criteria',
      'criteria-item': 'criteria-item',
      'criteria-indicator': 'criteria-indicator',
      'criteria-label': 'criteria-label',
      valid: 'valid',
    },
  },
  display: {
    default: {
      empty: 'empty',
      container: 'container',
      grid: 'grid',
      card: 'card',
      new: 'new',
      image: 'image',
    },
  },
};

export const mockFileToBase64 = vi.fn().mockImplementation((file: File) => {
  if (!file || file.size === 0) {
    return Promise.resolve('');
  }
  return Promise.resolve('data:image/jpeg;base64,base64string');
});
