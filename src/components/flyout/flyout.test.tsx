import { render, screen, fireEvent } from '@testing-library/react';
import { Flyout } from './flyout';
import { useStore } from '../../utils/store/store';
import { vi } from 'vitest';

vi.mock('../../utils/store/store');

describe('Flyout', () => {
  const mockUnselectAll = vi.fn();
  const mockGetSelectedCount = vi.fn();
  const mockGetSelectedItems = vi.fn();

  beforeEach(() => {
    vi.mocked(useStore).mockReturnValue({
      unselectAll: mockUnselectAll,
      getSelectedCount: mockGetSelectedCount,
      getSelectedItems: mockGetSelectedItems,
      toggleSelection: vi.fn(),
      isSelected: vi.fn(),
    });
  });

  it('should not render when no items are selected', () => {
    mockGetSelectedCount.mockReturnValue(0);
    const { container } = render(<Flyout />);
    expect(container.firstChild).toBeNull();
  });

  it('should render with correct count and buttons when items are selected', () => {
    mockGetSelectedCount.mockReturnValue(3);
    render(<Flyout />);

    expect(screen.getByText('3 items selected')).toBeInTheDocument();
    expect(screen.getByText('Unselect all')).toBeInTheDocument();
    expect(screen.getByText('Download CSV')).toBeInTheDocument();
  });

  it('should call unselectAll when "Unselect all" button is clicked', () => {
    mockGetSelectedCount.mockReturnValue(2);
    render(<Flyout />);

    fireEvent.click(screen.getByText('Unselect all'));
    expect(mockUnselectAll).toHaveBeenCalled();
  });
});
