import { describe, it, expect } from 'vitest';
import { formSchema } from './formSchema';
import { mockFormData } from '../tests/mocks';

describe('formSchema', () => {
  const validData = {
    name: mockFormData[0].name,
    age: mockFormData[0].age,
    email: mockFormData[0].email,
    password: mockFormData[0].password,
    confirmPassword: mockFormData[0].confirmPassword,
    gender: mockFormData[0].gender,
    country: mockFormData[0].country,
    agreeToTerms: mockFormData[0].agreeToTerms,
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
