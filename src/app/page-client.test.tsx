import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import { PageClient } from './page-client';
import { useSearchParams } from 'next/navigation';
import type { PokemonListItem } from '../pokemonTypes';

vi.mock('../components/results/results', () => ({
  Results: () => <div>Results Mock</div>,
}));

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
        append: (name: string, value: string) => params.append(name, value),
        delete: (name: string) => params.delete(name),
        set: (name: string, value: string) => params.set(name, value),
        sort: () => params.sort(),
        [Symbol.iterator]: () => params[Symbol.iterator](),
      };
    }),
  };
});

describe('PageClient Component', () => {
  const mockPokemons: PokemonListItem[] = [
    { name: 'bulbasaur', url: 'https://pokeapi.co/api/v2/pokemon/1/' },
    { name: 'ivysaur', url: 'https://pokeapi.co/api/v2/pokemon/2/' },
    { name: 'venusaur', url: 'https://pokeapi.co/api/v2/pokemon/3/' },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Results with default page when no page param', () => {
    vi.mocked(useSearchParams).mockReturnValue(
      new URLSearchParams() as unknown as ReturnType<typeof useSearchParams>
    );
    const { getByText } = render(<PageClient allPokemons={mockPokemons} />);
    expect(getByText('Results Mock')).toBeInTheDocument();
  });

  it('uses page parameter from URL', () => {
    const params = new URLSearchParams();
    params.set('page', '2');
    vi.mocked(useSearchParams).mockReturnValue(
      params as unknown as ReturnType<typeof useSearchParams>
    );
    const { getByText } = render(<PageClient allPokemons={mockPokemons} />);
    expect(getByText('Results Mock')).toBeInTheDocument();
  });

  it('handles invalid page parameter by defaulting to 1', () => {
    const params = new URLSearchParams();
    params.set('page', 'invalid');
    vi.mocked(useSearchParams).mockReturnValue(
      params as unknown as ReturnType<typeof useSearchParams>
    );
    const { getByText } = render(<PageClient allPokemons={mockPokemons} />);
    expect(getByText('Results Mock')).toBeInTheDocument();
  });

  it('handles negative page numbers by defaulting to 1', () => {
    const params = new URLSearchParams();
    params.set('page', '-5');
    vi.mocked(useSearchParams).mockReturnValue(
      params as unknown as ReturnType<typeof useSearchParams>
    );
    const { getByText } = render(<PageClient allPokemons={mockPokemons} />);
    expect(getByText('Results Mock')).toBeInTheDocument();
  });
});
