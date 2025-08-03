import { act, renderHook } from '@testing-library/react';
import { useStore } from './store';

describe('useStore', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useStore());
    act(() => result.current.unselectAll());
  });

  it('should toggle selection', () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.toggleSelection('1', 'Pikachu', 'Electric mouse');
    });

    expect(result.current.isSelected('1')).toBe(true);
    expect(result.current.getSelectedCount()).toBe(1);

    act(() => {
      result.current.toggleSelection('1');
    });

    expect(result.current.isSelected('1')).toBe(false);
  });

  it('should not add item without name and description', () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.toggleSelection('1');
    });

    expect(result.current.isSelected('1')).toBe(false);
  });

  it('should unselect all items', () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.toggleSelection('1', 'Pikachu', 'Electric');
      result.current.toggleSelection('2', 'Charmander', 'Fire');
      result.current.unselectAll();
    });

    expect(result.current.getSelectedCount()).toBe(0);
  });

  it('should return selected items', () => {
    const { result } = renderHook(() => useStore());

    act(() => {
      result.current.toggleSelection('1', 'Pikachu', 'Electric');
    });

    const items = result.current.getSelectedItems();
    expect(items).toEqual([
      {
        id: '1',
        name: 'Pikachu',
        description: 'Electric',
      },
    ]);
  });
});
