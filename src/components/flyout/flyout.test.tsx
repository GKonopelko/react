import { render, screen, fireEvent } from '../../../tests/test-utils';
import { createPokemonDetails } from '../../../tests/mocks';
import { Flyout } from './flyout';
import { useStore } from '../../utils/store/store';
import { vi } from 'vitest';

vi.mock('../store/store');

describe.skip('Flyout', () => {
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
    expect(screen.getByText('Download')).toBeInTheDocument();
  });

  it('should call unselectAll when "Unselect all" button is clicked', () => {
    mockGetSelectedCount.mockReturnValue(2);
    render(<Flyout />);

    fireEvent.click(screen.getByText('Unselect all'));
    expect(mockUnselectAll).toHaveBeenCalled();
  });

  it.skip('should generate correct CSV content', () => {
    mockGetSelectedItems.mockReturnValue([
      {
        ...createPokemonDetails(25),
        description: 'Electric mouse',
        name: 'Pikachu',
        id: '25',
      },
    ]);

    const originalCreateObjectURL = global.URL.createObjectURL;
    const originalRevokeObjectURL = global.URL.revokeObjectURL;

    global.URL.createObjectURL = vi.fn(() => 'mock-url');
    global.URL.revokeObjectURL = vi.fn();

    render(<Flyout />);

    fireEvent.click(screen.getByRole('button', { name: 'Download' }));

    expect(global.URL.createObjectURL).toHaveBeenCalled();
    const blob = (global.URL.createObjectURL as jest.Mock).mock.calls[0][0];
    expect(blob.type).toBe('text/csv');

    expect(global.URL.revokeObjectURL).toHaveBeenCalledWith('mock-url');

    global.URL.createObjectURL = originalCreateObjectURL;
    global.URL.revokeObjectURL = originalRevokeObjectURL;
  });
});
