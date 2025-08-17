import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Results } from './results';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { ReadonlyURLSearchParams } from 'next/navigation';

vi.mock('next/navigation', () => {
  const actual = vi.importActual('next/navigation');
  return {
    ...actual,
    useRouter: vi.fn(() => ({
      push: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    })),
    usePathname: vi.fn(() => '/'),
    useSearchParams: vi.fn(() => {
      const params = new URLSearchParams();
      return {
        get: (key: string) => params.get(key),
        toString: () => params.toString(),
        has: (key: string) => params.has(key),
        entries: () => params.entries(),
        forEach: (callback: (value: string, key: string) => void) =>
          params.forEach(callback),
        keys: () => params.keys(),
        values: () => params.values(),
        size: params.size,
        getAll: (name: string) => params.getAll(name),
        append: (name: string, value: string) => params.append(name, value),
        delete: (name: string) => params.delete(name),
        set: (name: string, value: string) => params.set(name, value),
        sort: () => params.sort(),
        [Symbol.iterator]: () => params[Symbol.iterator](),
      } as ReadonlyURLSearchParams;
    }),
  };
});

vi.mock('../details-page/details-page', () => ({
  PokemonDetailsPage: ({
    id,
    onClose,
  }: {
    id: string;
    onClose: () => void;
  }) => (
    <div data-testid="details-panel" onClick={onClose}>
      Details Panel {id}
    </div>
  ),
}));

vi.mock('../checkbox-wrapper/checkbox-wrapper', () => ({
  CheckboxWrapper: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

vi.mock('next/image', () => ({
  __esModule: true,
  default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => (
    <img {...props} />
  ),
}));

describe('Results Component', () => {
  const mockPokemons = [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
  ];

  const createMockSearchParams = (
    params?: Record<string, string>
  ): ReadonlyURLSearchParams => {
    const searchParams = new URLSearchParams(params);
    return {
      get: (key: string) => searchParams.get(key),
      toString: () => searchParams.toString(),
      has: (key: string) => searchParams.has(key),
      entries: () => searchParams.entries(),
      forEach: (callback: (value: string, key: string) => void) =>
        searchParams.forEach(callback),
      keys: () => searchParams.keys(),
      values: () => searchParams.values(),
      size: searchParams.size,
      getAll: (name: string) => searchParams.getAll(name),
      append: (name: string, value: string) => searchParams.append(name, value),
      delete: (name: string) => searchParams.delete(name),
      set: (name: string, value: string) => searchParams.set(name, value),
      sort: () => searchParams.sort(),
      [Symbol.iterator]: () => searchParams[Symbol.iterator](),
    } as ReadonlyURLSearchParams;
  };

  beforeEach(() => {
    vi.mocked(usePathname).mockReturnValue('/');
    vi.mocked(useRouter).mockReturnValue({
      push: vi.fn(),
      back: vi.fn(),
      forward: vi.fn(),
      refresh: vi.fn(),
      replace: vi.fn(),
      prefetch: vi.fn(),
    });
    vi.mocked(useSearchParams).mockReturnValue(createMockSearchParams());
  });

  it('renders pokemon list', () => {
    render(<Results resultPokemons={mockPokemons} currentPage={1} />);
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('ivysaur')).toBeInTheDocument();
  });

  it('shows "No Pokemons found" when search returns no results', () => {
    vi.mocked(useSearchParams).mockReturnValue(
      createMockSearchParams({ search: 'pikachu' })
    );

    render(<Results resultPokemons={[]} currentPage={1} />);
    expect(screen.getByText(/No Pokemons found/i)).toBeInTheDocument();
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
  });

  it('renders pagination when multiple pages', () => {
    const longList = Array.from({ length: 15 }, (_, i) => ({
      name: `pokemon-${i}`,
      url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
    }));

    render(
      <Results resultPokemons={longList} currentPage={1} cardsPerPage={5} />
    );
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('calls router.push when pokemon is clicked', () => {
    const pushMock = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      ...vi.mocked(useRouter)(),
      push: pushMock,
    });

    render(<Results resultPokemons={mockPokemons} currentPage={1} />);
    fireEvent.click(screen.getByText('bulbasaur'));
    expect(pushMock).toHaveBeenCalled();
  });

  it('disables Previous button on first page', () => {
    const longList = Array.from({ length: 15 }, (_, i) => ({
      name: `pokemon-${i}`,
      url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
    }));

    render(
      <Results resultPokemons={longList} currentPage={1} cardsPerPage={5} />
    );
    expect(screen.getByText('Previous')).toBeDisabled();
  });

  it('disables Next button on last page', () => {
    const longList = Array.from({ length: 15 }, (_, i) => ({
      name: `pokemon-${i}`,
      url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
    }));

    render(
      <Results resultPokemons={longList} currentPage={3} cardsPerPage={5} />
    );
    expect(screen.getByText('Next')).toBeDisabled();
  });

  it('calls handlePageChange when pagination buttons are clicked', () => {
    const pushMock = vi.fn();
    vi.mocked(useRouter).mockReturnValue({
      ...vi.mocked(useRouter)(),
      push: pushMock,
    });

    const longList = Array.from({ length: 15 }, (_, i) => ({
      name: `pokemon-${i}`,
      url: `https://pokeapi.co/api/v2/pokemon/${i + 1}/`,
    }));

    render(
      <Results resultPokemons={longList} currentPage={2} cardsPerPage={5} />
    );

    fireEvent.click(screen.getByText('Previous'));
    expect(pushMock).toHaveBeenCalledWith(expect.stringContaining('page=1'));

    fireEvent.click(screen.getByText('Next'));
    expect(pushMock).toHaveBeenCalledWith(expect.stringContaining('page=3'));
  });

  it('renders PokemonDetailsPage when detailsId is present', () => {
    vi.mocked(useSearchParams).mockReturnValue(
      createMockSearchParams({ details: '1' })
    );

    render(<Results resultPokemons={mockPokemons} currentPage={1} />);
    expect(screen.getByTestId('details-panel')).toBeInTheDocument();
  });

  it('filters pokemons based on search query', () => {
    vi.mocked(useSearchParams).mockReturnValue(
      createMockSearchParams({ search: 'bulba' })
    );

    render(<Results resultPokemons={mockPokemons} currentPage={1} />);
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.queryByText('ivysaur')).not.toBeInTheDocument();
  });

  it('renders pokemon images with correct src', () => {
    render(<Results resultPokemons={mockPokemons} currentPage={1} />);
    const images = screen.getAllByRole('img');
    expect(images[0]).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/1.png'
    );
    expect(images[1]).toHaveAttribute(
      'src',
      'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/2.png'
    );
  });

  it('applies wrapper-with-details class when details panel is open', () => {
    vi.mocked(useSearchParams).mockReturnValue(
      createMockSearchParams({ details: '1' })
    );

    const { container } = render(
      <Results resultPokemons={mockPokemons} currentPage={1} />
    );
    const wrapperDiv = container.querySelector('div');
    expect(wrapperDiv?.className).toMatch(/wrapper-with-details/);
  });
});
