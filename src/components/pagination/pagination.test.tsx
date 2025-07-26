import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../../../tests/test-utils';
import { Pagination } from './pagination';

describe('Pagination Component', () => {
  const mockOnPageChange = vi.fn();
  const baseProps = {
    currentPage: 2,
    totalPages: 5,
    onPageChange: mockOnPageChange,
  };

  beforeEach(() => {
    mockOnPageChange.mockClear();
  });

  it('should not render when totalPages is 1 or less', () => {
    const { container } = render(<Pagination {...baseProps} totalPages={1} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('should render with correct page info and buttons', () => {
    render(<Pagination {...baseProps} />);

    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument();
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('should disable Previous button on first page', () => {
    render(<Pagination {...baseProps} currentPage={1} />);
    expect(screen.getByText('Previous')).toBeDisabled();
  });

  it('should disable Next button on last page', () => {
    render(<Pagination {...baseProps} currentPage={5} />);
    expect(screen.getByText('Next')).toBeDisabled();
  });

  it('should call onPageChange with previous page when Previous clicked', () => {
    render(<Pagination {...baseProps} />);
    fireEvent.click(screen.getByText('Previous'));
    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('should call onPageChange with next page when Next clicked', () => {
    render(<Pagination {...baseProps} />);
    fireEvent.click(screen.getByText('Next'));
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });
});
