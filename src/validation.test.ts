import { describe, it, expect } from 'vitest';
import { isStrongPassword } from './validation';

describe('isStrongPassword', () => {
  it('should return true for strong passwords', () => {
    const strongPasswords = ['Password123!', 'Secure@Pass1', 'Test123$Test'];

    strongPasswords.forEach((password) => {
      expect(isStrongPassword(password)).toBe(true);
    });
  });

  it('should return false for weak passwords', () => {
    const weakPasswords = [
      'password',
      'PASSWORD',
      '12345678',
      'Password',
      'Pass1',
    ];

    weakPasswords.forEach((password) => {
      expect(isStrongPassword(password)).toBe(false);
    });
  });
});
