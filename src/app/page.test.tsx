import { render, screen } from '@testing-library/react';
import HomePage from './page';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../components/controls/controls', () => ({
  Controls: () => <div>Controls Mock</div>,
}));

vi.mock('../components/loader/loader', () => ({
  Loader: () => <div>Loading...</div>,
}));

vi.mock('./page-client', () => ({
  PageClient: () => <div>PageClient Mock</div>,
}));

vi.mock('../utils/api', () => ({
  fetchAllPokemons: vi.fn(() =>
    Promise.resolve({
      results: [{ name: 'pikachu', url: 'url-1' }],
      next: null,
    })
  ),
}));

describe('HomePage', () => {
  it('should render without crashing', async () => {
    const Page = await HomePage();
    render(Page);

    expect(screen.getByText('Controls Mock')).toBeInTheDocument();
    expect(screen.getByText('PageClient Mock')).toBeInTheDocument();
  });
});
