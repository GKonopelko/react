import { describe, it, expect, beforeEach } from 'vitest';
import { useFormStore } from './formStore';

describe('formStore', () => {
  beforeEach(() => {
    useFormStore.setState({ formData: [] });
  });

  it('should add form data', () => {
    const formData = {
      name: 'Test User',
      age: 25,
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      gender: 'male' as const,
      country: 'Russia',
      agreeToTerms: true,
      profilePicture: undefined,
    };

    useFormStore.getState().addFormData(formData);

    const state = useFormStore.getState();
    expect(state.formData).toHaveLength(1);
    expect(state.formData[0]).toMatchObject({
      ...formData,
      submittedAt: expect.any(Date),
    });
  });

  it('should clear form data', () => {
    const formData = {
      name: 'Test User',
      age: 25,
      email: 'test@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      gender: 'male' as const,
      country: 'Russia',
      agreeToTerms: true,
      profilePicture: undefined,
    };

    useFormStore.getState().addFormData(formData);
    expect(useFormStore.getState().formData).toHaveLength(1);

    useFormStore.getState().clearFormData();
    expect(useFormStore.getState().formData).toHaveLength(0);
  });

  it('should handle multiple form submissions', () => {
    const formData1 = {
      name: 'User 1',
      age: 25,
      email: 'user1@example.com',
      password: 'Password123!',
      confirmPassword: 'Password123!',
      gender: 'male' as const,
      country: 'Russia',
      agreeToTerms: true,
      profilePicture: undefined,
    };

    const formData2 = {
      name: 'User 2',
      age: 30,
      email: 'user2@example.com',
      password: 'Password456!',
      confirmPassword: 'Password456!',
      gender: 'female' as const,
      country: 'Belarus',
      agreeToTerms: true,
      profilePicture: undefined,
    };

    useFormStore.getState().addFormData(formData1);
    useFormStore.getState().addFormData(formData2);

    const state = useFormStore.getState();
    expect(state.formData).toHaveLength(2);
    expect(state.formData[0].name).toBe('User 1');
    expect(state.formData[1].name).toBe('User 2');
  });
});
