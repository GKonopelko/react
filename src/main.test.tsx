import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createBrowserRouter, type RouteObject } from 'next/link';
import { StrictMode, type ReactElement } from 'react';
import { createRoot, type Root } from 'react-dom/client';

const mockRoot: Root = {
  render: vi.fn(),
  unmount: vi.fn(),
} as unknown as Root;

vi.mock('react-dom/client', () => ({
  createRoot: vi.fn(() => mockRoot),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    createBrowserRouter: vi.fn((routes: RouteObject[]) => routes),
  };
});

describe('main', () => {
  beforeEach(() => {
    vi.resetModules();
    document.getElementById('root')?.remove();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should throw error if root does not exist', async () => {
    vi.spyOn(document, 'getElementById').mockReturnValue(null);
    await expect(import('./main')).rejects.toThrow(
      'Failed to find the root element'
    );
  });

  it('should render when root exists', async () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    await import('./main');

    expect(vi.mocked(createRoot)).toHaveBeenCalledTimes(1);
    expect(vi.mocked(createRoot)).toHaveBeenCalledWith(root);
    expect(mockRoot.render).toHaveBeenCalledTimes(1);

    document.body.removeChild(root);
  });

  it('should create correct router configuration', async () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    await import('./main');

    expect(vi.mocked(createBrowserRouter)).toHaveBeenCalledTimes(1);
    const [routerConfig] = vi.mocked(createBrowserRouter).mock.calls[0];

    expect(routerConfig).toContainEqual(
      expect.objectContaining({
        path: '/',
        children: expect.arrayContaining([
          expect.objectContaining({ path: '' }),
          expect.objectContaining({ path: '/about' }),
          expect.objectContaining({ path: '*' }),
        ]),
      })
    );

    const mainRoute = routerConfig.find((r: RouteObject) => r.path === '/');
    if (mainRoute && mainRoute.children) {
      const appRoute = mainRoute.children.find(
        (r: RouteObject) => r.path === ''
      );
      if (appRoute && appRoute.children) {
        expect(appRoute.children).toContainEqual(
          expect.objectContaining({
            path: 'details/:id',
          })
        );
      }
    }

    document.body.removeChild(root);
  });

  it('should render with StrictMode', async () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    await import('./main');

    const renderCalls = vi.mocked(mockRoot.render).mock.calls;
    expect(renderCalls.length).toBe(1);

    const renderedContent = renderCalls[0][0] as ReactElement;
    expect(renderedContent.type).toBe(StrictMode);

    document.body.removeChild(root);
  });
});
