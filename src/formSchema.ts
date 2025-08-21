import { z } from 'zod';

export const isStrongPassword = (password: string): boolean => {
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return strongPasswordRegex.test(password);
};

export const formSchema = z
  .object({
    name: z
      .string()
      .min(2, 'At least two symbols')
      .max(50, 'Name is too long')
      .regex(/^[A-Z]/, 'First letter must be uppercase'),

    age: z
      .number()
      .min(18, 'At least 18 years')
      .max(120, 'You are well preserved for your age'),

    email: z.string().email('Submit valid email'),

    password: z.string().min(8, 'Min 8 symbols in password'),

    confirmPassword: z.string(),

    gender: z.enum(['male', 'female']),

    country: z.string().min(1, 'Select country'),

    agreeToTerms: z
      .boolean()
      .refine((val) => val === true, 'Will you study well?'),

    profilePicture: z
      .instanceof(File)
      .optional()
      .refine(
        (file) => !file || file.size <= 5 * 1024 * 1024,
        'Picture is too big'
      )
      .refine(
        (file) =>
          !file || ['image/jpeg', 'image/png', 'image/gif'].includes(file.type),
        'Format not supported'
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'The passwords do not match',
    path: ['confirmPassword'],
  })
  .refine((data) => isStrongPassword(data.password), {
    message:
      'The password must contain uppercase and lowercase letters, numbers and special characters',
    path: ['password'],
  });

export type FormValues = z.infer<typeof formSchema>;
