import { render, screen, fireEvent } from '../../../tests/test-utils';
import { CheckboxWrapper } from './checkbox-wrapper';
import { useStore } from '../store/store';
import styles from './styles.module.css';

vi.mock('../store/store');

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
    });
  });

  it('should render children and checkbox', () => {
    render(
      <CheckboxWrapper id="test-id" name="test-name" description="test-desc">
        <div>Test Content</div>
      </CheckboxWrapper>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should call toggleSelection with correct params when clicked', () => {
    render(
      <CheckboxWrapper id="test-id" name="test-name" description="test-desc">
        <div>Test Content</div>
      </CheckboxWrapper>
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockToggleSelection).toHaveBeenCalledWith(
      'test-id',
      'test-name',
      'test-desc'
    );
  });

  it('should apply selected class when item is selected', () => {
    mockIsSelected.mockReturnValue(true);

    const { container } = render(
      <CheckboxWrapper id="test-id">
        <div>Test Content</div>
      </CheckboxWrapper>
    );

    expect(container.firstChild).toHaveClass(styles.selected);
  });

  it('should not apply selected class when item is not selected', () => {
    mockIsSelected.mockReturnValue(false);

    const { container } = render(
      <CheckboxWrapper id="test-id">
        <div>Test Content</div>
      </CheckboxWrapper>
    );

    expect(container.firstChild).not.toHaveClass(styles.selected);
  });

  it('should have proper aria-label', () => {
    render(
      <CheckboxWrapper id="test-id">
        <div>Test Content</div>
      </CheckboxWrapper>
    );

    expect(screen.getByRole('checkbox')).toHaveAttribute(
      'aria-label',
      'Select item test-id'
    );
  });
});
