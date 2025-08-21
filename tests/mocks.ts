import { type FormData } from '../src/formStore';

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
