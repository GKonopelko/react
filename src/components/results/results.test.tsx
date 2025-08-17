import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Results } from './results';
import { useSearchParams, useRouter } from 'next/navigation';

// Define complete mock types that match the actual Next.js interfaces
interface MockSearchParams {
  get: (key: string) => string | null;
  toString: () => string;
  has: (key: string) => boolean;
  entries: () => IterableIterator<[string, string]>;
  forEach: (callbackfn: (value: string, key: string) => void) => void;
  keys: () => IterableIterator<string>;
  values: () => IterableIterator<string>;
  append: (name: string, value: string) => void;
  delete: (name: string) => void;
  set: (name: string, value: string) => void;
  sort: () => void;
  [Symbol.iterator]: () => IterableIterator<[string, string]>;
}

interface MockRouter {
  push: (url: string) => void;
  back: () => void;
  forward: () => void;
  refresh: () => void;
  replace: (url: string) => void;
  prefetch: (url: string) => void;
}

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  })),
  usePathname: vi.fn(() => '/'),
  useSearchParams: vi.fn(() => ({
    get: vi.fn((key: string) => (key === 'search' ? 'pikachu' : null)),
    toString: vi.fn(() => '?search=pikachu'),
    has: vi.fn(),
    entries: vi.fn(),
    forEach: vi.fn(),
    keys: vi.fn(),
    values: vi.fn(),
    append: vi.fn(),
    delete: vi.fn(),
    set: vi.fn(),
    sort: vi.fn(),
    [Symbol.iterator]: vi.fn(),
  })),
}));

vi.mock('../details-page/details-page', () => ({
  PokemonDetailsPage: () => <div>Details Panel</div>,
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
    overrides: Partial<MockSearchParams> = {}
  ): MockSearchParams => ({
    get: vi.fn(),
    toString: vi.fn(),
    has: vi.fn(),
    entries: vi.fn(),
    forEach: vi.fn(),
    keys: vi.fn(),
    values: vi.fn(),
    append: vi.fn(),
    delete: vi.fn(),
    set: vi.fn(),
    sort: vi.fn(),
    [Symbol.iterator]: vi.fn(),
    ...overrides,
  });

  const createMockRouter = (
    overrides: Partial<MockRouter> = {}
  ): MockRouter => ({
    push: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
    ...overrides,
  });

  it('renders pokemon list', () => {
    const mockParams = createMockSearchParams({
      get: vi.fn((key: string) => (key === 'search' ? '' : null)),
      toString: vi.fn(() => ''),
    });
    vi.mocked(useSearchParams).mockReturnValue(
      mockParams as unknown as ReturnType<typeof useSearchParams>
    );

    render(<Results resultPokemons={mockPokemons} currentPage={1} />);
    expect(screen.getByText('bulbasaur')).toBeInTheDocument();
    expect(screen.getByText('ivysaur')).toBeInTheDocument();
  });

  it('shows "No Pokemons found" when search returns no results', () => {
    const mockParams = createMockSearchParams({
      get: vi.fn((key: string) => (key === 'search' ? 'pikachu' : null)),
      toString: vi.fn(() => '?search=pikachu'),
    });
    vi.mocked(useSearchParams).mockReturnValue(
      mockParams as unknown as ReturnType<typeof useSearchParams>
    );

    render(<Results resultPokemons={[]} currentPage={1} />);
    expect(screen.getByText(/No Pokemons found/i)).toBeInTheDocument();
    expect(screen.getByText(/pikachu/i)).toBeInTheDocument();
  });

  it('renders pagination when multiple pages', () => {
    const mockParams = createMockSearchParams({
      get: vi.fn((key: string) => (key === 'search' ? '' : null)),
      toString: vi.fn(() => ''),
    });
    vi.mocked(useSearchParams).mockReturnValue(
      mockParams as unknown as ReturnType<typeof useSearchParams>
    );

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
    const mockParams = createMockSearchParams({
      get: vi.fn((key: string) => (key === 'search' ? '' : null)),
      toString: vi.fn(() => ''),
    });
    vi.mocked(useSearchParams).mockReturnValue(
      mockParams as unknown as ReturnType<typeof useSearchParams>
    );

    const pushMock = vi.fn();
    const mockRouter = createMockRouter({ push: pushMock });
    vi.mocked(useRouter).mockReturnValue(
      mockRouter as unknown as ReturnType<typeof useRouter>
    );

    render(<Results resultPokemons={mockPokemons} currentPage={1} />);
    fireEvent.click(screen.getByText('bulbasaur'));
    expect(pushMock).toHaveBeenCalled();
  });
});
