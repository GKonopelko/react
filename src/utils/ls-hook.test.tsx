import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '../../tests/test-utils';
import { useLocalStorage } from './ls-hook';

describe('useLocalStorage Hook', () => {
  const key = 'test-key';
  const initialValue = 'initial-value';

  beforeEach(() => {
    localStorage.clear();
    vi.spyOn(Storage.prototype, 'getItem');
    vi.spyOn(Storage.prototype, 'setItem');
  });

  it('should return initial value when no value in localStorage', () => {
    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    expect(result.current[0]).toBe(initialValue);
    expect(localStorage.getItem).toHaveBeenCalledWith(key);
  });

  it('should return stored value from localStorage', () => {
    const storedValue = 'stored-value';
    localStorage.setItem(key, storedValue);

    const { result } = renderHook(() => useLocalStorage(key, initialValue));

    expect(result.current[0]).toBe(storedValue);
    expect(localStorage.getItem).toHaveBeenCalledWith(key);
  });

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage(key, initialValue));
    const newValue = 'new-value';

    act(() => {
      result.current[1](newValue);
    });

    expect(result.current[0]).toBe(newValue);
    expect(localStorage.setItem).toHaveBeenCalledWith(key, newValue);
  });

  it('should persist value between renders', () => {
    const { result, rerender } = renderHook(() =>
      useLocalStorage(key, initialValue)
    );
    const newValue = 'updated-value';

    act(() => {
      result.current[1](newValue);
    });

    rerender();

    expect(result.current[0]).toBe(newValue);
    expect(localStorage.getItem).toHaveBeenCalledWith(key);
  });
});
