import { describe, it, expect, beforeEach } from 'vitest';
import { useFormStore } from './formStore';
import { mockFormData, mockEmptyFormData } from '../tests/mocks';

describe('formStore', () => {
  beforeEach(() => {
    useFormStore.setState({ formData: [] });
  });

  it('should add form data', () => {
    useFormStore.getState().addFormData(mockFormData[0]);
    const state = useFormStore.getState();
    expect(state.formData).toHaveLength(1);
    expect(state.formData[0]).toMatchObject({
      ...mockFormData[0],
      submittedAt: expect.any(Date),
    });
  });

  it('should clear form data', () => {
    useFormStore.getState().addFormData(mockFormData[0]);
    expect(useFormStore.getState().formData).toHaveLength(1);
    useFormStore.getState().clearFormData();
    expect(useFormStore.getState().formData).toHaveLength(0);
  });

  it('should handle multiple form submissions', () => {
    useFormStore.getState().addFormData(mockFormData[0]);
    useFormStore.getState().addFormData(mockFormData[1]);
    const state = useFormStore.getState();
    expect(state.formData).toHaveLength(2);
    expect(state.formData[0].name).toBe('John Smith');
    expect(state.formData[1].name).toBe('Anna Johnson');
  });

  it('should return empty array when no data', () => {
    const state = useFormStore.getState();
    expect(state.formData).toEqual(mockEmptyFormData);
  });
});
