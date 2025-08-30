import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { CheckboxWrapper } from './checkbox-wrapper';
import { useStore } from '../../utils/store/store';

vi.mock('./styles.module.css', () => ({
  default: {
    wrapper: 'wrapper',
    selected: 'selected',
    checkbox: 'checkbox',
  },
  __esModule: true,
}));

vi.mock('../../utils/store/store', () => ({
  useStore: vi.fn(),
}));

describe('CheckboxWrapper', () => {
  const mockToggleSelection = vi.fn();
  const mockIsSelected = vi.fn();

  beforeEach(() => {
    vi.mocked(useStore).mockReturnValue({
      toggleSelection: mockToggleSelection,
      isSelected: mockIsSelected,
      unselectAll: vi.fn(),
      getSelectedCount: vi.fn(),
      getSelectedItems: vi.fn(),
      selectedItems: new Set(),
    });
  });

  it('renders children', () => {
    render(
      <CheckboxWrapper id="test-id">
        <div>Test Content</div>
      </CheckboxWrapper>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('calls toggleSelection when clicked', () => {
    render(
      <CheckboxWrapper id="test-id" name="test-name" description="test-desc">
        <div>Test Content</div>
      </CheckboxWrapper>
    );

    fireEvent.click(screen.getByRole('checkbox'));
    expect(mockToggleSelection).toHaveBeenCalledWith(
      'test-id',
      'test-name',
      'test-desc'
    );
  });

  it('shows checked state based on isSelected', () => {
    mockIsSelected.mockReturnValue(true);
    render(
      <CheckboxWrapper id="test-id">
        <div>Test Content</div>
      </CheckboxWrapper>
    );
    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});
