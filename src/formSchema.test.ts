import { describe, it, expect } from 'vitest';
import { formSchema } from './formSchema';

describe('formSchema', () => {
  const validData = {
    name: 'John Doe',
    age: 25,
    email: 'john@example.com',
    password: 'Password123!',
    confirmPassword: 'Password123!',
    gender: 'male' as const,
    country: 'Russia',
    agreeToTerms: true,
  };

  it('should validate correct data', async () => {
    await expect(formSchema.parseAsync(validData)).resolves.toEqual(validData);
  });

  it('should reject invalid name', async () => {
    const invalidData = { ...validData, name: 'j' };
    await expect(formSchema.parseAsync(invalidData)).rejects.toThrow();
  });

  it('should reject invalid age', async () => {
    const invalidData = { ...validData, age: 17 };
    await expect(formSchema.parseAsync(invalidData)).rejects.toThrow();
  });

  it('should reject invalid email', async () => {
    const invalidData = { ...validData, email: 'invalid-email' };
    await expect(formSchema.parseAsync(invalidData)).rejects.toThrow();
  });

  it('should reject weak password', async () => {
    const invalidData = {
      ...validData,
      password: 'weak',
      confirmPassword: 'weak',
    };
    await expect(formSchema.parseAsync(invalidData)).rejects.toThrow();
  });

  it('should reject mismatched passwords', async () => {
    const invalidData = { ...validData, confirmPassword: 'Different123!' };
    await expect(formSchema.parseAsync(invalidData)).rejects.toThrow();
  });

  it('should reject invalid country', async () => {
    const invalidData = { ...validData, country: 'InvalidCountry' };
    await expect(formSchema.parseAsync(invalidData)).rejects.toThrow();
  });

  it('should reject unchecked terms', async () => {
    const invalidData = { ...validData, agreeToTerms: false };
    await expect(formSchema.parseAsync(invalidData)).rejects.toThrow();
  });
});
